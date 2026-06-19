"use client";

import React, { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuSkeleton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Car, 
  Route, 
  CalendarClock, 
  Users, 
  ScrollText, 
  Building, 
  UserCog, 
  Wrench, 
  BookOpen, 
  Network, 
  ShieldCheck, 
  DollarSign,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/app-provider';
import { cn } from '@/lib/utils';

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

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole, logout, currentUser, isLoading, activeOrganization, setActiveOrganization } = useApp();

  const isCurrentUserDriver = useMemo(() => currentUser?.role.toLowerCase().includes('motorista'), [currentUser]);

  const filteredPlatformItems = useMemo(() => platformNavItems.filter(item => item.roles.includes(userRole)), [userRole]);
  
  const filteredOperationalItems = useMemo(() => operationalNavItems.filter(item => {
    // Para DEV e TI, a seção de operação só aparece se houver uma organização ativa selecionada
    if (['dev', 'ti'].includes(userRole) && !activeOrganization) {
      return false;
    }

    if (!item.roles.includes(userRole)) return false;
    
    if (userRole === 'employee') {
      const restrictedRoutes = ['/veiculos', '/viagens', '/manutencao', '/relatorios'];
      if (restrictedRoutes.includes(item.href)) return isCurrentUserDriver;
    }
    return true;
  }), [userRole, isCurrentUserDriver, activeOrganization]);

  const handleExitOrganization = () => {
    setActiveOrganization(null);
    router.push('/dev-global');
  };

  return (
    <Sidebar className="border-r border-border/50 bg-sidebar">
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-border/50">
        <Link href={userRole === 'dev' ? '/dev-global' : '/dashboard'} className="flex items-center gap-3">
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

        {filteredOperationalItems.length > 0 && (
          <SidebarGroup className="mt-4">
            <div className="flex items-center justify-between px-2 mb-2">
                <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground p-0">
                Operação {activeOrganization && `(${activeOrganization.name})`}
                </SidebarGroupLabel>
                {activeOrganization && ['dev', 'ti'].includes(userRole) && (
                    <button 
                        onClick={handleExitOrganization}
                        className="text-[9px] font-bold text-primary hover:underline flex items-center gap-1"
                        title="Sair da visão da empresa"
                    >
                        <ArrowLeft className="h-2 w-2" /> VOLTAR
                    </button>
                )}
            </div>
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
        )}
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
            <Button variant="ghost" size="sm" className="justify-start h-8 px-2 text-muted-foreground hover:text-foreground text-xs" onClick={logout}>
                <LogOut className="mr-2 h-3.5 w-3.5" /> Logout
            </Button>
         </div>
      </SidebarFooter>
    </Sidebar>
  );
}