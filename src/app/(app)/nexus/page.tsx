
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Network, Server, Route as RouteIcon, Play, Code, CheckCircle2, AlertCircle, RefreshCw, X, Search } from 'lucide-react';
import nexusConfig from '@/nexusbridge/config/nexus-settings.json';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function NexusControlPage() {
  const [testPath, setTestTestPath] = useState('users');
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  const runTest = async () => {
    setIsTesting(true);
    try {
      // Remove leading slash if exists to avoid double slash
      const cleanPath = testPath.startsWith('/') ? testPath.substring(1) : testPath;
      const response = await fetch(`/api/nexus/${cleanPath}`);
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({ error: "Falha na comunicação com o NexusBridge" });
    } finally {
      setIsTesting(false);
    }
  };

  const clearTest = () => {
    setTestTestPath('');
    setTestResult(null);
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
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="backends">Backends</TabsTrigger>
          <TabsTrigger value="routes">Rotas</TabsTrigger>
          <TabsTrigger value="console">Console de Teste</TabsTrigger>
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
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                  Transformers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground mt-1">Normalização de payload ativa</p>
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
                    <Button onClick={runTest} disabled={isTesting || !testPath}>
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
