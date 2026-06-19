
"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Bell, 
  Terminal, 
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/app-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  onTerminalOpen: () => void;
}

export function AppHeader({ onTerminalOpen }: AppHeaderProps) {
  const pathname = usePathname();
  const { 
    userRole, 
    logout, 
    currentUser, 
    isRefreshing, 
    refreshData, 
    notifications, 
    markNotificationAsRead, 
    clearNotifications 
  } = useApp();

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const getRoleName = (role: string) => {
    switch (role) {
      case 'dev': return 'Developer';
      case 'ti': return 'TI Expert';
      case 'admin': return 'Administrator';
      case 'manager': return 'Fleet Manager';
      default: return currentUser?.role || 'User';
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/95 backdrop-blur-md px-6">
        <div className="flex items-center gap-6">
          <SidebarTrigger className="h-8 w-8" />
          <nav className="hidden lg:flex items-center gap-6">
            {['Dashboard', 'Fleet', 'Network'].map((label) => (
              <Link 
                key={label} 
                href={label === 'Dashboard' ? '/dashboard' : label === 'Fleet' ? '/veiculos' : '/nexus'}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest transition-colors pb-1 border-b-2",
                  pathname.includes(label.toLowerCase()) ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-primary"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => refreshData()} disabled={isRefreshing} className="h-8 w-8 text-muted-foreground hover:text-primary">
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin text-primary")} />
          </Button>

          {['dev', 'ti', 'admin'].includes(userRole) && (
            <Button variant="ghost" size="icon" onClick={onTerminalOpen} className="h-8 w-8 text-muted-foreground hover:text-primary">
              <Terminal className="h-4 w-4" />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:text-primary">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 border-border/50 bg-sidebar">
              <DropdownMenuLabel className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-widest">Notificações</span>
                <Button variant="ghost" size="sm" onClick={clearNotifications} className="h-auto p-0 text-[10px] text-muted-foreground hover:text-primary">LIMPAR</Button>
              </DropdownMenuLabel>
              <ScrollArea className="h-80">
                {notifications.length > 0 ? notifications.map((n) => (
                  <div key={n.id} className={cn("p-4 border-b border-border/30 hover:bg-accent/30 cursor-pointer transition-colors", !n.read && "bg-primary/5")} onClick={() => markNotificationAsRead(n.id)}>
                    <div className="text-xs font-bold text-primary mb-1">{n.title}</div>
                    <p className="text-[11px] text-muted-foreground leading-tight line-clamp-2">{n.message}</p>
                  </div>
                )) : (
                  <div className="p-8 text-center text-xs text-muted-foreground italic">Nenhum alerta recente.</div>
                )}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-6 mx-2" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 p-0 rounded-full border border-border/50 hover:border-primary transition-all">
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${currentUser?.id}`} />
                  <AvatarFallback className="bg-primary/10 text-primary">{currentUser?.name?.[0]}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-border/50 bg-sidebar">
              <DropdownMenuLabel className='font-normal p-4'>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold tracking-tight">{currentUser?.name}</p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{getRoleName(userRole)}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary cursor-pointer"><Link href="/perfil">Meu Perfil</Link></DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">Sair do Sistema</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
    </header>
  );
}
