"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/app-provider';
import { cn } from '@/lib/utils';
import {
    Database, Server, Globe, Mail, Shield, HardDrive, Network,
    CheckCircle2, XCircle, Loader2, Save, RefreshCw, Zap,
    Eye, EyeOff, TestTube2, AlertTriangle, Settings2, Plug
} from 'lucide-react';

interface InfrastructureConfig {
    database: {
        type: string;
        url: string;
        urlRaw: string;
    };
    proxy: {
        enabled: boolean;
        allowedOrigins: string;
    };
    smtp: {
        host: string;
        port: string;
        user: string;
        pass: string;
        passRaw: string;
        secure: boolean;
    };
    server: {
        port: string;
        demoMode: boolean;
    };
    security: {
        jwtConfigured: boolean;
        corsOrigin: string;
    };
}

interface TestResult {
    success: boolean;
    message: string;
    details?: any;
}

export function InfrastructurePanel() {
    const { toast } = useToast();
    const { userRole } = useApp();
    const [config, setConfig] = useState<InfrastructureConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState<string | null>(null);
    const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
    const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

    // Database form state
    const [dbType, setDbType] = useState('sqlite');
    const [dbUrl, setDbUrl] = useState('');
    const [smtpHost, setSmtpHost] = useState('');
    const [smtpPort, setSmtpPort] = useState('587');
    const [smtpUser, setSmtpUser] = useState('');
    const [smtpPass, setSmtpPass] = useState('');
    const [smtpSecure, setSmtpSecure] = useState(false);
    const [corsOrigins, setCorsOrigins] = useState('http://localhost:9002');
    const [serverPort, setServerPort] = useState('3001');
    const [demoMode, setDemoMode] = useState(false);

    const getHeaders = useCallback(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('citymotion_token') : null;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    }, []);

    const fetchConfig = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/nexus/infrastructure/config', { headers: getHeaders() });
            if (res.ok) {
                const data = await res.json();
                setConfig(data);
                setDbType(data.database?.type || 'sqlite');
                setDbUrl(data.database?.urlRaw || '');
                setSmtpHost(data.smtp?.host || '');
                setSmtpPort(data.smtp?.port || '587');
                setSmtpUser(data.smtp?.user || '');
                setSmtpPass(data.smtp?.passRaw || '');
                setSmtpSecure(data.smtp?.secure || false);
                setCorsOrigins(data.proxy?.allowedOrigins || 'http://localhost:9002');
                setServerPort(data.server?.port || '3001');
                setDemoMode(data.server?.demoMode || false);
            }
        } catch (e) {
            console.error('Erro ao carregar config:', e);
        } finally {
            setLoading(false);
        }
    }, [getHeaders]);

    useEffect(() => { fetchConfig(); }, [fetchConfig]);

    const testConnection = async (section: string, payload: any) => {
        setTesting(section);
        setTestResults(prev => ({ ...prev, [section]: { success: false, message: 'Testando...' } }));
        try {
            let endpoint = '';
            if (section === 'database') endpoint = '/api/nexus/infrastructure/test-db';
            else if (section === 'smtp') endpoint = '/api/nexus/infrastructure/test-smtp';
            
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(payload),
            });
            const result = await res.json();
            setTestResults(prev => ({ ...prev, [section]: result }));
            toast({
                title: result.success ? '✅ Conexão OK' : '❌ Falha na Conexão',
                description: result.message,
                variant: result.success ? 'default' : 'destructive',
            });
        } catch (e: any) {
            setTestResults(prev => ({ ...prev, [section]: { success: false, message: e.message } }));
            toast({ title: '❌ Erro', description: e.message, variant: 'destructive' });
        } finally {
            setTesting(null);
        }
    };

    const saveConfig = async (section: string, data: any) => {
        setSaving(true);
        try {
            const res = await fetch('/api/nexus/infrastructure/save', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ section, config: data }),
            });
            const result = await res.json();
            toast({
                title: result.success ? '✅ Salvo' : '❌ Erro',
                description: result.message,
                variant: result.success ? 'default' : 'destructive',
            });
            if (result.success) fetchConfig();
        } catch (e: any) {
            toast({ title: '❌ Erro ao salvar', description: e.message, variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    const StatusBadge = ({ section }: { section: string }) => {
        const result = testResults[section];
        if (!result) return null;
        return (
            <Badge
                variant="outline"
                className={cn(
                    "text-[9px] font-black ml-2",
                    result.success
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                        : "bg-destructive/10 text-destructive border-destructive/30"
                )}
            >
                {result.success ? <CheckCircle2 className="h-2.5 w-2.5 mr-1" /> : <XCircle className="h-2.5 w-2.5 mr-1" />}
                {result.message}
            </Badge>
        );
    };

    const DB_TYPES = [
        { value: 'sqlite', label: 'SQLite3 (Local)', desc: 'Banco local, ideal para pendrives e servidores pequenos' },
        { value: 'postgresql', label: 'PostgreSQL', desc: 'Banco robusto para produção em nuvem' },
        { value: 'mongodb', label: 'MongoDB', desc: 'Banco NoSQL para dados flexíveis' },
        { value: 'supabase', label: 'Supabase', desc: 'PostgreSQL gerenciado com API automática' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground text-sm">Carregando configurações de infraestrutura...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                        <Server className="h-7 w-7 text-primary" />
                        Infraestrutura & Conectividade
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        Gerencie bancos de dados, proxy, DNS, credenciais e serviços externos.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {config?.security?.jwtConfigured ? (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[9px] font-black">
                            <Shield className="h-2.5 w-2.5 mr-1" /> JWT Configurado
                        </Badge>
                    ) : (
                        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-[9px] font-black">
                            <AlertTriangle className="h-2.5 w-2.5 mr-1" /> JWT Não Configurado
                        </Badge>
                    )}
                    <Badge className="bg-primary/10 text-primary border-primary/30 text-[9px] font-black">
                        <Plug className="h-2.5 w-2.5 mr-1" /> Backend: Porta {serverPort}
                    </Badge>
                </div>
            </div>

            <Tabs defaultValue="database" className="space-y-6">
                <TabsList className="bg-sidebar border border-border/50 p-1 w-full lg:w-fit justify-start h-auto gap-1">
                    <TabsTrigger value="database" className="text-[10px] font-bold uppercase tracking-widest px-4 gap-1.5">
                        <Database className="h-3 w-3" /> Banco de Dados
                    </TabsTrigger>
                    <TabsTrigger value="network" className="text-[10px] font-bold uppercase tracking-widest px-4 gap-1.5">
                        <Globe className="h-3 w-3" /> Proxy & CORS
                    </TabsTrigger>
                    <TabsTrigger value="smtp" className="text-[10px] font-bold uppercase tracking-widest px-4 gap-1.5">
                        <Mail className="h-3 w-3" /> SMTP
                    </TabsTrigger>
                    <TabsTrigger value="server" className="text-[10px] font-bold uppercase tracking-widest px-4 gap-1.5">
                        <Settings2 className="h-3 w-3" /> Servidor
                    </TabsTrigger>
                </TabsList>

                {/* ==================== DATABASE TAB ==================== */}
                <TabsContent value="database" className="space-y-6">
                    <Card className="bg-sidebar/50 border-border/50">
                        <CardHeader className="border-b border-border/30">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                <Database className="h-4 w-4 text-primary" /> Motor de Persistência
                                <StatusBadge section="database" />
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Configure o banco de dados principal. O sistema suporta SQLite local, PostgreSQL, MongoDB e Supabase.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Tipo de Banco</Label>
                                <Select value={dbType} onValueChange={setDbType}>
                                    <SelectTrigger className="bg-black/40 border-border/50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DB_TYPES.map(db => (
                                            <SelectItem key={db.value} value={db.value}>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-xs">{db.label}</span>
                                                    <span className="text-[10px] text-muted-foreground">{db.desc}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {dbType !== 'sqlite' && (
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">URL de Conexão</Label>
                                    <Input
                                        className="bg-black/40 font-mono text-xs border-border/50"
                                        placeholder={
                                            dbType === 'postgresql' ? 'postgresql://user:pass@host:5432/dbname' :
                                            dbType === 'mongodb' ? 'mongodb+srv://user:pass@cluster.mongodb.net/dbname' :
                                            'postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres'
                                        }
                                        value={dbUrl}
                                        onChange={(e) => setDbUrl(e.target.value)}
                                    />
                                    <p className="text-[10px] text-muted-foreground font-mono">
                                        {dbType === 'postgresql' && 'Formato: postgresql://usuario:senha@host:porta/nomedb'}
                                        {dbType === 'mongodb' && 'Formato: mongodb+srv://user:pass@cluster.mongodb.net/dbname'}
                                        {dbType === 'supabase' && 'Use a Connection String do painel Supabase → Settings → Database'}
                                    </p>
                                </div>
                            )}

                            {dbType === 'sqlite' && (
                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-md">
                                    <p className="text-[11px] font-mono text-primary/70 leading-relaxed">
                                        [INFO] SQLite não requer configuração de conexão. O banco é armazenado localmente em
                                        <code className="mx-1 bg-black/30 px-1.5 py-0.5 rounded">backend/database/citymotion.db</code>
                                        e é ideal para uso em pendrives e servidores isolados.
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => testConnection('database', { type: dbType, url: dbUrl })}
                                    disabled={testing === 'database'}
                                    className="text-[10px] font-bold uppercase tracking-widest"
                                >
                                    {testing === 'database' ? (
                                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                    ) : (
                                        <TestTube2 className="h-3 w-3 mr-2" />
                                    )}
                                    Testar Conexão
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => saveConfig('database', { type: dbType, url: dbUrl })}
                                    disabled={saving}
                                    className="text-[10px] font-bold uppercase tracking-widest"
                                >
                                    {saving ? <Loader2 className="h-3 w-3 mr-2 animate-spin" /> : <Save className="h-3 w-3 mr-2" />}
                                    Salvar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Database Status Card */}
                    <Card className="bg-zinc-950 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                <HardDrive className="h-4 w-4" /> Status Atual
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-3 bg-black/40 rounded border border-border/20">
                                    <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">Motor Ativo</p>
                                    <p className="text-sm font-bold mt-1 font-mono text-primary">
                                        {config?.database?.type === 'sqlite' ? 'SQLite3' : config?.database?.type?.toUpperCase() || 'N/A'}
                                    </p>
                                </div>
                                <div className="p-3 bg-black/40 rounded border border-border/20">
                                    <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">Modo</p>
                                    <p className="text-sm font-bold mt-1 font-mono text-emerald-500">Operacional</p>
                                </div>
                                <div className="p-3 bg-black/40 rounded border border-border/20">
                                    <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">Porta Backend</p>
                                    <p className="text-sm font-bold mt-1 font-mono">{serverPort}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ==================== PROXY & CORS TAB ==================== */}
                <TabsContent value="network" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-sidebar/50 border-border/50">
                            <CardHeader>
                                <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Globe className="h-4 w-4" /> CORS & Origens Permitidas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Origens Permitidas (separadas por vírgula)</Label>
                                    <Textarea
                                        className="bg-black/40 font-mono text-xs border-border/50 min-h-[80px]"
                                        placeholder="http://localhost:9002, https://citymotion.seudominio.com"
                                        value={corsOrigins}
                                        onChange={(e) => setCorsOrigins(e.target.value)}
                                    />
                                    <p className="text-[10px] text-muted-foreground">
                                        Domínios que podem fazer requisições ao backend. Em produção, defina apenas seu domínio.
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => saveConfig('proxy', { allowedOrigins: corsOrigins })}
                                    disabled={saving}
                                    className="text-[10px] font-bold uppercase tracking-widest"
                                >
                                    <Save className="h-3 w-3 mr-2" /> Salvar CORS
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-sidebar/50 border-border/50">
                            <CardHeader>
                                <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Network className="h-4 w-4" /> Rate Limiting
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded">
                                    <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" /> Proteção Ativa
                                    </p>
                                    <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                                        Global: 100 req/15min | Login: 10 tentativas/15min
                                    </p>
                                </div>
                                <div className="p-3 bg-black/40 rounded border border-border/20 space-y-2">
                                    <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">Endereços Protegidos</p>
                                    <p className="text-[10px] font-mono text-primary/70">POST /api/login — Rate limit dedicado</p>
                                    <p className="text-[10px] font-mono text-primary/70">* /api/* — Rate limit global</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* ==================== SMTP TAB ==================== */}
                <TabsContent value="smtp" className="space-y-6">
                    <Card className="bg-sidebar/50 border-border/50">
                        <CardHeader className="border-b border-border/30">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                <Mail className="h-4 w-4" /> Servidor de E-mail (SMTP)
                                <StatusBadge section="smtp" />
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Configuração para envio de e-mails transacionais (recuperação de senha, notificações).
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Host SMTP</Label>
                                    <Input
                                        className="bg-black/40 font-mono text-xs border-border/50"
                                        placeholder="smtp.gmail.com"
                                        value={smtpHost}
                                        onChange={(e) => setSmtpHost(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Porta</Label>
                                    <Input
                                        type="number"
                                        className="bg-black/40 font-mono text-xs border-border/50"
                                        placeholder="587"
                                        value={smtpPort}
                                        onChange={(e) => setSmtpPort(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Usuário</Label>
                                    <Input
                                        className="bg-black/40 font-mono text-xs border-border/50"
                                        placeholder="seu-email@gmail.com"
                                        value={smtpUser}
                                        onChange={(e) => setSmtpUser(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Senha / App Password</Label>
                                    <div className="relative">
                                        <Input
                                            type={showPasswords.smtp ? 'text' : 'password'}
                                            className="bg-black/40 font-mono text-xs border-border/50 pr-10"
                                            placeholder="••••••••"
                                            value={smtpPass}
                                            onChange={(e) => setSmtpPass(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(prev => ({ ...prev, smtp: !prev.smtp }))}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPasswords.smtp ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 border rounded bg-black/20">
                                <div>
                                    <Label className="text-xs font-bold">TLS/SSL Seguro</Label>
                                    <p className="text-[10px] text-muted-foreground">Usar conexão segura (porta 465)</p>
                                </div>
                                <Switch checked={smtpSecure} onCheckedChange={setSmtpSecure} />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => testConnection('smtp', { host: smtpHost, port: smtpPort, user: smtpUser, pass: smtpPass, secure: smtpSecure })}
                                    disabled={testing === 'smtp'}
                                    className="text-[10px] font-bold uppercase tracking-widest"
                                >
                                    {testing === 'smtp' ? <Loader2 className="h-3 w-3 mr-2 animate-spin" /> : <TestTube2 className="h-3 w-3 mr-2" />}
                                    Testar SMTP
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => saveConfig('smtp', { host: smtpHost, port: smtpPort, user: smtpUser, pass: smtpPass, secure: smtpSecure })}
                                    disabled={saving}
                                    className="text-[10px] font-bold uppercase tracking-widest"
                                >
                                    <Save className="h-3 w-3 mr-2" /> Salvar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ==================== SERVER TAB ==================== */}
                <TabsContent value="server" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-sidebar/50 border-border/50">
                            <CardHeader>
                                <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Server className="h-4 w-4" /> Configurações do Servidor
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Porta do Backend</Label>
                                    <Input
                                        type="number"
                                        className="bg-black/40 font-mono text-xs border-border/50"
                                        value={serverPort}
                                        onChange={(e) => setServerPort(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded bg-black/20">
                                    <div>
                                        <Label className="text-xs font-bold">Modo Demonstração</Label>
                                        <p className="text-[10px] text-muted-foreground">Reset diário automático dos dados</p>
                                    </div>
                                    <Switch checked={demoMode} onCheckedChange={setDemoMode} />
                                </div>
                                {demoMode && (
                                    <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded flex items-start gap-2">
                                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-amber-500">
                                            ATENÇÃO: O modo demo apaga todos os dados todos os dias à meia-noite. Não use em produção!
                                        </p>
                                    </div>
                                )}
                                <Button
                                    size="sm"
                                    onClick={() => saveConfig('server', { port: serverPort, demoMode })}
                                    disabled={saving}
                                    className="text-[10px] font-bold uppercase tracking-widest"
                                >
                                    <Save className="h-3 w-3 mr-2" /> Salvar
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-sidebar/50 border-border/50">
                            <CardHeader>
                                <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Shield className="h-4 w-4" /> Segurança
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between p-3 border rounded bg-black/20">
                                    <div>
                                        <Label className="text-xs font-bold">JWT Secret</Label>
                                        <p className="text-[10px] text-muted-foreground font-mono">
                                            {config?.security?.jwtConfigured ? '•••••••••••• configurado' : 'NÃO CONFIGURADO'}
                                        </p>
                                    </div>
                                    {config?.security?.jwtConfigured ? (
                                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[9px] font-black">
                                            <CheckCircle2 className="h-2.5 w-2.5 mr-1" /> OK
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-destructive/10 text-destructive border-destructive/30 text-[9px] font-black">
                                            <XCircle className="h-2.5 w-2.5 mr-1" /> FALTA
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded bg-black/20">
                                    <div>
                                        <Label className="text-xs font-bold">CORS Origin</Label>
                                        <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[200px]">
                                            {config?.security?.corsOrigin || 'Não configurado'}
                                        </p>
                                    </div>
                                    <Badge className="bg-primary/10 text-primary border-primary/30 text-[9px] font-black">
                                        <Globe className="h-2.5 w-2.5 mr-1" /> Ativo
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded bg-black/20">
                                    <div>
                                        <Label className="text-xs font-bold">Rate Limiting</Label>
                                        <p className="text-[10px] text-muted-foreground">Proteção contra brute force</p>
                                    </div>
                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[9px] font-black">
                                        <CheckCircle2 className="h-2.5 w-2.5 mr-1" /> Ativo
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
