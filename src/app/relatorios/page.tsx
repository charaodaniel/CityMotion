
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, Car, Clock, User } from 'lucide-react';
import { schedules } from '@/lib/data';
import type { Schedule, ScheduleStatus } from '@/lib/types';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

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

export default function ReportsPage() {
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const handleCardClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
  };

  const closeDetailsModal = () => {
    setSelectedSchedule(null);
  };

  const completedSchedules = schedules.filter(s => s.status === 'Concluída');

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Relatórios e Histórico
          </h1>
          <p className="text-muted-foreground">
            Consulte o histórico de viagens e gere relatórios.
          </p>
        </div>
        <Button disabled>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar para PDF
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Viagens Concluídas</CardTitle>
          <CardDescription>
            {completedSchedules.length > 0 
                ? 'Lista de todas as viagens já finalizadas.'
                : 'Ainda não há viagens concluídas no histórico.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
            {completedSchedules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedSchedules.map((schedule) => (
                        <Card key={schedule.id} onClick={() => handleCardClick(schedule)} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base">{schedule.title}</CardTitle>
                                <CardDescription className="flex items-center text-xs">
                                    <Clock className="mr-1.5 h-3 w-3" /> Concluído em: {schedule.time.split(' ')[0]}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-xs space-y-2">
                                <div className="flex items-center">
                                    <User className="mr-2 h-3 w-3 text-muted-foreground" />
                                    <span>Motorista: <strong>{schedule.driver}</strong></span>
                                </div>
                                <div className="flex items-center">
                                    <Car className="mr-2 h-3 w-3 text-muted-foreground" />
                                    <span>Veículo: <strong>{schedule.vehicle}</strong></span>
                                </div>
                                <div className="pt-2">
                                    <p className="text-xs text-muted-foreground">De: {schedule.origin}</p>
                                    <p className="text-xs text-muted-foreground">Para: {schedule.destination}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-8">
                    <p>Nenhuma viagem concluída para exibir.</p>
                </div>
            )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={!!selectedSchedule} onOpenChange={closeDetailsModal}>
        <DialogContent>
            <ScrollArea className="max-h-[80vh] p-4">
              {selectedSchedule && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{selectedSchedule.title}</DialogTitle>
                    <DialogDescription>
                      Detalhes da viagem concluída.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4 pr-4">
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
                        <p className="text-lg">{selectedSchedule.time}</p>
                    </div>
                    <Separator />
                    <div>
                        <span className="text-sm font-semibold text-muted-foreground">Status</span>
                        <div>
                            <Badge variant={getStatusVariant(selectedSchedule.status)}>{selectedSchedule.status}</Badge>
                        </div>
                    </div>
                  </div>
                </>
              )}
            </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
