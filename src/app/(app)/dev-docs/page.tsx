
"use client";

import { useApp } from "@/contexts/app-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Database, Code2, Network, Lock, FileCode, GitBranch, Book, UserCircle, Car, Route, HelpCircle, Activity, AlertCircle, AlertTriangle, RefreshCw, ServerOff, Terminal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function DevDocsPage() {
  const { userRole } = useApp();

  // Acesso permitido para Dev, TI e Admin
  const hasPermission = ['dev', 'ti', 'admin'].includes(userRole);

  if (!hasPermission) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="max-w-md text-center border-destructive/50 bg-destructive/5">
          <CardHeader>
            <Lock className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Esta documentação contém informações privilegiadas de administração e infraestrutura.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-8 space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter flex items-center gap-4">
          <FileCode className="h-10 w-10 text-primary" />
          Central de Documentação // NexusOS
        </h1>
        <p className="text-muted-foreground font-mono text-xs uppercase tracking-[0.2em]">
          Manual Operacional & Referência Técnica • Nível Administrativo
        </p>
      </div>

      <Tabs defaultValue="manual" className="space-y-6">
        <TabsList className="bg-sidebar border border-border/50 p-1 w-full justify-start overflow-x-auto h-auto gap-1">
          <TabsTrigger value="manual" className="text-[10px] font-bold uppercase tracking-widest gap-2">
            <Book className="h-3 w-3" /> Manual do Usuário
          </TabsTrigger>
          <TabsTrigger value="architecture" className="text-[10px] font-bold uppercase tracking-widest gap-2">
            <GitBranch className="h-3 w-3" /> Arquitetura UML
          </TabsTrigger>
          <TabsTrigger value="database" className="text-[10px] font-bold uppercase tracking-widest gap-2">
            <Database className="h-3 w-3" /> Esquema SQL
          </TabsTrigger>
          <TabsTrigger value="nexus" className="text-[10px] font-bold uppercase tracking-widest gap-2">
            <Network className="h-3 w-3" /> NexusBridge
          </TabsTrigger>
          <TabsTrigger value="troubleshooting" className="text-[10px] font-bold uppercase tracking-widest gap-2 text-amber-500">
            <AlertTriangle className="h-3 w-3" /> Resolução de Problemas
          </TabsTrigger>
          <TabsTrigger value="security" className="text-[10px] font-bold uppercase tracking-widest gap-2">
            <Lock className="h-3 w-3" /> Segurança e LGPD
          </TabsTrigger>
        </TabsList>

        {/* 0. USER MANUAL */}
        <TabsContent value="manual">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 space-y-6">
                <Card className="bg-sidebar/50 border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-primary" />
                            Guia Rápido de Operação
                        </CardTitle>
                        <CardDescription>Como utilizar as principais funções do CityMotion.</CardDescription>
                    </CardHeader>
                    <CardContent className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                        <div className="space-y-6">
                            <section>
                                <h3 className="text-foreground flex items-center gap-2"><Car className="h-4 w-4" /> Gestão de Frota</h3>
                                <p>Todos os veículos devem ser cadastrados com placa, modelo e quilometragem inicial. O status "Em Manutenção" bloqueia o veículo para novas missões automaticamente.</p>
                            </section>
                            <Separator className="bg-border/30" />
                            <section>
                                <h3 className="text-foreground flex items-center gap-2"><UserCircle className="h-4 w-4" /> Controle de Funcionários</h3>
                                <p>O cadastro de colaboradores exige o aceite do termo de LGPD. Motoristas devem ter o número da CNH preenchido para validação jurídica nos relatórios de sinistro.</p>
                            </section>
                            <Separator className="bg-border/30" />
                            <section>
                                <h3 className="text-foreground flex items-center gap-2"><Route className="h-4 w-4" /> Ciclo de Missões</h3>
                                <p>Uma viagem passa pelos estados: <strong>Agendada</strong> → <strong>Em Andamento</strong> (Checklist de Saída) → <strong>Concluída</strong> (Checklist de Chegada). A quilometragem final da viagem atualiza automaticamente o odômetro do veículo no sistema.</p>
                            </section>
                        </div>
                    </CardContent>
                </Card>
             </div>
             
             <Card className="bg-sidebar/50 border-border/50 h-fit">
                <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest">Atalhos de Teclado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 font-mono text-[10px]">
                    <div className="flex justify-between p-2 bg-black/20 rounded"><span>Terminal Dev</span><span>CTRL + B</span></div>
                    <div className="flex justify-between p-2 bg-black/20 rounded"><span>Sincronizar Dados</span><span>F5</span></div>
                    <div className="flex justify-between p-2 bg-black/20 rounded"><span>Pesquisa Rápida</span><span>CTRL + K</span></div>
                </CardContent>
             </Card>
          </div>
        </TabsContent>

        {/* 1. ARCHITECTURE / UML */}
        <TabsContent value="architecture">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-sidebar/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Code2 className="h-5 w-5 text-primary" />Entidade-Relacionamento (ERD)</CardTitle>
                <CardDescription>Estrutura lógica do banco SQLite.</CardDescription>
              </CardHeader>
              <CardContent className="bg-black/40 rounded-lg p-6 font-mono text-[10px] text-primary/80 overflow-x-auto">
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
                <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" />Ciclo de Vida do Ativo (State)</CardTitle>
                <CardDescription>Estados possíveis de um veículo na frota.</CardDescription>
              </CardHeader>
              <CardContent className="bg-black/40 rounded-lg p-6 font-mono text-[10px] text-emerald-500/80 overflow-x-auto leading-relaxed">
                <pre>{`
  (*) --> [Disponível]
  [Disponível] -- Agendar Missão --> [Agendada]
  [Agendada] -- Iniciar Checklist --> [Em Viagem]
  [Em Viagem] -- Finalizar Missão --> [Disponível]
  [Disponível] -- Relatar Defeito --> [Manutenção]
  [Manutenção] -- Concluir Reparo --> [Disponível]
                `}</pre>
              </CardContent>
            </Card>

            <Card className="bg-sidebar/50 border-border/50 col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><GitBranch className="h-5 w-5 text-primary" />Fluxo de Atividade: Agendamento</CardTitle>
                <CardDescription>Caminho lógico desde o pedido até a execução.</CardDescription>
              </CardHeader>
              <CardContent className="bg-black/40 rounded-lg p-6 font-mono text-[10px] text-amber-500/80 overflow-x-auto leading-relaxed">
                <pre>{`
  1. [Colaborador] -> Solicita Transporte
  2. [Gestor] -> Analisa Prioridade {Alta, Média, Baixa}
  3. [Gestor] -> SE Aprovado? (Sim/Não)
  4.   IF Não -> [Notifica Rejeição] -> Termina
  5.   IF Sim -> [Cria Trip ID] -> [Aloca Motorista/Veículo]
  6. [Motorista] -> Notificado no App -> [Executa Missão]
  7. [Sistema] -> Atualiza KM do Veículo no SQLite
                `}</pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2. DATABASE / SQL */}
        <TabsContent value="database">
          <Card className="bg-sidebar/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5 text-primary" />Esquema do Banco (DDL)</CardTitle>
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
    startChecklist TEXT, -- JSON Array
    endChecklist TEXT -- JSON Array
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
                <CardTitle className="flex items-center gap-2"><Network className="h-5 w-5 text-primary" />Protocolos de Resposta</CardTitle>
                <CardDescription>Tratamento de tráfego e códigos HTTP.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-sm text-muted-foreground">
                <div className="space-y-3">
                  <div className="flex items-center gap-3"><Badge className="bg-emerald-500/20 text-emerald-500 font-mono">200 OK</Badge> <span>Operação concluída com sucesso.</span></div>
                  <div className="flex items-center gap-3"><Badge className="bg-amber-500/20 text-amber-500 font-mono">404 NOT FOUND</Badge> <span>Rota virtual ou recurso não localizado.</span></div>
                  <div className="flex items-center gap-3"><Badge className="bg-destructive/20 text-destructive font-mono">503 UNAVAILABLE</Badge> <span>Backend Node.js offline (Porta 3001).</span></div>
                  <div className="flex items-center gap-3"><Badge className="bg-destructive/40 text-destructive font-mono">500 ERROR</Badge> <span>Falha de escrita no arquivo .db.</span></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-sidebar/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" />Adapters & Sanitização</CardTitle>
                <CardDescription>Normalização de payloads.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <ul className="list-disc list-inside space-y-2">
                  <li><strong className="text-foreground">Header Cleaning:</strong> Remoção de `content-length` original para evitar erros de proxy.</li>
                  <li><strong className="text-foreground">Dynamic Routing:</strong> Suporte a parâmetros `:id` na URL para CRUD via Terminal.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 4. TROUBLESHOOTING */}
        <TabsContent value="troubleshooting">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-sidebar/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-amber-500 flex items-center gap-2">
                    <ServerOff className="h-5 w-5" />
                    Erro 503: Backend Indisponível
                </CardTitle>
                <CardDescription>A interface carrega mas os dados não aparecem.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-black/40 border border-amber-500/20 rounded-lg space-y-3">
                    <p className="text-xs font-bold text-foreground">SINTOMA:</p>
                    <p className="text-[11px] text-muted-foreground italic">"Falha ao conectar ao servidor em http://localhost:3001"</p>
                    <Separator className="bg-border/20" />
                    <p className="text-xs font-bold text-foreground">SOLUÇÃO:</p>
                    <ol className="text-[11px] text-muted-foreground list-decimal list-inside space-y-1">
                        <li>Verifique se o terminal do backend está rodando.</li>
                        <li>Execute <code className="bg-zinc-800 px-1 rounded text-primary">npm run dev</code> na pasta raiz.</li>
                        <li>Certifique-se de que a porta 3001 não está em uso por outro serviço.</li>
                    </ol>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-sidebar/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Erro 500: Erro de Escrita SQLite
                </CardTitle>
                <CardDescription>O sistema não salva alterações de motoristas ou veículos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-black/40 border border-destructive/20 rounded-lg space-y-3">
                    <p className="text-xs font-bold text-foreground">SINTOMA:</p>
                    <p className="text-[11px] text-muted-foreground italic">"SQLITE_BUSY: database is locked" ou "EACCES: permission denied"</p>
                    <Separator className="bg-border/20" />
                    <p className="text-xs font-bold text-foreground">SOLUÇÃO:</p>
                    <ol className="text-[11px] text-muted-foreground list-decimal list-inside space-y-1">
                        <li>Feche qualquer editor de banco externo (DBeaver, DB Browser) que esteja acessando o arquivo <code className="text-primary">citymotion.db</code>.</li>
                        <li>Verifique as permissões de escrita na pasta <code className="text-primary">backend/database/</code>.</li>
                        <li>Se o arquivo estiver corrompido, use o comando <code className="text-amber-500">nexus-db-reset</code> no terminal de dev.</li>
                    </ol>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-sidebar/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Interface Dessincronizada
                </CardTitle>
                <CardDescription>Você alterou algo no Terminal mas a página não mudou.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-black/40 border border-primary/20 rounded-lg space-y-3">
                    <p className="text-xs font-bold text-foreground">SINTOMA:</p>
                    <p className="text-[11px] text-muted-foreground italic">"O Terminal mostra Sucesso, mas a tabela continua com os dados antigos."</p>
                    <Separator className="bg-border/20" />
                    <p className="text-xs font-bold text-foreground">SOLUÇÃO:</p>
                    <ol className="text-[11px] text-muted-foreground list-decimal list-inside space-y-1">
                        <li>Clique no botão <strong className="text-primary">Sincronizar</strong> (ícone de recarregar) no topo do cabeçalho.</li>
                        <li>O Terminal executa alterações atômicas; o frontend precisa de um gatilho de re-fetch para atualizar o cache local.</li>
                        <li>Verifique se o seu perfil tem permissão para visualizar o setor alterado.</li>
                    </ol>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950 border-border/50 border-dashed relative overflow-hidden">
               <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />
               <CardHeader>
                  <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                     <Terminal className="h-4 w-4" />
                     Dica de Diagnóstico
                  </CardTitle>
               </CardHeader>
               <CardContent className="text-[10px] text-muted-foreground leading-relaxed font-mono">
                  Sempre mantenha a aba <strong className="text-primary">Traffic Logs</strong> aberta no Console NexusBridge durante testes de integração. Ela exibe a duração real em <span className="text-emerald-500">ms</span> e identifica se o gargalo é de rede ou de processamento do banco.
               </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 5. SECURITY */}
        <TabsContent value="security">
          <Card className="bg-sidebar/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-primary" />Redundância e Permissões</CardTitle>
              <CardDescription>Políticas de proteção de dados.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-950/50">
                <h4 className="font-bold text-sm mb-2 text-primary uppercase flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Auto-Backup
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Toda operação de escrita (POST/PUT/DELETE) aciona o trigger `backupDb()`. Uma cópia `citymotion.db.bak` é gerada instantaneamente.
                </p>
              </div>
              <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-950/50">
                <h4 className="font-bold text-sm mb-2 text-amber-500 uppercase flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Exclusão Lógica
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Registros deletados são apenas marcados como `Desativado`. O registro físico permanece para auditoria histórica.
                </p>
              </div>
              <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-950/50">
                <h4 className="font-bold text-sm mb-2 text-emerald-500 uppercase flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Privilégio ROOT
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Apenas usuários com a role exata `Desenvolvedor Global` podem ignorar o Soft-Delete e realizar um `Hard Delete`.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
