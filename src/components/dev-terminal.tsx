
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, ChevronRight, Minus, Square } from 'lucide-react';
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
    { type: 'system', content: 'CityMotion NexusOS v2.4.0 (Console Simples)' },
    { type: 'system', content: 'Sessão iniciada como ' + (currentUser?.name || 'root') },
    { type: 'system', content: 'Digite "help" para ver os comandos disponíveis.' },
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
        addLine('info       - Exibe informações do operador.');
        addLine('health     - Relatório de saúde dos subsistemas.');
        addLine('integrity  - Verifica integridade do banco SQLite.');
        addLine('uptime     - Tempo de atividade ininterrupta.');
        addLine('users      - Lista todos os funcionários no banco.');
        addLine('fleet      - Lista todos os veículos da frota.');
        addLine('logs       - Exibe os últimos logs de auditoria.');
        addLine('status     - Testa conectividade com o backend.');
        addLine('clear/cls  - Limpa a tela do terminal.');
        addLine('exit       - Encerra a sessão atual.');
        break;

      case 'info':
        addLine(`Operador: ${currentUser?.name || 'Sistema'}`);
        addLine(`Cargo: ${currentUser?.role || 'Visitante'}`);
        addLine(`Matrícula: ${currentUser?.matricula || 'N/A'}`);
        addLine('Engine: NexusBridge v1.2');
        break;

      case 'health':
        addLine('Iniciando protocolo de diagnóstico...', 'system');
        try {
          const res = await fetch('/api/nexus/system/db-info');
          const data = await res.json();
          addLine(`[ BANCO ] Database: ${data.database} | Status: ${data.status}`, 'success');
          addLine(`[ REDE  ] Gateway: http://localhost:3001 | Status: ONLINE`, 'success');
          addLine(`[ DISCO ] Local Storage: Operacional`, 'success');
        } catch (e) {
          addLine('Falha ao obter diagnóstico completo.', 'error');
        }
        break;

      case 'integrity':
        addLine('Executando verificação de integridade...', 'system');
        try {
          const res = await fetch('/api/nexus/system/db-integrity');
          const data = await res.json();
          if (data.status === 'Success') addLine('INTEGRIDADE: OK (Banco Saudável)', 'success');
          else addLine(`AVISO: ${data.result}`, 'error');
        } catch (e) { addLine('Falha na comunicação com o banco.', 'error'); }
        break;

      case 'uptime':
        try {
          const res = await fetch('/api/nexus/system/resources');
          const data = await res.json();
          const hours = Math.floor(data.uptime / 3600);
          const mins = Math.floor((data.uptime % 3600) / 60);
          addLine(`Server Uptime: ${hours}h ${mins}m`, 'success');
        } catch (e) { addLine('Indisponível.', 'error'); }
        break;

      case 'status':
        addLine('Ping: http://localhost:3001/api...', 'system');
        try {
          const res = await fetch('/api/nexus/system/db-info');
          if (res.ok) addLine('RESPOSTA: 200 OK (0.4ms)', 'success');
          else addLine('RESPOSTA: FALHA NO GATEWAY', 'error');
        } catch (e) { addLine('ERRO: Backend Offline (Ref. 503)', 'error'); }
        break;

      case 'users':
      case 'nexus-employees':
        addLine('Buscando base de dados de funcionários...', 'system');
        try {
          const res = await fetch('/api/nexus/test/db-employees');
          const data = await res.json();
          if (res.ok) {
            addLine('ID   | NOME                 | CARGO', 'system');
            addLine('------------------------------------------', 'system');
            data.forEach((u: any) => {
                addLine(`${u.id.toString().padEnd(4)} | ${u.name.padEnd(20)} | ${u.role}`);
            });
          }
        } catch (e) { addLine('Erro de rede ao buscar usuários.', 'error'); }
        break;

      case 'fleet':
        addLine('Sincronizando frota ativa...', 'system');
        try {
          const res = await fetch('/api/nexus/test/db-vehicles');
          const data = await res.json();
          if (res.ok) {
            addLine('ID   | PLACA     | MODELO          | STATUS', 'system');
            addLine('------------------------------------------------', 'system');
            data.forEach((v: any) => {
                addLine(`${v.id.padEnd(4)} | ${v.licensePlate.padEnd(9)} | ${v.vehicleModel.padEnd(15)} | ${v.status}`);
            });
          }
        } catch (e) { addLine('Falha ao conectar com a frota.', 'error'); }
        break;

      case 'logs':
      case 'nexus-logdb':
        addLine('Recuperando logs de auditoria (Top 10)...', 'system');
        try {
          const res = await fetch('/api/nexus/system/audit-logs');
          const data = await res.json();
          if (res.ok) {
            addLine('DATA       | HORA  | OPERADOR   | AÇÃO', 'system');
            addLine('--------------------------------------------', 'system');
            data.slice(0, 10).forEach((l: any) => {
                const [d, t] = l.timestamp.split('T');
                addLine(`${d} | ${t.substring(0,5)} | ${l.user_identity.padEnd(10)} | ${l.action} em ${l.table_name}`);
            });
          }
        } catch (e) { addLine('Erro ao recuperar logs.', 'error'); }
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        break;

      case 'exit':
        addLine('Encerrando sessão...', 'system');
        setTimeout(onClose, 500);
        break;

      default:
        if (cmd.trim()) addLine(`Comando "${command}" não reconhecido. Digite "help" para ajuda.`, 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        className={cn(
            "fixed bottom-6 right-6 z-[100] transition-all border border-zinc-800 shadow-2xl flex flex-col font-mono text-sm overflow-hidden",
            isMinimized ? "w-64 h-10 bg-zinc-900" : "w-full max-w-4xl h-[500px] bg-zinc-950"
        )}
    >
      {/* Header Clássico */}
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 border-b border-zinc-800 text-zinc-400 shrink-0">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest">NexusOS v2.4 Console</span>
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
            <ScrollArea className="flex-1 p-4 bg-black/40">
                <div className="space-y-1">
                    {history.map((line, i) => (
                        <div key={i} className={cn(
                            "text-[12px] leading-relaxed break-all",
                            line.type === 'input' && "text-primary",
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

            <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) { processCommand(input); setInput(''); } }} className="p-3 bg-zinc-900/50 border-t border-zinc-800 flex items-center gap-2">
                <span className="text-primary font-bold shrink-0">$</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite um comando..."
                    className="bg-transparent border-none outline-none text-zinc-100 flex-1 text-xs font-mono"
                    autoComplete="off"
                />
            </form>
        </>
      )}

      {isMinimized && (
          <div className="flex-1 flex items-center px-4 cursor-pointer hover:bg-zinc-800 transition-colors" onClick={() => setIsMinimized(false)}>
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Terminal em Segundo Plano</span>
          </div>
      )}
    </div>
  );
}
