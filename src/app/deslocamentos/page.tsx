import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { schedules } from '@/lib/data';
import type { ScheduleStatus } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

export default function TripsPage() {
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Agendamento de Deslocamentos
          </h1>
          <p className="text-muted-foreground">
            Gerencie e agende os deslocamentos da frota.
          </p>
        </div>
        <Link href="/deslocamentos/agendar">
          <Button className="bg-accent hover:bg-accent/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Agendar Novo Deslocamento
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Deslocamentos Agendados</CardTitle>
          <CardDescription>
            {schedules.length > 0 
                ? 'Consulte e gerencie os deslocamentos programados.'
                : 'Ainda não há deslocamentos agendados.'
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
                    <p>Nenhum deslocamento agendado no momento.</p>
                    <p className="text-sm">Clique em "Agendar Novo Deslocamento" para começar.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
