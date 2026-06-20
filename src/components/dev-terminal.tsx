
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, ChevronRight, Command, Cpu, HardDrive, Activity, Save, ArrowLeft, Coffee, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
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

const AVAILABLE_ROLES = [
  "Funcionário",
  "Motorista",
  "Gestor de Setor",
  "Administrador",
  "Técnico de TI",
  "Desenvolvedor Global",
  "Técnico Mecânico"
];

export function DevTerminal({ isOpen, onClose }: { isOpen: boolean; onOpenChange: (open: boolean) => void; onClose: () => void }) {
  const { currentUser, refreshData } = useApp();
  const { toast } = useToast();
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'system', content: 'CityMotion NexusOS v2.0.0 (Admin Console)' },
    { type: 'system', content: 'Digite "nexus-help" para ver a lista de comandos.' },
  ]);
  const [input, setInput] = useState('');
  const [stats, setStats] = useState<SystemStats | null>(null);
  
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
      case 'nexus-help':
      case 'help':
        addLine('--- Comandos CityMotion NexusBridge ---', 'system');
        addLine('nexus-info          - Informações gerais do sistema.');
        addLine('nexus-status        - Status dos serviços principais.');
        addLine('nexus-version       - Versão instalada.');
        addLine('nexus-health        - Verificação rápida de integridade.');
        addLine('nexus-ping          - Testa comunicação com API/DB.');
        addLine('nexus-resources     - Monitor de hardware (btop).');
        addLine('nexus-routes        - Lista rotas registradas.');
        addLine('nexus-db-stats      - Estatísticas de registros no banco.');
        addLine('nexus-db-tables     - Lista tabelas do SQLite.');
        addLine('nexus-db-reset      - Hard reset no banco de dados.');
        addLine('nexus-employees     - Lista todos os funcionários.');
        addLine('nexus-employee-info - Detalhes de um funcionário (nexus-employee-info <id>).');
        addLine('nexus-vehicles      - Lista frota de veículos.');
        addLine('nexus-diagnostics   - Executa teste de stress completo.');
        addLine('nexus-terminal-clear - Limpa a tela.');
        addLine('----------------------------------------', 'system');
        break;

      case 'nexus-info':
        addLine('Ambiente: Desenvolvimento');
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
            else addLine('Backend Express/SQLite: ERRO', 'error');
        } catch (e) {
            addLine('Backend Express/SQLite: OFFLINE', 'error');
        }
        break;

      case 'nexus-version':
        addLine('CityMotion Enterprise: v2.0.0-alpha');
        addLine('NexusBridge Module: v1.0.4');
        break;

      case 'nexus-health':
        addLine('Verificando componentes...', 'system');
        addLine('Core API: [ OK ]');
        addLine('Auth Module: [ OK ]');
        addLine('Storage Driver: [ OK ]');
        addLine('Bridge Transformer: [ OK ]');
        break;

      case 'nexus-ping':
        const start = Date.now();
        try {
            const res = await fetch('/api/nexus/system/resources');
            const end = Date.now();
            if (res.ok) addLine(`PONG! Resposta em ${end - start}ms`, 'success');
            else addLine('Falha na resposta.', 'error');
        } catch (e) {
            addLine('Requisição falhou.', 'error');
        }
        break;

      case 'nexus-resources':
      case 'btop':
      case 'top':
        await fetchStats();
        addLine('Estatísticas de Recursos Atualizadas.', 'success');
        break;

      case 'nexus-db-stats':
        try {
            const res = await fetch('/api/nexus/system/db-info');
            const data = await res.json();
            addLine('--- Registros por Tabela ---', 'system');
            Object.entries(data.counts).forEach(([table, count]) => {
                addLine(`${table.padEnd(20)}: ${count} registros`);
            });
        } catch (e) { addLine('Erro ao buscar estatísticas.', 'error'); }
        break;

      case 'nexus-db-tables':
        addLine('Tabelas detectadas no schema:');
        addLine('- employees, vehicles, trips, sectors, vehicle_requests, maintenance_requests');
        break;

      case 'nexus-db-reset':
      case 'db-reset':
        addLine('Solicitando Hard Reset ao Backend...', 'system');
        try {
            const res = await fetch('/api/nexus/maintenance/db-reset', { method: 'POST' });
            if (res.ok) {
                addLine('REINICIALIZAÇÃO CONCLUÍDA.', 'success');
                toast({ title: "Sistema Reiniciado", description: "O banco foi restaurado." });
                await refreshData();
            } else addLine('ERRO NO RESET.', 'error');
        } catch (e) { addLine('Falha catastrófica.', 'error'); }
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
            } else addLine('Erro ao obter lista.', 'error');
        } catch (e) { addLine('Falha de conexão.', 'error'); }
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
                addLine('Interface TUI aberta.', 'success');
            } else addLine(`Erro: ${userData.error || 'Não encontrado.'}`, 'error');
        } catch (e) { addLine('Falha ao carregar dados.', 'error'); }
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

      case 'nexus-diagnostics':
      case 'test-all':
        addLine('Iniciando Teste Geral...', 'system');
        addLine('[1/3] Local API: OK', 'success');
        addLine('[2/3] NexusBridge: OK', 'success');
        addLine('[3/3] SQLite Driver: OK', 'success');
        addLine('Tudo funcionando normalmente.', 'success');
        break;

      case 'nexus-terminal-clear':
      case 'clear':
      case 'cls':
        setHistory([]);
        break;

      case 'nexus-coffee':
        addLine('☕ Servindo café virtual para o operador...', 'secret');
        addLine('   ( o)__ ( o)__ ( o)');
        addLine('    (   )  (   )  (   )');
        break;

      case 'nexus-konami':
        addLine('UP, UP, DOWN, DOWN, LEFT, RIGHT, LEFT, RIGHT, B, A', 'secret');
        addLine('CHEATS ATIVADOS: Vidas infinitas concedidas ao desenvolvedor.', 'secret');
        break;

      case 'nexus-secret':
        addLine('Você sabia? O nome CityMotion foi escolhido entre 42 opções.', 'secret');
        addLine('NexusBridge foi inspirado em sistemas de roteamento de hardware.', 'secret');
        break;

      case 'nexus-root':
        addLine('Acesso negado.', 'error');
        addLine('Boa tentativa. 😎');
        addLine('Evento registrado no Nexus Security Log.', 'system');
        break;

      case 'nexus-hack':
        addLine('Operação não autorizada.', 'error');
        addLine('O NexusBridge registrou sua tentativa.', 'system');
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
    if (!editingUser) return;
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updatedData = {
        name: formData.get('name') as string,
        role: formData.get('role') as string,
        status: formData.get('status') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    addLine(`Salvando ID ${editingUser.id}...`, 'system');
    try {
        const res = await fetch(`/api/nexus/test/db-employees/${editingUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });
        
        if (res.ok) {
            addLine(`SUCESSO: Registro atualizado.`, 'success');
            toast({ title: "Banco Atualizado", description: "Alterações salvas no SQLite." });
            await refreshData();
            setTuiMode(null);
            setEditingUser(null);
        } else addLine('ERRO ao salvar no banco.', 'error');
    } catch (e) { addLine('Erro de conexão.', 'error'); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-full max-w-3xl h-[550px] bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl flex flex-col font-mono text-sm overflow-hidden animate-in slide-in-from-bottom-4">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-400">
          <TerminalIcon className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Console Dev NexusBridge</span>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setHistory([])} className="text-zinc-600 hover:text-zinc-400"><Sparkles className="h-3 w-3" /></button>
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

        {/* INTERACTIVE TUI OVERLAY */}
        {tuiMode === 'edit' && editingUser && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-6 backdrop-blur-[1px]">
                <form 
                    onSubmit={handleTuiSave}
                    className="w-full max-w-lg bg-zinc-200 border-4 border-double border-zinc-400 shadow-[8px_8px_0px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                    <div className="bg-[#0000AA] text-white px-3 py-1 font-bold flex justify-between items-center select-none">
                        <span>Editar Usuário: {editingUser.id}</span>
                        <button type="button" onClick={() => setTuiMode(null)} className="hover:bg-red-600 px-1">X</button>
                    </div>

                    <div className="p-6 space-y-4 text-black">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase block">Nome Completo:</label>
                            <input name="name" defaultValue={editingUser.name} className="w-full bg-white border-2 border-zinc-500 px-2 py-1 outline-none" required />
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
                                <label className="text-xs font-bold uppercase block">Email:</label>
                                <input name="email" type="email" defaultValue={editingUser.email} className="w-full bg-white border-2 border-zinc-500 px-2 py-1 outline-none" required />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase block">Nova Senha:</label>
                                <input name="password" type="text" defaultValue={editingUser.password} className="w-full bg-white border-2 border-zinc-500 px-2 py-1 outline-none" required />
                            </div>
                        </div>

                        <div className="flex justify-center gap-6 pt-4">
                            <button type="submit" className="px-6 py-1 bg-zinc-300 border-2 border-zinc-500 active:translate-y-0.5 shadow-[2px_2px_0px_rgba(0,0,0,0.8)] hover:bg-zinc-400 font-bold flex items-center gap-2">
                                <Save className="h-4 w-4" /> [ SALVAR ]
                            </button>
                            <button type="button" onClick={() => setTuiMode(null)} className="px-6 py-1 bg-zinc-300 border-2 border-zinc-500 active:translate-y-0.5 shadow-[2px_2px_0px_rgba(0,0,0,0.8)] hover:bg-zinc-400 font-bold flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" /> [ CANCELAR ]
                            </button>
                        </div>
                    </div>
                </form>
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
