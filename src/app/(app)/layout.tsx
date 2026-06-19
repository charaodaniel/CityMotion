
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
import { LayoutDashboard, Car, Menu, Settings, Route, CalendarClock, Users, ScrollText, Building, LogOut, UserCog, Wrench, BookOpen, UserSquare, Bell, Check, Trash2, Info, Network, Terminal, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/app-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DevTerminal } from '@/components/dev-terminal';


const navItems = [
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
  { href: '/dev-global', label: 'Gestão Global', icon: ShieldCheck, roles: ['dev'] },
  { href: '/setores', label: 'Setores', icon: Building, roles: ['dev', 'ti', 'admin'] },
  { href: '/funcionarios', label: 'Funcionários', icon: Users, roles: ['dev', 'ti', 'admin', 'manager'] },
  { href: '/veiculos', label: 'Veículos', icon: Car, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
  { href: '/viagens', label: 'Viagens', icon: Route, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
  { href: '/manutencao', label: 'Manutenção', icon: Wrench, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
  { href: '/escalas', label: 'Escalas', icon: CalendarClock, roles: ['dev', 'ti', 'admin', 'manager'] },
  { href: '/relatorios', label: 'Relatórios', icon: ScrollText, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
];

const bottomNavItems = [
    { href: '/nexus', label: 'NexusBridge', icon: Network, roles: ['dev', 'ti'] },
    { href: '/perfil', label: 'Meu Perfil', icon: UserCog, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
    { href: '/perfis', label: 'Gerenciar Perfis', icon: UserCog, roles: ['dev', 'ti', 'admin'] },
    { href: '/docs', label: 'Central de Ajuda', icon: BookOpen, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
    { href: '/settings', label: 'Configurações', icon: Settings, roles: ['ti', 'admin'] },
]

const docsSidebarNavItems = [
  {
    title: "Introdução",
    href: "/docs",
  },
  {
    title: "Perfis de Usuário",
    href: "/docs/user-profiles",
  },
  {
    title: "Solicitando um Transporte",
    href: "/docs/requesting-trips",
  },
  {
    title: "Crachá Virtual",
    href: "/docs/virtual-badge",
  },
];


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole, logout, currentUser, isLoading, selectedSector, setSelectedSector, notifications, markNotificationAsRead, clearNotifications } = useApp();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const isCurrentUserDriver = useMemo(() => currentUser?.role.toLowerCase().includes('motorista'), [currentUser]);
  const isDocsPage = pathname.startsWith('/docs');


  const filteredNavItems = useMemo(() => {
    return navItems.filter(item => {
      // 1. Check if the general role has access
      if (!item.roles.includes(userRole)) return false;
      
      // 2. Technical roles see everything assigned to them
      if (['dev', 'ti', 'admin', 'manager'].includes(userRole)) return true;

      // 3. For Employees, we only show certain tools if they are Drivers
      const restrictedRoutes = ['/veiculos', '/viagens', '/manutencao', '/relatorios'];
      if (userRole === 'employee' && restrictedRoutes.includes(item.href)) {
         return isCurrentUserDriver;
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
  
  const handleLogout = () => {
    logout();
  }

  const handleChangeSector = () => {
    setSelectedSector(null);
    router.push('/select-sector');
  }

  const renderDocsLayout = (mainContent: React.ReactNode) => (
    <div className="container mx-auto p-4 sm:p-8">
       <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3">
          < BookOpen className="w-8 h-8 text-primary"/>
          Central de Ajuda
        </h1>
        <p className="text-muted-foreground mt-2">
          Encontre guias, tutoriais e respostas para suas dúvidas sobre o CityMotion.
        </p>
      </div>
      <div className="flex -mx-4">
        <aside className="w-1/4 px-4">
          <nav className="sticky top-20">
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <div className="space-y-4 pr-4">
                {docsSidebarNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block rounded-md p-3 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </nav>
        </aside>
        <main className="w-3/4 px-4">
          <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert bg-card p-8 rounded-lg border">
            {mainContent}
          </div>
        </main>
      </div>
    </div>
  )

  if (userRole === 'manager' && !selectedSector && pathname !== '/select-sector') {
      if (!isLoading) {
          router.replace('/select-sector');
      }
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Skeleton className="h-screen w-full" />
        </div>
      );
  }

  if (pathname === '/select-sector') {
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Link href="/home" className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-foreground">
              <Logo />
              <span className="text-lg font-semibold tracking-tighter">
                CityMotion
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            {userRole === 'manager' && selectedSector && (
              <div className="p-2">
                <Button variant="outline" size="sm" className="w-full justify-start text-left h-auto" onClick={handleChangeSector}>
                  <div className="flex items-center gap-2">
                    <UserSquare className="h-4 w-4 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Gerenciando</span>
                      <span className="text-sm font-semibold whitespace-normal break-words">{selectedSector}</span>
                    </div>
                  </div>
                </Button>
              </div>
            )}
            <SidebarMenu>
              {isLoading ? (
                <>
                  <SidebarMenuSkeleton showIcon />
                  <SidebarMenuSkeleton showIcon />
                  <SidebarMenuSkeleton showIcon />
                  <SidebarMenuSkeleton showIcon />
                </>
              ) : (
                filteredNavItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(item.href)}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className='mt-auto'>
            <Separator className='mb-2' />
             <SidebarMenu>
                {isLoading ? (
                  <>
                    <SidebarMenuSkeleton showIcon />
                    <SidebarMenuSkeleton showIcon />
                  </>
                ) : (
                  filteredBottomNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname.startsWith(item.href)}
                        tooltip={item.label}
                    >
                        <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
                <SidebarTrigger asChild className='sm:hidden'>
                    <Button variant="outline" size="icon">
                        <Menu />
                    </Button>
                </SidebarTrigger>
                <div className="ml-auto flex items-center gap-4">
                  
                  {/* Developer Terminal Trigger (Visível para DEV, TI e ADMIN) */}
                  {['dev', 'ti', 'admin'].includes(userRole) && (
                    <Button variant="ghost" size="icon" onClick={() => setIsTerminalOpen(true)} title="Terminal de Desenvolvedor">
                      <Terminal className="h-5 w-5 text-zinc-500 hover:text-primary transition-colors" />
                    </Button>
                  )}

                  {/* Notification Center */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full text-[10px]">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <DropdownMenuLabel className="flex items-center justify-between">
                        <span>Notificações</span>
                        {notifications.length > 0 && (
                           <Button variant="ghost" size="sm" className="h-auto p-1 text-xs text-muted-foreground" onClick={clearNotifications}>
                             <Trash2 className="h-3 w-3 mr-1" /> Limpar
                           </Button>
                        )}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <ScrollArea className="h-80">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <DropdownMenuItem 
                              key={n.id} 
                              className={cn("flex flex-col items-start p-4 cursor-pointer gap-1 border-b last:border-0", !n.read && "bg-muted/40")}
                              onClick={() => markNotificationAsRead(n.id)}
                            >
                              <div className="flex w-full items-center justify-between">
                                <span className={cn("text-sm font-semibold", !n.read && "text-primary")}>{n.title}</span>
                                {!n.read && <div className="h-2 w-2 rounded-full bg-primary" />}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                              <span className="text-[10px] text-muted-foreground mt-1">
                                {formatDistanceToNow(new Date(n.date), { addSuffix: true, locale: ptBR })}
                              </span>
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center p-8 text-center">
                            <Info className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Nenhuma notificação nova.</p>
                          </div>
                        )}
                      </ScrollArea>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {isLoading || !currentUser ? (
                    <Skeleton className="h-9 w-9 rounded-full" />
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                          <Avatar className='h-9 w-9'>
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${currentUser.id}`} alt={currentUser.name} />
                            <AvatarFallback>{getInitials(currentUser?.name)}</AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel className='font-normal'>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{currentUser?.name || getRoleName(userRole)}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {getRoleName(userRole)} {userRole === 'manager' && `(${currentUser?.role})`}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/perfil">
                            <UserCog className="mr-2 h-4 w-4" />
                            <span>Meu Perfil</span>
                          </Link>
                        </DropdownMenuItem>
                        {['dev', 'ti', 'admin'].includes(userRole) && (
                        <DropdownMenuItem asChild>
                          <Link href="/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Configurações</span>
                          </Link>
                        </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link href="/docs">
                            <BookOpen className="mr-2 h-4 w-4" />
                            <span>Ajuda</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Sair</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
            </header>
            <main className="flex-1 overflow-auto">
              {isDocsPage ? renderDocsLayout(children) : children}
            </main>
        </SidebarInset>
      </div>

      {/* Dev Terminal Overlay */}
      <DevTerminal 
        isOpen={isTerminalOpen} 
        onClose={() => setIsTerminalOpen(false)} 
        onOpenChange={setIsTerminalOpen}
      />
    </SidebarProvider>
  );
}
