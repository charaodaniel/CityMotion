

"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { VehicleRequest, VehicleRequestStatus, Schedule, ScheduleStatus, Driver, Vehicle, Sector, WorkSchedule } from '@/lib/types';
import { format } from 'date-fns';


type UserRole = 'admin' | 'manager' | 'driver' | 'employee';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  
  schedules: Schedule[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  
  vehicleRequests: VehicleRequest[];
  addVehicleRequest: (request: Omit<VehicleRequest, 'id' | 'status' | 'requestDate'>) => void;
  updateVehicleRequestStatus: (id: string, status: VehicleRequestStatus) => void;
  
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;

  sectors: Sector[];
  setSectors: React.Dispatch<React.SetStateAction<Sector[]>>;

  workSchedules: WorkSchedule[];
  setWorkSchedules: React.Dispatch<React.SetStateAction<WorkSchedule[]>>;

}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('admin');
  
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [vehicleRequests, setVehicleRequests] = useState<VehicleRequest[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [workSchedules, setWorkSchedules] = useState<WorkSchedule[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/data?type=all');
        if (!response.ok) {
            throw new Error('Failed to fetch initial data');
        }
        const data = await response.json();
        setSchedules(data.schedules);
        setVehicleRequests(data.requests);
        setVehicles(data.vehicles);
        setDrivers(data.drivers);
        setSectors(data.sectors);
        setWorkSchedules(data.workSchedules);
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
      requester: 'Ana Souza', // Simulating the employee 'Ana Souza' is always the requester
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
        const availableDriver = drivers.find(d => d.status === 'Disponível' && d.sector === request.sector);
        const availableVehicle = vehicles.find(v => v.status === 'Disponível' && v.sector === request.sector);

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
                category: request.sector, // Or a more specific category from the request
            };
            setSchedules(prevSchedules => [newSchedule, ...prevSchedules]);
             // Update driver and vehicle status
            setDrivers(drivers.map(d => d.id === availableDriver.id ? { ...d, status: 'Em Serviço' } : d));
            setVehicles(vehicles.map(v => v.id === availableVehicle.id ? { ...v, status: 'Em Serviço' } : v));
        } else {
            // Handle case where no driver or vehicle is available
             console.warn("No available driver or vehicle for the approved request.");
             // Optionally, revert the request status or keep it as 'Approved' but unassigned.
             // For this simulation, we'll leave it as approved.
        }
    }
  };

  return (
    <AppContext.Provider value={{ 
        userRole, setUserRole, 
        schedules, setSchedules, 
        vehicleRequests, addVehicleRequest, updateVehicleRequestStatus,
        drivers, setDrivers,
        vehicles, setVehicles,
        sectors, setSectors,
        workSchedules, setWorkSchedules
    }}>
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
