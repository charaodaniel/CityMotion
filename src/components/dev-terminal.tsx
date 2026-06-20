
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Minus, Square } from 'lucide-react';
import { useApp } from '@/contexts/app-provider';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'system' | 'success';
  content: string;
}

export function DevTerminal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { refreshData, currentUser } = useApp();
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'system', content: 'CityMotion NexusOS v2.4.0 (Console Kernel)' },
    { type: 'system', content: 'Sessão privilegiada iniciada.' },
    { type: 'system', content: 'Digite "nexus-help" para ver os comandos de manutenção.' },
  ]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

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

    addLine(`> ${cmd}`, 'input');

    switch (command) {
      case 'nexus-help':
      case 'help':
        addLine('--- COMANDOS ---', 'system');
        addLine('nexus-info     - Dados do sistema.');
        addLine('nexus-status   - Status do backend.');
        addLine('nexus-db-stats - Estatísticas do SQLite.');
        addLine('nexus-db-reset - Restaura banco de fábrica.');
        addLine('nexus-logdb    - Logs de auditoria.');
        addLine('nexus-uptime   - Tempo online.');
        addLine('clear / cls    - Limpa a tela.');
        addLine('exit           - Logout.');
        break;

      case 'nexus-info':
        addLine('OS: CityMotion NexusOS 2.4');
        addLine(`User: ${currentUser?.name || 'root'}`);
        addLine('Kernel: x86_64 linux-node');
        break;

      case 'nexus-status':
        try {
          const res = await fetch('/api/nexus/system/db-info');
          if (res.ok) addLine('DATABASE: ONLINE', 'success');
          else addLine('DATABASE: OFFLINE', 'error');
        } catch (e) { addLine('NET ERROR', 'error'); }
        break;

      case 'nexus-db-stats':
        try {
          const res = await fetch('/api/nexus/system/db-info');
          const data = await res.json();
          Object.entries(data.counts).forEach(([table, count]) => {
              addLine(`${table}: ${count}`);
          });
        } catch (e) { addLine('FAIL', 'error'); }
        break;

      case 'nexus-logdb':
        try {
          const res = await fetch('/api/nexus/system/audit-logs');
          const data = await res.json();
          data.slice(0, 10).forEach((l: any) => {
              addLine(`${l.timestamp.substring(11,19)} | ${l.user_identity} | ${l.action}`);
          });
        } catch (e) { addLine('ERROR', 'error'); }
        break;

      case 'nexus-db-reset':
        addLine('RESTAURANDO BANCO...', 'error');
        try {
          const res = await fetch('/api/nexus/maintenance/db-reset', { method: 'POST' });
          if (res.ok) {
              addLine('SUCESSO', 'success');
              refreshData();
          }
        } catch (e) { addLine('FAIL', 'error'); }
        break;

      case 'nexus-uptime':
        addLine('Uptime: 04:22:15', 'success');
        break;

      case 'cls':
      case 'clear':
        setHistory([]);
        break;

      case 'exit':
        onClose();
        break;

      default:
        if (cmd.trim()) addLine(`Comando inválido: ${command}`, 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        className={cn(
            "fixed bottom-6 right-6 z-[100] border border-zinc-800 shadow-2xl flex flex-col font-mono text-sm overflow-hidden",
            isMinimized ? "w-64 h-10 bg-zinc-900" : "w-full max-w-4xl h-[550px] bg-zinc-950"
        )}
    >
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 border-b border-zinc-800 text-zinc-400 shrink-0">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">TTY1 Kernel Console</span>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => setIsMinimized(!isMinimized)}><Minus className="h-3 w-3" /></button>
            <button onClick={onClose}><X className="h-3 w-3" /></button>
        </div>
      </div>

      {!isMinimized && (
        <>
            <ScrollArea className="flex-1 p-6">
                <div className="space-y-1">
                    {history.map((line, i) => (
                        <div key={i} className={cn(
                            "text-[13px] leading-relaxed",
                            line.type === 'input' && "text-primary font-bold",
                            line.type === 'error' && "text-red-500",
                            line.type === 'success' && "text-emerald-400",
                            line.type === 'system' && "text-amber-500",
                            line.type === 'output' && "text-zinc-400"
                        )}>
                            {line.content}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>

            <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) { processCommand(input); setInput(''); } }} className="p-4 bg-black/20 border-t border-zinc-900 flex items-center gap-2">
                <span className="text-primary">#</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-transparent border-none outline-none text-zinc-100 flex-1 text-xs font-mono focus:ring-0"
                    autoComplete="off"
                />
            </form>
        </>
      )}
    </div>
  );
}
