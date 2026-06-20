"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, User, Wrench, Check, CircleHelp, Settings, CheckCircle, ShoppingCart } from 'lucide-react';
import type { MaintenanceRequest, MaintenanceRequestStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApp } from '@/contexts/app-provider';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RequestPartForm } from '@/components/forms/request-part-form';

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
  const [isPartRequestModalOpen, setIsPartRequestModalOpen] = useState(false);

  const requestsByStatus = (status: MaintenanceRequestStatus) => {
    return maintenanceRequests.filter(s => s.status === status);
  }

  const handleCardClick = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
  };
  
  const closeModal = () => {
    setSelectedRequest(null);
    setIsPartRequestModalOpen(false);
  };

  const handleUpdateStatus = (newStatus: MaintenanceRequestStatus) => {
    if (selectedRequest) {
        updateMaintenanceRequestStatus(selectedRequest.id, newStatus);
        closeModal();
    }
  }

  const isAdminOrManager = userRole === 'admin' || userRole === 'manager' || userRole === 'dev';

  return (
    <div className="container mx-auto p-4 sm:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-on-surface flex items-center gap-4">
            <Wrench className="h-10 w-10 text-primary" />
            Manutenção
          </h1>
          <p className="text-muted-foreground text-lg mt-1 font-medium">
            Gestão técnica e operacional de reparos da frota NexusOS.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {statusColumns.map(column => (
            <div key={column.status} className="flex flex-col gap-4">
                <h2 className="text-xs font-bold uppercase tracking-widest flex items-center text-primary/70">
                    <column.icon className="mr-2 h-3.5 w-3.5" />
                    {column.title} ({requestsByStatus(column.status).length})
                </h2>
                <div className="bg-sidebar/30 rounded-xl p-4 space-y-4 min-h-[300px] border border-border/50 scanlines">
                    {requestsByStatus(column.status).length > 0 ? (
                        requestsByStatus(column.status).map(request => (
                            <Card 
                                key={request.id} 
                                onClick={() => handleCardClick(request)}
                                className="cursor-pointer hover:border-primary transition-all duration-300 bg-sidebar/80 border-border/50 group"
                            >
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-base font-bold tracking-tight">{request.vehicleModel}</CardTitle>
                                    <CardDescription asChild>
                                      <div className="flex items-center text-[10px] uppercase font-mono tracking-widest font-bold text-primary/60 mt-1">
                                        <Badge variant="outline" className="mr-2 text-[8px] h-4 px-1.5 border-primary/30">{request.licensePlate}</Badge>
                                        <Clock className="mr-1 h-3 w-3" /> 
                                        {format(new Date(request.requestDate), "dd/MM/yyyy", { locale: ptBR })}
                                      </div>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 space-y-3">
                                     <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{request.description}</p>
                                     <div className="flex items-center text-[10px] font-medium pt-1 text-muted-foreground border-t border-border/20">
                                        <User className="mr-1.5 h-3 w-3" />
                                        <span>Solicitante: <strong className="text-on-surface">{request.requesterName}</strong></span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-[10px] text-muted-foreground uppercase tracking-widest opacity-50 gap-2">
                            <column.icon className="h-8 w-8 mb-2" />
                            Vazio
                        </div>
                    )}
                </div>
            </div>
        ))}
      </div>

       {/* Details Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-2xl border-border/50 bg-sidebar p-0 overflow-hidden">
              <div className="h-1.5 w-full bg-primary" />
              <ScrollArea className="max-h-[80vh] p-8">
              {selectedRequest && (
                  <>
                  <DialogHeader className="mb-6">
                      <DialogTitle className="text-3xl font-black tracking-tight">{selectedRequest.vehicleModel} ({selectedRequest.licensePlate})</DialogTitle>
                      <DialogDescription className="text-xs font-mono uppercase tracking-widest text-primary/70">
                        Protocolo MNT-{selectedRequest.id.replace(/\D/g, '')} // Solicitado em {format(new Date(selectedRequest.requestDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </DialogDescription>
                  </DialogHeader>
                  <div className="scanlines rounded-lg border border-border/50 p-6 bg-accent/10 space-y-6">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status Atual</span>
                            <div className="mt-1">
                                <Badge variant={getStatusVariant(selectedRequest.status)} className="text-[10px] font-bold uppercase tracking-tight">{selectedRequest.status}</Badge>
                            </div>
                        </div>
                        <Separator className="bg-border/30" />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tipo de Manutenção</span>
                          <p className="text-lg font-bold">{selectedRequest.type}</p>
                      </div>
                      <Separator className="bg-border/30" />
                      <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Descrição do Diagnóstico</span>
                          <p className="text-sm mt-2 p-4 bg-black/40 rounded-md font-mono leading-relaxed text-foreground/90 border border-border/20">{selectedRequest.description}</p>
                      </div>
                      
                      {isAdminOrManager && (
                        <>
                          <Separator className="bg-border/30" />
                           <div className="pt-2">
                                <h3 className="text-xs font-black uppercase tracking-widest mb-4 text-primary">Ações de Oficina</h3>
                                <div className="flex flex-wrap gap-3">
                                    {selectedRequest.status === 'Pendente' && (
                                        <Button onClick={() => handleUpdateStatus('Em Andamento')} className="bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] h-10 px-4">
                                            <Settings className="mr-2 h-4 w-4" /> Iniciar Protocolo
                                        </Button>
                                    )}
                                    {selectedRequest.status === 'Em Andamento' && (
                                        <>
                                            <Button onClick={() => handleUpdateStatus('Concluída')} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-4">
                                                <Check className="mr-2 h-4 w-4" /> Finalizar Reparo
                                            </Button>
                                            <Button variant="outline" onClick={() => setIsPartRequestModalOpen(true)} className="border-primary text-primary hover:bg-primary/10 font-bold uppercase tracking-widest text-[10px] h-10 px-4">
                                                <ShoppingCart className="mr-2 h-4 w-4" /> Solicitar Peças
                                            </Button>
                                        </>
                                    )}
                                     {selectedRequest.status === 'Concluída' && (
                                        <Button variant="outline" onClick={() => handleUpdateStatus('Pendente')} className="text-xs uppercase font-bold tracking-widest">
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
      
      {/* Part Request Modal */}
      <Dialog open={isPartRequestModalOpen} onOpenChange={setIsPartRequestModalOpen}>
        <DialogContent className="sm:max-w-xl border-border/50 bg-sidebar p-0 overflow-hidden">
            <div className="h-1.5 w-full bg-primary" />
            <ScrollArea className="max-h-[80vh] p-8">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-black tracking-tight flex items-center">
                        <ShoppingCart className="mr-3 h-6 w-6 text-primary"/>
                        Pedido de Peças
                    </DialogTitle>
                    <DialogDescription className="text-xs font-mono uppercase tracking-widest text-primary/70">
                    MNT-REF: {selectedRequest?.vehicleModel} // {selectedRequest?.licensePlate}
                    </DialogDescription>
                </DialogHeader>
                <div className="scanlines rounded-lg border border-border/50 p-6 bg-accent/10">
                    <RequestPartForm 
                        maintenanceRequest={selectedRequest}
                        onFormSubmit={() => setIsPartRequestModalOpen(false)}
                    />
                </div>
            </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
