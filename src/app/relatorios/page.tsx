
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, Car, Clock, User } from 'lucide-react';
import { schedules } from '@/lib/data';

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
            Consulte o histórico de deslocamentos e gere relatórios.
          </p>
        </div>
        <Button disabled>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar para PDF
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Deslocamentos Concluídos</CardTitle>
          <CardDescription>
            {completedSchedules.length > 0 
                ? 'Lista de todos os deslocamentos já finalizados.'
                : 'Ainda não há deslocamentos concluídos no histórico.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
            {completedSchedules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedSchedules.map((schedule) => (
                        <Card key={schedule.id}>
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
                    <p>Nenhum deslocamento concluído para exibir.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
