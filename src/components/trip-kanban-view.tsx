
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Clock, User, Pin, ArrowRight } from 'lucide-react';
import type { Schedule, ScheduleStatus } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/app-provider';


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


export default function TripKanbanView({ isPublic = false }: { isPublic?: boolean }) {
  const { schedules } = useApp();
  
  const schedulesByStatus = (status: ScheduleStatus) => {
    return schedules.filter(s => s.status === status);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statusColumns.map(column => (
            <div key={column.status} className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold tracking-tight">{column.title} ({schedulesByStatus(column.status).length})</h2>
                <div className="bg-muted/50 rounded-lg p-4 space-y-4 min-h-[200px]">
                    {schedulesByStatus(column.status).length > 0 ? (
                        schedulesByStatus(column.status).map((schedule: Schedule) => (
                            <Card key={schedule.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{schedule.title}</CardTitle>
                                    <Badge variant={getStatusVariant(schedule.status)}>{schedule.status}</Badge>
                                    </div>
                                    <CardDescription className="flex items-center text-sm text-muted-foreground mt-2">
                                        <Clock className="mr-2 h-4 w-4" /> {schedule.departureTime}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex items-center">
                                    <User className="mr-2 h-4 w-4 text-primary" />
                                    <strong>Motorista:</strong><span className="ml-2">{schedule.driver}</span>
                                    </div>
                                    <div className="flex items-center">
                                    <Car className="mr-2 h-4 w-4 text-primary" />
                                    <strong>Veículo:</strong><span className="ml-2">{schedule.vehicle}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center">
                                    <Pin className="mr-2 h-4 w-4 text-green-500" />
                                    <span>{schedule.origin}</span>
                                    <ArrowRight className="mx-2 h-4 w-4 text-muted-foreground" />
                                    <Pin className="mr-2 h-4 w-4 text-red-500" />
                                    <span>{schedule.destination}</span>
                                    </div>
                                </CardContent>
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
  );
}
