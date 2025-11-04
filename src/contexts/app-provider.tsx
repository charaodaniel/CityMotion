

"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { VehicleRequest, VehicleRequestStatus, Schedule, ScheduleStatus, Employee, Vehicle, Sector, WorkSchedule, MaintenanceRequest, MaintenanceRequestStatus } from '@/lib/types';
import { format } from 'date-fns';
import { jwtDecode } from 'jwt-decode'; // Usaremos para extrair o papel do token

type UserRole = 'admin' | 'manager' | 'employee';

// Interface para o payload decodificado do JWT
interface DecodedToken {
  id: string;
  name: string;
  role: string; // Ex: 'Prefeito', 'Engenheiro Civil', 'Motorista'
  sector: string;
  iat: number;
  exp: number;
}

interface AppContextType {
  isLoading: boolean;
  token: string | null;
  userRole: UserRole;
  currentUser: Employee | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  
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
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('employee');
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [vehicleRequests, setVehicleRequests] = useState<VehicleRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [workSchedules, setWorkSchedules] = useState<WorkSchedule[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);

  const fetchData = useCallback(async (authToken: string) => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/data`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Falha ao buscar dados do servidor.');
      }
      const data = await response.json();
      setSchedules(data.schedules || []);
      setVehicleRequests(data.requests || []);
      setVehicles(data.vehicles || []);
      setEmployees(data.employees || []);
      setSectors(data.sectors || []);
      setWorkSchedules(data.workSchedules || []);
      setMaintenanceRequests(data.maintenanceRequests || []);
      
      // Encontra o usuário logado na lista de funcionários recebida
      const decodedToken = jwtDecode<DecodedToken>(authToken);
      const loggedUser = data.employees.find((emp: Employee) => emp.id === decodedToken.id);
      if(loggedUser) {
        setCurrentUser(loggedUser);
        // Define o userRole com base no cargo
        const roleString = loggedUser.role.toLowerCase();
        if (roleString.includes('prefeito')) setUserRole('admin');
        else if (roleString.includes('gestor') || roleString.includes('engenheiro')) setUserRole('manager');
        else setUserRole('employee');
      }

    } catch (error) {
      console.error("Não foi possível buscar os dados:", error);
      logout(); // Desloga o usuário se a busca de dados falhar (ex: token expirado)
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (authToken: string) => {
    localStorage.setItem('authToken', authToken);
    setToken(authToken);
    await fetchData(authToken);
  }, [fetchData]);

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setCurrentUser(null);
    setUserRole('employee');
    setSchedules([]);
    setVehicleRequests([]);
    setVehicles([]);
    setEmployees([]);
    setSectors([]);
    setWorkSchedules([]);
    setMaintenanceRequests([]);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // Aqui, você pode adicionar uma lógica para verificar a validade do token
      // antes de tentar buscar os dados. Por simplicidade, vamos direto.
      setToken(storedToken);
      fetchData(storedToken);
    } else {
      setIsLoading(false); // Se não há token, não há o que carregar
    }
  }, [fetchData]);


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
                category: request.sector,
            };
            setSchedules(prevSchedules => [newSchedule, ...prevSchedules]);
            setEmployees(employees.map(d => d.id === availableDriver.id ? { ...d, status: 'Em Serviço' } : d));
            setVehicles(vehicles.map(v => v.id === availableVehicle.id ? { ...v, status: 'Em Serviço' } : v));
        } else {
            console.warn("No available driver or vehicle for the approved request.");
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
        token,
        userRole,
        currentUser,
        login,
        logout,
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
