
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, Car, Pin, ArrowRight, FileText, Download } from 'lucide-react';
import type { ScheduleStatus, Schedule } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/app-provider';
import { useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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

function exportDriverReport(driverName: string, allTrips: Schedule[]) {
  const doc = new jsPDF('landscape', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Cabeçalho
  doc.setFillColor(9, 9, 11);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(147, 197, 253);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('CityMotion', 14, 18);
  
  doc.setTextColor(200, 200, 210);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Relatório de Viagens — ${driverName}`, 14, 28);
  doc.text(new Date().toLocaleDateString('pt-BR'), pageWidth - 14, 28, { align: 'right' });
  
  // Filtra viagens do motorista
  const driverTrips = allTrips.filter(s => s.driver === driverName);
  
  // Resumo
  const agendadas = driverTrips.filter(s => s.status === 'Agendada').length;
  const andamento = driverTrips.filter(s => s.status === 'Em Andamento').length;
  const concluidas = driverTrips.filter(s => s.status === 'Concluída').length;
  const kmTotal = driverTrips.reduce((acc, s) => acc + ((s.endMileage || 0) - (s.startMileage || 0)), 0);
  
  doc.setTextColor(100, 100, 120);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMO', 14, 45);
  
  doc.setFillColor(240, 240, 245);
  doc.rect(14, 48, pageWidth - 28, 18, 'F');
  doc.setTextColor(50, 50, 60);
  doc.setFontSize(9);
  doc.text(`Total de Viagens: ${driverTrips.length}`, 18, 57);
  doc.text(`Agendadas: ${agendadas}`, 70, 57);
  doc.text(`Em Andamento: ${andamento}`, 120, 57);
  doc.text(`Concluídas: ${concluidas}`, 175, 57);
  doc.text(`KM Total: ${kmTotal} km`, 230, 57);
  
  // Tabela de viagens
  doc.setTextColor(100, 100, 120);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('VIAGENS', 14, 76);
  
  const tableData = driverTrips.map(s => [
    s.title,
    s.departureTime,
    s.origin,
    s.destination,
    s.vehicle,
    s.startMileage?.toString() || '-',
    s.endMileage?.toString() || '-',
    s.status
  ]);
  
  autoTable(doc, {
    startY: 80,
    head: [['Título', 'Data/Hora', 'Origem', 'Destino', 'Veículo', 'KM Inicial', 'KM Final', 'Status']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [9, 9, 11],
      textColor: [147, 197, 253],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [50, 50, 60],
    },
    alternateRowStyles: {
      fillColor: [245, 245, 250],
    },
    columnStyles: {
      0: { cellWidth: 40 },
      2: { cellWidth: 35 },
      3: { cellWidth: 35 },
      7: { cellWidth: 20, halign: 'center' },
    },
    margin: { left: 14, right: 14 },
  });
  
  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(180, 180, 190);
    doc.setFontSize(7);
    doc.text(
      `CityMotion — Relatório gerado em ${new Date().toLocaleString('pt-BR')} | Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'center' }
    );
  }
  
  // Download
  const filename = `relatorio-viagens-${driverName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

export default function DriverDashboard() {
  const { schedules, currentUser } = useApp();
  const currentDriverName = currentUser?.name || "Maria Oliveira";
  const [isExporting, setIsExporting] = useState(false);

  const driverSchedules = useMemo(() => {
    return schedules.filter(s => s.driver === currentDriverName && s.status !== 'Cancelada');
  }, [schedules, currentDriverName]);

  const pendingSchedules = useMemo(() => {
    return driverSchedules.filter(s => s.status !== 'Concluída');
  }, [driverSchedules]);

  const handleExport = () => {
    setIsExporting(true);
    try {
      exportDriverReport(currentDriverName, schedules);
    } catch (err) {
      console.error('[Export] Erro ao gerar PDF:', err);
    } finally {
      setTimeout(() => setIsExporting(false), 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            Minhas Viagens
          </h2>
          <p className="text-sm text-muted-foreground">
            {pendingSchedules.length} pendente(s) • {driverSchedules.filter(s => s.status === 'Concluída').length} concluída(s)
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={isExporting}
          className="text-[10px] font-bold uppercase tracking-widest border-primary/30 text-primary hover:bg-primary/10"
        >
          <FileText className="mr-2 h-3.5 w-3.5" />
          {isExporting ? 'Exportando...' : 'Exportar Relatório PDF'}
        </Button>
      </div>

      <div className="space-y-4">
        {pendingSchedules.length > 0 ? pendingSchedules.map((schedule) => (
            <Card key={schedule.id}>
            <CardHeader>
                <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{schedule.title}</CardTitle>
                <Badge variant={getStatusVariant(schedule.status)}>{schedule.status}</Badge>
                </div>
                <CardDescription className="flex items-center text-sm text-muted-foreground mt-2">
                    <Clock className="mr-2 h-4 w-4" /> {schedule.departureTime}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-primary" />
                <strong>Motorista:</strong><span className="ml-2">{schedule.driver}</span>
                </div>
                <div className="flex items-center">
                <Car className="mr-2 h-4 w-4 text-primary" />
                <strong>Veículo:</strong><span className="ml-2">{schedule.vehicle}</span>
                </div>
                <Separator />
                <div className="flex items-center">
                <Pin className="mr-2 h-4 w-4 text-green-500" />
                <span>{schedule.origin}</span>
                <ArrowRight className="mx-2 h-4 w-4 text-muted-foreground" />
                <Pin className="mr-2 h-4 w-4 text-red-500" />
                <span>{schedule.destination}</span>
                </div>
            </CardContent>
            </Card>
        )) : (
            <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg">
                Você não tem nenhuma viagem agendada no momento.
            </div>
        )}
        
        {/* Seção de viagens concluídas */}
        {driverSchedules.filter(s => s.status === 'Concluída').length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <Download className="h-3.5 w-3.5" />
              Últimas Viagens Concluídas
            </h3>
            <div className="space-y-3">
              {driverSchedules.filter(s => s.status === 'Concluída').slice(-5).reverse().map((schedule) => (
                <Card key={schedule.id} className="opacity-70 hover:opacity-100 transition-opacity">
                  <CardContent className="p-4 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="font-bold">{schedule.title}</span>
                      <span className="text-muted-foreground text-xs">{schedule.destination}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{schedule.departureTime}</span>
                      {schedule.endMileage && schedule.startMileage && (
                        <span className="text-primary">{schedule.endMileage - schedule.startMileage} km</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
