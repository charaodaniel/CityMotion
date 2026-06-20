
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { VehicleRequest, VehicleRequestStatus, Schedule, ScheduleStatus, Employee, Vehicle, Sector, WorkSchedule, MaintenanceRequest, MaintenanceRequestStatus, UserRole, AppNotification, Organization } from '@/lib/types';
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
  login: (identifier: string, password?: string, shouldRedirect?: boolean) => Promise<void>;
  logout: () => void;
  refreshData: () => Promise<void>;
  
  schedules: Schedule[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  updateScheduleStatus: (id: string, status: ScheduleStatus, details?: any) => Promise<void>;
  
  vehicleRequests: VehicleRequest[];
  addVehicleRequest: (request: Omit<VehicleRequest, 'id' | 'status' | 'requestDate'>) => Promise<void>;
  updateVehicleRequestStatus: (id: string, status: VehicleRequestStatus) => Promise<void>;
  
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
  addMaintenanceRequest: (request: Omit<MaintenanceRequest, 'id' | 'status' | 'requestDate' | 'requesterName'>) => Promise<void>;
  updateMaintenanceRequestStatus: (id: string, status: MaintenanceRequestStatus) => Promise<void>;

  organizations: Organization[];
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>;

  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'date' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

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

  const getHeaders = useCallback(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('citymotion_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }, []);

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
      const response = await fetch('/api/nexus/sync-all', {
        headers: getHeaders()
      });
      
      if (response.status === 401 || response.status === 403) {
          return null;
      }

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.message || 'Falha na comunicação com o backend.');
      }
      
      setSchedules(data.trips || []);
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
          
          if (typeof window !== 'undefined') {
              const savedOrg = localStorage.getItem('activeOrganization');
              if (savedOrg) setActiveOrganizationState(JSON.parse(savedOrg));
          }
      }

      if (typeof window !== 'undefined') {
          const savedNotifications = localStorage.getItem('app_notifications');
          if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
      }

      return data;
    } catch (error: any) {
      console.error("Erro na sincronização de dados:", error);
      if (!isSilent) {
          toast({
              title: "Erro de Sincronização",
              description: "Verifique se o servidor backend está rodando em http://localhost:3001",
              variant: "destructive"
          });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [getHeaders, toast]);

  const refreshData = async () => {
    await fetchData(true);
    toast({
        title: "Dados Sincronizados",
        description: "A interface foi atualizada com os dados mais recentes do banco.",
    });
  };

  const addEmployee = async (employee: Partial<Employee>) => {
    try {
      const res = await fetch('/api/nexus/test/db-employees', {
        method: 'POST',
        headers: getHeaders(),
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
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) await fetchData(true);
    } catch (e) {
      console.error("Error updating employee", e);
      throw e;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const res = await fetch(`/api/nexus/test/db-employees/${id}`, { 
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
          const result = await res.json();
          await fetchData(true);
          toast({ 
              title: result.deleted ? "Registro Removido" : "Colaborador Desativado", 
              description: result.message 
          });
      }
    } catch (e) {
      console.error("Error deleting employee", e);
    }
  };

  const addVehicle = async (vehicle: Partial<Vehicle>) => {
    try {
      const res = await fetch('/api/nexus/test/db-vehicles', {
        method: 'POST',
        headers: getHeaders(),
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
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) await fetchData(true);
    } catch (e) {
      console.error("Error updating vehicle", e);
    }
  };

  const updateScheduleStatus = async (id: string, status: ScheduleStatus, details?: any) => {
    try {
      const res = await fetch(`/api/nexus/trips/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status, ...details })
      });
      if (res.ok) {
        await fetchData(true);
      }
    } catch (e) {
      console.error("Error updating trip", e);
    }
  };

  const addVehicleRequest = async (request: Omit<VehicleRequest, 'id' | 'status' | 'requestDate'>) => {
    try {
        const res = await fetch('/api/nexus/requests', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(request)
        });
        if (res.ok) await fetchData(true);
      } catch (e) {
        console.error("Error creating request", e);
      }
  };

  const updateVehicleRequestStatus = async (id: string, status: VehicleRequestStatus) => {
    try {
      const res = await fetch(`/api/nexus/requests/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) await fetchData(true);
    } catch (e) {
      console.error("Error updating request status", e);
    }
  };

  const addMaintenanceRequest = async (request: Omit<MaintenanceRequest, 'id' | 'status' | 'requestDate' | 'requesterName'>) => {
    try {
        const res = await fetch('/api/nexus/maintenance', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(request)
        });
        if (res.ok) await fetchData(true);
      } catch (e) {
        console.error("Error creating maintenance request", e);
      }
  };

  const updateMaintenanceRequestStatus = async (id: string, status: MaintenanceRequestStatus) => {
    try {
      const res = await fetch(`/api/nexus/maintenance/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) await fetchData(true);
    } catch (e) {
      console.error("Error updating maintenance status", e);
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_notifications', JSON.stringify(updated));
      }
      return updated;
    });

    toast({ title: newNotif.title, description: newNotif.message });
  }, [toast]);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_notifications', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    if (typeof window !== 'undefined') {
        localStorage.removeItem('app_notifications');
    }
  };

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
            
            setCurrentUser(data.user);
            const roleString = data.user.role.toLowerCase();
            
            let determinedRole: UserRole = 'employee';
            const devKeywords = ['dev', 'developer', 'desenvolvedor', 'root', 'global'];
            const tiKeywords = ['ti', 'suporte técnico', 'sysadmin'];
            const adminKeywords = ['administrador', 'diretor', 'ceo', 'admin'];
            const managerKeywords = ['gestor', 'chefe', 'gerente', 'coordenador', 'mecanico', 'mecânico'];

            if (devKeywords.some(r => roleString.includes(r))) determinedRole = 'dev';
            else if (tiKeywords.some(r => roleString.includes(r))) determinedRole = 'ti';
            else if (adminKeywords.some(r => roleString.includes(r))) determinedRole = 'admin';
            else if (managerKeywords.some(r => roleString.includes(r))) determinedRole = 'manager';
            
            setUserRole(determinedRole);
            
            // Sincroniza os dados antes de redirecionar
            await fetchData(true);

            if (shouldRedirect) {
                if (determinedRole === 'dev') router.push('/dev-global');
                else if (['ti', 'admin'].includes(determinedRole)) router.push('/dashboard');
                else if (determinedRole === 'manager' && Array.isArray(data.user.sector) && data.user.sector.length > 1) {
                    router.push('/select-sector');
                } else if (determinedRole === 'manager' && Array.isArray(data.user.sector) && data.user.sector.length === 1) {
                    setSelectedSector(data.user.sector[0]);
                    router.push('/dashboard');
                } else {
                    router.push('/dashboard');
                }
            }
        } else {
            throw new Error(data.message || 'Credenciais inválidas ou erro no servidor.');
        }
    } catch (error: any) {
        if (shouldRedirect) {
            toast({ title: "Erro de Acesso", description: error.message, variant: "destructive" });
        }
        throw error;
    } finally {
        setIsLoading(false);
    }
  }, [fetchData, router, setSelectedSector, toast]);

  const logout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('userEmailForSimulation');
        localStorage.removeItem('userPassForSimulation');
        localStorage.removeItem('citymotion_token');
        localStorage.removeItem('selectedSector');
        localStorage.removeItem('activeOrganization');
    }
    setCurrentUser(null);
    setActiveOrganizationState(null);
    setSelectedSectorState(null);
    setUserRole('employee'); 
    router.push('/login');
  };

  useEffect(() => {
    const initializeApp = async () => {
      const storedIdentifier = typeof window !== 'undefined' ? localStorage.getItem('userEmailForSimulation') : null;
      const storedPass = typeof window !== 'undefined' ? localStorage.getItem('userPassForSimulation') : null;
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('citymotion_token') : null;
      
      if (storedIdentifier && storedToken) {
          try {
              await login(storedIdentifier, storedPass || '123456', false);
          } catch (e) {
              logout();
          }
      } else {
          setIsLoading(false);
          // Só redireciona para login se não estiver em rotas públicas
          const publicRoutes = ['/home', '/cracha', '/docs'];
          const isPublic = publicRoutes.some(r => window.location.pathname.startsWith(r));
          if (!isPublic && window.location.pathname !== '/login') {
            router.push('/login');
          }
      }
    };
    initializeApp();
  }, []);

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
        schedules, setSchedules, updateScheduleStatus,
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
