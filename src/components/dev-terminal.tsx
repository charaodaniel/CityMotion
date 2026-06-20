
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, ChevronRight, Command, Cpu, HardDrive, Activity, Save, ArrowLeft, Coffee, Sparkles, Loader2, History, FileText } from 'lucide-react';
import { useApp } from '@/contexts/app-provider';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Progress } from './ui/progress';
import type { Employee } from '@/lib/types';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'system' | 'success' | 'secret';
  content: string;
}

interface SystemStats {
  uptime: number;
  memory: { total: string; used: string; percentage: string };
  cpu: { model: string; cores: number; load: string };
  platform: string;
  nodeVersion: string;
}

interface AuditLogEntry {
  id: number;
  action: string;
  table_name: string;
  record_id: string;
  details: string;
  user_identity: string;
  timestamp: string;
}

const AVAILABLE_ROLES = [
  "Funcionário",
  "Colaborador",
  "Motorista",
  "Gestor de Setor",
  "Administrador",
  "Técnico de TI",
  "Desenvolvedor Global",
  "Técnico Mecânico"
];

export function DevTerminal({ isOpen, onClose }: { isOpen: boolean; onOpenChange: (open: boolean) => void; onClose: () => void }) {
  const { updateEmployee, refreshData, currentUser } = useApp();
  const { toast } = useToast();
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'system', content: 'CityMotion NexusOS v2.0.0 (Admin Console)' },
    { type: 'system', content: 'Digite "nexus-help" para ver a lista de comandos.' },
  ]);
  const [input, setInput] = useState('');
  const [stats, setStats] = useState<SystemStats | null>(null);
  
  const [tuiMode, setTuiMode] = useState<'edit' | 'logs' | null>(null);
  const [editingUser, setEditingUser] = useState<Employee | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

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
      case 'nexus-help':
      case 'help':
        addLine('--- Comandos CityMotion NexusBridge ---', 'system');
        addLine('nexus-info          - Informações gerais do sistema.');
        addLine('nexus-status        - Status dos serviços principais.');
        addLine('nexus-ping          - Testa comunicação com API/DB.');
        addLine('nexus-resources     - Monitor de hardware (btop).');
        addLine('nexus-db-stats      - Estatísticas de registros no banco.');
        addLine('nexus-logdb         - Visualizador de Auditoria (Janela TUI).');
        addLine('nexus-db-reset      - Hard reset no banco de dados.');
        addLine('nexus-employees     - Lista todos os funcionários.');
        addLine('nexus-employee-info - Detalhes/Edição de um funcionário (nexus-employee-info <id>).');
        addLine('nexus-vehicles      - Lista frota de veículos.');
        addLine('nexus-terminal-clear - Limpa a tela.');
        addLine('----------------------------------------', 'system');
        break;

      case 'nexus-info':
        addLine('Ambiente: Desenvolvimento');
        addLine('Operador: ' + (currentUser?.name || 'Sistema/Root'));
        addLine('Engine: NexusBridge Core 1.2');
        addLine('Database: SQLite3 (Arquivo Local)');
        addLine('Platform: ' + (stats?.platform || 'Carregando...'));
        addLine('Node: ' + (stats?.nodeVersion || 'Carregando...'));
        break;

      case 'nexus-status':
      case 'status':
        addLine('NexusBridge Engine: OPERACIONAL', 'success');
        try {
            const res = await fetch('/api/nexus/system/db-info');
            if (res.ok) addLine('Backend Express/SQLite: CONECTADO', 'success');
            else addLine('Backend Express/SQLite: ERRO NA RESPOSTA', 'error');
        } catch (e) {
            addLine('Backend Express/SQLite: OFFLINE', 'error');
        }
        break;

      case 'nexus-ping':
        const start = Date.now();
        try {
            const res = await fetch('/api/nexus/system/resources');
            const end = Date.now();
            if (res.ok) addLine(`PONG! Resposta em ${end - start}ms`, 'success');
            else addLine('Falha na resposta do servidor.', 'error');
        } catch (e) {
            addLine('Requisição falhou (servidor offline?).', 'error');
        }
        break;

      case 'nexus-db-stats':
        try {
            const res = await fetch('/api/nexus/system/db-info');
            const data = await res.json();
            addLine('--- Registros por Tabela ---', 'system');
            Object.entries(data.counts).forEach(([table, count]) => {
                addLine(`${table.padEnd(20)}: ${count} registros`);
            });
        } catch (e) { addLine('Erro ao buscar estatísticas do banco.', 'error'); }
        break;

      case 'nexus-logdb':
        addLine('Acessando logs de auditoria...', 'system');
        setIsLoadingLogs(true);
        try {
            const res = await fetch('/api/nexus/system/audit-logs');
            const data = await res.json();
            if (res.ok && Array.isArray(data)) {
                setAuditLogs(data);
                setTuiMode('logs');
                addLine('Visualizador de Auditoria iniciado.', 'success');
            } else {
                addLine('Erro ao obter logs. O banco pode estar vazio.', 'error');
            }
        } catch (e) { addLine('Falha crítica de conexão com o sistema de auditoria.', 'error'); }
        finally { setIsLoadingLogs(false); }
        break;

      case 'nexus-db-reset':
        addLine('Solicitando Hard Reset ao Backend...', 'system');
        try {
            const res = await fetch('/api/nexus/maintenance/db-reset', { method: 'POST' });
            if (res.ok) {
                addLine('REINICIALIZAÇÃO CONCLUÍDA COM SUCESSO.', 'success');
                toast({ title: "Sistema Reiniciado", description: "O banco de dados foi restaurado." });
                await refreshData();
            } else addLine('ERRO NO RESET DE BANCO.', 'error');
        } catch (e) { addLine('Falha de conexão durante o reset.', 'error'); }
        break;

      case 'nexus-employees':
      case 'users':
        addLine('Buscando funcionários no SQLite...', 'system');
        try {
            const res = await fetch('/api/nexus/test/db-employees');
            const data = await res.json();
            if (res.ok && Array.isArray(data)) {
                addLine('ID  | NOME                 | CARGO', 'system');
                data.forEach((u: any) => {
                    const idStr = String(u.id).padEnd(3);
                    const nameStr = String(u.name).substring(0, 20).padEnd(20);
                    addLine(`${idStr} | ${nameStr} | ${u.role}`);
                });
            } else addLine('Erro ao obter lista do backend.', 'error');
        } catch (e) { addLine('Falha de conexão com a API de funcionários.', 'error'); }
        break;

      case 'nexus-employee-info':
      case 'user-edit':
        if (!args[0]) { addLine('Erro: Use nexus-employee-info <id>.', 'error'); break; }
        const userId = args[0];
        try {
            const res = await fetch(`/api/nexus/test/db-employees/${userId}`);
            const userData = await res.json();
            if (res.ok) {
                setEditingUser(userData);
                setTuiMode('edit');
                addLine('Interface TUI aberta para o ID: ' + userId, 'success');
            } else addLine(`Erro: Funcionário ${userId} não encontrado.`, 'error');
        } catch (e) { addLine('Falha ao carregar dados do usuário.', 'error'); }
        break;

      case 'nexus-vehicles':
        try {
            const res = await fetch('/api/nexus/test/db-vehicles');
            const data = await res.json();
            addLine('ID  | MODELO               | PLACA', 'system');
            data.forEach((v: any) => {
                addLine(`${String(v.id).padEnd(3)} | ${v.vehicleModel.padEnd(20)} | ${v.licensePlate}`);
            });
        } catch (e) { addLine('Falha ao listar frota.', 'error'); }
        break;

      case 'nexus-terminal-clear':
      case 'clear':
        setHistory([]);
        break;

      case 'nexus-coffee':
        addLine('☕ Servindo café virtual para o operador...', 'secret');
        addLine('   ( o)__ ( o)__ ( o)');
        addLine('    (   )  (   )  (   )');
        break;

      case 'exit':
        onClose();
        break;

      default:
        if (cmd.trim() !== '') addLine(`Comando não reconhecido: "${command}". Digite "nexus-help".`, 'error');
    }
  };

  const handleTuiSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || isSaving) return;
    
    setIsSaving(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    // Converte setores de volta para array
    const sectorInput = formData.get('sector') as string;
    const sectorArray = sectorInput.split(',').map(s => s.trim()).filter(s => s !== '');

    const updatedData = {
        name: formData.get('name') as string,
        role: formData.get('role') as string,
        status: formData.get('status') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        matricula: formData.get('matricula') as string,
        cnh: formData.get('cnh') as string,
        sector: sectorArray
    };

    addLine(`Salvando alterações para o ID ${editingUser.id}...`, 'system');
    try {
        await updateEmployee(editingUser.id, updatedData);
        addLine(`SUCESSO: Registro ${editingUser.id} sincronizado com SQLite.`, 'success');
        setTuiMode(null);
        setEditingUser(null);
        await refreshData();
    } catch (e) { 
        addLine('ERRO: Não foi possível persistir as alterações.', 'error'); 
    } finally {
        setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-full max-w-4xl h-[600px] bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl flex flex-col font-mono text-sm overflow-hidden animate-in slide-in-from-bottom-4">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-400">
          <TerminalIcon className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Console Dev NexusBridge</span>
        </div>
        <div className="flex gap-2">
            {isLoadingLogs && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
            <button onClick={() => setHistory([])} className="text-zinc-600 hover:text-zinc-400" title="Limpar Histórico"><Sparkles className="h-3 w-3" /></button>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="h-4 w-4" />
            </button>
        </div>
      </div>

      {/* btop Resource Monitor Section */}
      <div className="p-4 bg-zinc-900/50 border-b border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-zinc-500">
                <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> Carga CPU</span>
                <span>{stats?.cpu.load || '0'}%</span>
            </div>
            <Progress value={parseFloat(stats?.cpu.load || '0') * 10} className="h-1.5 bg-zinc-800" />
        </div>
        <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-zinc-500">
                <span className="flex items-center gap-1"><HardDrive className="h-3 w-3" /> RAM</span>
                <span>{stats?.memory.percentage || '0'}%</span>
            </div>
            <Progress value={parseFloat(stats?.memory.percentage || '0')} className="h-1.5 bg-zinc-800" />
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
                    line.type === 'secret' && "text-fuchsia-400 italic",
                    line.type === 'output' && "text-zinc-300"
                )}
                >
                {line.content}
                </div>
            ))}
            <div ref={bottomRef} className="h-1" />
            </div>
        </ScrollArea>

        {/* INTERACTIVE TUI OVERLAY (EDIT USER) */}
        {tuiMode === 'edit' && editingUser && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-6 backdrop-blur-[1px] z-[60]">
                <form 
                    onSubmit={handleTuiSave}
                    className="w-full max-w-lg bg-zinc-200 border-4 border-double border-zinc-400 shadow-[8px_8px_0px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                    <div className="bg-[#0000AA] text-white px-3 py-1 font-bold flex justify-between items-center select-none">
                        <span>Editar Usuário: {editingUser.id}</span>
                        <button type="button" onClick={() => setTuiMode(null)} className="hover:bg-red-600 px-1">X</button>
                    </div>

                    <div className="p-6 space-y-4 text-black">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase block">Nome Completo:</label>
                                <input name="name" defaultValue={editingUser.name} className="w-full bg-white border-2 border-zinc-500 px-2 py-1 outline-none" required />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase block">Matrícula:</label>
                                <input name="matricula" defaultValue={editingUser.matricula} className="w-full bg-white border-2 border-zinc-500 px-2 py-1 outline-none" placeholder="Ex: M-001" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase block">Cargo:</label>
                                <select name="role" defaultValue={editingUser.role} className="w-full bg-white border-2 border-zinc-500 px-2 py-1 outline-none">
                                  {AVAILABLE_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase block">Status:</label>
                                <select name="status" defaultValue={editingUser.status} className="w-full bg-white border-2 border-zinc-500 px-2 py-1 outline-none">
                                    <option value="Disponível">Disponível</option>
                                    <option value="Em Serviço">Em Serviço</option>
                                    <option value="Em Viagem">Em Viagem</option>
                                    <option value="Afastado">Afastado</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase block">Setores (separados por vírgula):</label>
                                <input name="sector" defaultValue={Array.isArray(editingUser.sector) ? editingUser.sector.join(', ') : editingUser.sector} className="w-full bg-white border-2 border-zinc-500 px-2 py-1 outline-none" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase block">CNH:</label>
                                <input name="cnh" defaultValue={editingUser.cnh} className="w-full bg-white border-2 border-zinc-500 px-2 py-1 outline-none" placeholder="Apenas motoristas" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase block">Email:</label>
                                <input name="email" type="email" defaultValue={editingUser.email} className="w-full bg-white border-2 border-zinc-500 px-2 py-1 outline-none" required />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase block">Nova Senha:</label>
                                <input name="password" type="text" defaultValue={editingUser.password} className="w-full bg-white border-2 border-zinc-500 px-2 py-1 outline-none" />
                            </div>
                        </div>

                        <div className="flex justify-center gap-6 pt-4">
                            <button type="submit" disabled={isSaving} className="px-6 py-1 bg-zinc-300 border-2 border-zinc-500 active:translate-y-0.5 shadow-[2px_2px_0px_rgba(0,0,0,0.8)] hover:bg-zinc-400 font-bold flex items-center gap-2">
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} [ SALVAR ]
                            </button>
                            <button type="button" onClick={() => setTuiMode(null)} className="px-6 py-1 bg-zinc-300 border-2 border-zinc-500 active:translate-y-0.5 shadow-[2px_2px_0px_rgba(0,0,0,0.8)] hover:bg-zinc-400 font-bold flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" /> [ CANCELAR ]
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )}

        {/* INTERACTIVE TUI OVERLAY (AUDIT LOGS) */}
        {tuiMode === 'logs' && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 backdrop-blur-[2px] z-[60]">
                <div className="w-full max-w-4xl bg-zinc-200 border-4 border-double border-zinc-400 shadow-[10px_10px_0px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden">
                    <div className="bg-[#0000AA] text-white px-4 py-1.5 font-bold flex justify-between items-center select-none shrink-0">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>VISUALIZADOR DE AUDITORIA // NEXUS-LOGDB</span>
                        </div>
                        <button onClick={() => setTuiMode(null)} className="hover:bg-red-600 px-2">X</button>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col p-4 text-black">
                        <div className="bg-white border-2 border-zinc-400 flex-1 flex flex-col overflow-hidden">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-2 bg-zinc-300 p-2 font-bold text-[10px] uppercase border-b-2 border-zinc-400 shrink-0">
                                <div className="col-span-2">HORÁRIO</div>
                                <div className="col-span-2">OPERADOR</div>
                                <div className="col-span-2">AÇÃO</div>
                                <div className="col-span-2">TABELA</div>
                                <div className="col-span-4">DETALHES DA ALTERAÇÃO</div>
                            </div>
                            
                            {/* Table Body */}
                            <ScrollArea className="flex-1">
                                <div className="divide-y divide-zinc-200">
                                    {auditLogs.length > 0 ? auditLogs.map((log) => (
                                        <div key={log.id} className="grid grid-cols-12 gap-2 p-2 text-[10px] hover:bg-zinc-100 transition-colors">
                                            <div className="col-span-2 text-zinc-500 font-mono">
                                                {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                                                <br/>
                                                {new Date(log.timestamp).toLocaleDateString('pt-BR')}
                                            </div>
                                            <div className="col-span-2 font-bold truncate" title={log.user_identity}>{log.user_identity || 'Sistema'}</div>
                                            <div className="col-span-2">
                                                <span className={cn(
                                                    "px-1.5 py-0.5 rounded text-white font-bold",
                                                    log.action === 'INSERT' && "bg-emerald-600",
                                                    log.action === 'UPDATE' && "bg-blue-600",
                                                    log.action === 'DELETE' && "bg-red-600",
                                                    log.action === 'SOFT_DELETE' && "bg-amber-600",
                                                )}>
                                                    {log.action}
                                                </span>
                                            </div>
                                            <div className="col-span-2 font-mono">{log.table_name}</div>
                                            <div className="col-span-4 break-words text-zinc-700 italic">
                                                {log.details}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-12 text-center text-zinc-400 italic uppercase tracking-widest">
                                            Nenhum registro encontrado no banco.
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-end shrink-0">
                            <div className="text-[9px] text-zinc-600 font-bold uppercase">
                                Total de registros: {auditLogs.length} | Database: SQLITE3
                            </div>
                            <button 
                                onClick={() => setTuiMode(null)} 
                                className="px-8 py-1.5 bg-zinc-300 border-2 border-zinc-500 active:translate-y-0.5 shadow-[3px_3px_0px_rgba(0,0,0,0.8)] hover:bg-zinc-400 font-bold text-xs"
                            >
                                [ FECHAR JANELA ]
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Terminal Input Bar */}
      {!tuiMode && (
        <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) { processCommand(input); setInput(''); } }} className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2">
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
                <span>Enter</span>
            </div>
        </form>
      )}
    </div>
  );
}
