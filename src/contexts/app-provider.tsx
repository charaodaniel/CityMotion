
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import type { VehicleRequest, VehicleRequestStatus, Schedule, ScheduleStatus, Employee, Vehicle, Sector, WorkSchedule, MaintenanceRequest, MaintenanceRequestStatus, UserRole, AppNotification, Organization, Refueling, Message } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { io, Socket } from 'socket.io-client';

interface AppContextType {
  isLoading: boolean;
  isRefreshing: boolean;
  userRole: UserRole;
  currentUser: Employee | null;
  activeOrganization: Organization | null;
  setActiveOrganization: (org: Organization | null) => void;
  selectedSector: string | null;
  setSelectedSector: (sector: string | null) => void;
  login: (identifier: string, password?: string, shouldRedirect?: boolean, isTerminal?: boolean) => Promise<void>;
  logout: () => void;
  refreshData: () => Promise<void>;
  
  schedules: Schedule[];
  vehicleRequests: VehicleRequest[];
  addVehicleRequest: (request: Partial<VehicleRequest>) => Promise<void>;
  
  employees: Employee[];
  vehicles: Vehicle[];
  sectors: Sector[];
  workSchedules: WorkSchedule[];
  maintenanceRequests: MaintenanceRequest[];
  refuelings: Refueling[];
  organizations: Organization[];
  messages: Message[];
  sendMessage: (receiverId: string, content: string) => Promise<void>;

  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'date' | 'read'>) => void;
  
  telemetryData: any[];
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
  const [refuelings, setRefuelings] = useState<Refueling[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [telemetryData, setTelemetryData] = useState<any[]>([]);

  const socketRef = useRef<Socket | null>(null);

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
      if (response.status === 401 || response.status === 403) {
          setIsLoading(false);
          setIsRefreshing(false);
          return;
      }

      const data = await response.json();
      setSchedules(data.trips || []);
      setVehicleRequests(data.requests || []);
      setVehicles(data.vehicles || []);
      setEmployees(data.employees || []);
      setSectors(data.sectors || []);
      setWorkSchedules(data.workSchedules || []);
      setMaintenanceRequests(data.maintenanceRequests || []);
      setRefuelings(data.refuelings || []);
      setMessages(data.messages || []);
      setOrganizations(data.organizations || []);

      const telRes = await fetch('/api/nexus/analytics/telemetry', { headers: getHeaders() });
      if (telRes.ok) setTelemetryData(await telRes.json());

    } catch (error) {
      console.error("[AppProvider] Sync Error", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [getHeaders]);

  const addNotification = useCallback((n: Omit<AppNotification, 'id' | 'date' | 'read'>) => {
    const newNotif: AppNotification = { ...n, id: Math.random().toString(36).substr(2, 9), date: new Date().toISOString(), read: false };
    setNotifications(prev => [newNotif, ...prev]);
    toast({ title: `📲 ${n.title}`, description: n.message });
  }, [toast]);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const mapRole = (roleStr: string): UserRole => {
    const r = roleStr.toLowerCase();
    if (r.includes('desenvolvedor') || r.includes('dev') || r.includes('root')) return 'dev';
    if (r.includes('ti') || r.includes('infra')) return 'ti';
    if (r.includes('admin')) return 'admin';
    if (r.includes('gestor') || r.includes('gerente')) return 'manager';
    return 'employee';
  };

  const login = async (identifier: string, password = '123456', shouldRedirect = false, isTerminal = false) => {
    setIsLoading(true);
    try {
        const res = await fetch('/api/nexus/auth/login', {
            method: 'POST',
            headers: isTerminal ? { 'x-nexus-terminal': 'true', 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: identifier, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('citymotion_token', data.token);
            setCurrentUser(data.user);
            setUserRole(mapRole(data.user.role));
            await fetchData(true);
            if (shouldRedirect) router.push('/dashboard');
        } else throw new Error(data.message);
    } catch (e: any) { throw e; } finally { setIsLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem('citymotion_token');
    setCurrentUser(null);
    setUserRole('employee');
    router.push('/login');
  };

  const addVehicleRequest = async (data: any) => {
    await fetch('/api/nexus/requests', { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    await fetchData(true);
  };

  const sendMessage = async (receiverId: string, content: string) => {
    await fetch('/api/nexus/chat/messages', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ receiverId, content }) });
    await fetchData(true);
  };

  return (
    <AppContext.Provider value={{ 
        isLoading, isRefreshing, userRole, currentUser, activeOrganization, 
        setActiveOrganization: setActiveOrganizationState,
        selectedSector, setSelectedSector: setSelectedSectorState, login, logout, refreshData: () => fetchData(true),
        schedules, vehicleRequests, addVehicleRequest,
        employees, vehicles, sectors, workSchedules, maintenanceRequests, refuelings, organizations,
        messages, sendMessage, notifications, markNotificationAsRead, clearNotifications, addNotification, telemetryData
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
