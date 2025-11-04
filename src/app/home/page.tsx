
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { WorkSchedule, WorkScheduleStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/app-provider';
import { CalendarDays, Clock, User } from 'lucide-react';
import Loading from '@/app/loading';

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

export default function HomePage() {
  const { workSchedules, currentUser, isLoading: isAppLoading } = useApp();
  const router = useRouter();
  const [selectedSchedule, setSelectedSchedule] = useState<WorkSchedule | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // We only check for redirection after the app has finished loading its initial data.
    if (!isAppLoading) {
      if (currentUser) {
        router.replace('/dashboard');
      } else {
        // If not logged in, show the public page.
        setIsCheckingAuth(false);
      }
    }
  }, [currentUser, isAppLoading, router]);


  const handleCardClick = (schedule: WorkSchedule) => {
    setSelectedSchedule(schedule);
  };

  const closeDetailsModal = () => {
    setSelectedSchedule(null);
  };
  
  if (isAppLoading || isCheckingAuth) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Escalas de Trabalho Públicas
          </h1>
          <p className="text-muted-foreground">
            Acompanhe as escalas, plantões e jornadas dos funcionários da prefeitura.
          </p>
        </div>
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
                        <CardDescription asChild className="flex items-center text-xs pt-1">
                           <div>
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
            <p className="text-lg">Nenhuma escala pública para exibir no momento.</p>
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
                      Detalhes da escala de trabalho.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4 pr-4">
                     <div>
                        <span className="text-sm font-semibold text-muted-foreground">Tipo</span>
                        <p className="text-lg">{selectedSchedule.type}</p>
                    </div>
                    <Separator />
                    <div>
                        <span className="text-sm font-semibold text-muted-foreground">Funcionário</span>
                        <p className="text-lg">{selectedSchedule.employee}</p>
                    </div>
                    <Separator />
                     <div>
                        <span className="text-sm font-semibold text-muted-foreground">Período</span>
                        <p className="text-lg">{selectedSchedule.startDate} até {selectedSchedule.endDate}</p>
                    </div>
                    <Separator />
                    {selectedSchedule.description && (
                      <>
                        <div>
                          <span className="text-sm font-semibold text-muted-foreground">Observações</span>
                          <p className="text-base mt-1">{selectedSchedule.description}</p>
                        </div>
                        <Separator />
                      </>
                    )}
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
