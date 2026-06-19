"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Route, DollarSign, AlertTriangle, Clock, Activity, TrendingUp, Hub } from 'lucide-react';
import { useApp } from '@/contexts/app-provider';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const { vehicleRequests, schedules, employees, vehicles } = useApp();
  
  const metrics = [
    { 
      label: 'Active Vehicles', 
      value: vehicles.filter(v => v.status === 'Em Serviço' || v.status === 'Em Viagem').length, 
      total: vehicles.length,
      icon: Zap,
      trend: '+12% from yesterday',
      color: 'text-primary'
    },
    { 
      label: 'Daily Trips', 
      value: schedules.filter(s => s.status !== 'Cancelada').length, 
      icon: Route,
      trend: '+5.4% from yesterday',
      color: 'text-primary'
    },
    { 
      label: 'Fleet Utilization', 
      value: '84%', 
      icon: Hub,
      trend: 'Stable',
      color: 'text-emerald-400'
    },
    { 
      label: 'Critical Alerts', 
      value: vehicleRequests.filter(r => r.priority === 'Alta' && r.status === 'Pendente').length, 
      icon: AlertTriangle,
      trend: 'Requires immediate action',
      color: 'text-destructive',
      error: true
    }
  ];

  return (
    <div className='space-y-8 max-w-container-max mx-auto'>
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground text-sm mt-1">Real-time telematics and infrastructure status.</p>
        </div>
        <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-2 uppercase tracking-widest">
          <Clock className="h-3 w-3" /> Last updated: Just now
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => (
          <Card key={idx} className={cn(
            "scanlines border-border/50 hover:border-primary transition-all duration-300 group overflow-hidden bg-sidebar/50",
            m.error && "bg-destructive/5 border-destructive/30 hover:border-destructive"
          )}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{m.label}</span>
              <m.icon className={cn("h-4 w-4", m.color)} />
            </CardHeader>
            <CardContent>
              <div className={cn("text-5xl font-black tracking-tighter mb-2", m.error ? "text-destructive" : "text-foreground")}>
                {m.value}
              </div>
              <div className={cn("text-[10px] font-mono flex items-center gap-1 font-bold", m.error ? "text-destructive" : "text-emerald-500")}>
                {m.error ? <AlertTriangle className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                {m.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/50 bg-sidebar/50">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/30 pb-4">
                <div>
                  <CardTitle className="text-lg font-bold tracking-tight">Fleet Throughput (7 Days)</CardTitle>
                  <CardDescription className="text-xs">Volume of operations processed by the NexusBridge engine.</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-primary">View Report</Button>
            </CardHeader>
            <CardContent className="pt-6 h-[300px]">
                <div className="flex h-full items-end gap-3 border-b border-l border-border/50 pl-2 relative">
                  <div className="absolute -left-10 top-0 h-full flex flex-col justify-between text-[9px] font-mono text-muted-foreground py-2">
                    <span>10k</span><span>5k</span><span>0</span>
                  </div>
                  {[60, 75, 85, 50, 90, 100, 80].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/20 hover:bg-primary/40 transition-all rounded-t-sm relative group cursor-pointer" style={{ height: `${h}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-accent px-2 py-1 rounded text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity z-20 border border-primary/30">
                        {h/10}k
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-[9px] font-mono text-muted-foreground px-2">
                  {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => <span key={d}>{d}</span>)}
                </div>
            </CardContent>
        </Card>

        <Card className="border-border/50 bg-sidebar/50 overflow-hidden flex flex-col">
            <CardHeader className="p-4 border-b border-border/30 bg-accent/30 backdrop-blur-md z-10 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-widest">Live Coverage</CardTitle>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </CardHeader>
            <CardContent className="p-0 flex-1 relative bg-zinc-900 grayscale opacity-70 flex items-center justify-center">
                {/* Simulated Radar Grid */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="w-48 h-48 rounded-full border border-primary/20 flex items-center justify-center relative">
                   <div className="w-32 h-32 rounded-full border border-primary/10" />
                   <div className="w-16 h-16 rounded-full border border-primary/5" />
                   <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping" />
                   <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-primary rounded-full" />
                   <div className="absolute top-1/2 left-1/2 w-[2px] h-24 bg-primary/20 origin-top rotate-45" />
                </div>
                <div className="absolute bottom-4 left-4 flex flex-col gap-1">
                   <div className="text-[9px] font-mono text-primary font-bold">LAT: 40.7128 N</div>
                   <div className="text-[9px] font-mono text-primary font-bold">LNG: 74.0060 W</div>
                </div>
            </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-sidebar/50 flex flex-col flex-1 min-h-[300px]">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/30 pb-4">
            <CardTitle className="text-lg font-bold tracking-tight">Terminal / Recent Activity</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-widest">Filter</Button>
              <Button variant="default" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground">Export</Button>
            </div>
        </CardHeader>
        <CardContent className="pt-6 flex-1 overflow-y-auto font-mono text-xs">
            <div className="space-y-2 text-muted-foreground">
                <div className="flex gap-4 p-2 hover:bg-accent/30 rounded transition-colors group">
                  <span className="w-20 shrink-0 opacity-50">10:42:05Z</span>
                  <span className="text-primary w-12 font-bold">[INFO]</span>
                  <span className="text-foreground">Vehicle <span className="text-primary/70">V-8902</span> completed charging cycle at Hub Alpha.</span>
                </div>
                <div className="flex gap-4 p-2 hover:bg-accent/30 rounded transition-colors group">
                  <span className="w-20 shrink-0 opacity-50">10:41:12Z</span>
                  <span className="text-destructive w-12 font-bold">[WARN]</span>
                  <span className="text-foreground">Telemetry sync timeout for unit <span className="text-destructive/70">V-331X</span>. Retrying connection...</span>
                </div>
                <div className="flex gap-4 p-2 hover:bg-accent/30 rounded transition-colors group">
                  <span className="w-20 shrink-0 opacity-50">10:35:00Z</span>
                  <span className="text-emerald-500 w-12 font-bold">[AUTH]</span>
                  <span className="text-foreground">Admin session initiated from <span className="text-emerald-500/70">192.168.1.45</span> via SSO.</span>
                </div>
                <div className="flex gap-4 p-2 hover:bg-accent/30 rounded transition-colors group">
                  <span className="w-20 shrink-0 opacity-50">10:15:22Z</span>
                  <span className="text-primary w-12 font-bold">[INFO]</span>
                  <span className="text-foreground">Automated route optimization script executed successfully. 450 routes updated.</span>
                </div>
                <div className="flex items-center gap-2 p-2">
                  <span className="text-primary font-bold">&gt;</span>
                  <span className="w-2 h-4 bg-primary animate-pulse" />
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}