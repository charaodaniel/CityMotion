
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, ChevronRight, Command, Minus, Square } from 'lucide-react';
import { useApp } from '@/contexts/app-provider';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'system' | 'success';
  content: string;
}

export function DevTerminal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; onOpenChange?: (open: boolean) => void }) {
  const { refreshData, currentUser } = useApp();
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'system', content: 'CityMotion NexusOS v2.4.0 (Simple Console)' },
    { type: 'system', content: 'Digite "help" para listar os comandos disponíveis.' },
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
    const args = parts.slice(1);

    addLine(`> ${cmd}`, 'input');

    switch (command) {
      case 'help':
      case 'nexus-help':
        addLine('--- COMANDOS DISPONÍVEIS ---', 'system');
        addLine('info       - Informações do operador e sistema.');
        addLine('status     - Verifica conexão com o backend.');
        addLine('users      - Lista usuários do sistema.');
        addLine('fleet      - Lista veículos da frota.');
        addLine('logs       - Exibe últimos logs de auditoria.');
        addLine('clear      - Limpa o histórico do terminal.');
        addLine('reset-db   - Restaura o banco de dados (Cuidado!)');
        addLine('exit       - Fecha o terminal.');
        break;

      case 'info':
        addLine(`Operador: ${currentUser?.name || 'Sistema'}`);
        addLine(`Nível: ${currentUser?.role || 'Visitante'}`);
        addLine('Engine: NexusBridge v1.2');
        break;

      case 'status':
        addLine('Testando conexão...', 'system');
        try {
          const res = await fetch('/api/nexus/system/db-info');
          if (res.ok) addLine('Backend e Banco de Dados: [ ONLINE ]', 'success');
          else addLine('Falha na resposta do servidor.', 'error');
        } catch (e) {
          addLine('Servidor Offline (Porta 3001).', 'error');
        }
        break;

      case 'users':
        addLine('Buscando usuários...', 'system');
        try {
          const res = await fetch('/api/nexus/test/db-employees');
          const data = await res.json();
          if (res.ok) {
            data.forEach((u: any) => addLine(`ID: ${u.id} | ${u.name} (${u.role})`));
          }
        } catch (e) { addLine('Erro ao conectar.', 'error'); }
        break;

      case 'logs':
        addLine('Recuperando auditoria...', 'system');
        try {
          const res = await fetch('/api/nexus/system/audit-logs');
          const data = await res.json();
          if (res.ok) {
            data.slice(0, 10).forEach((l: any) => addLine(`[${l.timestamp.split('T')[1].substring(0,5)}] ${l.action} em ${l.table_name} por ${l.user_identity}`));
          }
        } catch (e) { addLine('Erro ao carregar logs.', 'error'); }
        break;

      case 'reset-db':
        addLine('Executando restauração de fábrica...', 'error');
        try {
          const res = await fetch('/api/nexus/maintenance/db-reset', { method: 'POST' });
          if (res.ok) {
            addLine('BANCO RESTAURADO.', 'success');
            await refreshData();
          }
        } catch (e) { addLine('Falha no reset.', 'error'); }
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        break;

      case 'exit':
        onClose();
        break;

      default:
        if (cmd.trim()) addLine(`Comando "${command}" não reconhecido.`, 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        className={cn(
            "fixed bottom-6 right-6 z-[100] transition-all border-2 border-zinc-800 shadow-2xl flex flex-col font-mono text-sm overflow-hidden",
            isMinimized ? "w-64 h-10 bg-zinc-900" : "w-full max-w-3xl h-[450px] bg-zinc-950"
        )}
    >
      {/* Header Estilo TTY */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0000AA] text-white shrink-0">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-3.5 w-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">NexusOS Terminal</span>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => setIsMinimized(!isMinimized)} className="hover:bg-white/20 p-0.5">
                {isMinimized ? <Square className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            </button>
            <button onClick={onClose} className="hover:bg-red-600 p-0.5">
                <X className="h-3 w-3" />
            </button>
        </div>
      </div>

      {!isMinimized && (
        <>
            <ScrollArea className="flex-1 p-4 bg-black/40">
                <div className="space-y-1">
                    {history.map((line, i) => (
                        <div key={i} className={cn(
                            "text-[12px] leading-relaxed break-all",
                            line.type === 'input' && "text-primary font-bold",
                            line.type === 'error' && "text-red-500",
                            line.type === 'success' && "text-emerald-400",
                            line.type === 'system' && "text-amber-500",
                            line.type === 'output' && "text-zinc-300"
                        )}>
                            {line.content}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>

            <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) { processCommand(input); setInput(''); } }} className="p-2 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Comando..."
                    className="bg-transparent border-none outline-none text-zinc-100 flex-1 text-sm font-mono"
                />
            </form>
        </>
      )}

      {isMinimized && (
          <div className="flex-1 flex items-center px-4 cursor-pointer hover:bg-zinc-800 transition-colors" onClick={() => setIsMinimized(false)}>
               <span className="text-[10px] font-bold text-zinc-400">Terminal Ativo - Clique para expandir</span>
          </div>
      )}
    </div>
  );
}
