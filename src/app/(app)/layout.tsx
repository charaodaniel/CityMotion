"use client";

import React, { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
  SidebarMenuSkeleton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  LayoutDashboard, 
  Car, 
  Menu, 
  Settings, 
  Route, 
  CalendarClock, 
  Users, 
  ScrollText, 
  Building, 
  UserCog, 
  Wrench, 
  BookOpen, 
  UserSquare, 
  Bell, 
  Network, 
  Terminal, 
  ShieldCheck, 
  DollarSign,
  RefreshCw,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/app-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DevTerminal } from '@/components/dev-terminal';

const platformNavItems = [
  { href: '/dev-global', label: 'Gestão Global', icon: ShieldCheck, roles: ['dev'] },
  { href: '/faturamento', label: 'Faturamento', icon: DollarSign, roles: ['dev', 'ti'] },
  { href: '/nexus', label: 'NexusBridge', icon: Network, roles: ['dev', 'ti'] },
  { href: '/perfis', label: 'Gerenciar Perfis', icon: UserCog, roles: ['dev', 'ti', 'admin'] },
];

const operationalNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
  { href: '/setores', label: 'Setores', icon: Building, roles: ['dev', 'ti', 'admin'] },
  { href: '/funcionarios', label: 'Funcionários', icon: Users, roles: ['dev', 'ti', 'admin', 'manager'] },
  { href: '/veiculos', label: 'Fleet', icon: Car, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
  { href: '/viagens', label: 'Trips', icon: Route, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
  { href: '/manutencao', label: 'Manutenção', icon: Wrench, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
  { href: '/escalas', label: 'Escalas', icon: CalendarClock, roles: ['dev', 'ti', 'admin', 'manager'] },
  { href: '/relatorios', label: 'Relatórios', icon: ScrollText, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole, logout, currentUser, isLoading, isRefreshing, refreshData, selectedSector, notifications, markNotificationAsRead, clearNotifications } = useApp();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);
  const isCurrentUserDriver = useMemo(() => currentUser?.role.toLowerCase().includes('motorista'), [currentUser]);

  const filteredPlatformItems = useMemo(() => platformNavItems.filter(item => item.roles.includes(userRole)), [userRole]);
  const filteredOperationalItems = useMemo(() => operationalNavItems.filter(item => {
    if (!item.roles.includes(userRole)) return false;
    if (userRole === 'employee') {
      const restrictedRoutes = ['/veiculos', '/viagens', '/manutencao', '/relatorios'];
      if (restrictedRoutes.includes(item.href)) return isCurrentUserDriver;
    }
    return true;
  }), [userRole, isCurrentUserDriver]);

  const getRoleName = (role: string) => {
    switch (role) {
      case 'dev': return 'Developer';
      case 'ti': return 'TI Expert';
      case 'admin': return 'Administrator';
      case 'manager': return 'Fleet Manager';
      default: return currentUser?.role || 'User';
    }
  }

  const handleLogout = () => logout();

  if (pathname === '/select-sector') return <div className="min-h-screen bg-background">{children}</div>;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/30">
        <Sidebar className="border-r border-border/50 bg-sidebar">
          <SidebarHeader className="h-16 flex items-center px-6 border-b border-border/50">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
                <Network className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight leading-none">CityMotion</span>
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">NexusOS Fleet</span>
              </div>
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="px-2 py-4">
            {filteredPlatformItems.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-2 px-2">
                  Plataforma
                </SidebarGroupLabel>
                <SidebarMenu>
                  {filteredPlatformItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname.startsWith(item.href)} 
                        className={cn(
                          "rounded-sm transition-all duration-200",
                          pathname.startsWith(item.href) && "border-r-2 border-primary bg-accent/50 text-primary font-bold"
                        )}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            )}

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 px-2">
                Operação
              </SidebarGroupLabel>
              <SidebarMenu>
                {isLoading ? (
                  <SidebarMenuSkeleton showIcon />
                ) : (
                  filteredOperationalItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === item.href}
                        className={cn(
                          "rounded-sm transition-all duration-200",
                          pathname === item.href && "border-r-2 border-primary bg-accent/50 text-primary font-bold"
                        )}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className='mt-auto p-4 border-t border-border/50'>
             <div className="flex items-center gap-2 p-2 bg-accent/30 rounded border border-border/50">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-tight">System Status: Active</span>
             </div>
             <div className="flex flex-col gap-1 mt-4">
                <Button variant="ghost" size="sm" className="justify-start h-8 px-2 text-muted-foreground hover:text-foreground text-xs" asChild>
                    <Link href="/docs"><BookOpen className="mr-2 h-3.5 w-3.5" /> Docs</Link>
                </Button>
                <Button variant="ghost" size="sm" className="justify-start h-8 px-2 text-muted-foreground hover:text-foreground text-xs" onClick={handleLogout}>
                    <LogOut className="mr-2 h-3.5 w-3.5" /> Logout
                </Button>
             </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="bg-background">
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
                    <Button variant="ghost" size="icon" onClick={() => setIsTerminalOpen(true)} className="h-8 w-8 text-muted-foreground hover:text-primary">
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
                      <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">Sair do Sistema</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
            </header>
            <main className="flex-1 overflow-auto">
              {children}
            </main>
        </SidebarInset>
      </div>
      <DevTerminal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} onOpenChange={setIsTerminalOpen} />
    </SidebarProvider>
  );
}