

"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import type { VehicleRequest, VehicleRequestStatus, Schedule, ScheduleStatus, Employee, Vehicle, Sector, WorkSchedule } from '@/lib/types';
import { format } from 'date-fns';


type UserRole = 'admin' | 'manager' | 'employee';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUser: Employee | null;
  
  schedules: Schedule[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  
  vehicleRequests: VehicleRequest[];
  addVehicleRequest: (request: Omit<VehicleRequest, 'id' | 'status' | 'requestDate'>) => void;
  updateVehicleRequestStatus: (id: string, status: VehicleRequestStatus) => void;
  
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  
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
  const [userEmailForSimulation, setUserEmailForSimulation] = useState('admin@citymotion.com');
  
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [vehicleRequests, setVehicleRequests] = useState<VehicleRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
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
        setEmployees(data.employees);
        setSectors(data.sectors);
        setWorkSchedules(data.workSchedules);
      } catch (error) {
        console.error("Could not fetch data:", error);
      }
    }
    fetchData();
  }, []);

  const setRoleAndSimulatedEmail = (role: UserRole) => {
      setUserRole(role);
      // This is a helper to determine which user to show based on login email
      if (role === 'admin') setUserEmailForSimulation('admin@citymotion.com');
      else if (role === 'manager') setUserEmailForSimulation('manager@citymotion.com');
      else setUserEmailForSimulation('employee@citymotion.com'); // Default employee
  }
  
  // This is the core of the user simulation
  const currentUser = useMemo(() => {
    if (!employees.length) return null;

    if (userEmailForSimulation.startsWith('admin')) {
      return employees.find(e => e.name === 'Júlio César'); // The Mayor
    }
    if (userEmailForSimulation.startsWith('manager')) {
      return employees.find(e => e.name === 'Ricardo Nunes'); // Head of Obras
    }
    if (userEmailForSimulation.startsWith('driver')) {
      return employees.find(e => e.name === 'Maria Oliveira'); // A driver
    }
    // Default employee
    return employees.find(e => e.name === 'Ana Souza'); // A teacher
  }, [userEmailForSimulation, employees]);


  const addVehicleRequest = (request: Omit<VehicleRequest, 'id' | 'status' | 'requestDate'>) => {
    const newRequest: VehicleRequest = {
      ...request,
      id: `REQ${Date.now()}`,
      status: 'Pendente',
      requester: currentUser?.name || 'Funcionário Desconhecido',
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
        const availableDriver = employees.find(d => d.status === 'Disponível' && d.sector === request.sector && d.role.toLowerCase().includes('motorista'));
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
             // Update driver and vehicle status to show they are allocated
            setEmployees(employees.map(d => d.id === availableDriver.id ? { ...d, status: 'Em Serviço' } : d));
            setVehicles(vehicles.map(v => v.id === availableVehicle.id ? { ...v, status: 'Em Serviço' } : v));
        } else {
            console.warn("No available driver or vehicle for the approved request.");
            // For this simulation, we'll leave it as approved but unassigned. A real system might queue it.
        }
    }
  };

  return (
    <AppContext.Provider value={{ 
        userRole, 
        setUserRole: setRoleAndSimulatedEmail, 
        currentUser,
        schedules, setSchedules, 
        vehicleRequests, addVehicleRequest, updateVehicleRequestStatus,
        employees, setEmployees,
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
