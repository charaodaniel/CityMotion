
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
  messages: Message[];
  sendMessage: (receiverId: string, content: string) => Promise<void>;

  notifications: AppNotification[];
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
      if (response.status === 401 || response.status === 403) return;

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

      // Fetch Telemetry for Reports
      const telRes = await fetch('/api/nexus/analytics/telemetry', { headers: getHeaders() });
      if (telRes.ok) setTelemetryData(await telRes.json());

    } catch (error) {
      console.error("[AppProvider] Sync Error");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [getHeaders]);

  // WebSocket Setup
  useEffect(() => {
    if (currentUser && !socketRef.current) {
        socketRef.current = io('http://localhost:3001');
        
        socketRef.current.on('connect', () => {
            if (selectedSector) socketRef.current?.emit('join-sector', selectedSector);
        });

        socketRef.current.on('new-request', (data) => {
            addNotification({
                title: "Novo Pedido de Viagem",
                message: `${data.requester} solicitou um veículo: "${data.title}"`,
                type: 'request'
            });
            fetchData(true);
        });
    }

    return () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    };
  }, [currentUser, selectedSector, fetchData]);

  const addNotification = useCallback((n: Omit<AppNotification, 'id' | 'date' | 'read'>) => {
    const newNotif: AppNotification = { ...n, id: Math.random().toString(36).substr(2, 9), date: new Date().toISOString(), read: false };
    setNotifications(prev => [newNotif, ...prev]);
    toast({ title: `📲 ${n.title}`, description: n.message });
    
    // Alerta sonoro de sistema (opcional)
    if (typeof Audio !== 'undefined') {
        new Audio('/sounds/notification.mp3').play().catch(() => {});
    }
  }, [toast]);

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
            setUserRole(data.user.role.toLowerCase().includes('admin') ? 'admin' : data.user.role.toLowerCase().includes('gestor') ? 'manager' : 'employee');
            await fetchData(true);
            if (shouldRedirect) router.push('/dashboard');
        } else throw new Error(data.message);
    } catch (e: any) { throw e; } finally { setIsLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem('citymotion_token');
    setCurrentUser(null);
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
        isLoading, isRefreshing, userRole, currentUser, activeOrganization, setActiveOrganization: setActiveOrganizationState,
        selectedSector, setSelectedSector: setSelectedSectorState, login, logout, refreshData: () => fetchData(true),
        schedules, vehicleRequests, addVehicleRequest,
        employees, vehicles, sectors, workSchedules, maintenanceRequests, refuelings,
        messages, sendMessage, notifications, addNotification, telemetryData
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
