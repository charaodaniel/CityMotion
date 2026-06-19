
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, ChevronRight, Command } from 'lucide-react';
import { useApp } from '@/contexts/app-provider';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
}

export function DevTerminal({ isOpen, onClose }: { isOpen: boolean; onOpenChange: (open: boolean) => void; onClose: () => void }) {
  const { currentUser, userRole } = useApp();
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'system', content: 'CityMotion OS v1.0.0 (NexusBridge Core)' },
    { type: 'system', content: 'Digite "help" para ver os comandos disponíveis.' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

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
        addLine('Comandos disponíveis:');
        addLine('  help           - Mostra esta lista');
        addLine('  nexus <path>   - Consulta endpoint via NexusBridge');
        addLine('  whoami         - Detalhes do usuário atual');
        addLine('  status         - Verifica saúde do sistema');
        addLine('  clear | cls    - Limpa o terminal');
        addLine('  exit           - Fecha o terminal');
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        break;

      case 'exit':
        onClose();
        break;

      case 'whoami':
        addLine(`Usuário: ${currentUser?.name || 'N/A'}`);
        addLine(`Cargo: ${currentUser?.role || 'N/A'}`);
        addLine(`Permissão: ${userRole}`);
        addLine(`Setor: ${currentUser?.sector.join(', ') || 'N/A'}`);
        break;

      case 'status':
        addLine('NexusBridge Engine: OPERACIONAL');
        addLine('Local Simulation: ONLINE');
        addLine('Node Backend (SQLite): VERIFICANDO...');
        try {
            const res = await fetch('/api/nexus/test/db-employees');
            if (res.ok) addLine('Node Backend (SQLite): CONECTADO', 'system');
            else addLine('Node Backend (SQLite): ERRO NA RESPOSTA', 'error');
        } catch (e) {
            addLine('Node Backend (SQLite): INDISPONÍVEL', 'error');
        }
        break;

      case 'nexus':
        if (!args[0]) {
          addLine('Erro: Especifique um path. Ex: nexus users', 'error');
          break;
        }
        addLine(`Consultando /api/nexus/${args[0]}...`, 'system');
        try {
          const response = await fetch(`/api/nexus/${args[0]}`);
          const data = await response.json();
          addLine(JSON.stringify(data, null, 2));
        } catch (error) {
          addLine(`Falha na consulta: ${args[0]}`, 'error');
        }
        break;

      default:
        if (cmd.trim() !== '') {
          addLine(`Comando não reconhecido: ${command}`, 'error');
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      processCommand(input);
      setInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-full max-w-2xl h-[400px] bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl flex flex-col font-mono text-sm overflow-hidden animate-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-400">
          <TerminalIcon className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider">CityMotion Dev Console</span>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <ScrollArea className="flex-1 p-4 bg-black/50" ref={scrollRef}>
        <div className="space-y-1">
          {history.map((line, i) => (
            <div 
              key={i} 
              className={cn(
                "whitespace-pre-wrap break-all",
                line.type === 'input' && "text-blue-400",
                line.type === 'error' && "text-red-400",
                line.type === 'system' && "text-green-500 font-bold",
                line.type === 'output' && "text-zinc-300"
              )}
            >
              {line.content}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2">
        <ChevronRight className="h-4 w-4 text-zinc-500 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite um comando..."
          className="bg-transparent border-none outline-none text-zinc-100 flex-1 placeholder:text-zinc-700"
        />
        <div className="text-[10px] text-zinc-600 flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded">
          <Command className="h-2 w-2" /> 
          <span>Enter para enviar</span>
        </div>
      </form>
    </div>
  );
}
