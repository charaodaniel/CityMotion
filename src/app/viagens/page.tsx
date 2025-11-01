
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Clock, PlusCircle, User, Play, CheckSquare, Ban, Gauge, ClipboardCheck } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

type ModalState = 'details' | 'finish' | 'checklist' | 'form' | null;

function getStatusVariant(status: ScheduleStatus) {
    switch (status) {
      case 'Agendada':
        return 'secondary';
      case 'Em Andamento':
        return 'default';
      case 'Concluída':
        return 'outline';
      case 'Cancelada':
        return 'destructive';
      default:
        return 'outline';
    }
}

const statusColumns: { title: string; status: ScheduleStatus }[] = [
    { title: 'Agendadas', status: 'Agendada' },
    { title: 'Em Andamento', status: 'Em Andamento' },
    { title: 'Concluídas', status: 'Concluída' },
];

function TripsView({ 
    schedules, 
    onCardClick, 
    onOpenChecklistModal,
    onOpenFinishModal 
}: { 
    schedules: Schedule[], 
    onCardClick: (schedule: Schedule) => void,
    onOpenChecklistModal: (schedule: Schedule) => void;
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
                                            <Button size="sm" className="w-full" onClick={() => onOpenChecklistModal(schedule)}>
                                                <Play className="mr-2 h-4 w-4"/> Iniciar
                                            </Button>
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
                                Nenhuma viagem nesta etapa.
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function ViagensPage() {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);

  const [activeModal, setActiveModal] = useState<ModalState>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [startMileage, setStartMileage] = useState<number | undefined>();
  const [finalMileage, setFinalMileage] = useState<number | undefined>();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [checklistNotes, setChecklistNotes] = useState('');
  
  const { toast } = useToast();

  const checklistItemsData = [
    'Nível de óleo e água verificado',
    'Calibragem dos pneus verificada',
    'Documentos do veículo (CRLV) conferidos',
    'Limpeza interna e externa adequada'
  ];

  const openModal = (modal: ModalState, schedule: Schedule | null = null) => {
    setSelectedSchedule(schedule);
    setActiveModal(modal);
  };
  
  const closeModal = () => {
      openModal(null);
      // Reset dependent states
      setStartMileage(undefined);
      setFinalMileage(undefined);
      setCheckedItems([]);
      setChecklistNotes('');
  }

  const updateScheduleStatus = (scheduleId: string, newStatus: ScheduleStatus) => {
    let updatedSchedules = [...schedules];
    let updatedDrivers = [...drivers];
    let updatedVehicles = [...vehicles];
    const schedule = schedules.find(s => s.id === scheduleId);
    if (!schedule) return;

    const driver = drivers.find(d => d.name === schedule.driver);
    const vehicle = vehicles.find(v => schedule.vehicle.includes(v.licensePlate));

    if (newStatus === 'Em Andamento' && driver && vehicle) {
      updatedDrivers = drivers.map(d => d.id === driver.id ? { ...d, status: 'Em Viagem' } : d);
      updatedVehicles = vehicles.map(v => v.id === vehicle.id ? { ...v, status: 'Em Viagem' } : v);
      toast({ title: "Viagem iniciada!", description: `A viagem "${schedule.title}" foi marcada como "Em Andamento".` });
    } else if (newStatus === 'Concluída' && driver && vehicle && finalMileage) {
      updatedDrivers = drivers.map(d => d.id === driver.id ? { ...d, status: 'Disponível' } : d);
      updatedVehicles = vehicles.map(v => v.id === vehicle.id ? { ...v, status: 'Disponível', mileage: finalMileage } : v);
      toast({ title: "Viagem finalizada!", description: `A viagem "${schedule.title}" foi concluída com sucesso.` });
    } else if (newStatus === 'Cancelada') {
       toast({ title: "Viagem cancelada", description: `A viagem "${schedule.title}" foi cancelada.`, variant: 'destructive' });
    }

    updatedSchedules = schedules.map(s => s.id === scheduleId ? {
      ...s,
      status: newStatus,
      ...(newStatus === 'Concluída' && {
        endMileage: finalMileage,
        arrivalTime: new Date().toLocaleString('pt-BR'),
      }),
      ...(newStatus === 'Em Andamento' && {
        startMileage: startMileage,
        notes: checklistNotes,
      })
    } : s);

    setSchedules(updatedSchedules);
    setDrivers(updatedDrivers);
    setVehicles(updatedVehicles);
  };

  const handleStartTrip = () => {
    if (!selectedSchedule) return;
    updateScheduleStatus(selectedSchedule.id, 'Em Andamento');
    closeModal();
  };

  const handleFinishTrip = () => {
    if (!selectedSchedule || !finalMileage) return;
    updateScheduleStatus(selectedSchedule.id, 'Concluída');
    closeModal();
  };
  
  const handleCancelTrip = (scheduleId: string) => {
    updateScheduleStatus(scheduleId, 'Cancelada');
    closeModal();
  };

  const handleOpenChecklistModal = (schedule: Schedule) => {
    const vehicle = vehicles.find(v => schedule.vehicle.includes(v.licensePlate));
    setStartMileage(vehicle?.mileage);
    openModal('checklist', schedule);
  };

  const handleOpenFinishModal = (schedule: Schedule) => {
    setFinalMileage(schedule.startMileage);
    openModal('finish', schedule);
  };
  
  const handleChecklistItem = (item: string) => {
    setCheckedItems(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  }

  const allSchedules = schedules.filter(s => s.status !== 'Cancelada');
  const schoolSchedules = allSchedules.filter(s => s.category.toLowerCase().includes('escolar'));
  const generalSchedules = allSchedules.filter(s => !s.category.toLowerCase().includes('escolar'));

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Painel de Viagens
          </h1>
          <p className="text-muted-foreground">
            Acompanhe o status de todas as viagens e linhas escolares.
          </p>
        </div>
        <Dialog open={activeModal === 'form'} onOpenChange={() => closeModal()}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => openModal('form')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Agendar Viagem
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Agendar Nova Viagem</DialogTitle>
                    <DialogDescription>
                        Preencha o formulário para solicitar um veículo e agendar uma viagem.
                    </DialogDescription>
                </DialogHeader>
                 <ScrollArea className="max-h-[70vh] p-4">
                    <ScheduleTripForm onFormSubmit={() => closeModal()}/>
                </ScrollArea>
            </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Viagens Gerais ({generalSchedules.length})</TabsTrigger>
          <TabsTrigger value="school">Linhas Escolares ({schoolSchedules.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <TripsView 
            schedules={generalSchedules} 
            onCardClick={(schedule) => openModal('details', schedule)}
            onOpenChecklistModal={handleOpenChecklistModal}
            onOpenFinishModal={handleOpenFinishModal}
            />
        </TabsContent>
        <TabsContent value="school">
          <TripsView 
            schedules={schoolSchedules} 
            onCardClick={(schedule) => openModal('details', schedule)}
            onOpenChecklistModal={handleOpenChecklistModal}
            onOpenFinishModal={handleOpenFinishModal}
            />
        </TabsContent>
      </Tabs>
      
      {/* Details Modal */}
      <Dialog open={activeModal === 'details'} onOpenChange={() => closeModal()}>
          <DialogContent>
              <ScrollArea className="max-h-[80vh] p-4">
              {selectedSchedule && (
                  <>
                  <DialogHeader>
                      <DialogTitle className="text-2xl">{selectedSchedule.title}</DialogTitle>
                      <DialogDescription>
                      Detalhes da viagem agendada.
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
                      {selectedSchedule.status === 'Agendada' && (
                        <div className='pt-4 flex justify-end'>
                            <Button onClick={() => openModal('checklist', selectedSchedule)}>
                                <ClipboardCheck className="mr-2 h-4 w-4"/>
                                Verificar Checklist
                            </Button>
                        </div>
                      )}
                  </div>
                  </>
              )}
              </ScrollArea>
          </DialogContent>
      </Dialog>
      
      {/* Finish Trip Modal */}
       <Dialog open={activeModal === 'finish'} onOpenChange={() => closeModal()}>
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
            <Button variant="outline" onClick={() => closeModal()}>Cancelar</Button>
            <Button onClick={handleFinishTrip} disabled={!finalMileage}>Confirmar Finalização</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Checklist Modal */}
      <Dialog open={activeModal === 'checklist'} onOpenChange={() => closeModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Checklist de Pré-Viagem
            </DialogTitle>
            <DialogDescription>
              Verifique todos os itens antes de iniciar a viagem para garantir a segurança.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                    <Gauge className="h-5 w-5 text-muted-foreground"/>
                    <Label htmlFor="startMileage">Quilometragem Inicial</Label>
                </div>
                <Input
                    id="startMileage"
                    type="number"
                    value={startMileage}
                    onChange={(e) => setStartMileage(Number(e.target.value))}
                    placeholder="KM inicial do veículo"
                />
            </div>
            <Separator />
            {checklistItemsData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox 
                  id={`checklist-${index}`}
                  onCheckedChange={() => handleChecklistItem(item)}
                  checked={checkedItems.includes(item)}
                />
                <label
                  htmlFor={`checklist-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item}
                </label>
              </div>
            ))}
             <Separator />
            <div className="space-y-2">
                <Label htmlFor="checklist-notes">Observações (opcional)</Label>
                <Textarea 
                    id="checklist-notes"
                    placeholder="Ex: Pequeno arranhão na porta direita."
                    value={checklistNotes}
                    onChange={(e) => setChecklistNotes(e.target.value)}
                />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <Button variant="destructive" onClick={() => handleCancelTrip(selectedSchedule!.id)}>
                <Ban className="mr-2 h-4 w-4" />
                Cancelar Viagem
            </Button>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => closeModal()}>Fechar</Button>
                <Button 
                onClick={handleStartTrip} 
                disabled={checkedItems.length < checklistItemsData.length || !startMileage}
                >
                <Play className="mr-2 h-4 w-4"/> Iniciar Viagem
                </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
