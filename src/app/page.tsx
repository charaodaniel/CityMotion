

"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Clock, PlusCircle, User, Play, CheckSquare, Ban, Gauge, ClipboardCheck, ClipboardX, MessageSquareText, Check } from 'lucide-react';
import { drivers as initialDrivers, vehicles as initialVehicles } from '@/lib/data';
import type { Schedule, ScheduleStatus, Driver, Vehicle } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ScheduleTripForm } from '@/components/schedule-trip-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/app-provider';

type ModalState = 'details' | 'finish' | 'start-checklist' | 'form' | null;

const startChecklistItems = [
    'Nível de óleo e água verificado',
    'Calibragem dos pneus verificada',
    'Documentos do veículo (CRLV) conferidos',
    'Limpeza interna e externa adequada'
];

const finishChecklistItems = [
    'Veículo estacionado em local seguro',
    'Chaves entregues ao setor responsável',
    'Veículo sem novos danos aparentes',
    'Veículo deixado limpo e organizado',
];


function getStatusVariant(status: ScheduleStatus) {
    switch (status) {
      case 'Agendada':
        return 'secondary';
      case 'Em Andamento':
        return 'default';
      case 'Concluída':
        return 'outline';
      case 'Cancelada':
        return 'destructive';
      default:
        return 'outline';
    }
}

const statusColumns: { title: string; status: ScheduleStatus }[] = [
    { title: 'Agendadas', status: 'Agendada' },
    { title: 'Em Andamento', status: 'Em Andamento' },
    { title: 'Concluídas', status: 'Concluída' },
];

function TripsView({ 
    schedules, 
    onCardClick, 
}: { 
    schedules: Schedule[], 
    onCardClick: (schedule: Schedule) => void,
}) {
    
    const schedulesByStatus = (status: ScheduleStatus) => {
        return schedules.filter(s => s.status === status);
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {statusColumns.map(column => (
                <div key={column.status} className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold tracking-tight">{column.title} ({schedulesByStatus(column.status).length})</h2>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-4 min-h-[200px]">
                        {schedulesByStatus(column.status).length > 0 ? (
                            schedulesByStatus(column.status).map(schedule => (
                                <Card 
                                    key={schedule.id} 
                                    className="cursor-pointer hover:shadow-md transition-shadow relative"
                                    onClick={() => onCardClick(schedule)}
                                >
                                    <div>
                                        <CardHeader className="pb-4">
                                            <CardTitle className="text-base">{schedule.title}</CardTitle>
                                            <CardDescription className="flex items-center text-xs">
                                                <Clock className="mr-1.5 h-3 w-3" /> {schedule.departureTime}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="text-xs space-y-2">
                                            <div className="flex items-center">
                                                <User className="mr-2 h-3 w-3" />
                                                <span>{schedule.driver}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Car className="mr-2 h-3 w-3" />
                                                <span>{schedule.vehicle}</span>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                Nenhuma viagem nesta etapa.
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function HomePage() {
  const { schedules, setSchedules } = useApp();
  const [activeModal, setActiveModal] = useState<ModalState>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const openModal = (modal: ModalState, schedule: Schedule | null = null) => {
    setSelectedSchedule(schedule);
    setActiveModal(modal);
  };
  
  const closeModal = () => {
      openModal(null);
  }

  const allSchedules = schedules.filter(s => s.status !== 'Cancelada');
  const schoolSchedules = allSchedules.filter(s => s.category.toLowerCase().includes('escolar'));
  const generalSchedules = allSchedules.filter(s => !s.category.toLowerCase().includes('escolar'));

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Painel de Viagens
          </h1>
          <p className="text-muted-foreground">
            Acompanhe o status de todas as viagens e linhas escolares.
          </p>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Viagens Gerais ({generalSchedules.length})</TabsTrigger>
          <TabsTrigger value="school">Linhas Escolares ({schoolSchedules.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <TripsView 
            schedules={generalSchedules} 
            onCardClick={(schedule) => openModal('details', schedule)}
            />
        </TabsContent>
        <TabsContent value="school">
          <TripsView 
            schedules={schoolSchedules} 
            onCardClick={(schedule) => openModal('details', schedule)}
            />
        </TabsContent>
      </Tabs>
      
      {/* Details Modal */}
      <Dialog open={activeModal === 'details'} onOpenChange={() => closeModal()}>
          <DialogContent>
              <ScrollArea className="max-h-[80vh] p-4">
              {selectedSchedule && (
                  <>
                  <DialogHeader>
                      <DialogTitle className="text-2xl">{selectedSchedule.title}</DialogTitle>
                      <DialogDescription>
                      Detalhes da viagem agendada.
                      </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4 pr-4">
                        <div>
                            <span className="text-sm font-semibold text-muted-foreground">Status</span>
                            <div>
                                <Badge variant={getStatusVariant(selectedSchedule.status)}>{selectedSchedule.status}</Badge>
                            </div>
                        </div>
                        <Separator />
                        <div>
                          <span className="text-sm font-semibold text-muted-foreground">Motorista</span>
                          <p className="text-lg">{selectedSchedule.driver}</p>
                      </div>
                      <Separator />
                      <div>
                          <span className="text-sm font-semibold text-muted-foreground">Veículo</span>
                          <p className="text-lg">{selectedSchedule.vehicle}</p>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <span className="text-sm font-semibold text-muted-foreground">Origem</span>
                              <p className="text-lg">{selectedSchedule.origin}</p>
                          </div>
                          <div>
                              <span className="text-sm font-semibold text-muted-foreground">Destino</span>
                              <p className="text-lg">{selectedSchedule.destination}</p>
                          </div>
                      </div>
                      <Separator />
                      <div>
                          <span className="text-sm font-semibold text-muted-foreground">Data e Horário</span>
                          <p className="text-lg">{selectedSchedule.departureTime}</p>
                      </div>

                      {(selectedSchedule.status === 'Em Andamento' || selectedSchedule.status === 'Concluída') && selectedSchedule.startChecklist && (
                        <>
                          <Separator />
                           <div>
                            <span className="text-sm font-semibold text-muted-foreground flex items-center mb-2">
                              <ClipboardCheck className="mr-2 h-4 w-4" />
                              Checklist de Partida
                            </span>
                            <div className='space-y-1 text-sm'>
                              {selectedSchedule.startChecklist.map((item, index) => (
                                <div key={index} className="flex items-center">
                                  <Check className="h-4 w-4 mr-2 text-green-500" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                           </div>
                           {selectedSchedule.startNotes && (
                            <div className='mt-2'>
                              <span className="text-sm font-semibold text-muted-foreground flex items-center">
                                <MessageSquareText className="mr-2 h-4 w-4" />
                                Observações de Partida
                              </span>
                              <p className="text-sm mt-1 p-3 bg-muted/50 rounded-md">{selectedSchedule.startNotes}</p>
                            </div>
                          )}
                        </>
                      )}

                       {selectedSchedule.status === 'Concluída' && selectedSchedule.endChecklist && (
                        <>
                          <Separator />
                          <div>
                            <span className="text-sm font-semibold text-muted-foreground flex items-center mb-2">
                              <ClipboardX className="mr-2 h-4 w-4" />
                              Checklist de Chegada
                            </span>
                            <div className='space-y-1 text-sm'>
                               {selectedSchedule.endChecklist.map((item, index) => (
                                <div key={index} className="flex items-center">
                                  <Check className="h-4 w-4 mr-2 text-green-500" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                           </div>
                           {selectedSchedule.endNotes && (
                            <div className='mt-2'>
                              <span className="text-sm font-semibold text-muted-foreground flex items-center">
                                <MessageSquareText className="mr-2 h-4 w-4" />
                                Observações de Chegada
                              </span>
                              <p className="text-sm mt-1 p-3 bg-muted/50 rounded-md">{selectedSchedule.endNotes}</p>
                            </div>
                          )}
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
