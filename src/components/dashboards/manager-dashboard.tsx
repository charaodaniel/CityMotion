
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Package, UserCheck } from 'lucide-react';
import type { RequestPriority } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/app-provider';
import { useMemo } from 'react';

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

export default function ManagerDashboard() {
  const { toast } = useToast();
  const { vehicleRequests, updateVehicleRequestStatus, drivers } = useApp();

  const managerSector = "Secretaria de Obras"; // Simulating manager's sector

  const handleRequest = (id: string, approved: boolean) => {
    updateVehicleRequestStatus(id, approved ? 'Aprovada' : 'Rejeitada');
    const request = vehicleRequests.find(req => req.id === id);
    if (request) {
      toast({
        title: `Solicitação ${approved ? 'Aprovada' : 'Rejeitada'}`,
        description: `A solicitação "${request.title}" foi ${approved ? 'aprovada' : 'rejeitada'}.`,
      });
    }
  };

  const managerRequests = useMemo(() => {
    // This should ideally be based on the actual logged-in user's sector
    return vehicleRequests.filter(r => r.sector === managerSector && r.status === 'Pendente');
  }, [vehicleRequests, managerSector]);

  const availableDrivers = useMemo(() => {
    return drivers.filter(d => d.status === 'Disponível' && d.sector === managerSector).length;
  }, [drivers, managerSector]);


  return (
    <div className='space-y-8'>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Motoristas Disponíveis no Setor</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{availableDrivers}</div>
                <p className="text-xs text-muted-foreground">Motoristas do seu setor prontos para viagens</p>
            </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Solicitações Pendentes do Setor</h2>
      <div className="space-y-4">
        {managerRequests.length > 0 ? managerRequests.map((request) => (
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
                  <Clock className="mr-2 h-4 w-4" /> Solicitado em: {new Date(request.requestDate).toLocaleDateString('pt-BR')} por {request.requester || 'N/A'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
               <div className="flex items-center">
                <Package className="mr-2 h-4 w-4 text-primary" />
                <strong>Setor:</strong><span className="ml-2">{request.sector}</span>
              </div>
              <p className="text-muted-foreground pt-2">{request.details}</p>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => handleRequest(request.id, false)}>Rejeitar</Button>
                <Button onClick={() => handleRequest(request.id, true)}>Aprovar</Button>
              </div>
            </CardContent>
          </Card>
        )) : (
            <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg">
                Não há solicitações de veículos pendentes para seu setor.
            </div>
        )}
      </div>
    </div>
  );
}
