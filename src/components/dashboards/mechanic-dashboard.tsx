
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useApp } from '@/contexts/app-provider';
import { Car, CircleHelp, Settings, Wrench } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function MechanicDashboard() {
  const { maintenanceRequests, vehicles } = useApp();

  const pendingRequests = maintenanceRequests.filter(r => r.status === 'Pendente').length;
  const inProgressRequests = maintenanceRequests.filter(r => r.status === 'Em Andamento').length;
  const vehiclesInMaintenance = vehicles.filter(v => v.status === 'Manutenção').length;

  return (
    <div className='space-y-8'>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Solicitações Pendentes</CardTitle>
                <CircleHelp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{pendingRequests}</div>
                <p className="text-xs text-muted-foreground">Novos chamados aguardando avaliação</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Manutenções em Andamento</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{inProgressRequests}</div>
                <p className="text-xs text-muted-foreground">Serviços que estão sendo executados</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Veículos na Oficina</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{vehiclesInMaintenance}</div>
                <p className="text-xs text-muted-foreground">Total de veículos em manutenção</p>
            </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesse as principais ferramentas do seu dia a dia.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="w-full sm:w-auto">
                <Link href="/manutencao">
                    <Wrench className="mr-2 h-4 w-4" />
                    Gerenciar Manutenções
                </Link>
            </Button>
             <Button asChild variant="secondary" className="w-full sm:w-auto">
                <Link href="/veiculos">
                    <Car className="mr-2 h-4 w-4" />
                    Ver Frota Completa
                </Link>
            </Button>
        </CardContent>
      </Card>

    </div>
  );
}
