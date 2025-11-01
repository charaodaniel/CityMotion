
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
import { LayoutDashboard, Car, User, Menu, Settings, LifeBuoy, Route, CalendarClock, Users, UserCog, ScrollText, Building, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useApp } from '@/contexts/app-provider';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


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
  const router = useRouter();
  const { userRole, setUserRole } = useApp();

  const filteredNavItems = useMemo(() => {
    return navItems.filter(item => item.roles.includes(userRole));
  }, [userRole]);

  const filteredBottomNavItems = useMemo(() => {
    return bottomNavItems.filter(item => item.roles.includes(userRole));
  }, [userRole]);

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gestor de Setor';
      case 'driver': return 'Motorista';
      case 'employee': return 'Funcionário';
      default: return 'Desconhecido'
    }
  }
  const getInitials = (role: string) => {
    switch (role) {
        case 'admin': return 'AD';
        case 'manager': return 'GS';
        case 'driver': return 'MT';
        case 'employee': return 'FN';
        default: return 'U';
    }
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
                          <AvatarImage src={`https://avatar.vercel.sh/${userRole}`} alt="Avatar" />
                          <AvatarFallback>{getInitials(userRole)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel className='font-normal'>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{getRoleName(userRole)}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {userRole}@citymotion.com
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
                       <DropdownMenuItem asChild>
                         <Link href="/settings">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Configurações</span>
                        </Link>
                      </DropdownMenuItem>
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
