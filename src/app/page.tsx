
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Clock, User, CalendarDays } from 'lucide-react';
import { workSchedules } from '@/lib/data';
import type { Schedule, ScheduleStatus, WorkSchedule, WorkScheduleStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/app-provider';
import { Header } from '@/components/layout/header';

type ModalState = 'details-trip' | 'details-work' | null;

function getTripStatusVariant(status: ScheduleStatus) {
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
function getWorkStatusVariant(status: WorkScheduleStatus) {
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

const tripStatusColumns: { title: string; status: ScheduleStatus }[] = [
    { title: 'Agendadas', status: 'Agendada' },
    { title: 'Em Andamento', status: 'Em Andamento' },
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {tripStatusColumns.map(column => (
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

function WorkSchedulesView({ 
    schedules, 
    onCardClick,
}: { 
    schedules: WorkSchedule[], 
    onCardClick: (schedule: WorkSchedule) => void,
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {schedules.map(schedule => (
                <Card 
                    key={schedule.id} 
                    onClick={() => onCardClick(schedule)} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                >
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground"/> 
                          {schedule.title}
                        </CardTitle>
                        <CardDescription asChild className="flex items-center text-xs pt-1">
                           <div>
                            <Badge variant="outline">{schedule.type}</Badge>
                           </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                        <div className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>{schedule.employee}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="mr-2 h-4 w-4" />
                            <span>{schedule.startDate} - {schedule.endDate}</span>
                        </div>
                         <div className="pt-2">
                           <Badge variant={getWorkStatusVariant(schedule.status)}>{schedule.status}</Badge>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default function HomePage() {
  const { schedules } = useApp();
  const [activeModal, setActiveModal] = useState<ModalState>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedWorkSchedule, setSelectedWorkSchedule] = useState<WorkSchedule | null>(null);

  const openModal = (modal: ModalState, schedule: Schedule | WorkSchedule | null = null) => {
    if (modal === 'details-trip') {
        setSelectedSchedule(schedule as Schedule);
    } else if (modal === 'details-work') {
        setSelectedWorkSchedule(schedule as WorkSchedule);
    }
    setActiveModal(modal);
  };
  
  const closeModal = () => {
      setActiveModal(null);
      setSelectedSchedule(null);
      setSelectedWorkSchedule(null);
  }

  const openSchedules = schedules.filter(s => s.status === 'Agendada' || s.status === 'Em Andamento');
  const openWorkSchedules = workSchedules.filter(s => s.status !== 'Concluída');


  return (
    <>
      <Header />
      <div className="container mx-auto p-4 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              Painel de Atividades em Aberto
            </h1>
            <p className="text-muted-foreground">
              Acompanhe o status das viagens e escalas de trabalho ativas.
            </p>
          </div>
        </div>

        <Tabs defaultValue="trips">
          <TabsList>
            <TabsTrigger value="trips">Viagens ({openSchedules.length})</TabsTrigger>
            <TabsTrigger value="work-schedules">Escalas de Trabalho ({openWorkSchedules.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="trips">
            <TripsView 
              schedules={openSchedules} 
              onCardClick={(schedule) => openModal('details-trip', schedule)}
              />
          </TabsContent>
          <TabsContent value="work-schedules">
            <WorkSchedulesView
              schedules={openWorkSchedules}
              onCardClick={(schedule) => openModal('details-work', schedule)}
            />
          </TabsContent>
        </Tabs>
        
        {/* Details Modal */}
        <Dialog open={!!activeModal} onOpenChange={() => closeModal()}>
            <DialogContent>
                <ScrollArea className="max-h-[80vh] p-4">
                {activeModal === 'details-trip' && selectedSchedule && (
                    <>
                      <DialogHeader>
                          <DialogTitle className="text-2xl">{selectedSchedule.title}</DialogTitle>
                          <DialogDescription>Detalhes da viagem agendada.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4 pr-4">
                          <div>
                              <span className="text-sm font-semibold text-muted-foreground">Status</span>
                              <div><Badge variant={getTripStatusVariant(selectedSchedule.status)}>{selectedSchedule.status}</Badge></div>
                          </div>
                          <Separator />
                          <div><span className="text-sm font-semibold text-muted-foreground">Motorista</span><p className="text-lg">{selectedSchedule.driver}</p></div>
                          <Separator />
                          <div><span className="text-sm font-semibold text-muted-foreground">Veículo</span><p className="text-lg">{selectedSchedule.vehicle}</p></div>
                          <Separator />
                          <div className="grid grid-cols-2 gap-4">
                              <div><span className="text-sm font-semibold text-muted-foreground">Origem</span><p className="text-lg">{selectedSchedule.origin}</p></div>
                              <div><span className="text-sm font-semibold text-muted-foreground">Destino</span><p className="text-lg">{selectedSchedule.destination}</p></div>
                          </div>
                          <Separator />
                          <div><span className="text-sm font-semibold text-muted-foreground">Data e Horário</span><p className="text-lg">{selectedSchedule.departureTime}</p></div>
                      </div>
                    </>
                )}
                {activeModal === 'details-work' && selectedWorkSchedule && (
                    <>
                      <DialogHeader>
                          <DialogTitle className="text-2xl">{selectedWorkSchedule.title}</DialogTitle>
                          <DialogDescription>Detalhes da escala agendada.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4 pr-4">
                          <div><span className="text-sm font-semibold text-muted-foreground">Tipo</span><p className="text-lg">{selectedWorkSchedule.type}</p></div>
                          <Separator />
                          <div><span className="text-sm font-semibold text-muted-foreground">Funcionário</span><p className="text-lg">{selectedWorkSchedule.employee}</p></div>
                          <Separator />
                          <div><span className="text-sm font-semibold text-muted-foreground">Período</span><p className="text-lg">{selectedWorkSchedule.startDate} até {selectedWorkSchedule.endDate}</p></div>
                          <Separator />
                          {selectedWorkSchedule.description && (
                          <>
                              <div>
                              <span className="text-sm font-semibold text-muted-foreground">Observações</span>
                              <p className="text-base mt-1">{selectedWorkSchedule.description}</p>
                              </div>
                              <Separator />
                          </>
                          )}
                          <div>
                              <span className="text-sm font-semibold text-muted-foreground">Status</span>
                              <div><Badge variant={getWorkStatusVariant(selectedWorkSchedule.status)}>{selectedWorkSchedule.status}</Badge></div>
                          </div>
                      </div>
                    </>
                )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
