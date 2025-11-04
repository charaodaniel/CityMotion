

"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import type { VehicleRequest, VehicleRequestStatus, Schedule, ScheduleStatus, Employee, Vehicle, Sector, WorkSchedule, MaintenanceRequest, MaintenanceRequestStatus } from '@/lib/types';
import { format } from 'date-fns';

// Define a interface para o objeto exposto pelo preload.js
declare global {
  interface Window {
    electronAPI?: {
      getApiConfig: () => Promise<{ serverIp: string }>;
    };
  }
}


type UserRole = 'admin' | 'manager' | 'employee';

interface AppContextType {
  isLoading: boolean;
  userRole: UserRole;
  setUserRole: (role: UserRole, email?: string) => void;
  userEmailForSimulation: string;
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

  maintenanceRequests: MaintenanceRequest[];
  setMaintenanceRequests: React.Dispatch<React.SetStateAction<MaintenanceRequest[]>>;
  addMaintenanceRequest: (request: Omit<MaintenanceRequest, 'id' | 'status' | 'requestDate' | 'requesterName'>) => void;
  updateMaintenanceRequestStatus: (id: string, status: MaintenanceRequestStatus) => void;

}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>('employee');
  const [userEmailForSimulation, setUserEmailForSimulation] = useState('');
  
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [vehicleRequests, setVehicleRequests] = useState<VehicleRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [workSchedules, setWorkSchedules] = useState<WorkSchedule[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);


  useEffect(() => {
    async function getApiUrl() {
        let baseUrl = 'http://localhost:3001'; // Padrão para desenvolvimento web

        // Se estiver rodando no Electron, tenta ler a configuração
        if (window.electronAPI) {
            try {
                const config = await window.electronAPI.getApiConfig();
                if (config.serverIp) {
                    baseUrl = `http://${config.serverIp}:3001`;
                    console.log(`Conectando ao servidor customizado: ${baseUrl}`);
                } else {
                    console.log("Nenhum IP customizado. Usando localhost como padrão.");
                }
            } catch (error) {
                console.error("Erro ao obter configuração da API via Electron, usando localhost.", error);
            }
        }
        return `${baseUrl}/api`;
    }

    async function fetchData() {
      setIsLoading(true);
      try {
        // Por enquanto, esta API simulada /api/data continua a funcionar.
        // A lógica de `getApiUrl` está aqui para quando você refatorar para
        // consumir do backend Node.js diretamente.
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
        setMaintenanceRequests(data.maintenanceRequests);
      } catch (error) {
        console.error("Could not fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const setRoleAndSimulatedEmail = (role: UserRole, email: string = '') => {
      setUserRole(role);
      setUserEmailForSimulation(email);
  }
  
  // This is the core of the user simulation
  const currentUser = useMemo(() => {
    if (isLoading || !employees.length || !userEmailForSimulation) return null;
    
    // Fallback for empty email, ensuring no user is selected
    if (userEmailForSimulation === '') return null;

    if (userEmailForSimulation.startsWith('admin')) {
      return employees.find(e => e.name === 'Júlio César') || null; // The Mayor (simulated Admin)
    }
    if (userEmailForSimulation.startsWith('manager')) {
      return employees.find(e => e.name === 'Ricardo Nunes') || null; // Head of Obras (simulated Manager)
    }
    if (userEmailForSimulation.startsWith('driver')) {
      return employees.find(e => e.name === 'Maria Oliveira') || null; // A driver
    }
    if (userEmailForSimulation.startsWith('employee')) {
      return employees.find(e => e.name === 'Ana Souza') || null; // A teacher
    }
    
    // Fallback or default user
    return null;
  }, [userEmailForSimulation, employees, isLoading]);


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

  const addMaintenanceRequest = (request: Omit<MaintenanceRequest, 'id' | 'status' | 'requestDate' | 'requesterName'>) => {
    const newRequest: MaintenanceRequest = {
      ...request,
      id: `MNT${Date.now()}`,
      status: 'Pendente',
      requesterName: currentUser?.name || 'Desconhecido',
      requestDate: new Date().toISOString(),
    };
    setMaintenanceRequests(prev => [newRequest, ...prev]);
  };

  const updateMaintenanceRequestStatus = (id: string, status: MaintenanceRequestStatus) => {
    setMaintenanceRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, status } : req))
    );

    const request = maintenanceRequests.find(req => req.id === id);
    if (request) {
        if (status === 'Em Andamento') {
            setVehicles(prev => prev.map(v => v.id === request.vehicleId ? { ...v, status: 'Manutenção' } : v));
        } else if (status === 'Concluída') {
            setVehicles(prev => prev.map(v => v.id === request.vehicleId ? { ...v, status: 'Disponível' } : v));
        }
    }
  };

  return (
    <AppContext.Provider value={{ 
        isLoading,
        userRole, 
        setUserRole: setRoleAndSimulatedEmail,
        userEmailForSimulation,
        currentUser,
        schedules, setSchedules, 
        vehicleRequests, addVehicleRequest, updateVehicleRequestStatus,
        employees, setEmployees,
        vehicles, setVehicles,
        sectors, setSectors,
        workSchedules, setWorkSchedules,
        maintenanceRequests, setMaintenanceRequests, addMaintenanceRequest, updateMaintenanceRequestStatus
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
