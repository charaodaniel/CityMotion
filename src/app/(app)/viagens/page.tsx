

"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Clock, PlusCircle, User, Play, CheckSquare, Ban, Gauge, ClipboardCheck, ClipboardX, MessageSquareText, Check, Fuel } from 'lucide-react';
import { drivers as initialDrivers, vehicles as initialVehicles } from '@/lib/data';
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
import { useApp } from '@/contexts/app-provider';

type ModalState = 'details' | 'finish' | 'start-checklist' | 'form' | 'refueling' | null;

const startChecklistItems = [
    'Nível de óleo e água verificado',
    'Calibragem dos pneus verificada',
    'Documentos do veículo (CRLV) conferidos',
    'Limpeza interna e externa adequada'
];

const finishChecklistItems = [
    'Veículo estacionado em local seguro',
    'Chaves entregues ao setor responsável',
    'Veículo sem novos danos aparentes',
    'Veículo deixado limpo e organizado',
];


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
  const { schedules, setSchedules, userRole, vehicles, setVehicles, drivers, setDrivers } = useApp();

  const [activeModal, setActiveModal] = useState<ModalState>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [startMileage, setStartMileage] = useState<number | undefined>();
  const [finalMileage, setFinalMileage] = useState<number | undefined>();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  
  const { toast } = useToast();

  const managerSector = "Secretaria de Obras"; // Simulating manager's sector for filtering
  const currentDriverName = "Maria Oliveira"; // Simulating driver 'Maria Oliveira'

  const visibleSchedules = useMemo(() => {
    if (userRole === 'driver') {
      return schedules.filter(s => s.driver === currentDriverName);
    }
    if (userRole === 'manager') {
      const sectorVehicles = vehicles.filter(v => v.sector === managerSector).map(v => v.licensePlate);
      return schedules.filter(s => sectorVehicles.some(plate => s.vehicle.includes(plate)));
    }
    return schedules;
  }, [schedules, vehicles, userRole, managerSector, currentDriverName]);

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
      setNotes('');
  }

  const updateScheduleStatus = (scheduleId: string, newStatus: ScheduleStatus, details?: { startNotes?: string, endNotes?: string, startMileage?: number, endMileage?: number, startChecklist?: string[], endChecklist?: string[] }) => {
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
    } else if (newStatus === 'Concluída' && driver && vehicle && details?.endMileage) {
      updatedDrivers = drivers.map(d => d.id === driver.id ? { ...d, status: 'Disponível' } : d);
      updatedVehicles = vehicles.map(v => v.id === vehicle.id ? { ...v, status: 'Disponível', mileage: details.endMileage! } : v);
      toast({ title: "Viagem finalizada!", description: `A viagem "${schedule.title}" foi concluída com sucesso.` });
    } else if (newStatus === 'Cancelada') {
       toast({ title: "Viagem cancelada", description: `A viagem "${schedule.title}" foi cancelada.`, variant: 'destructive' });
    }

    updatedSchedules = schedules.map(s => s.id === scheduleId ? {
      ...s,
      status: newStatus,
      ...(newStatus === 'Em Andamento' && {
        startMileage: details?.startMileage,
        startNotes: details?.startNotes,
        startChecklist: details?.startChecklist
      }),
      ...(newStatus === 'Concluída' && {
        endMileage: details?.endMileage,
        endNotes: details?.endNotes,
        endChecklist: details?.endChecklist,
        arrivalTime: new Date().toLocaleString('pt-BR'),
      }),
    } : s);

    setSchedules(updatedSchedules);
    setDrivers(updatedDrivers);
    setVehicles(updatedVehicles);
  };

  const handleStartTrip = () => {
    if (!selectedSchedule) return;
    updateScheduleStatus(selectedSchedule.id, 'Em Andamento', { startNotes: notes, startMileage: startMileage, startChecklist: checkedItems });
    closeModal();
  };

  const handleFinishTrip = () => {
    if (!selectedSchedule || !finalMileage) return;
    updateScheduleStatus(selectedSchedule.id, 'Concluída', { endNotes: notes, endMileage: finalMileage, endChecklist: checkedItems });
    closeModal();
  };
  
  const handleCancelTrip = (scheduleId: string) => {
    updateScheduleStatus(scheduleId, 'Cancelada');
    closeModal();
  };

  const handleOpenChecklistModal = (schedule: Schedule) => {
    const vehicle = vehicles.find(v => schedule.vehicle.includes(v.licensePlate));
    setStartMileage(vehicle?.mileage);
    openModal('start-checklist', schedule);
  };

  const handleOpenFinishModal = (schedule: Schedule) => {
    setFinalMileage(schedule.startMileage);
    openModal('finish', schedule);
  };
  
  const handleChecklistItem = (item: string) => {
    setCheckedItems(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  }

  const handleRefuelingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form data submission, e.g., send to a server.
    toast({
        title: "Abastecimento Registrado",
        description: "As informações de abastecimento foram salvas com sucesso."
    });
    closeModal();
  }

  const allSchedules = visibleSchedules.filter(s => s.status !== 'Cancelada');
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
                            <span className="text-sm font-semibold text-muted-foreground">Status</span>
                            <div>
                                <Badge variant={getStatusVariant(selectedSchedule.status)}>{selectedSchedule.status}</Badge>
                            </div>
                        </div>
                        <Separator />
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

                      {(selectedSchedule.status === 'Em Andamento' || selectedSchedule.status === 'Concluída') && selectedSchedule.startChecklist && (
                        <>
                          <Separator />
                           <div>
                            <span className="text-sm font-semibold text-muted-foreground flex items-center mb-2">
                              <ClipboardCheck className="mr-2 h-4 w-4" />
                              Checklist de Partida
                            </span>
                            <div className='space-y-1 text-sm'>
                              {selectedSchedule.startChecklist.map((item, index) => (
                                <div key={index} className="flex items-center">
                                  <Check className="h-4 w-4 mr-2 text-green-500" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                           </div>
                           {selectedSchedule.startNotes && (
                            <div className='mt-2'>
                              <span className="text-sm font-semibold text-muted-foreground flex items-center">
                                <MessageSquareText className="mr-2 h-4 w-4" />
                                Observações de Partida
                              </span>
                              <p className="text-sm mt-1 p-3 bg-muted/50 rounded-md">{selectedSchedule.startNotes}</p>
                            </div>
                          )}
                        </>
                      )}

                       {selectedSchedule.status === 'Concluída' && selectedSchedule.endChecklist && (
                        <>
                          <Separator />
                          <div>
                            <span className="text-sm font-semibold text-muted-foreground flex items-center mb-2">
                              <ClipboardX className="mr-2 h-4 w-4" />
                              Checklist de Chegada
                            </span>
                            <div className='space-y-1 text-sm'>
                               {selectedSchedule.endChecklist.map((item, index) => (
                                <div key={index} className="flex items-center">
                                  <Check className="h-4 w-4 mr-2 text-green-500" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                           </div>
                           {selectedSchedule.endNotes && (
                            <div className='mt-2'>
                              <span className="text-sm font-semibold text-muted-foreground flex items-center">
                                <MessageSquareText className="mr-2 h-4 w-4" />
                                Observações de Chegada
                              </span>
                              <p className="text-sm mt-1 p-3 bg-muted/50 rounded-md">{selectedSchedule.endNotes}</p>
                            </div>
                          )}
                        </>
                      )}

                        <div className='pt-4 flex justify-end gap-2'>
                            {selectedSchedule.status === 'Agendada' && (
                                <Button onClick={() => openModal('start-checklist', selectedSchedule)}>
                                    <ClipboardCheck className="mr-2 h-4 w-4"/>
                                    Ver Checklist
                                </Button>
                            )}
                             {selectedSchedule.status === 'Em Andamento' && (
                                <Button variant="outline" onClick={() => openModal('refueling', selectedSchedule)}>
                                    <Fuel className="mr-2 h-4 w-4" />
                                    Registrar Abastecimento
                                </Button>
                            )}
                        </div>
                  </div>
                  </>
              )}
              </ScrollArea>
          </DialogContent>
      </Dialog>
      
      {/* Finish Trip Modal (Post-Checklist) */}
       <Dialog open={activeModal === 'finish'} onOpenChange={() => closeModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center"><ClipboardX className="mr-2 h-5 w-5" />Checklist de Pós-Viagem</DialogTitle>
            <DialogDescription>Verifique todos os itens para finalizar a viagem.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                    <Gauge className="h-5 w-5 text-muted-foreground"/>
                    <Label htmlFor="finalMileage">Quilometragem Final</Label>
                </div>
                <Input
                id="finalMileage"
                type="number"
                value={finalMileage}
                onChange={(e) => setFinalMileage(Number(e.target.value))}
                placeholder="KM final do veículo"
                />
            </div>
            <Separator />
             {finishChecklistItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox 
                  id={`finish-checklist-${index}`}
                  onCheckedChange={() => handleChecklistItem(item)}
                  checked={checkedItems.includes(item)}
                />
                <label htmlFor={`finish-checklist-${index}`} className="text-sm font-medium">
                  {item}
                </label>
              </div>
            ))}
            <Separator />
             <div className="space-y-2">
                <Label htmlFor="finish-notes">Observações Finais (opcional)</Label>
                <Textarea 
                    id="finish-notes"
                    placeholder="Relate qualquer problema ou ocorrência durante a viagem."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => closeModal()}>Cancelar</Button>
            <Button 
                onClick={handleFinishTrip} 
                disabled={checkedItems.length < finishChecklistItems.length || !finalMileage}
            >
                Confirmar Finalização
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Start Checklist Modal */}
      <Dialog open={activeModal === 'start-checklist'} onOpenChange={() => closeModal()}>
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
            {startChecklistItems.map((item, index) => (
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
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
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
                disabled={checkedItems.length < startChecklistItems.length || !startMileage}
                >
                <Play className="mr-2 h-4 w-4"/> Iniciar Viagem
                </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

       {/* Refueling Modal */}
      <Dialog open={activeModal === 'refueling'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Fuel className="mr-2 h-5 w-5" />
              Registrar Abastecimento
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do abastecimento realizado durante a viagem.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRefuelingSubmit} className="py-4 space-y-4">
             <div className="space-y-2">
                <Label htmlFor="refuel-mileage">Quilometragem</Label>
                <Input id="refuel-mileage" type="number" placeholder="KM no momento do abastecimento" required />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="refuel-liters">Litros</Label>
                    <Input id="refuel-liters" type="number" step="0.01" placeholder="0.00" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="refuel-price">Valor Total (R$)</Label>
                    <Input id="refuel-price" type="number" step="0.01" placeholder="0.00" required />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="refuel-receipt">Foto do Recibo (Opcional)</Label>
                <Input id="refuel-receipt" type="file" accept="image/*" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="refuel-notes">Observações (Opcional)</Label>
              <Textarea id="refuel-notes" placeholder="Ex: Posto Shell da Av. Principal" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeModal}>Cancelar</Button>
                <Button type="submit">Salvar Registro</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
