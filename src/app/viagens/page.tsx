"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { schedules } from '@/lib/data';
import type { ScheduleStatus } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import ScheduleTripPage from './agendar/page';

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

export default function TripsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Agendamento de Viagens
          </h1>
          <p className="text-muted-foreground">
            Gerencie e agende os deslocamentos da frota.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Agendar Nova Viagem
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Agendar Nova Viagem</DialogTitle>
                    <DialogDescription>
                        Preencha o formulário para solicitar um veículo e agendar um deslocamento.
                    </DialogDescription>
                </DialogHeader>
                 <ScrollArea className="max-h-[70vh] p-4">
                    <ScheduleTripPage />
                </ScrollArea>
            </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Viagens Agendadas</CardTitle>
          <CardDescription>
            {schedules.length > 0 
                ? 'Consulte e gerencie as viagens programadas.'
                : 'Ainda não há viagens agendadas.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
            {schedules.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Motorista</TableHead>
                            <TableHead>Veículo</TableHead>
                            <TableHead>Horário</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {schedules.map((schedule) => (
                            <TableRow key={schedule.id}>
                                <TableCell className="font-medium">{schedule.title}</TableCell>
                                <TableCell>{schedule.category}</TableCell>
                                <TableCell>{schedule.driver}</TableCell>
                                <TableCell>{schedule.vehicle}</TableCell>
                                <TableCell>{schedule.time}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(schedule.status)}>{schedule.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="text-center text-muted-foreground py-8">
                    <p>Nenhuma viagem agendada no momento.</p>
                    <p className="text-sm">Clique em "Agendar Nova Viagem" para começar.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
