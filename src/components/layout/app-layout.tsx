
"use client";

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
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
import { LayoutDashboard, Car, User, Menu, Settings, LifeBuoy, Route, CalendarClock, Users, UserCog, ScrollText, Building } from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useApp } from '@/contexts/app-provider';
import { Avatar, AvatarFallback } from '../ui/avatar';


const navItems = [
  { href: '/', label: 'Painel', icon: LayoutDashboard, roles: ['admin', 'manager', 'driver', 'employee'] },
  { href: '/setores', label: 'Setores', icon: Building, roles: ['admin'] },
  { href: '/motoristas', label: 'Motoristas', icon: User, roles: ['admin', 'manager'] },
  { href: '/veiculos', label: 'Veículos', icon: Car, roles: ['admin', 'manager'] },
  { href: '/viagens', label: 'Viagens', icon: Route, roles: ['admin', 'manager', 'driver'] },
  { href: '/escalas', label: 'Escalas', icon: CalendarClock, roles: ['admin', 'manager'] },
  { href: '/relatorios', label: 'Relatórios', icon: ScrollText, roles: ['admin', 'manager', 'driver'] },
];

const bottomNavItems = [
    { href: '/perfil', label: 'Meu Perfil', icon: UserCog, roles: ['admin', 'manager', 'driver', 'employee'] },
    { href: '/settings', label: 'Configurações', icon: Settings, roles: ['admin'] },
    { href: '/support', label: 'Suporte', icon: LifeBuoy, roles: ['admin', 'manager', 'driver', 'employee'] },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userRole, setUserRole } = useApp();

  const filteredNavItems = useMemo(() => {
    return navItems.filter(item => item.roles.includes(userRole));
  }, [userRole]);

  const filteredBottomNavItems = useMemo(() => {
    return bottomNavItems.filter(item => item.roles.includes(userRole));
  }, [userRole]);

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'manager': return 'Gestor';
      case 'driver': return 'Motorista';
      case 'employee': return 'Funcionário';
      default: return 'Desconhecido'
    }
  }
  const getInitials = (role: string) => {
    return getRoleName(role).charAt(0);
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
                    isActive={pathname.startsWith(item.href) && (item.href !== '/' || pathname === '/')}
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
                 <div className="flex items-center gap-2 p-2 mt-2 border-t border-sidebar-border">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(userRole)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-sidebar-foreground">{getRoleName(userRole)}</span>
                        <span className="text-xs text-muted-foreground">{userRole}@citymotion.com</span>
                    </div>
                </div>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <SidebarTrigger asChild className='sm:hidden'>
                    <Button variant="outline" size="icon">
                        <Menu />
                    </Button>
                </SidebarTrigger>
            </header>
            <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
