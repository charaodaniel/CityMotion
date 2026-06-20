
"use client";

import { useApp } from "@/contexts/app-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Database, Code2, Network, Lock, FileCode, GitBranch, Terminal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DevDocsPage() {
  const { userRole } = useApp();

  if (userRole !== 'dev') {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="max-w-md text-center border-destructive/50 bg-destructive/5">
          <CardHeader>
            <Lock className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Esta documentação contém segredos industriais e chaves de acesso restritas ao nível ROOT.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-8 space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter flex items-center gap-4">
          <Terminal className="h-10 w-10 text-primary" />
          Technical Documentation // NexusOS
        </h1>
        <p className="text-muted-foreground font-mono text-xs uppercase tracking-[0.2em]">
          Internal Reference Guide for Global Developers • Confidential
        </p>
      </div>

      <Tabs defaultValue="architecture" className="space-y-6">
        <TabsList className="bg-sidebar border border-border/50 p-1 w-full justify-start overflow-x-auto h-auto gap-1">
          <TabsTrigger value="architecture" className="text-[10px] font-bold uppercase tracking-widest gap-2">
            <GitBranch className="h-3 w-3" /> Arquitetura UML
          </TabsTrigger>
          <TabsTrigger value="database" className="text-[10px] font-bold uppercase tracking-widest gap-2">
            <Database className="h-3 w-3" /> Esquema SQL
          </TabsTrigger>
          <TabsTrigger value="nexus" className="text-[10px] font-bold uppercase tracking-widest gap-2">
            <Network className="h-3 w-3" /> NexusBridge
          </TabsTrigger>
          <TabsTrigger value="security" className="text-[10px] font-bold uppercase tracking-widest gap-2">
            <Lock className="h-3 w-3" /> Segurança
          </TabsTrigger>
        </TabsList>

        {/* 1. ARCHITECTURE / UML */}
        <TabsContent value="architecture">
          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-sidebar/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Code2 className="h-5 w-5 text-primary" />Entity-Relationship Diagram (ERD)</CardTitle>
                <CardDescription>Relacionamentos lógicos no banco de dados SQLite.</CardDescription>
              </CardHeader>
              <CardContent className="bg-black/40 rounded-lg p-6 font-mono text-xs text-primary/80 overflow-x-auto">
                <pre>{`
  [EMPLOYEES] 1---N [TRIPS]
  [VEHICLES]  1---N [TRIPS]
  [SECTORS]   1---N [EMPLOYEES]
  [SECTORS]   1---N [VEHICLES]
  [VEHICLES]  1---N [MAINTENANCE_REQUESTS]
  [EMPLOYEES] 1---N [VEHICLE_REQUESTS]
                `}</pre>
              </CardContent>
            </Card>

            <Card className="bg-sidebar/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><GitBranch className="h-5 w-5 text-primary" />Logic Flow: Mutation Persistence</CardTitle>
                <CardDescription>Caminho de uma atualização de dados (Request Flow).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-accent/10 border border-primary/20 rounded-lg">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li><strong className="text-foreground">UI (React/Client):</strong> Usuário clica em "Salvar".</li>
                    <li><strong className="text-foreground">AppProvider:</strong> Chama função asíncrona enviando dados para o Next API.</li>
                    <li><strong className="text-foreground">NexusBridge (Proxy):</strong> Intercepta, resolve o alvo (Backend Node) e limpa os headers.</li>
                    <li><strong className="text-foreground">Express Server:</strong> Executa a função `backupDb()` gerando o arquivo .bak.</li>
                    <li><strong className="text-foreground">SQLite Driver:</strong> Executa o comando SQL real no arquivo local.</li>
                    <li><strong className="text-foreground">Sincronização:</strong> Frontend recebe 200 OK e força o reload silencioso do estado global.</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2. DATABASE / SQL */}
        <TabsContent value="database">
          <Card className="bg-sidebar/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5 text-primary" />Database Schema (DDL)</CardTitle>
                <CardDescription>Definições de tabelas para o CityMotion SQLite.</CardDescription>
              </div>
              <ShieldCheck className="h-10 w-10 text-emerald-500 opacity-20" />
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] rounded-md border border-zinc-800 bg-zinc-950 p-6">
                <pre className="text-[11px] font-mono text-zinc-400 leading-relaxed">
{`--- TABELA DE FUNCIONÁRIOS (Lotação e Segurança)
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT '123456',
    role TEXT NOT NULL,
    sector TEXT, -- Armazenado como JSON String ["Setor A", "Setor B"]
    status TEXT DEFAULT 'Disponível',
    matricula TEXT UNIQUE,
    cnh TEXT,
    idPhoto TEXT,
    cnhPhoto TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

--- TABELA DE VEÍCULOS (Ativos de Frota)
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT UNIQUE NOT NULL,
    sector TEXT NOT NULL,
    mileage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Disponível',
    lastRefuelingDate DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

--- TABELA DE VIAGENS (Missões Logísticas)
CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    driver TEXT NOT NULL,
    vehicle TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departureTime TEXT NOT NULL,
    arrivalTime TEXT,
    startMileage INTEGER,
    endMileage INTEGER,
    status TEXT DEFAULT 'Agendada',
    category TEXT,
    passengers TEXT, -- Armazenado como JSON string
    startChecklist TEXT,
    endChecklist TEXT,
    startNotes TEXT,
    endNotes TEXT
);

--- TABELA DE MANUTENÇÃO
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId INTEGER,
    vehicleModel TEXT,
    licensePlate TEXT,
    requesterName TEXT,
    requestDate DATETIME,
    type TEXT,
    description TEXT,
    status TEXT DEFAULT 'Pendente'
);`}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. NEXUSBRIDGE */}
        <TabsContent value="nexus">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="bg-sidebar/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Network className="h-5 w-5 text-primary" />Engine: Virtual Routing</CardTitle>
                <CardDescription>Como os caminhos são resolvidos dinamicamente.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>O NexusBridge atua como uma camada de abstração. O frontend nunca sabe onde o banco de dados está fisicamente.</p>
                <div className="bg-black/40 p-4 rounded font-mono text-[10px] space-y-1">
                  <p className="text-primary">// Exemplo de mapeamento</p>
                  <p className="text-zinc-300">Front: <span className="text-emerald-400">/api/nexus/users</span></p>
                  <p className="text-zinc-300">Target: <span className="text-amber-400">http://localhost:3001/api/employees</span></p>
                </div>
                <p>Isso permite trocar o backend de Node/SQLite para Firebase ou AWS sem alterar uma única linha de código nos componentes UI.</p>
              </CardContent>
            </Card>

            <Card className="bg-sidebar/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileCode className="h-5 w-5 text-primary" />Adapters & Transformers</CardTitle>
                <CardDescription>Normalização de payloads entre sistemas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <ul className="list-disc list-inside space-y-2">
                  <li><strong className="text-foreground">HTTP Adapter:</strong> Gerencia o fetch, remove headers perigosos e trata timeouts.</li>
                  <li><strong className="text-foreground">Auth Transformer:</strong> Garante que o objeto de usuário retornado pelo login contenha os metadados de sessão necessários.</li>
                  <li><strong className="text-foreground">Identity Transformer:</strong> Pass-through simples para dados que já estão no padrão NexusOS.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 4. SECURITY */}
        <TabsContent value="security">
          <Card className="bg-sidebar/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-primary" />Data Resiliency & Permissions</CardTitle>
              <CardDescription>Políticas de redundância e controle de exclusão.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-950/50">
                <h4 className="font-bold text-sm mb-2 text-primary uppercase">Backup Automático</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Toda operação de escrita (POST/PUT/DELETE) aciona o trigger `backupDb()` no servidor Node. Uma cópia do arquivo de produção `citymotion.db` é rotacionada como `citymotion.db.bak`.
                </p>
              </div>
              <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-950/50">
                <h4 className="font-bold text-sm mb-2 text-amber-500 uppercase">Exclusão Lógica</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Para manter a integridade referencial, o sistema prioriza o Soft-Delete. O registro é marcado com o status `Desativado` e removido dos loops de UI, mas preservado no banco para auditoria.
                </p>
              </div>
              <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-950/50">
                <h4 className="font-bold text-sm mb-2 text-emerald-500 uppercase">Hierarquia ROOT</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Apenas usuários com a role `Desenvolvedor Global` podem ignorar os triggers de Soft-Delete e realizar um `Hard Delete` direto no banco de dados SQLite.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
