
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Clock, PlusCircle, User, Route, Play, CheckSquare, Ban, Gauge } from 'lucide-react';
import { schedules as initialSchedules, drivers as initialDrivers, vehicles as initialVehicles } from '@/lib/data';
import type { Schedule, ScheduleStatus, Driver, Vehicle } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ScheduleTripForm } from '@/components/schedule-trip-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

function getStatusVariant(status: ScheduleStatus) {
    switch (status) {
      case 'Agendada':
        return 'secondary';
      case 'Em Andamento':
        return 'default';
      case 'Concluída':
        return 'outline';
      case 'Cancelada':
        return 'destructive'
      default:
        return 'outline';
    }
}

const statusColumns: { title: string; status: ScheduleStatus }[] = [
    { title: 'Agendados', status: 'Agendada' },
    { title: 'Em Andamento', status: 'Em Andamento' },
    { title: 'Concluídos', status: 'Concluída' },
];

function DisplacementsView({ 
    schedules, 
    onCardClick, 
    onUpdateSchedule, 
    onOpenFinishModal 
}: { 
    schedules: Schedule[], 
    onCardClick: (schedule: Schedule) => void,
    onUpdateSchedule: (id: string, newStatus: ScheduleStatus) => void;
    onOpenFinishModal: (schedule: Schedule) => void;
}) {
    
    const schedulesByStatus = (status: ScheduleStatus) => {
        return schedules.filter(s => s.status === status);
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {statusColumns.map(column => (
                <div key={column.status} className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold tracking-tight">{column.title} ({schedulesByStatus(column.status).length})</h2>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-4 min-h-[200px]">
                        {schedulesByStatus(column.status).length > 0 ? (
                            schedulesByStatus(column.status).map(schedule => (
                                <Card 
                                    key={schedule.id} 
                                    className="cursor-pointer hover:shadow-md transition-shadow relative"
                                >
                                    <div onClick={() => onCardClick(schedule)}>
                                        <CardHeader className="pb-4">
                                            <CardTitle className="text-base">{schedule.title}</CardTitle>
                                            <CardDescription className="flex items-center text-xs">
                                                <Clock className="mr-1.5 h-3 w-3" /> {schedule.departureTime}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="text-xs space-y-2">
                                            <div className="flex items-center">
                                                <User className="mr-2 h-3 w-3" />
                                                <span>{schedule.driver}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Car className="mr-2 h-3 w-3" />
                                                <span>{schedule.vehicle}</span>
                                            </div>
                                        </CardContent>
                                    </div>
                                    <CardContent className="p-2 pt-0">
                                         {schedule.status === 'Agendada' && (
                                            <div className="flex gap-2">
                                                <Button size="sm" className="w-full" onClick={() => onUpdateSchedule(schedule.id, 'Em Andamento')}>
                                                    <Play className="mr-2 h-4 w-4"/> Iniciar
                                                </Button>
                                                <Button size="sm" variant="destructive" className="w-full" onClick={() => onUpdateSchedule(schedule.id, 'Cancelada')}>
                                                    <Ban className="mr-2 h-4 w-4"/> Cancelar
                                                </Button>
                                            </div>
                                        )}
                                        {schedule.status === 'Em Andamento' && (
                                            <Button size="sm" className="w-full" onClick={() => onOpenFinishModal(schedule)}>
                                                <CheckSquare className="mr-2 h-4 w-4"/> Finalizar
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                Nenhum deslocamento nesta etapa.
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function DeslocamentosPage() {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [finalMileage, setFinalMileage] = useState<number | undefined>();
  
  const { toast } = useToast();

  const handleCardClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsDetailsModalOpen(true);
  };
  
  const handleUpdateSchedule = (id: string, newStatus: ScheduleStatus) => {
      setSchedules(schedules.map(s => {
          if (s.id === id) {
              const driver = drivers.find(d => d.name === s.driver);
              const vehicle = vehicles.find(v => s.vehicle.includes(v.licensePlate));

              if (newStatus === 'Em Andamento' && driver && vehicle) {
                  setDrivers(drivers.map(d => d.id === driver.id ? { ...d, status: 'Em Viagem' } : d));
                  setVehicles(vehicles.map(v => v.id === vehicle.id ? { ...v, status: 'Em Viagem' } : v));
                  toast({ title: "Viagem iniciada!", description: `A viagem "${s.title}" foi marcada como "Em Andamento".` });
              }
              if (newStatus === 'Cancelada') {
                  toast({ title: "Viagem cancelada", description: `A viagem "${s.title}" foi cancelada.`, variant: 'destructive' });
              }

              return { ...s, status: newStatus };
          }
          return s;
      }));
  };
  
  const handleOpenFinishModal = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    const vehicle = vehicles.find(v => schedule.vehicle.includes(v.licensePlate));
    setFinalMileage(vehicle?.mileage);
    setIsFinishModalOpen(true);
  };
  
  const handleFinishTrip = () => {
    if (!selectedSchedule || !finalMileage) return;

    setSchedules(schedules.map(s => {
        if (s.id === selectedSchedule.id) {
            const driver = drivers.find(d => d.name === s.driver);
            const vehicle = vehicles.find(v => s.vehicle.includes(v.licensePlate));

            if (driver && vehicle) {
                setDrivers(drivers.map(d => d.id === driver.id ? { ...d, status: 'Disponível' } : d));
                setVehicles(vehicles.map(v => v.id === vehicle.id ? { ...v, status: 'Disponível', mileage: finalMileage } : v));
            }

            toast({ title: "Viagem finalizada!", description: `A viagem "${s.title}" foi concluída com sucesso.` });
            
            return {
                ...s,
                status: 'Concluída' as ScheduleStatus,
                endMileage: finalMileage,
                startMileage: vehicle?.mileage,
                arrivalTime: new Date().toLocaleString('pt-BR'),
            };
        }
        return s;
    }));
    setIsFinishModalOpen(false);
    setSelectedSchedule(null);
    setFinalMileage(undefined);
  };

  const handleFormSubmit = () => {
      // Logic to add new schedule will be here
      setIsFormModalOpen(false);
  }

  const allSchedules = schedules.filter(s => s.status !== 'Cancelada');
  const schoolSchedules = allSchedules.filter(s => s.category.toLowerCase().includes('escolar'));
  const generalSchedules = allSchedules.filter(s => !s.category.toLowerCase().includes('escolar'));

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Painel de Deslocamentos
          </h1>
          <p className="text-muted-foreground">
            Acompanhe o status de todos os deslocamentos e linhas escolares.
          </p>
        </div>
        <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Agendar Deslocamento
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Agendar Novo Deslocamento</DialogTitle>
                    <DialogDescription>
                        Preencha o formulário para solicitar um veículo e agendar um deslocamento.
                    </DialogDescription>
                </DialogHeader>
                 <ScrollArea className="max-h-[70vh] p-4">
                    <ScheduleTripForm onFormSubmit={() => setIsFormModalOpen(false)}/>
                </ScrollArea>
            </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Deslocamentos Gerais ({generalSchedules.length})</TabsTrigger>
          <TabsTrigger value="school">Linhas Escolares ({schoolSchedules.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <DisplacementsView 
            schedules={generalSchedules} 
            onCardClick={handleCardClick} 
            onUpdateSchedule={handleUpdateSchedule}
            onOpenFinishModal={handleOpenFinishModal}
            />
        </TabsContent>
        <TabsContent value="school">
          <DisplacementsView 
            schedules={schoolSchedules} 
            onCardClick={handleCardClick}
            onUpdateSchedule={handleUpdateSchedule}
            onOpenFinishModal={handleOpenFinishModal}
            />
        </TabsContent>
      </Tabs>
      
      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent>
              <ScrollArea className="max-h-[80vh] p-4">
              {selectedSchedule && (
                  <>
                  <DialogHeader>
                      <DialogTitle className="text-2xl">{selectedSchedule.title}</DialogTitle>
                      <DialogDescription>
                      Detalhes do deslocamento agendado.
                      </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4 pr-4">
                      <div>
                          <span className="text-sm font-semibold text-muted-foreground">Motorista</span>
                          <p className="text-lg">{selectedSchedule.driver}</p>
                      </div>
                      <Separator />
                      <div>
                          <span className="text-sm font-semibold text-muted-foreground">Veículo</span>
                          <p className="text-lg">{selectedSchedule.vehicle}</p>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <span className="text-sm font-semibold text-muted-foreground">Origem</span>
                              <p className="text-lg">{selectedSchedule.origin}</p>
                          </div>
                          <div>
                              <span className="text-sm font-semibold text-muted-foreground">Destino</span>
                              <p className="text-lg">{selectedSchedule.destination}</p>
                          </div>
                      </div>
                      <Separator />
                      <div>
                          <span className="text-sm font-semibold text-muted-foreground">Data e Horário</span>
                          <p className="text-lg">{selectedSchedule.departureTime}</p>
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
      
      {/* Finish Trip Modal */}
       <Dialog open={isFinishModalOpen} onOpenChange={setIsFinishModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Viagem</DialogTitle>
            <DialogDescription>Confirme a finalização da viagem e informe a quilometragem final.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
              <div className="flex items-baseline gap-2">
                <Gauge className="h-5 w-5 text-muted-foreground"/>
                <Label htmlFor="finalMileage" className="text-right">
                  Quilometragem Final
                </Label>
              </div>
            <Input
              id="finalMileage"
              type="number"
              value={finalMileage}
              onChange={(e) => setFinalMileage(Number(e.target.value))}
              placeholder="KM final do veículo"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsFinishModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleFinishTrip}>Confirmar Finalização</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
