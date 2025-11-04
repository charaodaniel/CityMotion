

"use client";

import React, { useMemo } from 'react';
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
import { LayoutDashboard, Car, Menu, Settings, LifeBuoy, Route, CalendarClock, Users, ScrollText, Building, LogOut, UserCog, Wrench, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/app-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';


const navItems = [
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard, roles: ['admin', 'manager', 'employee'] },
  { href: '/setores', label: 'Setores', icon: Building, roles: ['admin'] },
  { href: '/funcionarios', label: 'Funcionários', icon: Users, roles: ['admin', 'manager'] },
  { href: '/veiculos', label: 'Veículos', icon: Car, roles: ['admin', 'manager', 'employee'] },
  { href: '/viagens', label: 'Viagens', icon: Route, roles: ['admin', 'manager', 'employee'] },
  { href: '/manutencao', label: 'Manutenção', icon: Wrench, roles: ['admin', 'manager', 'employee'] },
  { href: '/escalas', label: 'Escalas', icon: CalendarClock, roles: ['admin', 'manager'] },
  { href: '/relatorios', label: 'Relatórios', icon: ScrollText, roles: ['admin', 'manager', 'employee'] },
];

const bottomNavItems = [
    { href: '/perfil', label: 'Meu Perfil', icon: UserCog, roles: ['admin', 'manager', 'employee'] },
    { href: '/perfis', label: 'Gerenciar Perfis', icon: UserCog, roles: ['admin'] },
    { href: '/docs', label: 'Central de Ajuda', icon: BookOpen, roles: ['admin', 'manager', 'employee'] },
    { href: '/settings', label: 'Configurações', icon: Settings, roles: ['admin'] },
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
  const { userRole, setUserRole, currentUser, isLoading } = useApp();

  const isCurrentUserDriver = useMemo(() => currentUser?.role.toLowerCase().includes('motorista'), [currentUser]);
  const isDocsPage = pathname.startsWith('/docs');


  const filteredNavItems = useMemo(() => {
    return navItems.filter(item => {
      if (!item.roles.includes(userRole)) return false;
      
      const isDriverOrAdminOrManager = isCurrentUserDriver || userRole === 'admin' || userRole === 'manager';

      if (['/viagens', '/relatorios', '/veiculos', '/manutencao'].includes(item.href)) {
         return userRole === 'employee' ? isDriverOrAdminOrManager : true;
      }
      
      return true;
    });
  }, [userRole, isCurrentUserDriver]);

  const filteredBottomNavItems = useMemo(() => {
    return bottomNavItems.filter(item => item.roles.includes(userRole));
  }, [userRole]);

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gestor de Setor';
      case 'employee': return currentUser?.role || 'Funcionário'; // Show specific role if available
      default: return 'Desconhecido'
    }
  }
  const getInitials = (name?: string) => {
    return name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
  }
  
  const handleLogout = () => {
    setUserRole('employee'); // Reset to a default role
    router.push('/home');
  }

  const renderDocsLayout = (mainContent: React.ReactNode) => (
    <div className="container mx-auto p-4 sm:p-8">
       <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary"/>
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


  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Link href="/dashboard" className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-foreground">
              <Logo />
              <span className="text-lg font-semibold tracking-tighter">
                CityMotion
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
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
                  {isLoading || !currentUser ? (
                    <Skeleton className="h-9 w-9 rounded-full" />
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                          <Avatar className='h-9 w-9'>
                            <AvatarImage src={`https://avatar.vercel.sh/${currentUser?.id}`} alt="Avatar" />
                            <AvatarFallback>{getInitials(currentUser?.name)}</AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel className='font-normal'>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{currentUser?.name || getRoleName(userRole)}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {getRoleName(userRole)}
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
                        {userRole === 'admin' && (
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
    </SidebarProvider>
  );
}
