"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Network, Server, Route as RouteIcon, Play, Code, CheckCircle2, AlertCircle, RefreshCw, X, Search, FileText, Activity, Clock } from 'lucide-react';
import nexusConfig from '@/nexusbridge/config/nexus-settings.json';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface BridgeLog {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  status: number;
  type: 'success' | 'error' | 'info';
  duration: number;
}

export default function NexusControlPage() {
  const [testPath, setTestTestPath] = useState('users');
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [logs, setLogs] = useState<BridgeLog[]>([]);

  // Inicializa com alguns logs simulados para preencher a tela
  useEffect(() => {
    const initialLogs: BridgeLog[] = [
      { id: '1', timestamp: new Date(Date.now() - 3600000).toISOString(), method: 'GET', path: '/users', status: 200, type: 'success', duration: 45 },
      { id: '2', timestamp: new Date(Date.now() - 1800000).toISOString(), method: 'GET', path: '/fleet', status: 200, type: 'success', duration: 32 },
      { id: '3', timestamp: new Date(Date.now() - 900000).toISOString(), method: 'POST', path: '/auth/login', status: 200, type: 'success', duration: 120 },
    ];
    setLogs(initialLogs);
  }, []);

  const addLog = (method: string, path: string, status: number, duration: number) => {
    const newLog: BridgeLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      method,
      path,
      status,
      type: status >= 400 ? 'error' : 'success',
      duration
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50)); // Mantém os últimos 50 logs
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
      
      setTestResult(data);
      addLog('GET', `/api/nexus/${cleanPath}`, response.status, duration);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      setTestResult({ error: "Falha na comunicação com o NexusBridge" });
      addLog('GET', `/api/nexus/${cleanPath}`, 500, duration);
    } finally {
      setIsTesting(false);
    }
  };

  const clearTest = () => {
    setTestTestPath('');
    setTestResult(null);
  }

  const clearLogs = () => {
    setLogs([]);
  }

  return (
    <div className="container mx-auto p-4 sm:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3">
            <Network className="h-8 w-8 text-primary" />
            NexusBridge Control
          </h1>
          <p className="text-muted-foreground">
            Gerenciamento de roteamento, adaptação de backends e transformação de dados.
          </p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 py-1 px-3">
          <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
          Engine: Operacional
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-[750px]">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="backends">Backends</TabsTrigger>
          <TabsTrigger value="routes">Rotas</TabsTrigger>
          <TabsTrigger value="logs">Logs de Tráfego</TabsTrigger>
          <TabsTrigger value="console">Console</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  Backends Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Object.keys(nexusConfig.backends).length}</div>
                <p className="text-xs text-muted-foreground mt-1 text-green-500 flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Todos sincronizados
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <RouteIcon className="h-4 w-4 text-muted-foreground" />
                  Rotas Mapeadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{nexusConfig.routes.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Endpoints virtuais ativos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  Taxa de Sucesso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">100%</div>
                <p className="text-xs text-muted-foreground mt-1">Últimas 24 horas</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Configuração em Tempo Real (JSON)</CardTitle>
              <CardDescription>Visualização do estado atual do arquivo nexus-settings.json</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-zinc-950 p-6 rounded-lg border border-zinc-800">
                <pre className="text-xs text-zinc-400 overflow-auto max-h-[300px] font-mono">
                  {JSON.stringify(nexusConfig, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backends">
          <Card>
            <CardHeader>
              <CardTitle>Serviços Conectados</CardTitle>
              <CardDescription>Fontes de dados externas gerenciadas pela ponte.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Base URL</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(nexusConfig.backends).map(([id, backend]: [string, any]) => (
                    <TableRow key={id}>
                      <TableCell className="font-mono font-bold">{id}</TableCell>
                      <TableCell className="text-muted-foreground">{backend.baseUrl}</TableCell>
                      <TableCell>{backend.description}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="bg-green-500/10 text-green-500">Online</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes">
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Roteamento</CardTitle>
              <CardDescription>Endpoints do frontend mapeados para alvos no backend.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Path (Virtual)</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Backend Alvo</TableHead>
                    <TableHead>Target Path</TableHead>
                    <TableHead>Transformer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nexusConfig.routes.map((route, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-primary">/api/nexus/{route.path}</TableCell>
                      <TableCell><Badge variant="outline">{route.method}</Badge></TableCell>
                      <TableCell>{route.backendId}</TableCell>
                      <TableCell className="font-mono text-xs">{route.target}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="flex items-center w-fit gap-1">
                          <Code className="h-3 w-3" />
                          {route.transformer}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  Logs de Execução
                </CardTitle>
                <CardDescription>Histórico de chamadas processadas pela Engine NexusBridge.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={clearLogs}>
                Limpar Logs
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-zinc-800">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[80px]">Método</TableHead>
                      <TableHead>Path Virtual</TableHead>
                      <TableHead className="w-[100px] text-right">Duração</TableHead>
                      <TableHead className="w-[180px] text-right">Horário</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.length > 0 ? logs.map((log) => (
                      <TableRow key={log.id} className="font-mono text-[11px]">
                        <TableCell>
                          <Badge variant={log.type === 'error' ? 'destructive' : 'default'} className={cn(
                            "w-full justify-center",
                            log.type === 'success' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
                          )}>
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold">{log.method}</span>
                        </TableCell>
                        <TableCell className="text-primary">{log.path}</TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {log.duration}ms
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground flex items-center justify-end gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center italic text-muted-foreground">
                          Nenhuma atividade registrada.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="console">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Execução de Teste</CardTitle>
                <CardDescription>Simule uma requisição através da ponte.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Path Virtual (Endpoint)</label>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center px-3 border rounded-md bg-muted text-muted-foreground text-sm font-mono overflow-hidden">
                      <span className="shrink-0 select-none">/api/nexus/</span>
                      <input 
                        className="bg-transparent border-none outline-none text-foreground ml-1 flex-1 min-w-0"
                        value={testPath}
                        onChange={(e) => setTestTestPath(e.target.value)}
                        placeholder="ex: users"
                        onKeyDown={(e) => e.key === 'Enter' && runTest()}
                      />
                      {testPath && (
                         <button onClick={clearTest} className="ml-2 hover:text-foreground">
                            <X className="h-4 w-4" />
                         </button>
                      )}
                    </div>
                    <Button onClick={runTest} disabled={isTesting || !testPath.trim()}>
                      {isTesting ? "Executando..." : "Testar"}
                      <Play className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">
                    Tente caminhos como: <code className="text-primary">users</code>, <code className="text-primary">fleet</code> ou <code className="text-primary">test/db-employees</code>
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                   <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 text-blue-400">
                     <AlertCircle className="h-4 w-4" />
                     Como funciona:
                   </h4>
                   <ul className="text-xs text-muted-foreground space-y-1 list-disc ml-4">
                     <li>O frontend chama o endpoint virtual selecionado acima.</li>
                     <li>A Engine NexusBridge resolve o backend e o target path no JSON.</li>
                     <li>O Adaptador HTTP executa a chamada real.</li>
                     <li>O Transformer processa o resultado e exibe no console ao lado.</li>
                   </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Resposta da Ponte</CardTitle>
                <CardDescription>Payload transformado e metadados da execução.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ScrollArea className="h-[400px] w-full rounded-md border bg-zinc-950 p-4">
                  {testResult ? (
                    <pre className="text-xs font-mono text-zinc-400">
                      {JSON.stringify(testResult, null, 2)}
                    </pre>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600 italic text-sm gap-2">
                      <Search className="h-8 w-8 opacity-20" />
                      Aguardando execução de teste...
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
