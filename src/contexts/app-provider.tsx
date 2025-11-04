
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { drivers, vehicles } from '@/lib/data';
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
  const [vehicleRequests, setVehicleRequests] = useState<VehicleRequest[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [schedulesRes, requestsRes] = await Promise.all([
            fetch('/api/data?type=schedules'),
            fetch('/api/data?type=vehicle-requests')
        ]);
        if (!schedulesRes.ok || !requestsRes.ok) {
            throw new Error('Failed to fetch initial data');
        }
        const schedulesData = await schedulesRes.json();
        const requestsData = await requestsRes.json();
        setSchedules(schedulesData);
        setVehicleRequests(requestsData);
      } catch (error) {
        console.error("Could not fetch data:", error);
      }
    }
    fetchData();
  }, []);


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
    let requestToProcess: VehicleRequest | undefined;
    
    setVehicleRequests(prev => 
        prev.map(req => {
            if (req.id === id) {
                requestToProcess = { ...req, status };
                return requestToProcess;
            }
            return req;
        })
    );

    if (status === 'Aprovada' && requestToProcess) {
      const request = requestToProcess;
        // Simulação da lógica de alocação de recursos
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
