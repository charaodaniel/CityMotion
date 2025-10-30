"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Package } from 'lucide-react';
import { vehicleRequests } from '@/lib/data';
import type { RequestPriority } from '@/lib/types';
import { Button } from '@/components/ui/button';

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
  const managerRequests = vehicleRequests.filter(r => r.sector === 'Secretaria de Obras');

  return (
    <div>
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
                  <Clock className="mr-2 h-4 w-4" /> Solicitado em: {new Date(request.requestDate).toLocaleDateString('pt-BR')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
               <div className="flex items-center">
                <Package className="mr-2 h-4 w-4 text-primary" />
                <strong>Setor:</strong><span className="ml-2">{request.sector}</span>
              </div>
              <p className="text-muted-foreground pt-2">{request.details}</p>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">Rejeitar</Button>
                <Button>Aprovar</Button>
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
