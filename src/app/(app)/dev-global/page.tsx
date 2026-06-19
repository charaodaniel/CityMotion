
"use client";

import { useApp } from "@/contexts/app-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Building2, Server, Key, Activity, Globe, Trash2, Edit2, Plus, ArrowUpRight, Lock, Database, DollarSign } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function DevGlobalPage() {
  const { userRole, organizations } = useApp();

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
            <Button variant="outline" size="sm" asChild>
                <Link href="/faturamento">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Ver Faturamento
                </Link>
            </Button>
            <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Nova Empresa
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              Empresas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Ativas no ecossistema</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              Receita Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">R$ 45,8k</div>
            <p className="text-xs text-muted-foreground mt-1">Receita recorrente atual</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              Usuários SaaS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.reduce((acc, curr) => acc + curr.activeUsers, 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total de contas registradas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              SLA Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">99.98%</div>
            <Progress value={99.98} className="h-1.5 mt-2" />
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
              <CardDescription>Gerencie o status e os limites de cada organização licenciada.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Métricas</TableHead>
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
                        <Badge variant={org.status === 'Ativa' ? 'default' : 'destructive'}>{org.status}</Badge>
                      </TableCell>
                      <TableCell>
                         <Badge variant="outline">{org.plan}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                            <p>🚗 {org.activeVehicles} veículos</p>
                            <p>👥 {org.activeUsers} usuários</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
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
                    <CardTitle className="flex items-center gap-2"><Server className="h-5 w-5" />Controles de Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <Label>Modo de Manutenção Global</Label>
                        <Switch />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <Label>Novos Cadastros Habilitados</Label>
                        <Switch defaultChecked />
                    </div>
                </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
