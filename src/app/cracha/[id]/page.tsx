"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Employee } from '@/lib/types';
import { ArrowLeft, Wallet, Download, ShieldCheck, Loader2, Verified } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function BadgePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [badgeUrl, setBadgeUrl] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBadgeUrl(window.location.href);
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    }, 1000);

    if (id) {
        setLoading(true);
        fetch('/api/nexus/users')
            .then(res => res.json())
            .then((employees: Employee[]) => {
                const foundEmployee = employees.find(d => String(d.id) === String(id));
                if (foundEmployee) setEmployee(foundEmployee);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }

    return () => clearInterval(timer);
  }, [id]);


  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-xs font-mono uppercase tracking-widest text-primary/70">Initializing Identity Protocol...</p>
        </div>
    )
  }

  if (!employee) return null;

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col items-center justify-center p-6 relative overflow-hidden antialiased font-sans selection:bg-primary/30">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 flex items-center justify-center">
        <div className="w-[800px] h-[800px] rounded-full bg-primary/10 blur-[120px] mix-blend-screen" />
      </div>

      <div className="z-10 w-full max-w-sm flex flex-col gap-8">
        {/* Context Header */}
        <div className="flex justify-between items-center w-full">
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary transition-colors uppercase text-[10px] font-bold tracking-widest p-0" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" /> Return
          </Button>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 border border-border/50 px-2 py-0.5 rounded">Secure Area</span>
        </div>

        {/* Virtual Badge Card */}
        <div className="relative bg-sidebar border border-border/50 shadow-2xl rounded-xl overflow-hidden group">
          {/* TUI Scanline Overlay */}
          <div className="absolute inset-0 tui-scanline opacity-[0.03] pointer-events-none z-20" />
          
          <div className="h-2 w-full bg-primary" />
          
          <CardHeader className="flex-row justify-between items-start pt-8 pb-4">
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none">CityMotion</span>
              <span className="text-[10px] font-mono font-bold text-primary tracking-widest mt-1">ID-SYS v2.4</span>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-tight text-emerald-400">Validated</span>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col items-center text-center p-8">
            <div className="relative mb-8">
              <div className="w-36 h-36 rounded-full border-4 border-primary/20 p-1 bg-background/50">
                <div className="w-full h-full rounded-full overflow-hidden bg-accent relative grayscale hover:grayscale-0 transition-all duration-700 ease-in-out cursor-pointer">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={`https://i.pravatar.cc/300?u=${employee.id}`} className="object-cover" />
                    <AvatarFallback className="text-4xl bg-primary/10 text-primary">{employee.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-sidebar rounded-full p-1 border border-border/50 shadow-xl">
                <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center">
                  <Verified className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="mb-8 w-full">
              <h1 className="text-3xl font-black tracking-tight mb-1">{employee.name}</h1>
              <p className="text-sm font-bold uppercase tracking-widest text-primary opacity-80">{employee.role}</p>
            </div>

            <div className="w-full h-px bg-border/30 mb-8" />

            <div className="w-52 h-52 bg-white p-4 rounded-lg mb-8 shadow-[0_0_30px_rgba(173,198,255,0.1)] hover:shadow-[0_0_40px_rgba(173,198,255,0.2)] transition-all duration-500">
              <QRCodeSVG value={badgeUrl} size={176} level="H" includeMargin={false} />
            </div>

            <div className="w-full grid grid-cols-2 gap-4 bg-background/50 rounded-lg p-4 border border-border/30 font-mono text-[10px]">
              <div className="flex flex-col text-left">
                <span className="uppercase text-muted-foreground/60 mb-1">Fleet ID</span>
                <span className="text-sm font-bold tracking-tighter">CM-{employee.matricula || 'SYS-' + employee.id.padStart(4, '0')}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="uppercase text-muted-foreground/60 mb-1">Access Level</span>
                <span className="text-sm font-bold text-primary">{employee.role === 'Desenvolvedor Global' ? 'ROOT-L5' : 'AUTH-L1'}</span>
              </div>
            </div>
          </CardContent>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="secondary" className="h-14 font-bold uppercase tracking-widest text-[10px] gap-2 border border-border/50 shadow-lg">
            <Wallet className="h-4 w-4" /> Apple Wallet
          </Button>
          <Button variant="default" className="h-14 font-bold uppercase tracking-widest text-[10px] gap-2 bg-primary text-primary-foreground shadow-[0_0_20px_rgba(173,198,255,0.2)]" onClick={() => window.print()}>
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>

        <div className="flex flex-col items-center gap-2 opacity-50 mt-4">
          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
             <ShieldCheck className="h-3 w-3" /> Secure NexusOS Session
          </div>
          <p className="text-[9px] font-mono text-muted-foreground/70">{currentTime || 'VALIDATING ENCRYPTION...'}</p>
        </div>
      </div>
    </div>
  );
}