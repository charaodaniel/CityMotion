
"use client";

import { useApp } from "@/contexts/app-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Building2, Server, Key, Activity, Globe, Trash2, Edit2, Plus, ArrowUpRight, Lock, Database } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function DevGlobalPage() {
  const { userRole, organizations, isLoading } = useApp();

  if (userRole !== 'dev') {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="max-w-md text-center">
          <CardHeader>
            <Lock className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>Apenas desenvolvedores root podem acessar este painel de controle SaaS.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Ativa': return 'default';
      case 'Demonstração': return 'secondary';
      case 'Suspensa': return 'destructive';
      default: return 'outline';
    }
  };

  const getPlanVariant = (plan: string) => {
    switch (plan) {
      case 'Enterprise': return 'default';
      case 'Pro': return 'secondary';
      default: return 'outline';
    }
  }

  return (
    <div className="container mx-auto p-4 sm:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Gestão Global SaaS
          </h1>
          <p className="text-muted-foreground">Controle de clientes, planos e infraestrutura do ecossistema CityMotion.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm">
                <Database className="mr-2 h-4 w-4" />
                Backup Global
            </Button>
            <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Nova Empresa
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              Empresas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.filter(o => o.status === 'Ativa').length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total de instâncias operacionais</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              Usuários Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.reduce((acc, curr) => acc + curr.activeUsers, 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Colaboradores em todo o SaaS</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              Taxa de Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">99.98%</div>
            <Progress value={99.98} className="h-1.5 mt-2 bg-zinc-800" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="organizations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="organizations">Empresas Clientes</TabsTrigger>
          <TabsTrigger value="infra">Infraestrutura</TabsTrigger>
        </TabsList>

        <TabsContent value="organizations">
          <Card>
            <CardHeader>
              <CardTitle>Base de Clientes</CardTitle>
              <CardDescription>Gerencie o status e os limites de cada organização cadastrada.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Métricas</TableHead>
                    <TableHead>Desde</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizations.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell>
                        <div className="flex flex-col">
                            <span className="font-bold">{org.name}</span>
                            <span className="text-xs text-muted-foreground font-mono">{org.slug}.citymotion.app</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(org.status)}>{org.status}</Badge>
                      </TableCell>
                      <TableCell>
                         <Badge variant={getPlanVariant(org.plan)}>{org.plan}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                            <p>🚗 {org.activeVehicles} veículos</p>
                            <p>👥 {org.activeUsers} usuários</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(org.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit2 className="h-4 w-4" />
                            </Button>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                             <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Acessar painel da empresa">
                                <Link href="/dashboard">
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infra">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Server className="h-5 w-5" />
                        Controles de Sistema
                    </CardTitle>
                    <CardDescription>Configurações globais que afetam todas as instâncias.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label className="text-base">Modo de Manutenção</Label>
                            <p className="text-sm text-muted-foreground">Bloqueia o acesso de todos os usuários (exceto Devs).</p>
                        </div>
                        <Switch />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label className="text-base">Novos Cadastros</Label>
                            <p className="text-sm text-muted-foreground">Permite que novas empresas se auto-cadastrem.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label className="text-base">Logs de Auditoria</Label>
                            <p className="text-sm text-muted-foreground">Gravação detalhada de todas as mutações no banco.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Chaves e Integrações
                    </CardTitle>
                    <CardDescription>Gestão de segredos e conectores externos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-3 bg-muted rounded-md space-y-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Google Maps API</p>
                        <div className="flex items-center gap-2">
                            <code className="text-xs bg-black p-1 rounded flex-1">AIzaSyB_XXXXXX....XXXXXX</code>
                            <Button size="icon" variant="ghost" className="h-6 w-6"><Edit2 className="h-3 w-3" /></Button>
                        </div>
                    </div>
                    <div className="p-3 bg-muted rounded-md space-y-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Twilio (SMS Notificações)</p>
                        <div className="flex items-center gap-2">
                            <code className="text-xs bg-black p-1 rounded flex-1">ACXXXXXX....XXXXXX</code>
                            <Button size="icon" variant="ghost" className="h-6 w-6"><Edit2 className="h-3 w-3" /></Button>
                        </div>
                    </div>
                     <div className="p-3 bg-muted rounded-md space-y-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">NexusBridge Master Key</p>
                        <div className="flex items-center gap-2">
                            <code className="text-xs bg-black p-1 rounded flex-1">NB-ROOT-XXXXXX-XXXXXX</code>
                            <Button size="icon" variant="ghost" className="h-6 w-6"><Edit2 className="h-3 w-3" /></Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
