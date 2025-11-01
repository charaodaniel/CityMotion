
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, Car, Clock, User, Filter, Calendar as CalendarIcon } from 'lucide-react';
import { schedules, sectors, vehicles } from '@/lib/data';
import type { Schedule, ScheduleStatus } from '@/lib/types';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ptBR } from 'date-fns/locale';

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}


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

export default function ReportsPage() {
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({ from: undefined, to: undefined });
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);


  const handleCardClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
  };

  const closeDetailsModal = () => {
    setSelectedSchedule(null);
  };

  const filteredSchedules = schedules.filter(s => {
    const scheduleDate = new Date(s.departureTime.split(' ')[0].split('/').reverse().join('-'));
    const isAfterFrom = dateRange.from ? scheduleDate >= dateRange.from : true;
    const isBeforeTo = dateRange.to ? scheduleDate <= dateRange.to : true;
    const isInSector = selectedSector ? (s as any).sector === selectedSector : true; // Assuming schedule has sector
    const isVehicle = selectedVehicle ? s.vehicle.includes(selectedVehicle) : true;
    
    return s.status === 'Concluída' && isAfterFrom && isBeforeTo && isInSector && isVehicle;
  });

  const generatePdf = () => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    doc.text('Relatório de Viagens Concluídas', 14, 16);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 22);

    doc.autoTable({
        startY: 30,
        head: [['Título', 'Motorista', 'Veículo', 'Data', 'Origem', 'Destino', 'KM Rodado']],
        body: filteredSchedules.map(s => [
            s.title,
            s.driver,
            s.vehicle,
            s.departureTime.split(' ')[0],
            s.origin,
            s.destination,
            s.endMileage && s.startMileage ? s.endMileage - s.startMileage : 'N/A'
        ]),
        headStyles: { fillColor: [33, 150, 243] }, // Azul
        styles: { fontSize: 8 },
        columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 25 },
            2: { cellWidth: 25 },
            3: { cellWidth: 20 },
            4: { cellWidth: 'auto' },
            5: { cellWidth: 'auto' },
            6: { cellWidth: 20 },
        }
    });

    doc.save(`relatorio_viagens_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const clearFilters = () => {
      setDateRange({ from: undefined, to: undefined });
      setSelectedSector(null);
      setSelectedVehicle(null);
  }

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
        <Button onClick={generatePdf} disabled={filteredSchedules.length === 0}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar para PDF
        </Button>
      </div>

       <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filtros do Relatório
          </CardTitle>
          <CardDescription>
            Selecione os filtros para gerar um relatório personalizado.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col space-y-1.5">
            <Label>Período</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Selecione um período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                  numberOfMonths={2}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="sector">Setor</Label>
            <Select onValueChange={setSelectedSector} value={selectedSector || ''}>
              <SelectTrigger id="sector">
                <SelectValue placeholder="Todos os setores" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="vehicle">Veículo</Label>
            <Select onValueChange={setSelectedVehicle} value={selectedVehicle || ''}>
              <SelectTrigger id="vehicle">
                <SelectValue placeholder="Todos os veículos" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map(v => <SelectItem key={v.id} value={v.licensePlate}>{v.vehicleModel} ({v.licensePlate})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={clearFilters} variant="ghost" className="w-full">Limpar Filtros</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Viagens Concluídas ({filteredSchedules.length})</CardTitle>
          <CardDescription>
            {filteredSchedules.length > 0 
                ? 'Lista de todas as viagens já finalizadas de acordo com os filtros selecionados.'
                : 'Ainda não há viagens concluídas no histórico que correspondam aos filtros.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
            {filteredSchedules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSchedules.map((schedule) => (
                        <Card key={schedule.id} onClick={() => handleCardClick(schedule)} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base">{schedule.title}</CardTitle>
                                <CardDescription className="flex items-center text-xs">
                                    <Clock className="mr-1.5 h-3 w-3" /> Concluído em: {schedule.arrivalTime ? format(new Date(schedule.arrivalTime), 'dd/MM/yyyy') : 'N/A'}
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
                                    <p className="text-xs text-muted-foreground mt-1">
                                      KM Rodados: <strong>{schedule.endMileage && schedule.startMileage ? schedule.endMileage - schedule.startMileage : 'N/A'} km</strong>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-8">
                    <p>Nenhuma viagem concluída para exibir com os filtros atuais.</p>
                </div>
            )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={!!selectedSchedule} onOpenChange={closeDetailsModal}>
        <DialogContent>
            <ScrollArea className="max-h-[80vh] p-4">
              {selectedSchedule && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{selectedSchedule.title}</DialogTitle>
                    <DialogDescription>
                      Detalhes da viagem concluída.
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
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-sm font-semibold text-muted-foreground">Partida</span>
                            <p className="text-lg">{selectedSchedule.departureTime}</p>
                        </div>
                        <div>
                            <span className="text-sm font-semibold text-muted-foreground">Chegada</span>
                            <p className="text-lg">{selectedSchedule.arrivalTime || 'N/A'}</p>
                        </div>
                    </div>
                    <Separator />
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-sm font-semibold text-muted-foreground">KM Inicial</span>
                            <p className="text-lg">{selectedSchedule.startMileage?.toLocaleString('pt-BR') || 'N/A'} km</p>
                        </div>
                        <div>
                            <span className="text-sm font-semibold text-muted-foreground">KM Final</span>
                            <p className="text-lg">{selectedSchedule.endMileage?.toLocaleString('pt-BR') || 'N/A'} km</p>
                        </div>
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
    </div>
  );
}
