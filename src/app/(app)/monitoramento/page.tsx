
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Server, Database, Network, HardDrive, MemoryStick, Cpu } from 'lucide-react';

const systemStatus = [
    { name: 'Servidor Principal', status: 'Operacional', icon: Server },
    { name: 'Banco de Dados', status: 'Operacional', icon: Database },
    { name: 'API de Viagens', status: 'Operacional', icon: Network },
];

const recentLogs = [
    { id: 1, type: 'Security', user: 'system', action: 'Failed login attempt for user: "guest"', timestamp: 'Há 2 minutos' },
    { id: 2, type: 'Trips', user: 'Maria Oliveira', action: 'Iniciou a viagem SCH002', timestamp: 'Há 5 minutos' },
    { id: 3, type: 'Admin', user: 'Júlio César', action: 'Atualizou o perfil de "Ricardo Nunes" para "Gestor de Setor"', timestamp: 'Há 15 minutos' },
    { id: 4, type: 'System', user: 'system', action: 'Backup do banco de dados concluído com sucesso', timestamp: 'Há 1 hora' },
    { id: 5, type: 'Users', user: 'Ana Souza', action: 'Realizou login no sistema', timestamp: 'Há 2 horas' },
];


export default function MonitoringPage() {

    return (
        <div className="container mx-auto p-4 sm:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3">
                    <Activity />
                    Monitoramento do Sistema
                </h1>
                <p className="text-muted-foreground mt-2">
                    Acompanhe o status, uso de recursos e logs de atividade do sistema em tempo real.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status dos Serviços</CardTitle>
                            <CardDescription>Saúde dos componentes principais do sistema.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {systemStatus.map((service) => {
                                const Icon = service.icon;
                                return (
                                    <div key={service.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Icon className="h-5 w-5 text-muted-foreground" />
                                            <span className="text-sm font-medium">{service.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                            <span className="text-sm text-green-500">{service.status}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Uso de Recursos</CardTitle>
                            <CardDescription>Monitoramento do servidor em tempo real.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm flex items-center gap-2"><Cpu className="h-4 w-4"/> CPU</Label>
                                    <span className="text-sm font-bold">42%</span>
                                </div>
                                <Progress value={42} />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm flex items-center gap-2"><MemoryStick className="h-4 w-4"/> Memória</Label>
                                    <span className="text-sm font-bold">68%</span>
                                </div>
                                <Progress value={68} />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm flex items-center gap-2"><HardDrive className="h-4 w-4"/> Disco</Label>
                                    <span className="text-sm font-bold">75%</span>
                                </div>
                                <Progress value={75} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Log de Atividades Recentes</CardTitle>
                            <CardDescription>Últimas ações realizadas no sistema.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Usuário</TableHead>
                                        <TableHead>Ação</TableHead>
                                        <TableHead className="text-right">Horário</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                <div className="font-medium">{log.user}</div>
                                                <div className="text-xs text-muted-foreground">{log.type}</div>
                                            </TableCell>
                                            <TableCell>{log.action}</TableCell>
                                            <TableCell className="text-right text-muted-foreground">{log.timestamp}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
