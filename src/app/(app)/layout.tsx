
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
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Logo } from '@/components/icons';
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
  LogOut, 
  UserCog, 
  Wrench, 
  BookOpen, 
  UserSquare, 
  Bell, 
  Trash2, 
  Info, 
  Network, 
  Terminal, 
  ShieldCheck, 
  DollarSign, 
  BarChart3 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/app-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DevTerminal } from '@/components/dev-terminal';

// 1. Itens de Administração da PLATAFORMA (Dev/TI)
const platformNavItems = [
  { href: '/dev-global', label: 'Gestão Global', icon: ShieldCheck, roles: ['dev'] },
  { href: '/faturamento', label: 'Faturamento', icon: DollarSign, roles: ['dev', 'ti'] },
  { href: '/nexus', label: 'NexusBridge', icon: Network, roles: ['dev', 'ti'] },
  { href: '/perfis', label: 'Gerenciar Perfis', icon: UserCog, roles: ['dev', 'ti', 'admin'] },
];

// 2. Itens de Gestão OPERACIONAL (Empresa)
const operationalNavItems = [
  { href: '/dashboard', label: 'Painel Geral', icon: LayoutDashboard, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
  { href: '/setores', label: 'Setores', icon: Building, roles: ['dev', 'ti', 'admin'] },
  { href: '/funcionarios', label: 'Funcionários', icon: Users, roles: ['dev', 'ti', 'admin', 'manager'] },
  { href: '/veiculos', label: 'Veículos', icon: Car, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
  { href: '/viagens', label: 'Viagens', icon: Route, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
  { href: '/manutencao', label: 'Manutenção', icon: Wrench, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
  { href: '/escalas', label: 'Escalas', icon: CalendarClock, roles: ['dev', 'ti', 'admin', 'manager'] },
  { href: '/relatorios', label: 'Relatórios', icon: ScrollText, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
];

const bottomNavItems = [
    { href: '/perfil', label: 'Meu Perfil', icon: UserCog, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
    { href: '/docs', label: 'Central de Ajuda', icon: BookOpen, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
    { href: '/settings', label: 'Configurações', icon: Settings, roles: ['ti', 'admin'] },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole, logout, currentUser, isLoading, selectedSector, setSelectedSector, notifications, markNotificationAsRead, clearNotifications } = useApp();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);
  const isCurrentUserDriver = useMemo(() => currentUser?.role.toLowerCase().includes('motorista'), [currentUser]);
  const isDocsPage = pathname.startsWith('/docs');

  // Filtragem inteligente por seção
  const filteredPlatformItems = useMemo(() => {
    return platformNavItems.filter(item => item.roles.includes(userRole));
  }, [userRole]);

  const filteredOperationalItems = useMemo(() => {
    return operationalNavItems.filter(item => {
      if (!item.roles.includes(userRole)) return false;
      if (userRole === 'employee') {
        const restrictedRoutes = ['/veiculos', '/viagens', '/manutencao', '/relatorios'];
        if (restrictedRoutes.includes(item.href)) return isCurrentUserDriver;
      }
      return true;
    });
  }, [userRole, isCurrentUserDriver]);

  const filteredBottomNavItems = useMemo(() => {
    return bottomNavItems.filter(item => item.roles.includes(userRole));
  }, [userRole]);

  const getRoleName = (role: string) => {
    switch (role) {
      case 'dev': return 'Desenvolvedor Global';
      case 'ti': return 'Técnico de TI';
      case 'admin': return 'Administrador';
      case 'manager': return 'Gestor';
      case 'employee': return currentUser?.role || 'Colaborador'; 
      default: return 'Desconhecido'
    }
  }

  const getInitials = (name?: string) => {
    return name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
  }
  
  const handleLogout = () => logout();

  const handleChangeSector = () => {
    setSelectedSector(null);
    router.push('/select-sector');
  }

  if (userRole === 'manager' && !selectedSector && pathname !== '/select-sector') {
      if (!isLoading) router.replace('/select-sector');
      return <div className="flex items-center justify-center min-h-screen"><SidebarMenuSkeleton /></div>;
  }

  if (pathname === '/select-sector') return <div className="min-h-screen bg-background">{children}</div>;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Link href="/dashboard" className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-foreground">
              <Logo />
              <span className="text-lg font-semibold tracking-tighter">CityMotion</span>
            </Link>
          </SidebarHeader>
          
          <SidebarContent>
            {/* SEÇÃO DA PLATAFORMA (Somente Dev/TI/Admin) */}
            {(userRole === 'dev' || userRole === 'ti') && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                  Plataforma
                </SidebarGroupLabel>
                <SidebarMenu>
                  {filteredPlatformItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={item.label}>
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            )}

            {/* SEÇÃO OPERACIONAL DA EMPRESA */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Operação
              </SidebarGroupLabel>
              {userRole === 'manager' && selectedSector && (
                <div className="px-2 mb-2">
                  <Button variant="outline" size="sm" className="w-full justify-start text-left h-auto" onClick={handleChangeSector}>
                    <div className="flex items-center gap-2">
                      <UserSquare className="h-4 w-4 shrink-0 text-primary" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground leading-none">Unidade</span>
                        <span className="text-xs font-semibold whitespace-normal break-words">{selectedSector}</span>
                      </div>
                    </div>
                  </Button>
                </div>
              )}
              <SidebarMenu>
                {isLoading ? (
                  <SidebarMenuSkeleton showIcon />
                ) : (
                  filteredOperationalItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className='mt-auto'>
            <Separator className='mb-2' />
             <SidebarMenu>
                {filteredBottomNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={item.label}>
                        <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
                <SidebarTrigger asChild className='sm:hidden'>
                    <Button variant="outline" size="icon"><Menu /></Button>
                </SidebarTrigger>
                <div className="ml-auto flex items-center gap-4">
                  {['dev', 'ti', 'admin'].includes(userRole) && (
                    <Button variant="ghost" size="icon" onClick={() => setIsTerminalOpen(true)} title="NexusOS Terminal">
                      <Terminal className="h-5 w-5 text-zinc-500 hover:text-primary" />
                    </Button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full text-[10px]">
                            {unreadCount}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <DropdownMenuLabel className="flex items-center justify-between">
                        <span>Notificações</span>
                        <Button variant="ghost" size="sm" onClick={clearNotifications} className="h-auto p-0 text-xs">Limpar</Button>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <ScrollArea className="h-80">
                        {notifications.length > 0 ? notifications.map((n) => (
                          <DropdownMenuItem key={n.id} className={cn("flex flex-col items-start p-4 gap-1 border-b", !n.read && "bg-muted/40")} onClick={() => markNotificationAsRead(n.id)}>
                            <div className="flex w-full items-center justify-between">
                              <span className={cn("text-sm font-semibold", !n.read && "text-primary")}>{n.title}</span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                          </DropdownMenuItem>
                        )) : (
                          <div className="p-8 text-center text-sm text-muted-foreground">Silêncio por aqui...</div>
                        )}
                      </ScrollArea>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {isLoading || !currentUser ? (
                    <SidebarMenuSkeleton />
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                          <Avatar className='h-9 w-9'>
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${currentUser.id}`} />
                            <AvatarFallback>{getInitials(currentUser?.name)}</AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel className='font-normal'>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">{getRoleName(userRole)}</p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild><Link href="/perfil">Meu Perfil</Link></DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
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
