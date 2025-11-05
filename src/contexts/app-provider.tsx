

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
  login: (emailAsToken: string) => Promise<void>;
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

// Mapa de e-mails para IDs de usuários de teste do employees.json
const emailToIdMap: Record<string, string> = {
    'admin@citymotion.com': '11', // Júlio César (Prefeito)
    'manager@citymotion.com': '12', // Ricardo Nunes (Engenheiro)
    'driver@citymotion.com': '9', // Marcos Lima (Motorista Escolar)
    'employee@citymotion.com': '4', // Ana Souza (Professor)
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null); // Armazena o e-mail de simulação
  const [userRole, setUserRole] = useState<UserRole>('employee');
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [vehicleRequests, setVehicleRequests] = useState<VehicleRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [workSchedules, setWorkSchedules] = useState<WorkSchedule[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);

  const fetchData = useCallback(async (simulatedEmail: string) => {
    setIsLoading(true);
    try {
      // Usar a API de simulação interna do Next.js
      const response = await fetch('/api/data?type=all');
      if (!response.ok) {
        throw new Error('Falha ao buscar dados simulados.');
      }
      const data = await response.json();
      setSchedules(data.schedules || []);
      setVehicleRequests(data.requests || []);
      setVehicles(data.vehicles || []);
      setEmployees(data.employees || []);
      setSectors(data.sectors || []);
      setWorkSchedules(data.workSchedules || []);
      setMaintenanceRequests(data.maintenanceRequests || []);
      
      // Encontra o usuário logado com base no email simulado
      const userId = emailToIdMap[simulatedEmail];
      const loggedUser = data.employees.find((emp: Employee) => emp.id === userId);

      if(loggedUser) {
        setCurrentUser(loggedUser);
        const roleString = loggedUser.role.toLowerCase();
        if (['prefeito', 'administrador'].some(r => roleString.includes(r))) setUserRole('admin');
        else if (['gestor', 'engenheiro', 'secretário'].some(r => roleString.includes(r))) setUserRole('manager');
        else setUserRole('employee');
      }

    } catch (error) {
      console.error("Não foi possível buscar os dados:", error);
      logout(); 
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (emailAsToken: string) => {
    localStorage.setItem('authToken', emailAsToken);
    setToken(emailAsToken);
    await fetchData(emailAsToken);
  }, [fetchData]);

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setCurrentUser(null);
    setUserRole('employee');
    // Limpa os dados para garantir um estado limpo
    setSchedules([]);
    setVehicleRequests([]);
    setVehicles([]);
    setEmployees([]);
    setSectors([]);
    setWorkSchedules([]);
    setMaintenanceRequests([]);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken'); // O token é o e-mail de simulação
    if (storedToken) {
      setToken(storedToken);
      fetchData(storedToken);
    } else {
      // Se não há token, busca apenas os dados públicos (escalas) para a home page
      const fetchPublicData = async () => {
          setIsLoading(true);
           try {
               const response = await fetch('/api/data?type=work-schedules');
               const data = await response.json();
               setWorkSchedules(data);
           } catch(e) {
               console.error("Erro ao buscar dados públicos", e);
           } finally {
               setIsLoading(false);
           }
      }
      fetchPublicData();
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
