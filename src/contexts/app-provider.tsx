"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { vehicleRequests as initialVehicleRequests, schedules as initialSchedules, drivers, vehicles } from '@/lib/data';
import type { VehicleRequest, VehicleRequestStatus, Schedule, ScheduleStatus } from '@/lib/types';
import { format } from 'date-fns';


type UserRole = 'admin' | 'manager' | 'driver' | 'employee';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  vehicleRequests: VehicleRequest[];
  addVehicleRequest: (request: Omit<VehicleRequest, 'id' | 'status' | 'requestDate'>) => void;
  updateVehicleRequestStatus: (id: string, status: VehicleRequestStatus) => void;
  schedules: Schedule[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [vehicleRequests, setVehicleRequests] = useState<VehicleRequest[]>(initialVehicleRequests);
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);

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
  
  const updateVehicleRequestStatus = (id: string, status: VehicleRequestStatus) => {
    setVehicleRequests(prev => 
        prev.map(req => 
            req.id === id ? { ...req, status: status } : req
        )
    );

    if (status === 'Aprovada') {
      const request = vehicleRequests.find(req => req.id === id);
      if (request) {
        // Encontrar um motorista e veículo disponível para a nova viagem
        const availableDriver = drivers.find(d => d.status === 'Disponível');
        const availableVehicle = vehicles.find(v => v.status === 'Disponível');

        if (availableDriver && availableVehicle) {
            const newSchedule: Schedule = {
                id: `SCH${Date.now()}`,
                title: request.title,
                driver: availableDriver.name,
                vehicle: `${availableVehicle.vehicleModel} (${availableVehicle.licensePlate})`,
                origin: "Garagem da Prefeitura",
                destination: request.details.split("Destino: ")[1]?.split('.')[0] || "Não especificado",
                departureTime: format(new Date(), "dd/MM/yyyy HH:mm"),
                status: 'Agendada',
                category: request.sector,
            };
            setSchedules(prevSchedules => [newSchedule, ...prevSchedules]);
        }
      }
    }
  };

  return (
    <AppContext.Provider value={{ userRole, setUserRole, vehicleRequests, addVehicleRequest, updateVehicleRequestStatus, schedules, setSchedules }}>
      {children}
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
