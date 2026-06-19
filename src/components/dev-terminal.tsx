"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, ChevronRight, Command, Cpu, HardDrive, Activity } from 'lucide-react';
import { useApp } from '@/contexts/app-provider';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Progress } from './ui/progress';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'system' | 'success';
  content: string;
}

interface SystemStats {
  uptime: number;
  memory: { total: string; used: string; percentage: string };
  cpu: { model: string; cores: number; load: string };
  platform: string;
  nodeVersion: string;
}

export function DevTerminal({ isOpen, onClose }: { isOpen: boolean; onOpenChange: (open: boolean) => void; onClose: () => void }) {
  const { currentUser } = useApp();
  const { toast } = useToast();
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'system', content: 'CityMotion OS v1.2.0 (btop edition)' },
    { type: 'system', content: 'Digite "help" para ver a lista de comandos e descrições.' },
  ]);
  const [input, setInput] = useState('');
  const [stats, setStats] = useState<SystemStats | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/nexus/system/resources');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Failed to fetch system stats");
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
      fetchStats();
      const interval = setInterval(fetchStats, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Auto-scroll logic like Linux Terminal
  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [history, isOpen]);

  const addLine = (content: string, type: TerminalLine['type'] = 'output') => {
    setHistory(prev => [...prev, { type, content }]);
  };

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  };

  const processCommand = async (cmd: string) => {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    addLine(`> ${cmd}`, 'input');

    switch (command) {
      case 'help':
        addLine('--- Comandos Disponíveis ---', 'system');
        addLine('users           - Lista todos os funcionários do banco de dados (SQLite).');
        addLine('top | btop      - Mostra uso de CPU, RAM e Uptime em tempo real.');
        addLine('status          - Testa conectividade com NexusBridge e Banco SQLite.');
        addLine('whoami          - Exibe detalhes do seu perfil e permissões atuais.');
        addLine('nexus <path>    - Executa consulta GET na ponte (Ex: nexus fleet).');
        addLine('nexus-post <p>  - Envia dados via POST para a ponte (Ex: nexus-post employees {...}).');
        addLine('db-reset        - HARD RESET: Reinicia o backend e restaura o banco original.');
        addLine('clear | cls     - Limpa o histórico de mensagens deste console.');
        addLine('exit            - Fecha a janela do terminal de desenvolvedor.');
        addLine('----------------------------', 'system');
        break;

      case 'users':
        addLine('Buscando lista de usuários no SQLite...', 'system');
        try {
            const res = await fetch('/api/nexus/test/db-employees');
            const data = await res.json();
            if (res.ok && Array.isArray(data)) {
                addLine(`Encontrados ${data.length} registros:`, 'success');
                addLine('ID  | NOME                 | CARGO', 'system');
                addLine('------------------------------------------');
                data.forEach((u: any) => {
                    const idStr = String(u.id).padEnd(3);
                    const nameStr = String(u.name).substring(0, 20).padEnd(20);
                    addLine(`${idStr} | ${nameStr} | ${u.role}`);
                });
            } else {
                addLine('Erro: Não foi possível obter a lista de usuários.', 'error');
            }
        } catch (e) {
            addLine('Falha catastrófica ao conectar com o banco.', 'error');
        }
        break;

      case 'btop':
      case 'top':
        await fetchStats();
        addLine('Estatísticas de Recursos Atualizadas.', 'success');
        if (stats) {
            addLine(`CPU: ${stats.cpu.model} (${stats.cpu.cores} cores)`);
            addLine(`Load: ${stats.cpu.load}% | RAM: ${stats.memory.percentage}% (${stats.memory.used} / ${stats.memory.total})`);
        }
        break;

      case 'status':
        addLine('NexusBridge Engine: OPERACIONAL', 'success');
        try {
            const res = await fetch('/api/nexus/test/db-employees');
            if (res.ok) addLine('Backend Express/SQLite: CONECTADO', 'success');
            else addLine('Backend Express/SQLite: ERRO (Response ' + res.status + ')', 'error');
        } catch (e) {
            addLine('Backend Express/SQLite: INDISPONÍVEL (Offline)', 'error');
        }
        break;

      case 'db-reset':
        addLine('Solicitando Hard Reset ao Backend...', 'system');
        try {
            const res = await fetch('/api/nexus/maintenance/db-reset', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                addLine('REINICIALIZAÇÃO CONCLUÍDA: Banco de dados restaurado.', 'success');
                toast({ title: "Sistema Reiniciado", description: "O backend e o banco foram restaurados com sucesso." });
                fetchStats();
            } else {
                addLine('ERRO NO RESET: ' + data.message, 'error');
            }
        } catch (e) {
            addLine('Falha catastrófica ao tentar resetar.', 'error');
        }
        break;

      case 'nexus':
        if (!args[0]) { addLine('Erro: Especifique um path (Ex: nexus users).', 'error'); break; }
        try {
          const res = await fetch(`/api/nexus/${args[0]}`);
          const data = await res.json();
          addLine(JSON.stringify(data, null, 2));
        } catch (error) { addLine(`Falha na consulta: ${args[0]}`, 'error'); }
        break;
      
      case 'nexus-post':
         if (!args[0] || !args[1]) { addLine('Erro: Use nexus-post <path> <json_body>.', 'error'); break; }
         try {
             const body = JSON.parse(args.slice(1).join(' '));
             const res = await fetch(`/api/nexus/${args[0]}`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(body)
             });
             const data = await res.json();
             addLine(JSON.stringify(data, null, 2), res.ok ? 'success' : 'error');
         } catch (e) {
             addLine('Erro: Payload JSON inválido.', 'error');
         }
         break;

      case 'whoami':
        addLine(`NOME: ${currentUser?.name || 'N/A'}`);
        addLine(`ID: ${currentUser?.id || 'N/A'}`);
        addLine(`SETOR: ${Array.isArray(currentUser?.sector) ? currentUser?.sector.join(', ') : currentUser?.sector}`);
        addLine(`CARGO: ${currentUser?.role || 'N/A'}`);
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        break;

      case 'exit':
        onClose();
        break;

      default:
        if (cmd.trim() !== '') addLine(`Comando não reconhecido: "${command}". Digite "help" para ajuda.`, 'error');
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
    <div className="fixed bottom-6 right-6 z-[100] w-full max-w-3xl h-[550px] bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl flex flex-col font-mono text-sm overflow-hidden animate-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-400">
          <TerminalIcon className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider">CityMotion Admin Console</span>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* btop Resource Monitor Section */}
      <div className="p-4 bg-zinc-900/50 border-b border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-zinc-500">
                <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> CPU Load</span>
                <span>{stats?.cpu.load || '0'}%</span>
            </div>
            <Progress value={parseFloat(stats?.cpu.load || '0') * 10} className="h-1.5 bg-zinc-800" />
            <div className="text-[9px] text-zinc-600 truncate">{stats?.cpu.model || 'Loading CPU...'}</div>
        </div>
        <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-zinc-500">
                <span className="flex items-center gap-1"><HardDrive className="h-3 w-3" /> Memory</span>
                <span>{stats?.memory.percentage || '0'}%</span>
            </div>
            <Progress value={parseFloat(stats?.memory.percentage || '0')} className="h-1.5 bg-zinc-800" />
            <div className="text-[9px] text-zinc-600">{stats?.memory.used || '0 GB'} / {stats?.memory.total || '0 GB'}</div>
        </div>
        <div className="space-y-2">
             <div className="flex items-center justify-between text-[10px] uppercase font-bold text-zinc-500">
                <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> Uptime</span>
            </div>
            <div className="text-lg font-bold text-emerald-500 mt-1">
                {stats ? formatUptime(stats.uptime) : '00:00:00'}
            </div>
            <div className="text-[9px] text-zinc-600">Platform: {stats?.platform || 'linux'} | Node: {stats?.nodeVersion || 'N/A'}</div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 bg-black/50">
        <div className="space-y-1">
          {history.map((line, i) => (
            <div 
              key={i} 
              className={cn(
                "whitespace-pre-wrap break-all",
                line.type === 'input' && "text-blue-400",
                line.type === 'error' && "text-red-400",
                line.type === 'success' && "text-emerald-400",
                line.type === 'system' && "text-amber-500 font-bold",
                line.type === 'output' && "text-zinc-300"
              )}
            >
              {line.content}
            </div>
          ))}
          {/* Scroll Anchor */}
          <div ref={bottomRef} className="h-1" />
        </div>
      </ScrollArea>

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
