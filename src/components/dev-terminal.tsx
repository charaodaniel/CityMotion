
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, ChevronRight, Command, Cpu, HardDrive, Activity, Save, ArrowLeft } from 'lucide-react';
import { useApp } from '@/contexts/app-provider';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Progress } from './ui/progress';
import type { Employee } from '@/lib/types';

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

const AVAILABLE_ROLES = [
  "Funcionário",
  "Motorista",
  "Gestor de Setor",
  "Administrador",
  "Técnico Mecânico"
];

export function DevTerminal({ isOpen, onClose }: { isOpen: boolean; onOpenChange: (open: boolean) => void; onClose: () => void }) {
  const { currentUser } = useApp();
  const { toast } = useToast();
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'system', content: 'CityMotion OS v1.2.6 (interactive edition)' },
    { type: 'system', content: 'Digite "help" para ver a lista de comandos e descrições.' },
  ]);
  const [input, setInput] = useState('');
  const [stats, setStats] = useState<SystemStats | null>(null);
  
  // TUI (Terminal User Interface) State
  const [tuiMode, setTuiMode] = useState<'edit' | null>(null);
  const [editingUser, setEditingUser] = useState<Employee | null>(null);

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

  useEffect(() => {
    if (isOpen && !tuiMode) {
      bottomRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [history, isOpen, tuiMode]);

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
        addLine('test-all        - Executa teste de stress em todas as conexões e gera logs.');
        addLine('users           - Lista todos os funcionários do banco de dados (SQLite).');
        addLine('user-edit <id>  - Abre a interface TUI para editar um funcionário.');
        addLine('top | btop      - Mostra uso de CPU, RAM e Uptime em tempo real.');
        addLine('status          - Testa conectividade com NexusBridge e Banco SQLite.');
        addLine('whoami          - Exibe detalhes do seu perfil e permissões atuais.');
        addLine('nexus <path>    - Executa consulta GET na ponte (Ex: nexus fleet).');
        addLine('db-reset        - HARD RESET: Reinicia o backend e restaura o banco original.');
        addLine('clear | cls     - Limpa o histórico de mensagens deste console.');
        addLine('exit            - Fecha a janela do terminal de desenvolvedor.');
        addLine('----------------------------', 'system');
        break;

      case 'test-all':
        addLine('Iniciando Teste Geral de Conectividade...', 'system');
        
        // 1. Teste de API Local (JSON)
        addLine('[1/4] Testando Local API (/api/data)...');
        try {
            const res = await fetch('/api/data?type=employees');
            if (res.ok) addLine(`SUCCESS: Local API responded with status ${res.status}`, 'success');
            else addLine(`FAILURE: Local API returned status ${res.status}`, 'error');
        } catch (e) { addLine('FAILURE: Local API is unreachable.', 'error'); }

        // 2. Teste de Ponte Nexus (Local Bridge)
        addLine('[2/4] Testando NexusBridge (Path: users)...');
        try {
            const res = await fetch('/api/nexus/users');
            if (res.ok) addLine(`SUCCESS: NexusBridge resolved LocalSim with status ${res.status}`, 'success');
            else addLine(`FAILURE: NexusBridge returned status ${res.status}`, 'error');
        } catch (e) { addLine('FAILURE: NexusBridge internal error.', 'error'); }

        // 3. Teste de Backend Express
        addLine('[3/4] Testando Node Backend (/api/system/resources)...');
        try {
            const res = await fetch('/api/nexus/system/resources');
            if (res.ok) addLine(`SUCCESS: Node Backend is ALIVE (Status ${res.status})`, 'success');
            else addLine(`FAILURE: Node Backend responded with error ${res.status}`, 'error');
        } catch (e) { addLine('FAILURE: Node Backend is OFFLINE (503/Connection Refused)', 'error'); }

        // 4. Teste de Banco SQLite
        addLine('[4/4] Testando Query no Banco SQLite...');
        try {
            const res = await fetch('/api/nexus/test/db-employees');
            if (res.ok) addLine(`SUCCESS: SQLite DB returned data records correctly.`, 'success');
            else addLine(`FAILURE: Database query failed (Status ${res.status})`, 'error');
        } catch (e) { addLine('FAILURE: Could not communicate with database engine.', 'error'); }
        
        addLine('--- Fim do Relatório de Teste ---', 'system');
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

      case 'user-edit':
        if (!args[0]) {
            addLine('Erro: Use user-edit <id>.', 'error');
            break;
        }

        const userId = args[0];
        
        addLine(`Iniciando TUI Dialog para funcionário ID ${userId}...`, 'system');
        try {
            const res = await fetch(`/api/nexus/test/db-employees/${userId}`);
            const userData = await res.json();
            
            if (res.ok) {
                setEditingUser(userData);
                setTuiMode('edit');
                addLine('Interface TUI aberta.', 'success');
            } else {
                addLine(`Erro: ${userData.error || 'Não encontrado.'}`, 'error');
            }
        } catch (e) {
            addLine('Falha ao tentar carregar dados do usuário.', 'error');
        }
        break;

      case 'btop':
      case 'top':
        await fetchStats();
        addLine('Estatísticas de Recursos Atualizadas.', 'success');
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
        if (!args[0]) { addLine('Erro: Especifique um path.', 'error'); break; }
        try {
          const res = await fetch(`/api/nexus/${args[0]}`);
          const data = await res.json();
          addLine(JSON.stringify(data, null, 2));
        } catch (error) { addLine(`Falha na consulta: ${args[0]}`, 'error'); }
        break;

      case 'whoami':
        addLine(`NOME: ${currentUser?.name || 'N/A'}`);
        addLine(`ID: ${currentUser?.id || 'N/A'}`);
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
        if (cmd.trim() !== '') addLine(`Comando não reconhecido: "${command}". Digite "help".`, 'error');
    }
  };

  const handleTuiSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updatedData = {
        name: formData.get('name') as string,
        role: formData.get('role') as string,
        status: formData.get('status') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    addLine(`Salvando alterações via TUI no SQLite para ID ${editingUser.id}...`, 'system');
    try {
        const res = await fetch(`/api/nexus/test/db-employees/${editingUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });
        
        if (res.ok) {
            addLine(`SUCESSO: Registro ID ${editingUser.id} atualizado.`, 'success');
            toast({ title: "Banco Atualizado", description: "Alterações salvas com sucesso no SQLite." });
            setTuiMode(null);
            setEditingUser(null);
        } else {
            const errorData = await res.json().catch(() => ({ error: 'Desconhecido' }));
            addLine(`ERRO (${res.status}): Falha ao salvar no banco. ${errorData.error || ''}`, 'error');
        }
    } catch (e) {
        addLine('Erro de conexão ao tentar salvar.', 'error');
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
      {/* Terminal Header */}
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
                <span className="flex items-center gap-1"><HardDrive className="h-3 w-3" /> RAM</span>
                <span>{stats?.memory.percentage || '0'}%</span>
            </div>
            <Progress value={parseFloat(stats?.memory.percentage || '0')} className="h-1.5 bg-zinc-800" />
            <div className="text-[9px] text-zinc-600">{stats?.memory.used || '0 GB'} / {stats?.memory.total || '0 GB'}</div>
        </div>
        <div className="space-y-2 text-right">
             <div className="flex items-center justify-end text-[10px] uppercase font-bold text-zinc-500">
                <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> Uptime</span>
            </div>
            <div className="text-lg font-bold text-emerald-500 mt-1">
                {stats ? formatUptime(stats.uptime) : '00:00:00'}
            </div>
        </div>
      </div>

      {/* Main Terminal Viewport */}
      <div className="relative flex-1 overflow-hidden flex flex-col">
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
            <div ref={bottomRef} className="h-1" />
            </div>
        </ScrollArea>

        {/* INTERACTIVE TUI OVERLAY (Retro Linux Dialog Style) */}
        {tuiMode === 'edit' && editingUser && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-6 backdrop-blur-[1px]">
                <form 
                    onSubmit={handleTuiSave}
                    className="w-full max-w-lg bg-zinc-200 border-4 border-double border-zinc-400 shadow-[8px_8px_0px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                    {/* TUI Header (BIOS/Dialog style) */}
                    <div className="bg-[#0000AA] text-white px-3 py-1 font-bold flex justify-between items-center select-none">
                        <span>Edit User: {editingUser.id}</span>
                        <div className="flex gap-2">
                             <button type="button" onClick={() => setTuiMode(null)} className="hover:bg-red-600 px-1">X</button>
                        </div>
                    </div>

                    {/* TUI Body */}
                    <div className="p-6 space-y-4 text-black">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase block">Full Name:</label>
                            <input 
                                name="name"
                                defaultValue={editingUser.name}
                                className="w-full bg-white border-2 border-zinc-500 px-2 py-1 focus:bg-[#FFFFAA] outline-none"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase block">Cargo / Role:</label>
                                <select 
                                    name="role"
                                    defaultValue={editingUser.role}
                                    className="w-full bg-white border-2 border-zinc-500 px-2 py-1 focus:bg-[#FFFFAA] outline-none"
                                    required
                                >
                                  {AVAILABLE_ROLES.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                  ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase block">Status:</label>
                                <select 
                                    name="status"
                                    defaultValue={editingUser.status}
                                    className="w-full bg-white border-2 border-zinc-500 px-2 py-1 focus:bg-[#FFFFAA] outline-none"
                                >
                                    <option value="Disponível">Disponível</option>
                                    <option value="Em Serviço">Em Serviço</option>
                                    <option value="Em Viagem">Em Viagem</option>
                                    <option value="Afastado">Afastado</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase block">Email Address:</label>
                                <input 
                                    name="email"
                                    type="email"
                                    defaultValue={editingUser.email}
                                    className="w-full bg-white border-2 border-zinc-500 px-2 py-1 focus:bg-[#FFFFAA] outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase block">Change Password:</label>
                                <input 
                                    name="password"
                                    type="text"
                                    placeholder="Nova senha ou atual"
                                    defaultValue={editingUser.password}
                                    className="w-full bg-white border-2 border-zinc-500 px-2 py-1 focus:bg-[#FFFFAA] outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* TUI Footer Buttons */}
                        <div className="flex justify-center gap-6 pt-4">
                            <button 
                                type="submit"
                                className="px-6 py-1 bg-zinc-300 border-2 border-zinc-500 active:translate-y-0.5 shadow-[2px_2px_0px_rgba(0,0,0,0.8)] hover:bg-zinc-400 font-bold flex items-center gap-2"
                            >
                                <Save className="h-4 w-4" /> [ OK ]
                            </button>
                            <button 
                                type="button"
                                onClick={() => setTuiMode(null)}
                                className="px-6 py-1 bg-zinc-300 border-2 border-zinc-500 active:translate-y-0.5 shadow-[2px_2px_0px_rgba(0,0,0,0.8)] hover:bg-zinc-400 font-bold flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" /> [ CANCEL ]
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )}
      </div>

      {/* Terminal Input Bar */}
      {!tuiMode && (
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
      )}
    </div>
  );
}
