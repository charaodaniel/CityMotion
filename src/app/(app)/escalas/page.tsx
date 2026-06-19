
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Clock, User, CalendarDays } from 'lucide-react';
import type { WorkSchedule, WorkScheduleStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreateScheduleForm } from '@/components/forms/create-schedule-form';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/app-provider';

function getStatusVariant(status: WorkScheduleStatus) {
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

export default function SchedulesPage() {
  const { workSchedules } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<WorkSchedule | null>(null);

  const handleCardClick = (schedule: WorkSchedule) => {
    setSelectedSchedule(schedule);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Escalas de Funcionários
          </h1>
          <p className="text-muted-foreground">
            Gestão de plantões e jornadas.
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
                <DialogTitle className="text-2xl">Agendamento de Escala</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] p-4">
                <CreateScheduleForm onFormSubmit={() => setIsModalOpen(false)} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {workSchedules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {workSchedules.map(schedule => (
                <Card 
                    key={schedule.id} 
                    onClick={() => handleCardClick(schedule)} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                >
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground"/> 
                          {schedule.title}
                        </CardTitle>
                        <CardDescription asChild>
                           <div className="flex items-center text-xs pt-1">
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
                           <Badge variant={getStatusVariant(schedule.status)}>{schedule.status}</Badge>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8 border-dashed border-2 rounded-lg">
            <p className="text-lg">Nenhuma escala agendada.</p>
        </div>
      )}

      <Dialog open={!!selectedSchedule} onOpenChange={() => setSelectedSchedule(null)}>
        <DialogContent>
            <ScrollArea className="max-h-[80vh] p-4">
              {selectedSchedule && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{selectedSchedule.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4 pr-4">
                     <div>
                        <span className="text-sm font-semibold text-muted-foreground">Tipo</span>
                        <p className="text-lg">{selectedSchedule.type}</p>
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
