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
  Fuel,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/app-provider';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
  { href: '/chat', label: 'Comunicação', icon: MessageSquare, roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
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
    <Sidebar className="border-r border-border/50 bg-sidebar/80 backdrop-blur-xl">
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-border/50">
        <Link href={userRole === 'dev' ? '/dev-global' : '/dashboard'} className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20"
          >
            <Network className="h-5 w-5" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight leading-none">CityMotion</span>
            <span className="text-[9px] uppercase font-black text-primary/70 tracking-widest mt-1">NexusOS Kernel</span>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4">
        {filteredPlatformItems.length > 0 && (
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild className="text-[10px] font-bold uppercase tracking-widest text-primary/50 mb-2 px-2 hover:text-primary transition-colors cursor-pointer select-none">
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  Core Platform
                  <ChevronRight className="ml-auto h-3 w-3 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarMenu>
                  {filteredPlatformItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} className={cn("rounded-md transition-all", pathname.startsWith(item.href) ? "bg-primary/10 text-primary border-r-2 border-primary" : "hover:bg-accent/50")}>
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
                  <SidebarGroupLabel asChild className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 p-0 hover:text-foreground transition-colors cursor-pointer select-none">
                    <CollapsibleTrigger className="flex w-full items-center justify-between">
                      <span>Logistics Node {activeOrganization && `(${activeOrganization.name})`}</span>
                      <ChevronRight className="ml-auto h-3 w-3 transition-transform duration-200 group-data-[state=open]/collapsible-op:rotate-90" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  {activeOrganization && ['dev', 'ti'].includes(userRole) && (
                      <button onClick={handleExitOrganization} className="text-[9px] font-black text-primary hover:underline flex items-center gap-1 ml-2">EXIT_NODE</button>
                  )}
              </div>
              <CollapsibleContent>
                <SidebarMenu>
                    {isLoading ? <SidebarMenuSkeleton showIcon /> : filteredOperationalItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={pathname === item.href} className={cn("rounded-md transition-all", pathname === item.href ? "bg-primary/10 text-primary border-r-2 border-primary" : "hover:bg-accent/50")}>
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
         <motion.div 
           initial={{ opacity: 0 }} 
           animate={{ opacity: 1 }}
           className="flex items-center gap-2 p-2 bg-emerald-500/5 rounded border border-emerald-500/20"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-mono text-emerald-500 font-black uppercase tracking-widest">Sys_Status: 100% OK</span>
         </motion.div>
         <div className="flex flex-col gap-1 mt-4">
            <Button variant="ghost" size="sm" className="justify-start h-8 px-2 text-muted-foreground hover:text-primary text-[10px] font-bold uppercase tracking-widest transition-all" asChild>
                <Link href="/dev-docs"><BookOpen className="mr-2 h-3.5 w-3.5" /> Docs_Repo</Link>
            </Button>
            <Button variant="ghost" size="sm" className="justify-start h-8 px-2 text-muted-foreground hover:text-destructive text-[10px] font-bold uppercase tracking-widest transition-all" onClick={logout}>
                <LogOut className="mr-2 h-3.5 w-3.5" /> Terminate_Session</Button>
         </div>
      </SidebarFooter>
    </Sidebar>
  );
}
