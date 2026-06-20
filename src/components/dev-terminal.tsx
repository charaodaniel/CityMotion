
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
    const args = parts.slice(1);

    addLine(`> ${cmd}`, 'input');

    switch (command) {
      case 'nexus-help':
      case 'help':
        addLine('--- COMANDOS DE MANUTENÇÃO ---', 'system');
        addLine('nexus-info       - Dados do ambiente e hardware.');
        addLine('nexus-status     - Testa conectividade com o backend.');
        addLine('nexus-resources  - Monitoramento de memória e CPU.');
        addLine('nexus-db-stats   - Contagem de registros no SQLite.');
        addLine('nexus-db-reset   - [HARD RESET] Restaura banco de fábrica.');
        addLine('nexus-employees  - Lista funcionários diretamente do DB.');
        addLine('nexus-logdb      - Exibe os últimos logs de auditoria.');
        addLine('nexus-uptime     - Tempo de atividade do servidor.');
        addLine('clear / cls      - Limpa o histórico de comandos.');
        addLine('exit             - Encerra a sessão do terminal.');
        break;

      case 'nexus-info':
        addLine('Ambiente: Produção/NexusOS');
        addLine(`Operador: ${currentUser?.name || 'ROOT'}`);
        addLine('Gateway: http://localhost:3001/api');
        addLine('Engine: NexusBridge v1.2.0');
        break;

      case 'nexus-status':
        addLine('Sincronizando com gateway...', 'system');
        try {
          const res = await fetch('/api/nexus/system/db-info');
          if (res.ok) addLine('STATUS: 200 OK - Conectado ao SQLite', 'success');
          else addLine('STATUS: 503 FAIL - Gateway Indisponível', 'error');
        } catch (e) { addLine('ERRO: Falha crítica na rede.', 'error'); }
        break;

      case 'nexus-resources':
        try {
          const res = await fetch('/api/nexus/system/resources');
          const data = await res.json();
          addLine(`CPU: ${data.cpu.model} (${data.cpu.load}%)`, 'success');
          addLine(`MEM: ${data.memory.used} / ${data.memory.total} (${data.memory.percentage}%)`, 'success');
        } catch (e) { addLine('Falha ao obter telemetria.', 'error'); }
        break;

      case 'nexus-db-stats':
        try {
          const res = await fetch('/api/nexus/system/db-info');
          const data = await res.json();
          addLine('CONTAGEM DE REGISTROS:', 'system');
          Object.entries(data.counts).forEach(([table, count]) => {
              addLine(`${table.padEnd(20)} : ${count}`);
          });
        } catch (e) { addLine('Erro ao acessar estatísticas.', 'error'); }
        break;

      case 'nexus-employees':
        addLine('Buscando dados brutos...', 'system');
        try {
          const res = await fetch('/api/nexus/test/db-employees');
          const data = await res.json();
          addLine('ID   | NOME                 | CARGO', 'system');
          addLine('------------------------------------------', 'system');
          data.forEach((u: any) => {
              addLine(`${u.id.toString().padEnd(4)} | ${u.name.padEnd(20)} | ${u.role}`);
          });
        } catch (e) { addLine('Erro na consulta.', 'error'); }
        break;

      case 'nexus-logdb':
        addLine('Recuperando auditoria...', 'system');
        try {
          const res = await fetch('/api/nexus/system/audit-logs');
          const data = await res.json();
          addLine('DATA       | HORA  | USUÁRIO    | AÇÃO', 'system');
          addLine('--------------------------------------------', 'system');
          data.slice(0, 15).forEach((l: any) => {
              const [d, t] = l.timestamp.split('T');
              addLine(`${d} | ${t.substring(0,5)} | ${l.user_identity.padEnd(10)} | ${l.action} em ${l.table_name}`);
          });
        } catch (e) { addLine('Erro ao ler logs.', 'error'); }
        break;

      case 'nexus-db-reset':
        addLine('!!! ATENÇÃO: EXECUTANDO RESTAURAÇÃO DE FÁBRICA !!!', 'error');
        try {
          const res = await fetch('/api/nexus/maintenance/db-reset', { method: 'POST' });
          const data = await res.json();
          if (data.success) {
              addLine('SUCESSO: Banco de dados restaurado.', 'success');
              refreshData();
          } else addLine('FALHA: ' + data.message, 'error');
        } catch (e) { addLine('Erro ao executar reset.', 'error'); }
        break;

      case 'nexus-uptime':
        try {
            const res = await fetch('/api/nexus/system/resources');
            const data = await res.json();
            const uptime = Math.floor(data.uptime);
            addLine(`Uptime: ${Math.floor(uptime/3600)}h ${Math.floor((uptime%3600)/60)}m ${uptime%60}s`, 'success');
        } catch (e) { addLine('Indisponível.', 'error'); }
        break;

      case 'cls':
      case 'clear':
        setHistory([]);
        break;

      case 'exit':
        onClose();
        break;

      default:
        if (cmd.trim()) addLine(`Comando "${command}" não reconhecido. Digite "nexus-help" para ajuda.`, 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        className={cn(
            "fixed bottom-6 right-6 z-[100] transition-all border border-zinc-800 shadow-2xl flex flex-col font-mono text-sm overflow-hidden",
            isMinimized ? "w-64 h-10 bg-zinc-900" : "w-full max-w-4xl h-[550px] bg-zinc-950"
        )}
    >
      {/* Header Estilo Console */}
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 border-b border-zinc-800 text-zinc-400 shrink-0">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest">NexusOS Console /dev/tty1</span>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => setIsMinimized(!isMinimized)} className="hover:text-white p-0.5 transition-colors">
                {isMinimized ? <Square className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            </button>
            <button onClick={onClose} className="hover:text-red-500 p-0.5 transition-colors">
                <X className="h-3 w-3" />
            </button>
        </div>
      </div>

      {!isMinimized && (
        <>
            <ScrollArea className="flex-1 p-6 bg-black/40">
                <div className="space-y-1">
                    {history.map((line, i) => (
                        <div key={i} className={cn(
                            "text-[12px] leading-relaxed break-all",
                            line.type === 'input' && "text-primary font-bold",
                            line.type === 'error' && "text-red-500",
                            line.type === 'success' && "text-emerald-400",
                            line.type === 'system' && "text-amber-500 font-bold",
                            line.type === 'output' && "text-zinc-300"
                        )}>
                            {line.content}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>

            <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) { processCommand(input); setInput(''); } }} className="p-4 bg-zinc-900/50 border-t border-zinc-800 flex items-center gap-2">
                <span className="text-primary font-bold shrink-0">#</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="nexus-system-prompt..."
                    className="bg-transparent border-none outline-none text-zinc-100 flex-1 text-xs font-mono"
                    autoComplete="off"
                />
            </form>
        </>
      )}

      {isMinimized && (
          <div className="flex-1 flex items-center px-4 cursor-pointer hover:bg-zinc-800 transition-colors" onClick={() => setIsMinimized(false)}>
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Console em Background</span>
          </div>
      )}
    </div>
  );
}
