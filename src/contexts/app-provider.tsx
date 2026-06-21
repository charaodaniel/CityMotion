
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import type { VehicleRequest, VehicleRequestStatus, Schedule, ScheduleStatus, Employee, Vehicle, Sector, WorkSchedule, MaintenanceRequest, MaintenanceRequestStatus, UserRole, AppNotification, Organization, Refueling, Message } from '@/lib/types';
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
  requestPasswordRecovery: (identifier: string) => Promise<{ debugCode?: string }>;
  resetPassword: (identifier: string, token: string, newPass: string) => Promise<void>;
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

  messages: Message[];
  sendMessage: (receiverId: string, content: string) => Promise<void>;

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Ref para evitar loops de inicialização
  const hasInited = useRef(false);

  const getHeaders = useCallback(() => {
    if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('citymotion_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }, []);

  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const response = await fetch('/api/nexus/sync-all', { headers: getHeaders() });
      
      if (response.status === 401 || response.status === 403) {
          return null;
      }

      const data = await response.json();
      if (!response.ok) {
          throw new Error(data.message || 'Falha no sync da NexusBridge.');
      }
      
      setSchedules(data.trips || []);
      setVehicleRequests(data.requests || []);
      setVehicles(data.vehicles || []);
      setEmployees(data.employees || []);
      setSectors(data.sectors || []);
      setWorkSchedules(data.workSchedules || []);
      setMaintenanceRequests(data.maintenanceRequests || []);
      setRefuelings(data.refuelings || []);
      setMessages(data.messages || []);
      
      return data;
    } catch (error: any) {
      console.error("[AppProvider] Sync Error:", error.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [getHeaders]);

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
        } else {
            throw new Error(data.message || 'Credenciais inválidas no Nexus-Core.');
        }
    } catch (error: any) {
        localStorage.removeItem('citymotion_token');
        throw error;
    } finally { 
        setIsLoading(false); 
    }
  }, [fetchData, router]);

  const logout = useCallback(() => {
    localStorage.removeItem('citymotion_token');
    localStorage.removeItem('userEmailForSimulation');
    localStorage.removeItem('userPassForSimulation');
    setCurrentUser(null);
    setUserRole('employee'); 
    router.push('/login');
  }, [router]);

  const requestPasswordRecovery = async (identifier: string) => {
    const res = await fetch('/api/nexus/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Falha ao solicitar recuperação.');
    return data;
  };

  const resetPassword = async (identifier: string, token: string, newPassword: string) => {
    const res = await fetch('/api/nexus/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, token, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Falha ao redefinir senha.');
  };

  useEffect(() => {
    if (hasInited.current) return;
    
    const init = async () => {
      const token = localStorage.getItem('citymotion_token');
      const email = localStorage.getItem('userEmailForSimulation');
      const pass = localStorage.getItem('userPassForSimulation');
      
      const publicRoutes = ['/home', '/docs', '/login', '/terminal', '/forgot-password', '/reset-password'];
      const isPublic = publicRoutes.some(r => pathname.startsWith(r));

      if (token && email) {
          try { 
            await login(email, pass || '123456', false); 
          } catch (e) { 
            if (!isPublic) logout(); 
          }
      } else { 
        setIsLoading(false); 
      }
      hasInited.current = true;
    };
    init();
  }, [pathname, login, logout]);

  // MUTAÇÕES DE DADOS (Persistência via Bridge)
  const sendMessage = async (receiverId: string, content: string) => {
    try {
        const res = await fetch('/api/nexus/chat/messages', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ receiverId, content })
        });
        if (res.ok) {
            await fetchData(true);
        }
    } catch (e) { console.error(e); }
  }

  const addRefueling = async (data: any) => {
    try {
      const res = await fetch('/api/nexus/refuelings', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
          toast({ title: "Sucesso", description: "Abastecimento registrado no banco." });
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
            toast({ title: "Colaborador Criado", description: "Registro persistido no SQLite." });
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
          toast({ title: "Perfil Atualizado", description: "Alterações salvas." });
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
          toast({ title: "Registro Removido", description: "Operação de exclusão concluída." });
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
      // Placeholder para futura implementação de missões reais no banco
      console.log("Trip Status Update:", id, status);
  };

  const addVehicleRequest = async (request: any) => {
      console.log("New Vehicle Request:", request);
  };

  const updateVehicleRequestStatus = async (id: string, status: any) => {
      console.log("Request Status Update:", id, status);
  };

  const updateMaintenanceRequestStatus = async (id: string, status: any) => {
    console.log("Maintenance OS Update:", id, status);
  };

  const addMaintenanceRequest = async (request: any) => {
    console.log("New Maintenance OS:", request);
  };

  const addNotification = useCallback((n: Omit<AppNotification, 'id' | 'date' | 'read'>) => {
    const newNotif: AppNotification = { 
      ...n, 
      id: Math.random().toString(36).substr(2, 9), 
      date: new Date().toISOString(), 
      read: false 
    };
    setNotifications(prev => [newNotif, ...prev]);
    toast({ title: `📲 ${n.title}`, description: n.message });
  }, [toast]);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => setNotifications([]);

  return (
    <AppContext.Provider value={{ 
        isLoading, isRefreshing, userRole, currentUser, activeOrganization, setActiveOrganization: setActiveOrganizationState,
        selectedSector, setSelectedSector: setSelectedSectorState, login, logout, refreshData: () => fetchData(true),
        requestPasswordRecovery, resetPassword,
        schedules, updateScheduleStatus, vehicleRequests, addVehicleRequest, updateVehicleRequestStatus,
        employees, addEmployee, updateEmployee, deleteEmployee, vehicles, addVehicle, updateVehicle: (id: string, data: any) => Promise.resolve(),
        sectors, workSchedules, maintenanceRequests, refuelings, addRefueling,
        messages, sendMessage,
        organizations, notifications, addNotification, markNotificationAsRead, clearNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp deve ser utilizado dentro de um AppProvider');
    return context;
};
