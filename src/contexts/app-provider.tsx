
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
          
          if (typeof window !== 'undefined') {
              const savedOrg = localStorage.getItem('activeOrganization');
              if (savedOrg) setActiveOrganizationState(JSON.parse(savedOrg));
          }
      }
      
      prevRequestsLength.current = data.requests?.length || 0;
      prevSchedulesLength.current = data.schedules?.length || 0;

      if (typeof window !== 'undefined') {
          const savedNotifications = localStorage.getItem('app_notifications');
          if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
      }

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
    } catch (e) {
      console.error("Error updating employee", e);
      throw e;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const res = await fetch(`/api/nexus/test/db-employees/${id}`, { method: 'DELETE' });
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
      toast({ title: "Erro na Deleção", description: "Não foi possível completar a ação.", variant: "destructive" });
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

  // --- Trips (Schedules) Persistance ---
  const updateScheduleStatus = async (id: string, status: ScheduleStatus, details?: any) => {
    try {
      const res = await fetch(`/api/nexus/trips/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...details })
      });
      if (res.ok) {
        await fetchData(true);
        toast({ title: "Status Atualizado", description: `A missão agora está: ${status}.` });
      }
    } catch (e) {
      console.error("Error updating trip", e);
    }
  };

  // --- Requests Persistance ---
  const addVehicleRequest = async (request: Omit<VehicleRequest, 'id' | 'status' | 'requestDate'>) => {
    try {
        const res = await fetch('/api/nexus/requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...request,
            requester: currentUser?.name || 'Usuário',
          })
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) await fetchData(true);
    } catch (e) {
      console.error("Error updating request status", e);
    }
  };

  // --- Maintenance Persistance ---
  const addMaintenanceRequest = async (request: Omit<MaintenanceRequest, 'id' | 'status' | 'requestDate' | 'requesterName'>) => {
    try {
        const res = await fetch('/api/nexus/maintenance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...request,
            requesterName: currentUser?.name || 'Usuário',
          })
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
        headers: { 'Content-Type': 'application/json' },
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

  const login = useCallback(async (email: string, shouldRedirect = false) => {
    setIsLoading(true);
    if (typeof window !== 'undefined') {
        localStorage.setItem('userEmailForSimulation', email);
    }
    
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
  }, [fetchData, router, setSelectedSector]);

  const logout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('userEmailForSimulation');
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
      const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmailForSimulation') : null;
      if (storedEmail) await login(storedEmail, false);
      else await fetchData();
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
