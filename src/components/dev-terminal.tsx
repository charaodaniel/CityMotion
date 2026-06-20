
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, ChevronRight, Command, Cpu, HardDrive, Activity, Save, ArrowLeft, Loader2, FileText, Minus, Square } from 'lucide-react';
import { useApp } from '@/contexts/app-provider';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Progress } from './ui/progress';
import type { Employee } from '@/lib/types';
import nexusConfig from '@/nexusbridge/config/nexus-settings.json';

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
    { type: 'system', content: 'CityMotion NexusOS v2.4.0 (Enhanced Admin Console)' },
    { type: 'system', content: 'Digite "nexus-help" para ver a lista de comandos categorizada.' },
  ]);
  const [input, setInput] = useState('');
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  
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
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
      fetchStats();
      const interval = setInterval(fetchStats, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !tuiMode && !isMinimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [history, isOpen, tuiMode, isMinimized]);

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
        addLine('--- COMANDOS DISPONÍVEIS (NEXUS OS) ---', 'system');
        addLine('[ INFO & STATUS ]', 'success');
        addLine('nexus-info           - Detalhes do sistema e operador.');
        addLine('nexus-uptime         - Relatório de tempo de atividade.');
        addLine('nexus-health         - Health Check completo dos subsistemas.');
        addLine('nexus-status         - Status rápido dos serviços principais.');
        addLine('nexus-version        - Versão dos módulos da plataforma.');
        addLine('[ DATABASE & AUDIT ]', 'success');
        addLine('nexus-db-stats       - Contagem de registros no SQLite.');
        addLine('nexus-db-integrity   - Executa check de integridade no banco.');
        addLine('nexus-backup-info    - Status do último arquivo .bak.');
        addLine('nexus-logdb          - Visualizador de Auditoria (Janela TUI).');
        addLine('nexus-db-reset       - Restaura o banco ao estado original.');
        addLine('[ GESTÃO DE RECURSOS ]', 'success');
        addLine('nexus-employees      - Lista funcionários registrados.');
        addLine('nexus-employee-info  - Edição interativa (TUI) por ID.');
        addLine('nexus-vehicles       - Lista frota de veículos.');
        addLine('[ NETWORK & ENGINE ]', 'success');
        addLine('nexus-routes         - Lista rotas virtuais da NexusBridge.');
        addLine('nexus-net-diag       - Diagnóstico de rede para o backend.');
        addLine('nexus-config-view    - Visualiza JSON de configuração.');
        addLine('nexus-ping           - Teste ICMP simulado contra a API.');
        addLine('[ TERMINAL ]', 'success');
        addLine('nexus-terminal-clear - Limpa a tela (alias: clear, cls).');
        addLine('exit                 - Fecha o console de administração.');
        addLine('----------------------------------------', 'system');
        break;

      case 'nexus-info':
        addLine('Operador: ' + (currentUser?.name || 'Sistema/Root'));
        addLine('Ambiente: Local Development');
        addLine('Engine: NexusBridge 1.2.4 (Active)');
        addLine('Platform: ' + (stats?.platform || 'Unknown'));
        addLine('NodeJS: ' + (stats?.nodeVersion || 'Unknown'));
        break;

      case 'nexus-uptime':
        if (stats) addLine(`Sistema online por: ${formatUptime(stats.uptime)}`, 'success');
        else addLine('Estatísticas indisponíveis.', 'error');
        break;

      case 'nexus-health':
        addLine('Executando Health Check Global...', 'system');
        addLine('-> NexusBridge Engine: [ ONLINE ]', 'success');
        try {
            const res = await fetch('/api/nexus/system/db-info');
            if (res.ok) addLine('-> SQLite Connection: [ ESTABLISHED ]', 'success');
        } catch (e) { addLine('-> SQLite Connection: [ FAILED ]', 'error'); }
        addLine(`-> Resource Monitor: [ ${stats ? 'COLLECTING' : 'IDLE'} ]`);
        break;

      case 'nexus-db-integrity':
        addLine('Iniciando verificação de integridade...', 'system');
        try {
            const res = await fetch('/api/nexus/system/db-integrity');
            const data = await res.json();
            if (data.status === 'Success') addLine(`INTEGRIDADE DO BANCO: ${data.result.toUpperCase()}`, 'success');
            else addLine(`AVISO: ${data.result}`, 'error');
        } catch (e) { addLine('Falha ao executar PRAGMA check.', 'error'); }
        break;

      case 'nexus-backup-info':
        try {
            const res = await fetch('/api/nexus/system/backup-status');
            const data = await res.json();
            if (data.exists) {
                addLine('--- BACKUP STATUS ---', 'system');
                addLine(`Arquivo: citymotion.db.bak`);
                addLine(`Tamanho: ${data.size}`);
                addLine(`Sincronizado: ${new Date(data.lastModified).toLocaleString('pt-BR')}`);
                addLine('Estado: PRONTO PARA RESTAURAÇÃO', 'success');
            } else {
                addLine('Nenhum backup localizado no servidor.', 'error');
            }
        } catch (e) { addLine('Erro ao consultar sistema de arquivos.', 'error'); }
        break;

      case 'nexus-routes':
        addLine('--- MAPA DE ROTAS VIRTUAIS (NEXUSBRIDGE) ---', 'system');
        nexusConfig.routes.forEach(r => {
            addLine(`${r.method.padEnd(6)} | /api/nexus/${r.path.padEnd(20)} -> ${r.target}`);
        });
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
            } else addLine('Erro ao obter logs.', 'error');
        } catch (e) { addLine('Falha crítica de conexão.', 'error'); }
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
        } catch (e) { addLine('Falha de conexão.', 'error'); }
        break;

      case 'nexus-employee-info':
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
        } catch (e) { addLine('Falha ao carregar dados.', 'error'); }
        break;

      case 'nexus-terminal-clear':
      case 'clear':
      case 'cls':
        setHistory([]);
        break;

      case 'exit':
        onClose();
        break;

      default:
        if (cmd.trim() !== '') addLine(`Comando não reconhecido. Digite "nexus-help".`, 'error');
    }
  };

  const handleTuiSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || isSaving) return;
    
    setIsSaving(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
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
    <div 
        className={cn(
            "fixed bottom-6 right-6 z-[100] transition-all duration-300 ease-in-out border-4 border-double shadow-2xl flex flex-col font-mono text-sm overflow-hidden",
            isMinimized 
                ? "w-72 h-12 bg-zinc-900 border-zinc-700" 
                : "w-full max-w-4xl h-[600px] bg-zinc-950 border-zinc-800",
            !isMinimized && "animate-in slide-in-from-bottom-4"
        )}
    >
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0000AA] text-white shrink-0 select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-3 w-3" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {isMinimized ? "NexusOS Terminal (Min)" : "Console de Administração NexusBridge"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
            {isLoadingLogs && <Loader2 className="h-3 w-3 animate-spin" />}
            <button onClick={() => setIsMinimized(!isMinimized)} className="w-5 h-5 flex items-center justify-center hover:bg-white/20 border border-transparent hover:border-white/40">
                {isMinimized ? <Square className="h-2.5 w-2.5" /> : <Minus className="h-3 w-3" />}
            </button>
            <button onClick={onClose} className="w-5 h-5 flex items-center justify-center hover:bg-red-600 border border-transparent hover:border-red-400">
                <X className="h-3 w-3" />
            </button>
        </div>
      </div>

      {!isMinimized && (
        <>
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

            <div className="relative flex-1 overflow-hidden flex flex-col">
                <ScrollArea className="flex-1 p-4 bg-black/40">
                    <div className="space-y-1">
                    {history.map((line, i) => (
                        <div 
                        key={i} 
                        className={cn(
                            "whitespace-pre-wrap break-all text-[12px] leading-relaxed",
                            line.type === 'input' && "text-primary font-bold",
                            line.type === 'error' && "text-destructive",
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

                {tuiMode === 'edit' && editingUser && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-6 backdrop-blur-[1px] z-[60]">
                        <form onSubmit={handleTuiSave} className="w-full max-w-lg bg-zinc-200 border-4 border-double border-zinc-400 shadow-[8px_8px_0px_rgba(0,0,0,0.5)]">
                            <div className="bg-[#0000AA] text-white px-3 py-1 font-bold flex justify-between items-center select-none">
                                <span className="text-[10px] uppercase tracking-widest">Editar Usuário: {editingUser.id}</span>
                                <button type="button" onClick={() => setTuiMode(null)} className="hover:bg-red-600 px-1">X</button>
                            </div>
                            <div className="p-6 space-y-4 text-black">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase block">Nome Completo:</label>
                                        <input name="name" defaultValue={editingUser.name} className="w-full bg-white border-2 border-zinc-500 px-2 py-1 outline-none text-xs" required />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase block">Matrícula:</label>
                                        <input name="matricula" defaultValue={editingUser.matricula || ''} className="w-full bg-white border-2 border-zinc-500 px-2 py-1 outline-none text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase block">Cargo:</label>
                                        <select name="role" defaultValue={editingUser.role} className="w-full bg-white border-2 border-zinc-500 px-2 py-1 outline-none text-xs">
                                        {AVAILABLE_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase block">Status:</label>
                                        <select name="status" defaultValue={editingUser.status} className="w-full bg-white border-2 border-zinc-500 px-2 py-1 outline-none text-xs">
                                            <option value="Disponível">Disponível</option>
                                            <option value="Em Serviço">Em Serviço</option>
                                            <option value="Em Viagem">Em Viagem</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-center gap-6 pt-4">
                                    <button type="submit" disabled={isSaving} className="px-6 py-1.5 bg-zinc-300 border-2 border-zinc-500 active:translate-y-0.5 shadow-[2px_2px_0px_rgba(0,0,0,0.8)] hover:bg-zinc-400 font-bold flex items-center gap-2 text-[10px] uppercase">
                                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-3.5 w-3.5" />} [ SALVAR ]
                                    </button>
                                    <button type="button" onClick={() => setTuiMode(null)} className="px-6 py-1.5 bg-zinc-300 border-2 border-zinc-500 active:translate-y-0.5 shadow-[2px_2px_0px_rgba(0,0,0,0.8)] hover:bg-zinc-400 font-bold flex items-center gap-2 text-[10px] uppercase">
                                        <ArrowLeft className="h-3.5 w-3.5" /> [ VOLTAR ]
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {tuiMode === 'logs' && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]">
                        <div className="w-full max-w-4xl bg-zinc-200 border-4 border-double border-zinc-400 shadow-[10px_10px_0px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden">
                            <div className="bg-[#0000AA] text-white px-4 py-1.5 font-bold flex justify-between items-center select-none shrink-0">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span className="text-[10px] uppercase tracking-widest">VISUALIZADOR DE AUDITORIA // NEXUS-LOGDB</span>
                                </div>
                                <button onClick={() => setTuiMode(null)} className="hover:bg-red-600 px-2">X</button>
                            </div>
                            <div className="flex-1 overflow-hidden flex flex-col p-4 text-black">
                                <div className="bg-white border-2 border-zinc-400 flex-1 flex flex-col overflow-hidden">
                                    <div className="grid grid-cols-12 gap-2 bg-zinc-300 p-2 font-bold text-[9px] uppercase border-b-2 border-zinc-400 shrink-0">
                                        <div className="col-span-2">HORÁRIO</div>
                                        <div className="col-span-2">OPERADOR</div>
                                        <div className="col-span-2">AÇÃO</div>
                                        <div className="col-span-2">TABELA</div>
                                        <div className="col-span-4">DETALHES</div>
                                    </div>
                                    <ScrollArea className="flex-1">
                                        <div className="divide-y divide-zinc-200">
                                            {auditLogs.map((log) => (
                                                <div key={log.id} className="grid grid-cols-12 gap-2 p-2 text-[10px] hover:bg-zinc-100 transition-colors">
                                                    <div className="col-span-2 text-zinc-500 font-mono leading-tight">
                                                        {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                                                        <br/>
                                                        {new Date(log.timestamp).toLocaleDateString('pt-BR')}
                                                    </div>
                                                    <div className="col-span-2 font-bold truncate">{log.user_identity || 'Sistema'}</div>
                                                    <div className="col-span-2">
                                                        <span className={cn(
                                                            "px-1.5 py-0.5 rounded text-[8px] text-white font-bold",
                                                            log.action === 'INSERT' && "bg-emerald-600",
                                                            log.action === 'UPDATE' && "bg-blue-600",
                                                            log.action === 'DELETE' && "bg-red-600",
                                                            log.action === 'SOFT_DELETE' && "bg-amber-600",
                                                        )}>
                                                            {log.action}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-2 font-mono text-[9px]">{log.table_name}</div>
                                                    <div className="col-span-4 break-words text-zinc-700 italic leading-tight text-[9px]">
                                                        {log.details}
                                                    </div>
                                                </div>
                                            ))}
                                            {auditLogs.length === 0 && (
                                                <div className="p-12 text-center text-zinc-400 italic text-xs">Nenhum registro encontrado no banco.</div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </div>
                                <div className="mt-4 flex justify-between items-end shrink-0">
                                    <div className="text-[8px] text-zinc-600 font-bold uppercase">Total: {auditLogs.length} | Database: SQLITE3</div>
                                    <button onClick={() => setTuiMode(null)} className="px-8 py-1.5 bg-zinc-300 border-2 border-zinc-500 active:translate-y-0.5 shadow-[3px_3px_0px_rgba(0,0,0,0.8)] hover:bg-zinc-400 font-bold text-[10px] uppercase">
                                        [ FECHAR JANELA ]
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {!tuiMode && (
                <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) { processCommand(input); setInput(''); } }} className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-primary shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Digite um comando..."
                        className="bg-transparent border-none outline-none text-zinc-100 flex-1 placeholder:text-zinc-700 text-sm font-mono"
                    />
                    <div className="text-[9px] text-zinc-500 flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                        <Command className="h-2 w-2" /> 
                        <span>Enter</span>
                    </div>
                </form>
            )}
        </>
      )}

      {isMinimized && (
          <div className="flex-1 flex items-center justify-between px-4 bg-zinc-900 cursor-pointer" onClick={() => setIsMinimized(false)}>
               <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-1.5">
                        <Cpu className="h-2.5 w-2.5 text-primary" />
                        <span className="text-[10px] font-bold text-zinc-400">{stats?.cpu.load || '0'}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <HardDrive className="h-2.5 w-2.5 text-emerald-500" />
                        <span className="text-[10px] font-bold text-zinc-400">{stats?.memory.percentage || '0'}%</span>
                    </div>
               </div>
               <div className="text-[9px] font-mono text-zinc-600 animate-pulse uppercase font-bold tracking-tighter">
                   Terminal Ativo // Escutando...
               </div>
          </div>
      )}
    </div>
  );
}
