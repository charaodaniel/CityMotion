
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Clock, User, Wrench, Check, CircleHelp, Settings, CheckCircle } from 'lucide-react';
import type { MaintenanceRequest, MaintenanceRequestStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApp } from '@/contexts/app-provider';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function getStatusVariant(status: MaintenanceRequestStatus) {
    switch (status) {
      case 'Pendente':
        return 'secondary';
      case 'Em Andamento':
        return 'default';
      case 'Concluída':
        return 'outline';
      default:
        return 'outline';
    }
}

const statusColumns: { title: string; status: MaintenanceRequestStatus; icon: React.ElementType }[] = [
    { title: 'Pendentes', status: 'Pendente', icon: CircleHelp },
    { title: 'Em Andamento', status: 'Em Andamento', icon: Settings },
    { title: 'Concluídas', status: 'Concluída', icon: CheckCircle },
];

export default function MaintenancePage() {
  const { maintenanceRequests, updateMaintenanceRequestStatus, userRole } = useApp();
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);

  const requestsByStatus = (status: MaintenanceRequestStatus) => {
    return maintenanceRequests.filter(s => s.status === status);
  }

  const handleCardClick = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
  };
  
  const closeModal = () => {
    setSelectedRequest(null);
  };

  const handleUpdateStatus = (newStatus: MaintenanceRequestStatus) => {
    if (selectedRequest) {
        updateMaintenanceRequestStatus(selectedRequest.id, newStatus);
        closeModal();
    }
  }

  const isAdminOrManager = userRole === 'admin' || userRole === 'manager';

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center">
            <Wrench className="mr-3 h-8 w-8" />
            Gestão de Manutenção
          </h1>
          <p className="text-muted-foreground">
            Acompanhe e gerencie as solicitações de manutenção da frota.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statusColumns.map(column => (
            <div key={column.status} className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold tracking-tight flex items-center">
                    <column.icon className="mr-2 h-5 w-5" />
                    {column.title} ({requestsByStatus(column.status).length})
                </h2>
                <div className="bg-muted/50 rounded-lg p-4 space-y-4 min-h-[200px]">
                    {requestsByStatus(column.status).length > 0 ? (
                        requestsByStatus(column.status).map(request => (
                            <Card 
                                key={request.id} 
                                onClick={() => handleCardClick(request)}
                                className="cursor-pointer hover:shadow-md transition-shadow"
                            >
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-base">{request.vehicleModel} ({request.licensePlate})</CardTitle>
                                    <CardDescription className="flex items-center text-xs pt-1">
                                        <Badge variant="outline" className="mr-2">{request.type}</Badge>
                                        <Clock className="mr-1.5 h-3 w-3" /> 
                                        {format(new Date(request.requestDate), "dd/MM/yyyy", { locale: ptBR })}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-sm space-y-2">
                                     <p className="text-muted-foreground line-clamp-2">{request.description}</p>
                                     <div className="flex items-center pt-2">
                                        <User className="mr-2 h-3 w-3" />
                                        <span>Solicitado por: <strong>{request.requesterName}</strong></span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                            Nenhuma solicitação nesta etapa.
                        </div>
                    )}
                </div>
            </div>
        ))}
      </div>

       {/* Details Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={closeModal}>
          <DialogContent>
              <ScrollArea className="max-h-[80vh] p-4">
              {selectedRequest && (
                  <>
                  <DialogHeader>
                      <DialogTitle className="text-2xl">{selectedRequest.vehicleModel} ({selectedRequest.licensePlate})</DialogTitle>
                      <DialogDescription>
                        Solicitado por {selectedRequest.requesterName} em {format(new Date(selectedRequest.requestDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4 pr-4">
                        <div>
                            <span className="text-sm font-semibold text-muted-foreground">Status Atual</span>
                            <div>
                                <Badge variant={getStatusVariant(selectedRequest.status)}>{selectedRequest.status}</Badge>
                            </div>
                        </div>
                        <Separator />
                        <div>
                          <span className="text-sm font-semibold text-muted-foreground">Tipo de Manutenção</span>
                          <p className="text-lg">{selectedRequest.type}</p>
                      </div>
                      <Separator />
                      <div>
                          <span className="text-sm font-semibold text-muted-foreground">Descrição do Problema</span>
                          <p className="text-base mt-1 p-3 bg-muted/50 rounded-md">{selectedRequest.description}</p>
                      </div>
                      
                      {isAdminOrManager && (
                        <>
                          <Separator />
                           <div className="pt-4">
                                <h3 className="text-base font-semibold mb-3">Alterar Status</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedRequest.status === 'Pendente' && (
                                        <Button onClick={() => handleUpdateStatus('Em Andamento')}>
                                            <Settings className="mr-2 h-4 w-4" /> Iniciar Manutenção
                                        </Button>
                                    )}
                                    {selectedRequest.status === 'Em Andamento' && (
                                        <Button onClick={() => handleUpdateStatus('Concluída')}>
                                            <Check className="mr-2 h-4 w-4" /> Concluir Manutenção
                                        </Button>
                                    )}
                                     {selectedRequest.status === 'Concluída' && (
                                        <Button variant="secondary" onClick={() => handleUpdateStatus('Pendente')}>
                                            Reabrir Chamado
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </>
                      )}
                  </div>
                  </>
              )}
              </ScrollArea>
          </DialogContent>
      </Dialog>
    </div>
  );
}
