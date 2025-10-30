
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
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

export default function ReportsPage() {
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
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Motorista</TableHead>
                            <TableHead>Veículo</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {completedSchedules.map((schedule) => (
                            <TableRow key={schedule.id}>
                                <TableCell className="font-medium">{schedule.title}</TableCell>
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
                    <p>Nenhuma viagem concluída para exibir.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
