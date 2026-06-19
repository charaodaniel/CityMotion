
"use client";

import type { Vehicle, VehicleStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Building, Edit, Wrench, Search, Filter, Download, MoreVertical, Zap, Route, Activity, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RegisterVehicleForm } from '@/components/forms/register-vehicle-form';
import { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/app-provider';
import { RequestMaintenanceForm } from '@/components/forms/request-maintenance-form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type ModalState = 'register' | 'details' | 'edit' | 'maintenance' | null;

function getStatusStyles(status: VehicleStatus) {
  switch (status) {
    case 'Em Serviço':
    case 'Em Viagem':
      return 'border-primary/30 bg-primary/10 text-primary';
    case 'Disponível':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
    case 'Manutenção':
      return 'border-destructive/30 bg-destructive/10 text-destructive';
    default:
      return 'border-border bg-muted/50 text-muted-foreground';
  }
}

export default function VehiclesPage() {
  const { vehicles, setVehicles, userRole, selectedSector } = useApp();
  const [activeModal, setActiveModal] = useState<ModalState>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVehicles = useMemo(() => {
    let result = vehicles;
    if (userRole === 'manager' && selectedSector) {
      result = result.filter(v => v.sector === selectedSector);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(v => 
        v.vehicleModel.toLowerCase().includes(q) || 
        v.licensePlate.toLowerCase().includes(q) ||
        v.sector.toLowerCase().includes(q)
      );
    }
    return result;
  }, [vehicles, userRole, selectedSector, searchQuery]);

  const openModal = (modal: ModalState, vehicle: Vehicle | null = null) => {
    setSelectedVehicle(vehicle);
    setActiveModal(modal);
  };

  const handleFormSubmit = (newVehicleData: Partial<Vehicle>) => {
    if (activeModal === 'edit' && selectedVehicle) {
      setVehicles(vehicles.map(v => v.id === selectedVehicle.id ? { ...v, ...newVehicleData } as Vehicle : v));
    } else {
      const newVehicle: Vehicle = {
        id: `V${vehicles.length + 1}`,
        status: 'Disponível',
        ...newVehicleData
      } as Vehicle;
      setVehicles([...vehicles, newVehicle]);
    }
    openModal(null);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-on-surface">Gestão de Frota</h1>
          <p className="text-muted-foreground text-lg mt-1 font-medium">Controle de ativos e telemetria NexusOS.</p>
        </div>
        <Button onClick={() => openModal('register')} className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 rounded-lg font-bold uppercase tracking-widest text-xs">
          <Plus className="mr-2 h-4 w-4" />
          Novo Veículo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Prontos para Saída', count: vehicles.filter(v => v.status === 'Disponível').length, color: 'emerald' },
          { label: 'Rotas Ativas', count: vehicles.filter(v => v.status === 'Em Viagem').length, color: 'primary' },
          { label: 'Oficina / Manutenção', count: vehicles.filter(v => v.status === 'Manutenção').length, color: 'destructive' }
        ].map((stat, i) => (
          <Card key={i} className="border-border/50 bg-sidebar/50 rounded-xl p-6 relative overflow-hidden group">
            <div className={cn(
              "absolute right-0 top-0 w-32 h-32 rounded-bl-full -z-0 transition-transform group-hover:scale-110",
              stat.color === 'emerald' ? 'bg-emerald-500/10' : stat.color === 'primary' ? 'bg-primary/10' : 'bg-destructive/10'
            )} />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={cn(
                "p-3 rounded-lg border",
                stat.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                stat.color === 'primary' ? 'bg-primary/20 text-primary border-primary/30' : 
                'bg-destructive/20 text-destructive border-destructive/30'
              )}>
                {stat.color === 'emerald' ? <Building className="h-5 w-5" /> : stat.color === 'primary' ? <Route className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-4xl font-black tracking-tighter">{stat.count}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="border-border/50 bg-sidebar/50 rounded-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-accent/20">
              <CardTitle className="text-xl font-bold tracking-tight">Frota Ativa</CardTitle>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar veículos, placas..." 
                    className="pl-10 h-10 border-border/50 bg-sidebar text-xs" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="h-10 w-10"><Filter className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" className="h-10 w-10"><Download className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/30">
                  <TableRow className="border-border/30 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">
                    <TableHead className="px-6 h-12">ID Veículo</TableHead>
                    <TableHead className="h-12">Modelo / Placa</TableHead>
                    <TableHead className="h-12">Setor</TableHead>
                    <TableHead className="h-12">Status</TableHead>
                    <TableHead className="text-right px-6 h-12">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="font-mono text-xs text-foreground divide-y divide-border/30">
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id} className="border-border/30 hover:bg-accent/20 transition-all cursor-pointer group" onClick={() => openModal('details', vehicle)}>
                      <TableCell className="px-6 py-4 font-bold text-primary">NEX-{vehicle.id.replace(/\D/g, '').padStart(3, '0')}</TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="font-sans font-bold text-sm">{vehicle.vehicleModel}</span>
                          <span className="text-[10px] text-muted-foreground tracking-widest">{vehicle.licensePlate}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-[10px] font-sans font-medium text-muted-foreground">{vehicle.sector}</TableCell>
                      <TableCell className="py-4">
                        <span className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-bold uppercase tracking-tight", getStatusStyles(vehicle.status))}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", vehicle.status === 'Em Viagem' && "animate-pulse bg-primary", vehicle.status === 'Disponível' && "bg-emerald-400", vehicle.status === 'Manutenção' && "bg-destructive")} />
                          {vehicle.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right px-6 py-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); openModal('edit', vehicle); }}><Edit className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-3.5 w-3.5" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="border-border/50 bg-sidebar/50 rounded-xl p-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-primary" /> Motoristas Destaque
            </h4>
            <div className="space-y-4">
              {['J. Pereira', 'M. Santos'].map((name, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-border/50 hover:bg-accent/30 transition-all cursor-pointer">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarImage src={`https://i.pravatar.cc/100?u=${name}`} />
                    <AvatarFallback>{name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold truncate leading-none mb-1">{name}</p>
                    <p className="text-[9px] font-mono text-muted-foreground uppercase">{4.8 + i*0.1}/5.0 • {980 + i*220} Viagens</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-primary opacity-50" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-zinc-950 border-border/50 rounded-xl p-6 relative overflow-hidden flex-1 tui-scanline">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
              <Activity className="h-3.5 w-3.5" /> Log de Atividade
            </h4>
            <div className="font-mono text-[10px] text-muted-foreground flex flex-col gap-3">
              {[
                { time: '10:42', id: 'NEX-108', msg: 'Geofence Z-04 detectado', type: 'primary' },
                { time: '10:38', id: 'NEX-015', msg: 'Manutenção #882 aberta', type: 'destructive' },
                { time: '10:15', id: 'NEX-042', msg: 'Viagem T-9912 concluída', type: 'emerald' },
                { time: '09:55', id: 'SYS', msg: 'Update OTA v2.4 aplicado', type: 'primary' }
              ].map((log, i) => (
                <div key={i} className="flex gap-2 leading-tight">
                  <span className="text-primary/40 shrink-0">[{log.time}]</span>
                  <span className={cn("font-bold uppercase shrink-0", log.type === 'primary' ? 'text-primary' : log.type === 'destructive' ? 'text-destructive' : 'text-emerald-400')}>{log.id}</span>
                  <span className="text-foreground/70">{log.msg}</span>
                </div>
              ))}
            </div>
            <div className="absolute bottom-6 right-6">
              <span className="inline-block w-2 h-4 bg-primary animate-pulse" />
            </div>
          </Card>
        </div>
      </div>

       <Dialog open={!!activeModal} onOpenChange={() => openModal(null)}>
        <DialogContent className="sm:max-w-2xl border-border/50 bg-sidebar overflow-hidden p-0">
          <div className="h-1.5 w-full bg-primary" />
          <ScrollArea className="max-h-[80vh] p-8">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-black tracking-tight">
                    {activeModal === 'register' ? 'Novo Protocolo Veicular' : activeModal === 'edit' ? 'Atualizar Unidade' : 'Detalhes de Telemetria'}
                </DialogTitle>
                <DialogDescription className="text-xs font-mono uppercase tracking-widest text-primary/70">
                  {activeModal === 'register' ? 'Executando registro FSP-v3' : 'Acessando parâmetros centrais'}
                </DialogDescription>
              </DialogHeader>
              <div className="scanlines rounded-lg border border-border/50 p-6 bg-accent/10">
                {activeModal === 'maintenance' ? (
                  <RequestMaintenanceForm vehicle={selectedVehicle} onFormSubmit={() => openModal(null)} />
                ) : activeModal === 'register' || activeModal === 'edit' ? (
                  <RegisterVehicleForm onFormSubmit={handleFormSubmit} existingVehicle={selectedVehicle} />
                ) : (
                  <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-8">
                        <div><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Modelo</p><p className="text-lg font-bold">{selectedVehicle?.vehicleModel}</p></div>
                        <div><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Placa</p><p className="text-lg font-mono font-bold text-primary">{selectedVehicle?.licensePlate}</p></div>
                        <div><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Setor Alocado</p><p className="text-sm font-bold">{selectedVehicle?.sector}</p></div>
                        <div><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Distância Total</p><p className="text-sm font-mono">{selectedVehicle?.mileage.toLocaleString('pt-BR')} KM</p></div>
                     </div>
                     <Separator className="bg-border/30" />
                     <div className="flex justify-end gap-3">
                        <Button variant="outline" className="text-xs uppercase font-bold" onClick={() => openModal('maintenance', selectedVehicle)}>Abrir Manutenção</Button>
                        <Button variant="default" className="bg-primary text-primary-foreground text-xs uppercase font-bold" onClick={() => openModal('edit', selectedVehicle)}>Editar Unidade</Button>
                     </div>
                  </div>
                )}
              </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
