
"use client";

import React from 'react';
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
  { href: '/', label: 'Painel', icon: LayoutDashboard },
  { href: '/setores', label: 'Setores', icon: Building },
  { href: '/motoristas', label: 'Motoristas', icon: User },
  { href: '/veiculos', label: 'Veículos', icon: Car },
  { href: '/viagens', label: 'Viagens', icon: Route },
  { href: '/escalas', label: 'Escalas', icon: CalendarClock },
  { href: '/relatorios', label: 'Relatórios', icon: ScrollText },
];

const bottomNavItems = [
    { href: '/perfil', label: 'Meu Perfil', icon: UserCog },
    { href: '/settings', label: 'Configurações', icon: Settings },
    { href: '/support', label: 'Suporte', icon: LifeBuoy },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userRole, setUserRole } = useApp();

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'manager': return 'Gestor';
      case 'driver': return 'Motorista';
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
              {navItems.map((item) => (
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
                {bottomNavItems.map((item) => (
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip='Trocar Perfil'>
                                <Users />
                                <span>Trocar Perfil</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" className="mb-2">
                        <DropdownMenuLabel>Simular Perfil</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setUserRole('admin')}>
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>A</AvatarFallback>
                          </Avatar>
                          <span>Administrador</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setUserRole('manager')}>
                           <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>G</AvatarFallback>
                          </Avatar>
                          <span>Gestor de Setor</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setUserRole('driver')}>
                           <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>M</AvatarFallback>
                          </Avatar>
                          <span>Motorista</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

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
