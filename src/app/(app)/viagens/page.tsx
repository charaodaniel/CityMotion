"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Clock, PlusCircle, User, Play, CheckSquare, Gauge, ClipboardCheck, AlertTriangle } from 'lucide-react';
import type { Schedule, ScheduleStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ScheduleTripForm } from '@/components/forms/schedule-trip-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/app-provider';
import { ReportIncidentForm } from '@/components/forms/report-incident-form';
import dynamic from 'next/dynamic';
import { useDriverLocation } from '@/hooks/use-driver-location';
import { MapIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const DriverMap = dynamic(() => import('@/components/driver-map'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] rounded-lg border border-border/50 bg-sidebar/50 flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <MapIcon className="h-8 w-8 mx-auto mb-2 animate-pulse" />
        <p className="text-xs font-mono uppercase tracking-widest">Carregando mapa...</p>
      </div>
    </div>
  ),
});

type ModalState = 'details' | 'finish' | 'start-checklist' | 'form' | 'refueling' | 'incident' | null;

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {statusColumns.map(column => (
                <div key={column.status} className="flex flex-col gap-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-primary/70 px-2">{column.title} ({schedulesByStatus(column.status).length})</h2>
                    <div className="bg-sidebar/30 rounded-xl p-4 space-y-4 min-h-[300px] border border-border/50 scanlines">
                        {schedulesByStatus(column.status).length > 0 ? (
                            schedulesByStatus(column.status).map(schedule => (
                                <Card 
                                    key={schedule.id} 
                                    className="cursor-pointer hover:border-primary transition-all duration-300 bg-sidebar/80 border-border/50 group"
                                >
                                    <div onClick={() => onCardClick(schedule)} className="p-4 pb-2">
                                        <CardHeader className="p-0 mb-4">
                                            <CardTitle className="text-base font-bold tracking-tight">{schedule.title}</CardTitle>
                                            <CardDescription className="flex items-center text-[10px] font-mono font-bold uppercase tracking-widest text-primary/60 mt-1">
                                                <Clock className="mr-1.5 h-3 w-3" /> {schedule.departureTime}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-0 space-y-2">
                                            <div className="flex items-center text-[11px] text-muted-foreground">
                                                <User className="mr-2 h-3.5 w-3.5 text-primary/40" />
                                                <span className="truncate">{schedule.driver}</span>
                                            </div>
                                            <div className="flex items-center text-[11px] text-muted-foreground">
                                                <Car className="mr-2 h-3.5 w-3.5 text-primary/40" />
                                                <span className="truncate">{schedule.vehicle}</span>
                                            </div>
                                        </CardContent>
                                    </div>
                                    <CardContent className="p-2 pt-0 border-t border-border/10 mt-2 bg-black/20">
                                         {schedule.status === 'Agendada' && (
                                            <Button size="sm" variant="ghost" className="w-full h-8 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => onOpenChecklistModal(schedule)}>
                                                <Play className="mr-2 h-3 w-3"/> Iniciar Missão
                                            </Button>
                                        )}
                                        {schedule.status === 'Em Andamento' && (
                                            <Button size="sm" variant="ghost" className="w-full h-8 text-[10px] font-bold uppercase tracking-widest text-emerald-400 hover:bg-emerald-500 hover:text-white" onClick={() => onOpenFinishModal(schedule)}>
                                                <CheckSquare className="mr-2 h-3 w-3"/> Finalizar
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full text-[10px] uppercase tracking-widest text-muted-foreground opacity-30 italic">
                                Sem registros
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

  // Mapa e geolocalização
  const activeTrips = useMemo(() => 
    schedules.filter(s => s.status === 'Em Andamento'),
    [schedules]
  );
  
  const {
    driverLocations,
    isTracking,
    startTracking,
    stopTracking,
  } = useDriverLocation(
    activeTrips,
    currentUser?.id,
    currentUser?.name
  );

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
  };
  
  const closeModal = () => {
      openModal(null);
      setStartMileage('');
      setFinalMileage('');
      setCheckedItems([]);
      setNotes('');
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

  const handleOpenChecklistModal = (schedule: Schedule) => {
    const vehicle = vehicles.find(v => schedule.vehicle.includes(v.licensePlate));
    setStartMileage(vehicle?.mileage || '');
    openModal('start-checklist', schedule);
  };

  const handleOpenFinishModal = (schedule: Schedule) => {
    setFinalMileage(schedule.startMileage || '');
    openModal('finish', schedule);
  };
  
  const allSchedules = visibleSchedules.filter(s => s.status !== 'Cancelada');
  const schoolSchedules = allSchedules.filter(s => s.category.toLowerCase().includes('escolar'));
  const generalSchedules = allSchedules.filter(s => !s.category.toLowerCase().includes('escolar'));

  return (
    <div className="container mx-auto p-4 sm:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-on-surface flex items-center gap-4">
            <Gauge className="h-10 w-10 text-primary" />
            Missões
          </h1>
          <p className="text-muted-foreground text-lg mt-1 font-medium">
            Monitoramento de tráfego e logística operacional.
          </p>
        </div>
        <Dialog open={activeModal === 'form'} onOpenChange={() => closeModal()}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 rounded-lg font-bold uppercase tracking-widest text-xs" onClick={() => openModal('form')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Agendar Viagem
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl border-border/50 bg-sidebar p-0 overflow-hidden">
                <div className="h-1.5 w-full bg-primary" />
                <ScrollArea className="max-h-[70vh] p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black tracking-tight">Novo Protocolo de Viagem</DialogTitle>
                        <DialogDescription className="text-xs font-mono uppercase tracking-widest text-primary/70">Executando agendamento logístico V3</DialogDescription>
                    </DialogHeader>
                    <div className="scanlines rounded-lg border border-border/50 p-6 bg-accent/10">
                        <ScheduleTripForm onFormSubmit={() => closeModal()}/>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="bg-sidebar/50 border border-border/50 p-1">
          <TabsTrigger value="general" className="text-xs uppercase font-bold tracking-widest">Gerais ({generalSchedules.length})</TabsTrigger>
          <TabsTrigger value="school" className="text-xs uppercase font-bold tracking-widest">Escolares ({schoolSchedules.length})</TabsTrigger>
          <TabsTrigger value="map" className="text-xs uppercase font-bold tracking-widest">
            <MapIcon className="h-3.5 w-3.5 mr-1.5" />
            Mapa ao Vivo
            {activeTrips.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-400 rounded-full">
                {activeTrips.length}
              </span>
            )}
          </TabsTrigger>
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
        <TabsContent value="map" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
                🚗 Rastreamento ao Vivo
              </h3>
              <p className="text-[10px] text-muted-foreground mt-1">
                {activeTrips.length > 0 
                  ? `${activeTrips.length} viagem(ns) em andamento — ${driverLocations.length} localização(ões) capturada(s)`
                  : 'Nenhuma viagem em andamento no momento.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isTracking ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={stopTracking}
                  className="text-[10px] font-bold uppercase tracking-widest border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <span className="h-2 w-2 rounded-full bg-destructive animate-pulse mr-2" />
                  Parar Rastreio
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={startTracking}
                  disabled={activeTrips.length === 0}
                  className="text-[10px] font-bold uppercase tracking-widest border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                >
                  <MapIcon className="h-3 w-3 mr-2" />
                  Iniciar Rastreio
                </Button>
              )}
            </div>
          </div>
          
          {activeTrips.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <DriverMap 
                  locations={driverLocations}
                  height="500px"
                />
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Veículos em Trânsito
                </h4>
                {activeTrips.map((trip) => {
                  const loc = driverLocations.find(l => l.tripId === trip.id);
                  return (
                    <Card key={trip.id} className="bg-sidebar/50 border-border/30">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold truncate">{trip.title}</span>
                          <Badge variant="default" className="text-[8px] h-4 px-1.5">
                            {loc ? '📍 Rastreado' : '⏳ Aguardando'}
                          </Badge>
                        </div>
                        <div className="text-[10px] text-muted-foreground space-y-0.5">
                          <p>🚗 {trip.driver} — {trip.vehicle}</p>
                          <p>📌 {trip.destination}</p>
                          {loc?.address && (
                            <p className="text-[9px] text-primary/60 truncate" title={loc.address}>
                              📍 {loc.address}
                            </p>
                          )}
                          {loc?.speed !== undefined && (
                            <p className="text-emerald-400">
                              ⚡ {(loc.speed * 3.6).toFixed(0)} km/h
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Details Modal */}
      <Dialog open={activeModal === 'details'} onOpenChange={() => closeModal()}>
          <DialogContent className="sm:max-w-2xl border-border/50 bg-sidebar p-0 overflow-hidden">
              <div className="h-1.5 w-full bg-primary" />
              <ScrollArea className="max-h-[80vh] p-8">
              {selectedSchedule && (
                  <>
                  <DialogHeader className="mb-6">
                      <DialogTitle className="text-3xl font-black tracking-tight">{selectedSchedule.title}</DialogTitle>
                      <DialogDescription className="text-xs font-mono uppercase tracking-widest text-primary/70">Visualizando telemetria de missão</DialogDescription>
                  </DialogHeader>
                  <div className="scanlines rounded-lg border border-border/50 p-6 bg-accent/10 space-y-6">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</span>
                            <div className="mt-1">
                                <Badge variant={getStatusVariant(selectedSchedule.status)} className="text-[10px] font-bold uppercase tracking-tight">{selectedSchedule.status}</Badge>
                            </div>
                        </div>
                        <Separator className="bg-border/30" />
                        <div className="grid grid-cols-2 gap-8">
                            <div><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Motorista</p><p className="text-sm font-bold">{selectedSchedule.driver}</p></div>
                            <div><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Veículo</p><p className="text-sm font-bold">{selectedSchedule.vehicle}</p></div>
                        </div>
                        <Separator className="bg-border/30" />
                        <div className='flex justify-end gap-3'>
                            {selectedSchedule.status === 'Agendada' && (
                                <Button onClick={() => openModal('start-checklist', selectedSchedule)} className="bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] h-10 px-6">
                                    <ClipboardCheck className="mr-2 h-4 w-4"/>
                                    Executar Checklist
                                </Button>
                            )}
                             {selectedSchedule.status === 'Em Andamento' && (
                                <>
                                    <Button variant="destructive" onClick={() => openModal('incident', selectedSchedule)} className="font-bold uppercase tracking-widest text-[10px] h-10 px-6">
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

      {/* Incident Modal */}
      <Dialog open={activeModal === 'incident'} onOpenChange={() => closeModal()}>
          <DialogContent className="sm:max-w-2xl border-border/50 bg-sidebar p-0 overflow-hidden">
              <div className="h-1.5 w-full bg-destructive" />
              <ScrollArea className="max-h-[80vh] p-8">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-black tracking-tight text-destructive">Relatório de Sinistro</DialogTitle>
                    <DialogDescription className="text-xs font-mono uppercase tracking-widest text-destructive/70">Protocolo de incidente crítico</DialogDescription>
                </DialogHeader>
                <div className="scanlines rounded-lg border border-destructive/30 p-6 bg-destructive/5">
                    <ReportIncidentForm schedule={selectedSchedule} onFormSubmit={() => closeModal()} />
                </div>
              </ScrollArea>
          </DialogContent>
      </Dialog>
    </div>
  );
}
