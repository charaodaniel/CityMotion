"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { schedules } from '@/lib/data';
import type { ScheduleStatus } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';


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

export default function SchedulesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
            <Button className="bg-accent hover:bg-accent/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar Nova Escala
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Escala</DialogTitle>
              <DialogDescription>
                Formulário para criar uma nova escala de trabalho. (Em desenvolvimento)
              </DialogDescription>
            </DialogHeader>
            <div className='py-4'>
                <p className='text-sm text-muted-foreground'>O formulário de criação de escala será adicionado aqui em breve.</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Escalas Agendadas</CardTitle>
          <CardDescription>
            {schedules.length > 0 
                ? 'Consulte as escalas de trabalho e plantões agendados.'
                : 'Ainda não há escalas agendadas.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
            {schedules.length > 0 ? (
                 <Table>
                 <TableHeader>
                     <TableRow>
                         <TableHead>Título</TableHead>
                         <TableHead>Responsável</TableHead>
                         <TableHead>Horário</TableHead>
                         <TableHead>Status</TableHead>
                     </TableRow>
                 </TableHeader>
                 <TableBody>
                     {schedules.map((schedule) => (
                         <TableRow key={schedule.id}>
                             <TableCell className="font-medium">{schedule.title}</TableCell>
                             <TableCell>{schedule.driver}</TableCell>
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
                    <p>Nenhuma escala agendada no momento.</p>
                    <p className="text-sm">Clique em "Criar Nova Escala" para começar.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
