
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Clock, User } from 'lucide-react';
import { schedules } from '@/lib/data';
import type { Schedule, ScheduleStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreateScheduleForm } from '@/components/create-schedule-form';
import { Separator } from '@/components/ui/separator';

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

const statusColumns: { title: string; status: ScheduleStatus }[] = [
    { title: 'Agendadas', status: 'Agendada' },
    { title: 'Em Andamento', status: 'Em Andamento' },
    { title: 'Concluídas', status: 'Concluída' },
];

export default function SchedulesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const handleCardClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
  };

  const closeDetailsModal = () => {
    setSelectedSchedule(null);
  };

  const schedulesByStatus = (status: ScheduleStatus) => {
    return schedules.filter(s => s.status === status);
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Escalas de Funcionários
          </h1>
          <p className="text-muted-foreground">
            Gerencie as escalas de trabalho, plantões e jornadas dos funcionários.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar Nova Escala
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
                <DialogTitle className="text-2xl">Criar Nova Escala</DialogTitle>
                <DialogDescription>
                    Preencha o formulário para agendar uma nova escala de trabalho.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] p-4">
                <CreateScheduleForm onFormSubmit={() => setIsModalOpen(false)} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {schedules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statusColumns.map(column => (
                <div key={column.status} className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold tracking-tight">{column.title} ({schedulesByStatus(column.status).length})</h2>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-4 min-h-[200px]">
                        {schedulesByStatus(column.status).length > 0 ? (
                            schedulesByStatus(column.status).map(schedule => (
                                <Card 
                                    key={schedule.id} 
                                    onClick={() => handleCardClick(schedule)} 
                                    className="cursor-pointer hover:shadow-md transition-shadow"
                                >
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-base">{schedule.title}</CardTitle>
                                        <CardDescription className="flex items-center text-xs">
                                            <Clock className="mr-1.5 h-3 w-3" /> {schedule.time}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-xs space-y-2">
                                        <div className="flex items-center">
                                            <User className="mr-2 h-3 w-3" />
                                            <span>{schedule.driver}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                Nenhuma escala nesta etapa.
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8 border-dashed border-2 rounded-lg">
            <p className="text-lg">Nenhuma escala agendada no momento.</p>
            <p className="text-sm mt-2">Clique em "Criar Nova Escala" para começar.</p>
        </div>
      )}


      {/* Details Modal */}
      <Dialog open={!!selectedSchedule} onOpenChange={closeDetailsModal}>
        <DialogContent>
            <ScrollArea className="max-h-[80vh] p-4">
              {selectedSchedule && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{selectedSchedule.title}</DialogTitle>
                    <DialogDescription>
                      Detalhes da escala agendada.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4 pr-4">
                    <div>
                        <span className="text-sm font-semibold text-muted-foreground">Responsável</span>
                        <p className="text-lg">{selectedSchedule.driver}</p>
                    </div>
                    <Separator />
                     <div>
                        <span className="text-sm font-semibold text-muted-foreground">Horário</span>
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
