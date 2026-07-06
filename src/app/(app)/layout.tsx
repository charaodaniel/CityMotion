
"use client";

import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useApp } from '@/contexts/app-provider';
import { DevTerminal } from '@/components/dev-terminal';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { Header as PublicHeader } from '@/components/layout/header';
import { usePathname } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userRole, currentUser } = useApp();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  // Telas que não utilizam o layout padrão de sidebar (ex: seleção de setor)
  if (pathname === '/select-sector') return <div className="min-h-screen bg-background">{children}</div>;

  // Se for uma rota pública e o usuário não estiver logado, usamos o layout público com cabeçalho simples
  const publicRoutes = ['/docs'];
  const isPublicRoute = pathname ? publicRoutes.some(route => pathname.startsWith(route)) : false;

  if (!currentUser && isPublicRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PublicHeader />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/30">
        <AppSidebar />

        <SidebarInset className="bg-background">
            <AppHeader onTerminalOpen={() => setIsTerminalOpen(true)} />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
        </SidebarInset>
      </div>
      
      {['dev', 'ti', 'admin'].includes(userRole) && (
        <DevTerminal 
          isOpen={isTerminalOpen} 
          onClose={() => setIsTerminalOpen(false)} 
        />
      )}
    </SidebarProvider>
  );
}
