"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { vehicleRequests as initialVehicleRequests } from '@/lib/data';
import type { VehicleRequest } from '@/lib/types';


type UserRole = 'admin' | 'manager' | 'driver' | 'employee';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  vehicleRequests: VehicleRequest[];
  addVehicleRequest: (request: Omit<VehicleRequest, 'id' | 'status' | 'requestDate'>) => void;
  updateVehicleRequestStatus: (id: string, status: 'Aprovada' | 'Rejeitada') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [vehicleRequests, setVehicleRequests] = useState<VehicleRequest[]>(initialVehicleRequests);

  const addVehicleRequest = (request: Omit<VehicleRequest, 'id' | 'status' | 'requestDate'>) => {
    const newRequest: VehicleRequest = {
      ...request,
      id: `REQ${Date.now()}`,
      status: 'Pendente',
      requestDate: new Date().toISOString(),
      priority: request.priority || 'Baixa',
      details: request.details || 'N/A'
    };
    setVehicleRequests(prev => [newRequest, ...prev]);
  };
  
  const updateVehicleRequestStatus = (id: string, status: 'Aprovada' | 'Rejeitada') => {
    setVehicleRequests(prev => prev.filter(req => req.id !== id));
  };

  return (
    <AppContext.Provider value={{ userRole, setUserRole, vehicleRequests, addVehicleRequest, updateVehicleRequestStatus }}>
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
