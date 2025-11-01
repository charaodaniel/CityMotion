
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Car, Pin, ArrowRight } from 'lucide-react';
import { schedules } from '@/lib/data';
import type { ScheduleStatus } from '@/lib/types';
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

export default function DriverDashboard() {
  const driverSchedules = schedules.filter(s => s.driver === 'João da Silva'); // Simula o motorista logado

  return (
    <div>
        <h2 className="text-2xl font-semibold mb-4">Minhas Próximas Viagens</h2>
        <div className="space-y-4">
        {driverSchedules.length > 0 ? driverSchedules.map((schedule) => (
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
        )) : (
            <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg">
                Você não tem nenhuma viagem agendada no momento.
            </div>
        )}
        </div>
    </div>
  );
}
