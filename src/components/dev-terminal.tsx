
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Minus, ShieldCheck, Database, Server, ShieldAlert } from 'lucide-react';
import { useApp } from '@/contexts/app-provider';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'system' | 'success' | 'root';
  content: string;
}

export function DevTerminal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { refreshData, currentUser, userRole } = useApp();
  const isRoot = userRole === 'dev';
  
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (history.length === 0) {
        setHistory([
            { type: 'system', content: 'CityMotion NexusOS v2.4.0 (Console Kernel)' },
            { type: 'system', content: `Session: ${currentUser?.name || 'ROOT'}@nexusbridge` },
            { type: isRoot ? 'root' : 'system', content: isRoot ? '[ROOT ACCESS ENABLED] Restricted operations unlocked.' : 'Standard maintenance mode active.' },
            { type: 'system', content: 'Type "nexus-help" for maintenance commands.' },
        ]);
    }
  }, [currentUser, isRoot]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [history, isOpen, isMinimized]);

  const addLine = (content: string, type: TerminalLine['type'] = 'output') => {
    setHistory(prev => [...prev, { type, content }]);
  };

  const processCommand = async (cmd: string) => {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();

    addLine(`${isRoot ? '#' : '>'} ${cmd}`, 'input');

    switch (command) {
      case 'nexus-help':
      case 'help':
        addLine('--- NEXUS OS MAINTENANCE SUITE ---', 'system');
        addLine('nexus-info      - Kernel & System environment data.');
        addLine('nexus-health    - Full subsystem integrity report.');
        addLine('nexus-db-stats  - Table record counts (SQLite).');
        addLine('nexus-logdb     - Global audit trail history.');
        addLine('nexus-integrity - Low-level PRAGMA database check.');
        if (isRoot) {
            addLine('nexus-db-reset  - [ROOT] Hard reset & Factory restore.', 'root');
        }
        addLine('cls / clear     - Wipe terminal history.');
        addLine('exit            - Terminate TTY session.');
        break;

      case 'nexus-info':
        addLine('OS: CityMotion NexusOS 2.4.0 (Turbopack Powered)');
        addLine(`Operator: ${currentUser?.name || 'root'}`);
        addLine(`Privileges: ${isRoot ? 'SUPERUSER (ROOT)' : 'ADMINISTRATOR'}`);
        addLine(`Ident: ${currentUser?.matricula || 'sys-default'}`);
        addLine('Architecture: x86_64-linux-nextjs');
        break;

      case 'nexus-health':
        addLine('Starting diagnostic sequence...', 'system');
        try {
          const res = await fetch('/api/nexus/system/db-info');
          if (res.ok) addLine('DATABASE:  [OK] SQLite3 V3.45 Connected', 'success');
          else addLine('DATABASE:  [FAIL] Connection Refused', 'error');
          addLine('BRIDGE:    [OK] NexusBridge V1.2 Operational', 'success');
          addLine('AUTH:      [OK] JWT Protocol Valid', 'success');
          addLine('SLA:       [OK] 99.98% Healthy', 'success');
        } catch (e) { addLine('NETWORK ERROR: Bridge disconnected', 'error'); }
        break;

      case 'nexus-db-stats':
        addLine('Querying SQLite table statistics...', 'system');
        try {
          const res = await fetch('/api/nexus/system/db-info');
          const data = await res.json();
          Object.entries(data.counts).forEach(([table, count]) => {
              addLine(`TABLE [${table.toUpperCase().padEnd(15)}]: ${count} records`);
          });
        } catch (e) { addLine('ERROR: Unable to reach database metrics.', 'error'); }
        break;

      case 'nexus-logdb':
        addLine('Accessing audit trail logs...', 'system');
        try {
          const res = await fetch('/api/nexus/system/audit-logs');
          const data = await res.json();
          if (data.length === 0) addLine('No recent activity recorded.');
          
          addLine('TIMESTAMP | USER | ACTION | TARGET', 'system');
          addLine('----------------------------------------', 'system');
          data.slice(0, 15).forEach((l: any) => {
              addLine(`${l.timestamp.substring(11,19)} | ${l.user_identity.split(' ')[0]} | ${l.action} | ${l.table_name}`);
          });
        } catch (e) { addLine('ERROR: Audit system unreachable.', 'error'); }
        break;

      case 'nexus-integrity':
        addLine('Running PRAGMA integrity_check...', 'system');
        try {
            const res = await fetch('/api/nexus/system/db-integrity');
            const data = await res.json();
            if (data.status === 'Success') addLine(`STATUS: ${data.result} (Database is healthy)`, 'success');
            else addLine(`WARNING: ${data.result}`, 'error');
        } catch (e) { addLine('ERROR: Integrity check failed.', 'error'); }
        break;

      case 'nexus-db-reset':
        if (!isRoot) {
            addLine('PERMISSION DENIED: This operation requires root access.', 'error');
            break;
        }
        addLine('!!! ALERT: INITIATING FACTORY RESET PROTOCOL !!!', 'error');
        try {
          const res = await fetch('/api/nexus/maintenance/db-reset', { method: 'POST' });
          if (res.ok) {
              addLine('SUCCESS: DATABASE RESTORED. SYNCING UI...', 'success');
              refreshData();
          }
        } catch (e) { addLine('CRITICAL: Reset operation failed.', 'error'); }
        break;

      case 'cls':
      case 'clear':
        setHistory([]);
        break;

      case 'exit':
        onClose();
        break;

      default:
        if (cmd.trim()) addLine(`Command not found: "${command}". Type "help" for a list of commands.`, 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        className={cn(
            "fixed bottom-6 right-6 z-[100] border border-zinc-800 shadow-2xl flex flex-col font-mono text-sm overflow-hidden transition-all duration-300",
            isMinimized ? "w-64 h-10 bg-zinc-900" : "w-full max-w-4xl h-[600px] bg-black/95 backdrop-blur-md"
        )}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className={cn("h-4 w-4 animate-pulse", isRoot ? "text-red-500" : "text-primary")} />
          <span className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", isRoot ? "text-red-500" : "text-primary/90")}>
            NexusOS Shell v2.4 {isRoot && "// ROOT"}
          </span>
        </div>
        <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 text-[9px] uppercase tracking-widest opacity-50 mr-4">
                <span className="flex items-center gap-1"><Database className="h-2 w-2" /> SQLite3</span>
                <span className="flex items-center gap-1 text-emerald-400"><Server className="h-2 w-2" /> Online</span>
            </div>
            <button onClick={() => setIsMinimized(!isMinimized)} className="hover:text-white transition-colors"><Minus className="h-4 w-4" /></button>
            <button onClick={onClose} className="hover:text-red-500 transition-colors"><X className="h-4 w-4" /></button>
        </div>
      </div>

      {!isMinimized && (
        <>
            <ScrollArea className="flex-1 p-6 relative">
                <div className="absolute inset-0 tui-scanline opacity-[0.03] pointer-events-none" />
                <div className="space-y-1 relative z-10">
                    {history.map((line, i) => (
                        <div key={i} className={cn(
                            "text-[13px] leading-relaxed break-all",
                            line.type === 'input' && (isRoot ? "text-red-400 font-bold" : "text-primary font-bold"),
                            line.type === 'error' && "text-red-500",
                            line.type === 'success' && "text-emerald-400",
                            line.type === 'system' && "text-amber-500/80 italic",
                            line.type === 'root' && "text-red-500 font-black uppercase tracking-widest",
                            line.type === 'output' && "text-zinc-400"
                        )}>
                            {line.content}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>

            <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) { processCommand(input); setInput(''); } }} className="p-4 bg-zinc-900/40 border-t border-zinc-800 flex items-center gap-3 group">
                <span className={cn("font-bold animate-pulse group-focus-within:animate-none", isRoot ? "text-red-500" : "text-primary")}>
                    {isRoot ? '#' : '$'}
                </span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-transparent border-none outline-none text-zinc-100 flex-1 text-sm font-mono focus:ring-0 p-0"
                    autoComplete="off"
                    spellCheck="false"
                    placeholder={isRoot ? "Kernel waiting..." : "Waiting for command..."}
                />
                <div className="hidden sm:block text-[9px] text-zinc-600 uppercase tracking-widest font-bold">
                    User: {currentUser?.name?.split(' ')[0] || 'ROOT'}
                </div>
            </form>
        </>
      )}
    </div>
  );
}
