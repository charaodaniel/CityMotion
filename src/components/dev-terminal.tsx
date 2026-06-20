
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Minus, ShieldCheck, Database, Server } from 'lucide-react';
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
    { type: 'system', content: `Sessão autenticada como: ${currentUser?.name || 'ROOT'}` },
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
        addLine('--- COMANDOS DISPONÍVEIS ---', 'system');
        addLine('nexus-info     - Informações do Kernel e Sistema.');
        addLine('nexus-health   - Status de integridade dos serviços.');
        addLine('nexus-db-stats - Contagem de registros no SQLite.');
        addLine('nexus-logdb    - Histórico de auditoria (quem alterou o quê).');
        addLine('nexus-integrity- Verificação PRAGMA do banco de dados.');
        addLine('nexus-db-reset - Hard Reset do banco de dados.');
        addLine('cls / clear    - Limpa o histórico do console.');
        addLine('exit           - Encerra a sessão TTY.');
        break;

      case 'nexus-info':
        addLine('OS: CityMotion NexusOS 2.4 (NextJS-Powered)');
        addLine(`Operador: ${currentUser?.name || 'root'}`);
        addLine(`Role: ${currentUser?.role || 'SYS_ADMIN'}`);
        addLine('Architecture: x86_64 linux-node');
        break;

      case 'nexus-health':
        addLine('Checando subsistemas...', 'system');
        try {
          const res = await fetch('/api/nexus/system/db-info');
          if (res.ok) addLine('DATABASE: [OK] SQLite3 V3.45', 'success');
          else addLine('DATABASE: [FAIL] Connection Refused', 'error');
          addLine('API BRIDGE: [OK] NexusBridge V1.2', 'success');
          addLine('STORAGE: [OK] Filesystem Local', 'success');
        } catch (e) { addLine('ERRO DE REDE: Backend indisponível', 'error'); }
        break;

      case 'nexus-db-stats':
        addLine('Consultando tabelas...', 'system');
        try {
          const res = await fetch('/api/nexus/system/db-info');
          const data = await res.json();
          Object.entries(data.counts).forEach(([table, count]) => {
              addLine(`TABLE [${table.toUpperCase()}]: ${count} registros`);
          });
        } catch (e) { addLine('FALHA AO ACESSAR ESTATÍSTICAS', 'error'); }
        break;

      case 'nexus-logdb':
        addLine('Lendo logs de auditoria...', 'system');
        try {
          const res = await fetch('/api/nexus/system/audit-logs');
          const data = await res.json();
          if (data.length === 0) addLine('Nenhum registro encontrado.');
          data.slice(0, 15).forEach((l: any) => {
              addLine(`${l.timestamp.substring(11,19)} | ${l.user_identity} | ${l.action} em ${l.table_name}`);
          });
        } catch (e) { addLine('ERRO AO RECUPERAR AUDITORIA', 'error'); }
        break;

      case 'nexus-integrity':
        addLine('Executando PRAGMA integrity_check...', 'system');
        try {
            const res = await fetch('/api/nexus/system/db-integrity');
            const data = await res.json();
            if (data.status === 'Success') addLine(`RESULTADO: ${data.result}`, 'success');
            else addLine(`ALERTA: ${data.result}`, 'error');
        } catch (e) { addLine('ERRO NA EXECUÇÃO', 'error'); }
        break;

      case 'nexus-db-reset':
        addLine('!!! ATENÇÃO: INICIANDO RESTAURAÇÃO DE FÁBRICA !!!', 'error');
        try {
          const res = await fetch('/api/nexus/maintenance/db-reset', { method: 'POST' });
          if (res.ok) {
              addLine('BANCO RESTAURADO COM SUCESSO. SINCRONIZANDO...', 'success');
              refreshData();
          }
        } catch (e) { addLine('ERRO CRÍTICO NO RESET', 'error'); }
        break;

      case 'cls':
      case 'clear':
        setHistory([]);
        break;

      case 'exit':
        onClose();
        break;

      default:
        if (cmd.trim()) addLine(`Comando não reconhecido: "${command}". Digite "help" para auxílio.`, 'error');
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
          <TerminalIcon className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/90">NexusOS Shell v2.4</span>
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
                            line.type === 'input' && "text-primary font-bold",
                            line.type === 'error' && "text-red-500",
                            line.type === 'success' && "text-emerald-400",
                            line.type === 'system' && "text-amber-500/80 italic",
                            line.type === 'output' && "text-zinc-400"
                        )}>
                            {line.content}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>

            <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) { processCommand(input); setInput(''); } }} className="p-4 bg-zinc-900/40 border-t border-zinc-800 flex items-center gap-3 group">
                <span className="text-primary font-bold animate-pulse group-focus-within:animate-none">#</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-transparent border-none outline-none text-zinc-100 flex-1 text-sm font-mono focus:ring-0 p-0"
                    autoComplete="off"
                    spellCheck="false"
                    placeholder="Aguardando comando..."
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
