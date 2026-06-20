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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  ArrowLeft,
  ChevronRight,
  Terminal,
  FileCode,
  Fuel
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/app-provider';
import { cn } from '@/lib/utils';

const platformNavItems = [
  { href: '/dev-global', label: 'Gestão Global', icon: ShieldCheck, roles: ['dev'] },
  { href: '/dev-docs', label: 'Documentação Central', icon: FileCode, roles: ['dev', 'ti', 'admin'] },
  { href: '/faturamento', label: 'Faturamento', icon: DollarSign, roles: ['dev', 'ti'] },
  { href: '/nexus', label: 'NexusBridge', icon: Network, roles: ['dev', 'ti'] },
  { href: '/terminal', label: 'Console TTY', icon: Terminal, roles: ['dev', 'ti'] },
  { href: '/perfis', label: 'Gerenciar Perfis', icon: UserCog, roles: ['dev', 'ti', 'admin'] },
];

const operationalNavItems = [
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
  { href: '/setores', label: 'Setores', icon: Building, roles: ['dev', 'ti', 'admin'] },
  { href: '/funcionarios', label: 'Funcionários', icon: Users, roles: ['dev', 'ti', 'admin', 'manager'] },
  { href: '/veiculos', label: 'Frota', icon: Car, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
  { href: '/viagens', label: 'Missões', icon: Route, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
  { href: '/abastecimento', label: 'Abastecimento', icon: Fuel, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
  { href: '/manutencao', label: 'Manutenção', icon: Wrench, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
  { href: '/escalas', label: 'Escalas', icon: CalendarClock, roles: ['dev', 'ti', 'admin', 'manager'] },
  { href: '/relatorios', label: 'Relatórios', icon: ScrollText, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole, logout, currentUser, isLoading, activeOrganization, setActiveOrganization } = useApp();

  const isCurrentUserDriver = useMemo(() => currentUser?.role?.toLowerCase().includes('motorista'), [currentUser]);

  const filteredPlatformItems = useMemo(() => platformNavItems.filter(item => item.roles.includes(userRole)), [userRole]);
  
  const filteredOperationalItems = useMemo(() => operationalNavItems.filter(item => {
    if (['dev', 'ti'].includes(userRole) && !activeOrganization) return false;
    if (!item.roles.includes(userRole)) return false;
    if (userRole === 'employee') {
      const restricted = ['/veiculos', '/viagens', '/abastecimento', '/manutencao', '/relatorios'];
      if (restricted.includes(item.href)) return isCurrentUserDriver;
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
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-2 px-2 hover:text-primary transition-colors cursor-pointer select-none">
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  Plataforma
                  <ChevronRight className="ml-auto h-3 w-3 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarMenu>
                  {filteredPlatformItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} className={cn("rounded-sm", pathname.startsWith(item.href) && "border-r-2 border-primary bg-accent/50 text-primary font-bold")}>
                        <Link href={item.href}><item.icon className="h-4 w-4" /><span>{item.label}</span></Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}

        {filteredOperationalItems.length > 0 && (
          <Collapsible defaultOpen className="group/collapsible-op mt-4">
            <SidebarGroup>
              <div className="flex items-center justify-between px-2 mb-2">
                  <SidebarGroupLabel asChild className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground p-0 hover:text-foreground transition-colors cursor-pointer select-none">
                    <CollapsibleTrigger className="flex w-full items-center justify-between">
                      <span>Operação {activeOrganization && `(${activeOrganization.name})`}</span>
                      <ChevronRight className="ml-auto h-3 w-3 transition-transform duration-200 group-data-[state=open]/collapsible-op:rotate-90" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  {activeOrganization && ['dev', 'ti'].includes(userRole) && (
                      <button onClick={handleExitOrganization} className="text-[9px] font-bold text-primary hover:underline flex items-center gap-1 ml-2"><ArrowLeft className="h-2 w-2" /> VOLTAR</button>
                  )}
              </div>
              <CollapsibleContent>
                <SidebarMenu>
                    {isLoading ? <SidebarMenuSkeleton showIcon /> : filteredOperationalItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={pathname === item.href} className={cn("rounded-sm", pathname === item.href && "border-r-2 border-primary bg-accent/50 text-primary font-bold")}>
                            <Link href={item.href}><item.icon className="h-4 w-4" /><span>{item.label}</span></Link>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}
      </SidebarContent>

      <SidebarFooter className='mt-auto p-4 border-t border-border/50'>
         <div className="flex items-center gap-2 p-2 bg-accent/30 rounded border border-border/50">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-tight">Status: Ativo</span>
         </div>
         <div className="flex flex-col gap-1 mt-4">
            <Button variant="ghost" size="sm" className="justify-start h-8 px-2 text-muted-foreground hover:text-foreground text-xs" asChild>
                <Link href="/dev-docs"><BookOpen className="mr-2 h-3.5 w-3.5" /> Documentação</Link>
            </Button>
            <Button variant="ghost" size="sm" className="justify-start h-8 px-2 text-muted-foreground hover:text-foreground text-xs" onClick={logout}>
                <LogOut className="mr-2 h-3.5 w-3.5" /> Sair
            </Button>
         </div>
      </SidebarFooter>
    </Sidebar>
  );
}
