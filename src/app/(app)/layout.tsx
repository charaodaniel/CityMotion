
"use client";

import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useApp } from '@/contexts/app-provider';
import { DevTerminal } from '@/components/dev-terminal';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { usePathname } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userRole } = useApp();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  // Telas que não utilizam o layout padrão de sidebar (ex: seleção de setor)
  if (pathname === '/select-sector') return <div className="min-h-screen bg-background">{children}</div>;

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
          onOpenChange={setIsTerminalOpen} 
        />
      )}
    </SidebarProvider>
  );
}
