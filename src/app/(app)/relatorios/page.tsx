
"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, Gauge, Route, Trophy, TrendingUp, BarChart3 } from 'lucide-react';
import { useApp } from '@/contexts/app-provider';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export default function ReportsPage() {
  const { schedules, telemetryData, isLoading } = useApp();

  const totalTrips = schedules.filter(s => s.status === 'Concluída').length;
  const totalMileage = useMemo(() => {
    return schedules.reduce((acc, s) => acc + ((s.endMileage || 0) - (s.startMileage || 0)), 0);
  }, [schedules]);

  return (
    <div className="container mx-auto p-4 sm:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-on-surface">Inteligência & Analytics</h1>
          <p className="text-muted-foreground text-lg mt-1 font-medium">Análise de telemetria e KPIs da frota industrial.</p>
        </div>
        <Button className="h-12 px-8 font-black uppercase tracking-widest text-xs bg-primary text-primary-foreground">
          <FileDown className="mr-2 h-4 w-4" /> Exportar PDF Consolidado
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-sidebar/50 border-border/50 scanlines">
          <CardHeader className="pb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Route className="h-3 w-3" /> Missões Concluídas</span>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black tracking-tighter text-primary">{totalTrips}</div>
            <div className="text-[10px] font-mono text-emerald-500 font-bold mt-1 uppercase">Sincronizado via Kernel</div>
          </CardContent>
        </Card>
        <Card className="bg-sidebar/50 border-border/50">
          <CardHeader className="pb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Gauge className="h-3 w-3" /> Distância Acumulada</span>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black tracking-tighter">{totalMileage.toLocaleString()} <span className="text-lg text-muted-foreground">KM</span></div>
            <div className="text-[10px] font-mono text-muted-foreground mt-1 uppercase">Dados de telemetria real</div>
          </CardContent>
        </Card>
        <Card className="bg-sidebar/50 border-border/50">
          <CardHeader className="pb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2"><TrendingUp className="h-3 w-3 text-emerald-500" /> Eficiência Média</span>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black tracking-tighter text-emerald-500">94.2%</div>
            <div className="text-[10px] font-mono text-emerald-500/70 font-bold mt-1 uppercase">Performance do Ecossistema</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-zinc-950 border-border/50 tui-scanline overflow-hidden">
          <CardHeader className="border-b border-border/30 bg-accent/5">
            <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" /> Histórico de Investimento em Combustível
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryData}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="month" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '12px' }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                />
                <Area type="monotone" dataKey="cost" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorCost)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-border/50 overflow-hidden flex flex-col">
          <CardHeader className="border-b border-border/30 bg-accent/5">
            <CardTitle className="text-sm font-bold uppercase tracking-widest">Volume de Abastecimentos</CardTitle>
          </CardHeader>
          <CardContent className="pt-8 flex-1">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={telemetryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="month" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '12px' }}
                    />
                    <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
