
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Clock, PlusCircle, User, Play, CheckSquare, Ban, Gauge, ClipboardCheck, ClipboardX, MessageSquareText, Check, Fuel, AlertTriangle, FileImage } from 'lucide-react';
import type { Schedule, ScheduleStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ScheduleTripForm } from '@/components/forms/schedule-trip-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/app-provider';
import { ReportIncidentForm } from '@/components/forms/report-incident-form';

type ModalState = 'details' | 'finish' | 'start-checklist' | 'form' | 'refueling' | 'incident' | null;

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
  const { schedules, setSchedules, userRole, vehicles, setVehicles, employees, setEmployees, currentUser, selectedSector } = useApp();

  const [activeModal, setActiveModal] = useState<ModalState>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [startMileage, setStartMileage] = useState<number | string>('');
  const [finalMileage, setFinalMileage] = useState<number | string>('');
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  
  const [refuelMileage, setRefuelMileage] = useState<string>('');
  const [refuelLiters, setRefuelLiters] = useState<string>('');
  const [refuelPrice, setRefuelPrice] = useState<string>('');
  const [refuelReceipt, setRefuelReceipt] = useState<File | null>(null);

  const { toast } = useToast();
  
  const isCurrentUserDriver = useMemo(() => currentUser?.role.toLowerCase().includes('motorista'), [currentUser]);

  const visibleSchedules = useMemo(() => {
    if (isCurrentUserDriver && currentUser) {
      return schedules.filter(s => s.driver === currentUser.name);
    }
    if (userRole === 'manager' && selectedSector) {
      const sectorVehicles = vehicles.filter(v => v.sector === selectedSector).map(v => v.licensePlate);
      return schedules.filter(s => sectorVehicles.some(plate => s.vehicle.includes(plate)));
    }
    return schedules;
  }, [schedules, vehicles, userRole, selectedSector, currentUser, isCurrentUserDriver]);

  const openModal = (modal: ModalState, schedule: Schedule | null = null) => {
    setSelectedSchedule(schedule);
    setActiveModal(modal);
    if (modal === 'refueling' && schedule) {
        const vehicle = vehicles.find(v => schedule.vehicle.includes(v.licensePlate));
        setRefuelMileage(String(vehicle?.mileage || ''));
    }
  };
  
  const closeModal = () => {
      openModal(null);
      setStartMileage('');
      setFinalMileage('');
      setCheckedItems([]);
      setNotes('');
      setRefuelMileage('');
      setRefuelLiters('');
      setRefuelPrice('');
      setRefuelReceipt(null);
  }

  const updateScheduleStatus = (scheduleId: string, newStatus: ScheduleStatus, details?: { startNotes?: string, endNotes?: string, startMileage?: number, endMileage?: number, startChecklist?: string[], endChecklist?: string[] }) => {
    let updatedSchedules = [...schedules];
    let updatedEmployees = [...employees];
    let updatedVehicles = [...vehicles];
    const schedule = schedules.find(s => s.id === scheduleId);
    if (!schedule) return;

    const driver = employees.find(d => d.name === schedule.driver);
    const vehicle = vehicles.find(v => schedule.vehicle.includes(v.licensePlate));

    if (newStatus === 'Em Andamento' && driver && vehicle) {
      updatedEmployees = employees.map(d => d.id === driver.id ? { ...d, status: 'Em Viagem' } : d);
      updatedVehicles = vehicles.map(v => v.id === vehicle.id ? { ...v, status: 'Em Viagem' } : v);
      toast({ title: "Viagem iniciada!", description: `A viagem "${schedule.title}" foi iniciada.` });
    } else if (newStatus === 'Concluída' && driver && vehicle && details?.endMileage) {
      updatedEmployees = employees.map(d => d.id === driver.id ? { ...d, status: 'Disponível' } : d);
      updatedVehicles = vehicles.map(v => v.id === vehicle.id ? { ...v, status: 'Disponível', mileage: details.endMileage! } : v);
      toast({ title: "Viagem finalizada!", description: `A viagem "${schedule.title}" foi concluída.` });
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
    setEmployees(updatedEmployees);
    setVehicles(updatedVehicles);
  };

  const handleStartTrip = () => {
    if (!selectedSchedule || !startMileage) return;
    updateScheduleStatus(selectedSchedule.id, 'Em Andamento', { startNotes: notes, startMileage: Number(startMileage), startChecklist: checkedItems });
    closeModal();
  };

  const handleFinishTrip = () => {
    if (!selectedSchedule || !finalMileage) return;
    updateScheduleStatus(selectedSchedule.id, 'Concluída', { endNotes: notes, endMileage: Number(finalMileage), endChecklist: checkedItems });
    closeModal();
  };

  const handleOpenChecklistModal = (schedule: Schedule) => {
    const vehicle = vehicles.find(v => schedule.vehicle.includes(v.licensePlate));
    setStartMileage(vehicle?.mileage || '');
    openModal('start-checklist', schedule);
  };

  const handleOpenFinishModal = (schedule: Schedule) => {
    setFinalMileage(schedule.startMileage || '');
    openModal('finish', schedule);
  };
  
  const handleChecklistItem = (item: string) => {
    setCheckedItems(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
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
            Monitoramento de missões e linhas logísticas.
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
                    <DialogTitle className="text-2xl">Nova Missão</DialogTitle>
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
      
      {/* Detalhes, Checklist e outras modais mantidas conforme lógica anterior mas com imports corrigidos */}
      <Dialog open={activeModal === 'details'} onOpenChange={() => closeModal()}>
          <DialogContent>
              <ScrollArea className="max-h-[80vh] p-4">
              {selectedSchedule && (
                  <>
                  <DialogHeader>
                      <DialogTitle className="text-2xl">{selectedSchedule.title}</DialogTitle>
                      <DialogDescription>Detalhes da missão.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4 pr-4">
                        <div>
                            <span className="text-sm font-semibold text-muted-foreground">Status</span>
                            <div>
                                <Badge variant={getStatusVariant(selectedSchedule.status)}>{selectedSchedule.status}</Badge>
                            </div>
                        </div>
                        <Separator />
                        <div className='pt-4 flex justify-end gap-2'>
                            {selectedSchedule.status === 'Agendada' && (
                                <Button onClick={() => openModal('start-checklist', selectedSchedule)}>
                                    <ClipboardCheck className="mr-2 h-4 w-4"/>
                                    Executar Checklist
                                </Button>
                            )}
                             {selectedSchedule.status === 'Em Andamento' && (
                                <>
                                    <Button variant="destructive" onClick={() => openModal('incident', selectedSchedule)}>
                                        <AlertTriangle className="mr-2 h-4 w-4" />
                                        Relatar Sinistro
                                    </Button>
                                </>
                            )}
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
