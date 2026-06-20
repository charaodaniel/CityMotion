
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import type { VehicleRequest, VehicleRequestStatus, Schedule, ScheduleStatus, Employee, Vehicle, Sector, WorkSchedule, MaintenanceRequest, MaintenanceRequestStatus, UserRole, AppNotification, Organization } from '@/lib/types';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  isLoading: boolean;
  isRefreshing: boolean;
  userRole: UserRole;
  currentUser: Employee | null;
  activeOrganization: Organization | null;
  setActiveOrganization: (org: Organization | null) => void;
  selectedSector: string | null;
  setSelectedSector: (sector: string | null) => void;
  login: (email: string, shouldRedirect?: boolean) => Promise<void>;
  logout: () => void;
  refreshData: () => Promise<void>;
  
  schedules: Schedule[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  
  vehicleRequests: VehicleRequest[];
  addVehicleRequest: (request: Omit<VehicleRequest, 'id' | 'status' | 'requestDate'>) => void;
  updateVehicleRequestStatus: (id: string, status: VehicleRequestStatus) => void;
  
  employees: Employee[];
  addEmployee: (employee: Partial<Employee>) => Promise<void>;
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  
  vehicles: Vehicle[];
  addVehicle: (vehicle: Partial<Vehicle>) => Promise<void>;
  updateVehicle: (id: string, data: Partial<Vehicle>) => Promise<void>;
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;

  sectors: Sector[];
  setSectors: React.Dispatch<React.SetStateAction<Sector[]>>;

  workSchedules: WorkSchedule[];
  setWorkSchedules: React.Dispatch<React.SetStateAction<WorkSchedule[]>>;

  maintenanceRequests: MaintenanceRequest[];
  setMaintenanceRequests: React.Dispatch<React.SetStateAction<MaintenanceRequest[]>>;
  addMaintenanceRequest: (request: Omit<MaintenanceRequest, 'id' | 'status' | 'requestDate' | 'requesterName'>) => void;
  updateMaintenanceRequestStatus: (id: string, status: MaintenanceRequestStatus) => void;

  organizations: Organization[];
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>;

  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'date' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const emailToIdMap: Record<string, string> = {
    'dev@dev.com': '0',
    'admin@citymotion.com': '11', 
    'manager@citymotion.com': '12', 
    'driver@citymotion.com': '9', 
    'employee@citymotion.com': '4', 
    'mecanico@citymotion.com': '17',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('employee');
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [activeOrganization, setActiveOrganizationState] = useState<Organization | null>(null);
  const [selectedSector, setSelectedSectorState] = useState<string | null>(null);
  
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [vehicleRequests, setVehicleRequests] = useState<VehicleRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [workSchedules, setWorkSchedules] = useState<WorkSchedule[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const prevRequestsLength = useRef<number>(0);
  const prevSchedulesLength = useRef<number>(0);

  const setActiveOrganization = (org: Organization | null) => {
    if (typeof window !== 'undefined') {
      if (org) localStorage.setItem('activeOrganization', JSON.stringify(org));
      else localStorage.removeItem('activeOrganization');
    }
    setActiveOrganizationState(org);
  };

  const setSelectedSector = (sector: string | null) => {
    if (typeof window !== 'undefined') {
      if (sector) localStorage.setItem('selectedSector', sector);
      else localStorage.removeItem('selectedSector');
    }
    setSelectedSectorState(sector);
  };

  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const response = await fetch('/api/nexus/sync-all');
      if (!response.ok) throw new Error('Falha ao sincronizar com o banco.');
      
      const data = await response.json();
      
      setSchedules(data.schedules || []);
      setVehicleRequests(data.requests || []);
      setVehicles(data.vehicles || []);
      setEmployees(data.employees || []);
      setSectors(data.sectors || []);
      setWorkSchedules(data.workSchedules || []);
      setMaintenanceRequests(data.maintenanceRequests || []);
      
      const orgRes = await fetch('/api/data?type=organizations');
      if (orgRes.ok) {
          const orgs = await orgRes.json();
          setOrganizations(orgs);
          
          const savedOrg = localStorage.getItem('activeOrganization');
          if (savedOrg) setActiveOrganizationState(JSON.parse(savedOrg));
      }
      
      prevRequestsLength.current = data.requests?.length || 0;
      prevSchedulesLength.current = data.schedules?.length || 0;

      const savedNotifications = localStorage.getItem('app_notifications');
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));

      return data;
    } catch (error) {
      console.error("Erro na sincronização de dados:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const refreshData = async () => {
    await fetchData(true);
    toast({
        title: "Sincronização Completa",
        description: "Os dados da interface agora estão idênticos aos do banco SQLite.",
    });
  };

  // --- CRUD Employees ---
  const addEmployee = async (employee: Partial<Employee>) => {
    try {
      const res = await fetch('/api/nexus/test/db-employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
      });
      if (res.ok) await fetchData(true);
    } catch (e) {
      console.error("Error adding employee", e);
    }
  };

  const updateEmployee = async (id: string, data: Partial<Employee>) => {
    try {
      const res = await fetch(`/api/nexus/test/db-employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) await fetchData(true);
      else throw new Error('Falha no backend');
    } catch (e) {
      console.error("Error updating employee", e);
      throw e;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const res = await fetch(`/api/nexus/test/db-employees/${id}`, { method: 'DELETE' });
      if (res.ok) await fetchData(true);
    } catch (e) {
      console.error("Error deleting employee", e);
    }
  };

  // --- CRUD Vehicles ---
  const addVehicle = async (vehicle: Partial<Vehicle>) => {
    try {
      const res = await fetch('/api/nexus/test/db-vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicle)
      });
      if (res.ok) await fetchData(true);
    } catch (e) {
      console.error("Error adding vehicle", e);
    }
  };

  const updateVehicle = async (id: string, data: Partial<Vehicle>) => {
    try {
      const res = await fetch(`/api/nexus/test/db-vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) await fetchData(true);
    } catch (e) {
      console.error("Error updating vehicle", e);
    }
  };

  const addNotification = useCallback((notification: Omit<AppNotification, 'id' | 'date' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notification,
      id: `NOTIF-${Date.now()}`,
      date: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => {
      const updated = [newNotif, ...prev].slice(0, 50);
      localStorage.setItem('app_notifications', JSON.stringify(updated));
      return updated;
    });

    toast({ title: newNotif.title, description: newNotif.message });
  }, [toast]);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem('app_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('app_notifications');
  };

  const login = useCallback(async (email: string, shouldRedirect = false) => {
    setIsLoading(true);
    localStorage.setItem('userEmailForSimulation', email);
    
    const data = await fetchData();
    if (!data) {
        setIsLoading(false);
        return;
    }
    
    const userId = emailToIdMap[email];
    const user = data.employees.find((emp: Employee) => String(emp.id) === String(userId));

    if (user) {
      setCurrentUser(user);
      const roleString = user.role.toLowerCase();
      
      let determinedRole: UserRole = 'employee';
      
      const devKeywords = ['dev', 'developer', 'desenvolvedor', 'root'];
      const tiKeywords = ['ti', 'suporte técnico', 'sysadmin'];
      const adminKeywords = ['administrador', 'diretor', 'ceo', 'admin'];
      const managerKeywords = ['gestor', 'chefe', 'gerente', 'coordenador', 'mecanico', 'mecânico'];

      if (devKeywords.some(r => roleString.includes(r))) determinedRole = 'dev';
      else if (tiKeywords.some(r => roleString.includes(r))) determinedRole = 'ti';
      else if (adminKeywords.some(r => roleString.includes(r))) determinedRole = 'admin';
      else if (managerKeywords.some(r => roleString.includes(r))) determinedRole = 'manager';
      
      setUserRole(determinedRole);
      
      if (shouldRedirect) {
          if (determinedRole === 'dev') router.push('/dev-global');
          else if (['ti', 'admin'].includes(determinedRole)) router.push('/dashboard');
          else if (determinedRole === 'manager' && Array.isArray(user.sector) && user.sector.length > 1) router.push('/select-sector');
          else if (determinedRole === 'manager' && Array.isArray(user.sector) && user.sector.length === 1) {
              setSelectedSector(user.sector[0]);
              router.push('/dashboard');
          } else router.push('/dashboard');
      }
    }
    setIsLoading(false);
  }, [fetchData, router]);

  const logout = () => {
    localStorage.removeItem('userEmailForSimulation');
    localStorage.removeItem('selectedSector');
    localStorage.removeItem('activeOrganization');
    setCurrentUser(null);
    setActiveOrganizationState(null);
    setSelectedSectorState(null);
    setUserRole('employee'); 
    router.push('/login');
  };

  useEffect(() => {
    const initializeApp = async () => {
      const storedEmail = localStorage.getItem('userEmailForSimulation');
      if (storedEmail) await login(storedEmail, false);
      else await fetchData();
    };
    initializeApp();
  }, []);

  useEffect(() => {
    if (!currentUser || isLoading) return;

    if (userRole === 'manager' && selectedSector && vehicleRequests.length > prevRequestsLength.current) {
      const latestRequest = vehicleRequests[0];
      if (latestRequest.sector === selectedSector && latestRequest.status === 'Pendente' && latestRequest.requester !== currentUser.name) {
        addNotification({
          title: "Nova Solicitação de Veículo",
          message: `${latestRequest.requester} solicitou transporte: "${latestRequest.title}"`,
          type: 'request'
        });
      }
    }
    prevRequestsLength.current = vehicleRequests.length;

    const isDriver = currentUser.role.toLowerCase().includes('motorista');
    if (isDriver && schedules.length > prevSchedulesLength.current) {
      const latestTrip = schedules[0];
      if (latestTrip.driver === currentUser.name && latestTrip.status === 'Agendada') {
        addNotification({
          title: "Nova Viagem Agendada",
          message: `Você tem uma nova viagem atribuída: "${latestTrip.title}" para ${latestTrip.destination}.`,
          type: 'trip'
        });
      }
    }
    prevSchedulesLength.current = schedules.length;

  }, [vehicleRequests, schedules, userRole, selectedSector, currentUser, isLoading, addNotification]);

  const addVehicleRequest = (request: Omit<VehicleRequest, 'id' | 'status' | 'requestDate'>) => {
    const newRequest: VehicleRequest = {
      ...request,
      id: `REQ${Date.now()}`,
      status: 'Pendente',
      requester: currentUser?.name || 'Usuário do Sistema',
      requestDate: new Date().toISOString(),
      priority: request.priority || 'Média',
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
        const availableDriver = employees.find(d => d.status === 'Disponível' && Array.isArray(d.sector) && d.sector.includes(request.sector) && d.role.toLowerCase().includes('motorista'));
        const availableVehicle = vehicles.find(v => v.status === 'Disponível' && v.sector === request.sector);

        if (availableDriver && availableVehicle) {
            const newSchedule: Schedule = {
                id: `SCH${Date.now()}`,
                title: request.title,
                driver: availableDriver.name,
                vehicle: `${availableVehicle.vehicleModel} (${availableVehicle.licensePlate})`,
                origin: "Sede da Organização",
                destination: request.details.split("Destino: ")[1]?.split('.')[0] || "Destino não especificado",
                departureTime: format(new Date(), "dd/MM/yyyy HH:mm"),
                status: 'Agendada',
                category: request.sector,
            };
            setSchedules(prevSchedules => [newSchedule, ...prevSchedules]);
            setEmployees(prev => prev.map(d => d.id === availableDriver.id ? { ...d, status: 'Em Serviço' } : d));
            setVehicles(prev => prev.map(v => v.id === availableVehicle.id ? { ...v, status: 'Em Serviço' } : v));
        }
    }
  };

  const addMaintenanceRequest = (request: Omit<MaintenanceRequest, 'id' | 'status' | 'requestDate' | 'requesterName'>) => {
    const newRequest: MaintenanceRequest = {
      ...request,
      id: `MNT${Date.now()}`,
      status: 'Pendente',
      requesterName: currentUser?.name || 'Usuário',
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
        isRefreshing,
        userRole,
        currentUser,
        activeOrganization,
        setActiveOrganization,
        selectedSector,
        setSelectedSector,
        login,
        logout,
        refreshData,
        schedules, setSchedules, 
        vehicleRequests, addVehicleRequest, updateVehicleRequestStatus,
        employees, addEmployee, updateEmployee, deleteEmployee, setEmployees,
        vehicles, addVehicle, updateVehicle, setVehicles,
        sectors, setSectors,
        workSchedules, setWorkSchedules,
        maintenanceRequests, setMaintenanceRequests, addMaintenanceRequest, updateMaintenanceRequestStatus,
        organizations, setOrganizations,
        notifications, addNotification, markNotificationAsRead, clearNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp deve ser usado dentro de um AppProvider');
  return context;
}
