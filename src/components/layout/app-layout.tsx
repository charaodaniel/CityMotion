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
import { Logo } from '@/components/icons';
import { LayoutDashboard, Car, User, Menu, Settings, LifeBuoy, Route, CalendarClock } from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

const navItems = [
  { href: '/', label: 'Painel', icon: LayoutDashboard },
  { href: '/motoristas', label: 'Motoristas', icon: User },
  { href: '/veiculos', label: 'Veículos', icon: Car },
  { href: '/viagens', label: 'Viagens', icon: Route },
  { href: '/escalas', label: 'Escalas', icon: CalendarClock },
];

const bottomNavItems = [
    { href: '/settings', label: 'Configurações', icon: Settings },
    { href: '/support', label: 'Suporte', icon: LifeBuoy },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
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
                        <a href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                        </a>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
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
