
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
import { LayoutDashboard, Car, Menu, Settings, LifeBuoy, Route, CalendarClock, Users, ScrollText, Building, LogOut, UserCog, Wrench } from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useApp } from '@/contexts/app-provider';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


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
    { href: '/settings', label: 'Configurações', icon: Settings, roles: ['admin'] },
    { href: '/support', label: 'Suporte', icon: LifeBuoy, roles: ['admin', 'manager', 'employee'] },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole, setUserRole, currentUser } = useApp();

  const isCurrentUserDriver = useMemo(() => currentUser?.role.toLowerCase().includes('motorista'), [currentUser]);

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
    router.push('/login');
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Link href="/" className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-foreground">
              <Logo />
              <span className="text-lg font-semibold tracking-tighter">
                CityMotion
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
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
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className='mt-auto'>
            <Separator className='mb-2' />
             <SidebarMenu>
                {filteredBottomNavItems.map((item) => (
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
                ))}
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
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
            </header>
            <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
