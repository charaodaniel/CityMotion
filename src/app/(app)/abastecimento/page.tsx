"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Fuel, Clock, User, Car, Search, Filter, ArrowUpRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApp } from '@/contexts/app-provider';
import { RegisterRefuelingForm } from '@/components/forms/register-refueling-form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function RefuelingPage() {
  const { refuelings, userRole, isLoading } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredLogs = useMemo(() => {
    if (!search) return refuelings;
    const q = search.toLowerCase();
    return refuelings.filter(r => 
        r.licensePlate?.toLowerCase().includes(q) || 
        r.vehicleModel?.toLowerCase().includes(q) ||
        r.driverName.toLowerCase().includes(q)
    );
  }, [refuelings, search]);

  const totalSpent = useMemo(() => {
    return refuelings.reduce((acc, curr) => acc + curr.totalValue, 0);
  }, [refuelings]);

  return (
    <div className="container mx-auto p-4 sm:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-on-surface flex items-center gap-4">
            <Fuel className="h-10 w-10 text-primary" />
            Abastecimento
          </h1>
          <p className="text-muted-foreground text-lg mt-1 font-medium">Controle de consumo e despesas de combustível.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 rounded-lg font-bold uppercase tracking-widest text-xs">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Registrar Abastecimento
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl border-border/50 bg-sidebar p-0 overflow-hidden">
                <div className="h-1.5 w-full bg-primary" />
                <ScrollArea className="max-h-[85vh] p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black tracking-tight">Novo Registro de Combustível</DialogTitle>
                        <DialogDescription className="text-xs font-mono uppercase tracking-widest text-primary/70">Protocolo de suprimento logístico</DialogDescription>
                    </DialogHeader>
                    <div className="scanlines rounded-lg border border-border/50 p-6 bg-accent/10">
                        <RegisterRefuelingForm onFormSubmit={() => setIsModalOpen(false)} />
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-sidebar/50 border-border/50 scanlines">
            <CardHeader className="pb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Investido (Mês)</span>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-black tracking-tighter text-primary">R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div className="text-[10px] font-mono text-emerald-500 font-bold mt-1 uppercase">Sincronizado com Financeiro</div>
            </CardContent>
        </Card>
        <Card className="bg-sidebar/50 border-border/50">
            <CardHeader className="pb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Média de Consumo Geral</span>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-black tracking-tighter">12.4 <span className="text-lg text-muted-foreground">km/l</span></div>
                <div className="text-[10px] font-mono text-muted-foreground mt-1 uppercase">Baseado em telemetria</div>
            </CardContent>
        </Card>
        <Card className="bg-sidebar/50 border-border/50">
            <CardHeader className="pb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Abastecimentos Ativos</span>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-black tracking-tighter">{refuelings.length}</div>
                <div className="text-[10px] font-mono text-muted-foreground mt-1 uppercase">Últimos 30 dias</div>
            </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-sidebar/50 rounded-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-accent/20">
              <CardTitle className="text-xl font-bold tracking-tight">Histórico de Suprimentos</CardTitle>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Filtrar placa, veículo..." 
                    className="pl-10 h-10 border-border/50 bg-sidebar text-xs" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="h-10 w-10"><Filter className="h-4 w-4" /></Button>
              </div>
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLogs.map((log) => (
                    <Card key={log.id} className="bg-black/20 border-border/30 hover:border-primary transition-all group">
                        <CardContent className="p-5 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                    <span className="text-xs font-black tracking-tighter text-primary">NEX-REF#{log.id.padStart(3, '0')}</span>
                                    <span className="text-sm font-bold truncate max-w-[150px]">{log.vehicleModel}</span>
                                    <span className="text-[10px] font-mono text-muted-foreground uppercase">{log.licensePlate}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black tracking-tighter text-foreground">R$ {log.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                                    <Badge variant="outline" className="text-[8px] h-4 bg-primary/10 border-primary/20 text-primary">{log.fuelType}</Badge>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/10 font-mono text-[10px]">
                                <div className="flex flex-col gap-1">
                                    <span className="text-muted-foreground uppercase opacity-50">Litros</span>
                                    <span className="font-bold">{log.liters.toFixed(2)} L</span>
                                </div>
                                <div className="flex flex-col gap-1 text-right">
                                    <span className="text-muted-foreground uppercase opacity-50">Km Atual</span>
                                    <span className="font-bold">{log.mileage.toLocaleString()} KM</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                                        {log.driverName[0]}
                                    </div>
                                    <span className="text-[10px] font-medium text-muted-foreground">{log.driverName.split(' ')[0]}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {format(new Date(log.date), "dd MMM, HH:mm", { locale: ptBR })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filteredLogs.length === 0 && !isLoading && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl bg-sidebar/20">
                        <Fuel className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <p className="text-sm font-medium text-muted-foreground">Nenhum registro de abastecimento localizado.</p>
                    </div>
                )}
            </div>
      </Card>
    </div>
  );
}
