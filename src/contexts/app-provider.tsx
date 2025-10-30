"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppLayout } from '@/components/layout/app-layout';

type UserRole = 'admin' | 'manager' | 'driver' | 'employee';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('admin');

  return (
    <AppContext.Provider value={{ userRole, setUserRole }}>
      <AppLayout>
        {children}
      </AppLayout>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
