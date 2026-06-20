
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { VehicleRequest, VehicleRequestStatus, Schedule, ScheduleStatus, Employee, Vehicle, Sector, WorkSchedule, MaintenanceRequest, MaintenanceRequestStatus, UserRole, AppNotification, Organization, Refueling } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';
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
  login: (identifier: string, password?: string, shouldRedirect?: boolean) => Promise<void>;
  logout: () => void;
  refreshData: () => Promise<void>;
  
  schedules: Schedule[];
  updateScheduleStatus: (id: string, status: ScheduleStatus, details?: any) => Promise<void>;
  
  vehicleRequests: VehicleRequest[];
  addVehicleRequest: (request: Partial<VehicleRequest>) => Promise<void>;
  updateVehicleRequestStatus: (id: string, status: VehicleRequestStatus) => Promise<void>;
  
  employees: Employee[];
  addEmployee: (employee: Partial<Employee>) => Promise<void>;
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  
  vehicles: Vehicle[];
  addVehicle: (vehicle: Partial<Vehicle>) => Promise<void>;
  updateVehicle: (id: string, data: Partial<Vehicle>) => Promise<void>;

  sectors: Sector[];
  workSchedules: WorkSchedule[];
  maintenanceRequests: MaintenanceRequest[];
  
  refuelings: Refueling[];
  addRefueling: (data: Partial<Refueling>) => Promise<void>;

  organizations: Organization[];
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'date' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
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
  const [refuelings, setRefuelings] = useState<Refueling[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const getHeaders = useCallback(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('citymotion_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }, []);

  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const response = await fetch('/api/nexus/sync-all', { headers: getHeaders() });
      if (response.status === 401 || response.status === 403) return null;

      const data = await response.json();
      if (!response.ok) {
          if (response.status === 503) {
              toast({ title: "Backend Indisponível", description: "O servidor backend (porta 3001) não está respondendo. Verifique se o processo está rodando.", variant: "destructive" });
          }
          throw new Error(data.message || 'Falha no sync.');
      }
      
      setSchedules(data.trips || []);
      setVehicleRequests(data.requests || []);
      setVehicles(data.vehicles || []);
      setEmployees(data.employees || []);
      setSectors(data.sectors || []);
      setWorkSchedules(data.workSchedules || []);
      setMaintenanceRequests(data.maintenanceRequests || []);
      setRefuelings(data.refuelings || []);
      
      return data;
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [getHeaders, toast]);

  const login = useCallback(async (identifier: string, password = '123456', shouldRedirect = false) => {
    setIsLoading(true);
    try {
        const res = await fetch('/api/nexus/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: identifier, password })
        });
        const data = await res.json();
        if (res.ok && data.token && data.user) {
            localStorage.setItem('citymotion_token', data.token);
            localStorage.setItem('userEmailForSimulation', identifier);
            localStorage.setItem('userPassForSimulation', password);
            
            const roleStr = data.user.role.toLowerCase();
            let determinedRole: UserRole = 'employee';
            if (['dev', 'root', 'global'].some(r => roleStr.includes(r))) determinedRole = 'dev';
            else if (roleStr.includes('ti')) determinedRole = 'ti';
            else if (roleStr.includes('admin')) determinedRole = 'admin';
            else if (['gestor', 'chefe', 'mecanico'].some(r => roleStr.includes(r))) determinedRole = 'manager';
            
            setCurrentUser(data.user);
            setUserRole(determinedRole);
            await fetchData(true);

            if (shouldRedirect) {
                if (determinedRole === 'dev') router.push('/dev-global');
                else router.push('/dashboard');
            }
        } else throw new Error(data.message || 'Erro no login.');
    } catch (error: any) {
        if (shouldRedirect) toast({ title: "Erro de Acesso", description: error.message, variant: "destructive" });
        throw error;
    } finally { setIsLoading(false); }
  }, [fetchData, router, toast]);

  const logout = useCallback(() => {
    localStorage.clear();
    setCurrentUser(null);
    setUserRole('employee'); 
    router.push('/login');
  }, [router]);

  useEffect(() => {
    const init = async () => {
      const email = localStorage.getItem('userEmailForSimulation');
      const pass = localStorage.getItem('userPassForSimulation');
      const token = localStorage.getItem('citymotion_token');
      
      const publicRoutes = ['/home', '/docs', '/login'];
      const isPublic = publicRoutes.some(r => pathname.startsWith(r));

      if (email && token) {
          try { 
              await login(email, pass || '123456', false); 
          } catch (e) { 
              if (!isPublic) logout(); 
          }
      } else { 
          setIsLoading(false); 
      }
    };
    init();
  }, [pathname, login, logout]);

  // MUTAÇÕES REAIS VIA NEXUSBRIDGE
  const addRefueling = async (data: any) => {
    try {
      const res = await fetch('/api/nexus/refuelings', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
          toast({ title: "Sucesso", description: "Abastecimento registrado no SQLite." });
          await fetchData(true);
      }
    } catch (e) { console.error(e); }
  };

  const addEmployee = async (data: any) => {
      try {
        const res = await fetch('/api/nexus/test/db-employees', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (res.ok) {
            toast({ title: "Colaborador Criado", description: "Registro persistido com hash Bcrypt." });
            await fetchData(true);
        }
      } catch (e) { console.error(e); }
  };

  const updateEmployee = async (id: string, data: any) => {
    try {
      const res = await fetch(`/api/nexus/test/db-employees/${id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(data)
      });
      if (res.ok) {
          toast({ title: "Perfil Atualizado", description: "Alterações salvas no banco de dados." });
          await fetchData(true);
      }
    } catch (e) { console.error(e); }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const res = await fetch(`/api/nexus/test/db-employees/${id}`, {
          method: 'DELETE',
          headers: getHeaders()
      });
      if (res.ok) {
          toast({ title: "Registro Removido", description: "O funcionário foi excluído do sistema." });
          await fetchData(true);
      }
    } catch (e) { console.error(e); }
  };

  const addVehicle = async (data: any) => {
      try {
        const res = await fetch('/api/nexus/test/db-vehicles', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (res.ok) {
            toast({ title: "Veículo Adicionado", description: "Ativo registrado na frota." });
            await fetchData(true);
        }
      } catch (e) { console.error(e); }
  };

  const updateScheduleStatus = async (id: string, status: ScheduleStatus, details: any) => {
      // Implementação futura conforme novas rotas de trips no backend
      console.log("Update Trip:", id, status, details);
  };

  const addVehicleRequest = async (request: any) => {
      // Implementação futura
      console.log("Add Request:", request);
  };

  const updateVehicleRequestStatus = async (id: string, status: any) => {
      // Implementação futura
      console.log("Update Request Status:", id, status);
  };

  const updateMaintenanceRequestStatus = async (id: string, status: any) => {
    // Implementação futura
    console.log("Update Maintenance Status:", id, status);
  };

  const addMaintenanceRequest = async (request: any) => {
    // Implementação futura
    console.log("Add Maintenance Request:", request);
  };

  const addNotification = (n: any) => {
    const newNotif = { ...n, id: Math.random().toString(36).substr(2, 9), date: new Date().toISOString(), read: false };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => setNotifications([]);

  return (
    <AppContext.Provider value={{ 
        isLoading, isRefreshing, userRole, currentUser, activeOrganization, setActiveOrganization: setActiveOrganizationState,
        selectedSector, setSelectedSector: setSelectedSectorState, login, logout, refreshData: () => fetchData(true),
        schedules, updateScheduleStatus, vehicleRequests, addVehicleRequest, updateVehicleRequestStatus,
        employees, addEmployee, updateEmployee, deleteEmployee, vehicles, addVehicle, updateVehicle: (id: string, data: any) => Promise.resolve(),
        sectors, workSchedules, maintenanceRequests, refuelings, addRefueling,
        organizations, notifications, addNotification, markNotificationAsRead, clearNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
};
