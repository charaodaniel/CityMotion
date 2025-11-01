
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Car, Clock, User, Pin, ArrowRight, Package, UserCheck, Route } from 'lucide-react';
import { drivers, vehicles } from '@/lib/data';
import type { ScheduleStatus, RequestPriority } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { OverviewChart } from '../overview-chart';
import { DriverActivityChart } from '../driver-activity-chart';
import { useApp } from '@/contexts/app-provider';


function getStatusVariant(status: ScheduleStatus) {
  switch (status) {
    case 'Agendada':
      return 'secondary';
    case 'Em Andamento':
      return 'default';
    case 'Concluída':
      return 'outline';
    default:
      return 'outline';
  }
}

function getPriorityVariant(priority: RequestPriority) {
  switch (priority) {
    case 'Alta':
      return 'destructive';
    case 'Média':
      return 'secondary';
    case 'Baixa':
      return 'outline';
    default:
      return 'outline';
  }
}

export default function AdminDashboard() {
  const { vehicleRequests, schedules } = useApp();
  const availableDrivers = drivers.filter(d => d.status === 'Disponível').length;
  const pendingRequests = vehicleRequests.filter(r => r.status === 'Pendente');
  const totalVehicles = vehicles.length;
  const tripsInProgress = schedules.filter(s => s.status === 'Em Andamento').length;

  return (
    <div className='space-y-8'>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Veículos</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalVehicles}</div>
                <p className="text-xs text-muted-foreground">Veículos na frota municipal</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Motoristas Disponíveis</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{availableDrivers}</div>
                <p className="text-xs text-muted-foreground">Motoristas prontos para novas viagens</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Viagens em Andamento</CardTitle>
                <Route className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{tripsInProgress}</div>
                <p className="text-xs text-muted-foreground">Veículos atualmente em percurso</p>
            </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna de Escalas */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Escalas do Dia</h2>
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <Card key={schedule.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{schedule.title}</CardTitle>
                      <Badge variant={getStatusVariant(schedule.status)}>{schedule.status}</Badge>
                    </div>
                    <CardDescription className="flex items-center text-sm text-muted-foreground mt-2">
                        <Clock className="mr-2 h-4 w-4" /> {schedule.departureTime}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-primary" />
                      <strong>Motorista:</strong><span className="ml-2">{schedule.driver}</span>
                    </div>
                    <div className="flex items-center">
                      <Car className="mr-2 h-4 w-4 text-primary" />
                      <strong>Veículo:</strong><span className="ml-2">{schedule.vehicle}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center">
                      <Pin className="mr-2 h-4 w-4 text-green-500" />
                      <span>{schedule.origin}</span>
                      <ArrowRight className="mx-2 h-4 w-4 text-muted-foreground" />
                      <Pin className="mr-2 h-4 w-4 text-red-500" />
                      <span>{schedule.destination}</span>
                    </div>

                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Coluna de Solicitações */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Solicitações de Veículos Pendentes</h2>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <Badge variant={getPriorityVariant(request.priority)}>
                        {request.priority === 'Alta' && <AlertTriangle className="mr-1 h-3 w-3" />}
                        Prioridade {request.priority}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center text-sm text-muted-foreground mt-2">
                        <Clock className="mr-2 h-4 w-4" /> Solicitado em: {new Date(request.requestDate).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <Package className="mr-2 h-4 w-4 text-primary" />
                      <strong>Setor:</strong><span className="ml-2">{request.sector}</span>
                    </div>
                    <p className="text-muted-foreground pt-2">{request.details}</p>
                  </CardContent>
                </Card>
              ))}
              {pendingRequests.length === 0 && (
                  <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg">
                      Nenhuma solicitação de veículo pendente no momento.
                  </div>
              )}
            </div>
          </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Visão Geral</CardTitle>
                <CardDescription>Viagens e motoristas ativos nos últimos meses.</CardDescription>
            </CardHeader>
            <CardContent>
                <OverviewChart />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Atividade dos Motoristas</CardTitle>
                <CardDescription>Motoristas ativos e em viagem ao longo do dia.</CardDescription>
            </CardHeader>
            <CardContent>
                <DriverActivityChart />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
