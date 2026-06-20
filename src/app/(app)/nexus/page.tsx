
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Network, Server, Route as RouteIcon, Play, Code, CheckCircle2, X, Search, FileText, Activity, Clock } from 'lucide-react';
import nexusConfig from '@/nexusbridge/config/nexus-settings.json';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface BridgeLog {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  status: number;
  type: 'success' | 'error' | 'warning';
  duration: number;
}

export default function NexusControlPage() {
  const [testPath, setTestTestPath] = useState('users');
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [logs, setLogs] = useState<BridgeLog[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('nexus_bridge_logs');
    if (saved) {
        try {
            setLogs(JSON.parse(saved));
        } catch (e) {
            localStorage.removeItem('nexus_bridge_logs');
        }
    }
  }, []);

  const addLog = (method: string, path: string, status: number, duration: number) => {
    const newLog: BridgeLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      method,
      path,
      status,
      type: status >= 500 ? 'error' : status >= 400 ? 'warning' : 'success',
      duration
    };
    
    setLogs(prev => {
        const updated = [newLog, ...prev].slice(0, 50);
        localStorage.setItem('nexus_bridge_logs', JSON.stringify(updated));
        return updated;
    });
  };

  const runTest = async () => {
    const cleanPath = testPath.trim().replace(/^\//, '');
    if (!cleanPath) return;

    setIsTesting(true);
    const startTime = Date.now();
    
    try {
      const response = await fetch(`/api/nexus/${cleanPath}`);
      const duration = Date.now() - startTime;
      const data = await response.json();
      
      setTestResult({
          status: response.status,
          duration: `${duration}ms`,
          payload: data
      });
      
      addLog('GET', `/api/nexus/${cleanPath}`, response.status, duration);
      
    } catch (error: any) {
      const duration = Date.now() - startTime;
      setTestResult({ status: 500, error: "Falha Crítica", message: error.message });
      addLog('GET', `/api/nexus/${cleanPath}`, 500, duration);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3">
            <Network className="h-8 w-8 text-primary" />
            NexusBridge Control
          </h1>
          <p className="text-muted-foreground">Monitoramento de tráfego e diagnóstico de backends.</p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 py-1.5 px-4">
          <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
          Engine: Operacional
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-sidebar border border-border/50 p-1 w-full lg:w-fit justify-start overflow-x-auto h-auto gap-1">
          <TabsTrigger value="overview" className="text-[10px] font-bold uppercase tracking-widest px-6 py-2">Visão Geral</TabsTrigger>
          <TabsTrigger value="routes" className="text-[10px] font-bold uppercase tracking-widest px-6 py-2">Dicionário de Rotas</TabsTrigger>
          <TabsTrigger value="logs" className="text-[10px] font-bold uppercase tracking-widest px-6 py-2">Traffic Logs</TabsTrigger>
          <TabsTrigger value="console" className="text-[10px] font-bold uppercase tracking-widest px-6 py-2">Test Console</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-sidebar/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Server className="h-3 w-3" /> Serviços Conectados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black tracking-tighter">{Object.keys(nexusConfig.backends).length}</div>
                <p className="text-[10px] font-mono text-green-500 flex items-center mt-1">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Sincronizados
                </p>
              </CardContent>
            </Card>
            <Card className="bg-sidebar/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <RouteIcon className="h-3 w-3" /> Endpoints Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black tracking-tighter">{nexusConfig.routes.length}</div>
                <p className="text-[10px] font-mono text-muted-foreground mt-1">Mapeamento virtual V1.2</p>
              </CardContent>
            </Card>
            <Card className="bg-sidebar/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Activity className="h-3 w-3" /> Taxa de Sucesso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black tracking-tighter text-primary">99.8%</div>
                <p className="text-[10px] font-mono text-muted-foreground mt-1">Últimas 1.000 requisições</p>
              </CardContent>
            </Card>
          </div>
          <Card className="bg-sidebar/50 border-border/50 overflow-hidden">
            <CardHeader className="border-b border-border/30 bg-accent/10">
              <CardTitle className="text-sm font-bold uppercase tracking-widest">Configuração de Roteamento (JSON)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px]">
                <div className="p-6 font-mono text-[11px] text-primary/70 leading-relaxed">
                  <pre>{JSON.stringify(nexusConfig, null, 2)}</pre>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes">
          <Card className="bg-sidebar/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest">Mapeamento de Rotas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-accent/20">
                  <TableRow className="border-border/30">
                    <TableHead className="text-[10px] uppercase font-black h-10">Path (Virtual)</TableHead>
                    <TableHead className="text-[10px] uppercase font-black h-10">Método</TableHead>
                    <TableHead className="text-[10px] uppercase font-black h-10">Target Path</TableHead>
                    <TableHead className="text-[10px] uppercase font-black h-10">Transformer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="font-mono text-xs">
                  {nexusConfig.routes.map((route, idx) => (
                    <TableRow key={idx} className="border-border/30">
                      <TableCell className="text-primary">/api/nexus/{route.path}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[9px] font-bold h-5">{route.method}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{route.target}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary border-primary/20">{route.transformer}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card className="bg-sidebar/50 border-border/50">
            <CardHeader className="border-b border-border/30">
              <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <FileText className="h-4 w-4" /> Traffic Analyzer
              </CardTitle>
              <CardDescription className="text-xs">Histórico em tempo real das chamadas processadas.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-accent/20">
                  <TableRow className="border-border/30">
                    <TableHead className="w-[100px] text-[10px] uppercase font-black text-center h-10">Status</TableHead>
                    <TableHead className="w-[80px] text-[10px] uppercase font-black h-10">Método</TableHead>
                    <TableHead className="text-[10px] uppercase font-black h-10">Path Virtual</TableHead>
                    <TableHead className="w-[100px] text-right text-[10px] uppercase font-black h-10">Duração</TableHead>
                    <TableHead className="w-[150px] text-right text-[10px] uppercase font-black h-10 pr-6">Horário</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="font-mono text-[11px]">
                  {logs.length > 0 ? logs.map((log) => (
                    <TableRow key={log.id} className="border-border/20 hover:bg-accent/10">
                      <TableCell className="text-center">
                        <Badge 
                          variant={log.type === 'error' ? 'destructive' : log.type === 'warning' ? 'secondary' : 'default'} 
                          className={cn(
                            "w-12 justify-center text-[9px] font-black",
                            log.type === 'success' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
                            log.type === 'warning' && "bg-amber-500/10 text-amber-500 border-amber-500/30"
                          )}
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-black">{log.method}</TableCell>
                      <TableCell className="text-primary/70">{log.path}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{log.duration}ms</TableCell>
                      <TableCell className="text-right text-muted-foreground pr-6 flex items-center justify-end gap-1.5 h-12">
                        <Clock className="h-3 w-3 opacity-50" />
                        {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={5} className="h-40 text-center italic text-muted-foreground uppercase text-[10px] tracking-widest opacity-40">Sem atividade.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="console">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-sidebar/50 border-border/50">
              <CardHeader className="border-b border-border/30">
                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Requisição Manual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Endpoint Virtual</label>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center px-4 border border-border/50 rounded-md bg-black/40 text-muted-foreground text-xs font-mono overflow-hidden">
                      <span className="shrink-0 select-none opacity-50">/api/nexus/</span>
                      <input 
                        className="bg-transparent border-none outline-none text-foreground ml-1 flex-1 min-w-0 h-10"
                        value={testPath}
                        onChange={(e) => setTestTestPath(e.target.value)}
                        placeholder="ex: users"
                        onKeyDown={(e) => e.key === 'Enter' && runTest()}
                      />
                      {testPath && <button onClick={() => setTestTestPath('')} className="ml-2 opacity-50 hover:opacity-100"><X className="h-4 w-4" /></button>}
                    </div>
                    <Button onClick={runTest} disabled={isTesting || !testPath.trim()} className="h-10 bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] px-6">
                      {isTesting ? "AGUARDE..." : "EXECUTAR"}
                      <Play className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950 border-border/50 flex flex-col tui-scanline">
              <CardHeader className="border-b border-border/30 flex flex-row items-center justify-between">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <Code className="h-4 w-4" /> Network Response
                </CardTitle>
                {testResult && (
                    <Badge variant="outline" className={cn(
                        "text-[9px] font-black",
                        testResult.status < 400 ? "text-emerald-500 border-emerald-500/30" : "text-destructive border-destructive/30"
                    )}>
                        {testResult.status} {testResult.status === 200 ? 'OK' : 'FAIL'} // {testResult.duration}
                    </Badge>
                )}
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-[400px] w-full">
                  <div className="p-6">
                    {testResult ? (
                        <div className="space-y-4">
                             <div className="p-3 bg-black/40 rounded border border-border/20 text-[10px] font-mono grid grid-cols-2 gap-4">
                                <div className="flex justify-between"><span>Status:</span> <span className="text-primary">{testResult.status}</span></div>
                                <div className="flex justify-between"><span>Tempo:</span> <span className="text-emerald-500">{testResult.duration}</span></div>
                            </div>
                            <pre className="text-[11px] font-mono text-primary/80 bg-black/40 p-4 rounded border border-border/20">
                                {JSON.stringify(testResult.payload || testResult, null, 2)}
                            </pre>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[300px] text-zinc-700 italic text-sm gap-4">
                            <Search className="h-10 w-10 opacity-20" />
                            <span className="uppercase text-[10px] font-bold tracking-[0.2em] opacity-30">Aguardando Execução...</span>
                        </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
