"use client";
import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
const AppContext = createContext(void 0);
function AppProvider({ children }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userRole, setUserRole] = useState("employee");
  const [currentUser, setCurrentUser] = useState(null);
  const [activeOrganization, setActiveOrganizationState] = useState(null);
  const [selectedSector, setSelectedSectorState] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [vehicleRequests, setVehicleRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [workSchedules, setWorkSchedules] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [refuelings, setRefuelings] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [telemetryData, setTelemetryData] = useState([]);
  const socketRef = useRef(null);
  const getHeaders = useCallback(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("citymotion_token") : null;
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }, []);
  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);
    try {
      const response = await fetch("/api/nexus/sync-all", { headers: getHeaders() });
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
      const telRes = await fetch("/api/nexus/analytics/telemetry", { headers: getHeaders() });
      if (telRes.ok) setTelemetryData(await telRes.json());
    } catch (error) {
      console.error("[AppProvider] Sync Error", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [getHeaders]);
  const addNotification = useCallback((n) => {
    const newNotif = { ...n, id: Math.random().toString(36).substr(2, 9), date: (/* @__PURE__ */ new Date()).toISOString(), read: false };
    setNotifications((prev) => [newNotif, ...prev]);
    toast({ title: `\u{1F4F2} ${n.title}`, description: n.message });
  }, [toast]);
  const markNotificationAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };
  const clearNotifications = () => {
    setNotifications([]);
  };
  const mapRole = (roleStr) => {
    const r = roleStr.toLowerCase();
    if (r.includes("desenvolvedor") || r.includes("dev") || r.includes("root")) return "dev";
    if (r.includes("ti") || r.includes("infra")) return "ti";
    if (r.includes("admin")) return "admin";
    if (r.includes("gestor") || r.includes("gerente")) return "manager";
    return "employee";
  };
  const requestPasswordRecovery = async (identifier) => {
    const res = await fetch("/api/nexus/auth/forgot-password", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email: identifier })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erro ao solicitar recupera\xE7\xE3o");
  };
  const resetPassword = async (identifier, token, newPassword) => {
    const res = await fetch("/api/nexus/auth/reset-password", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email: identifier, token, password: newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erro ao redefinir senha");
  };
  const login = async (identifier, password = "123456", shouldRedirect = false, isTerminal = false) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/nexus/auth/login", {
        method: "POST",
        headers: isTerminal ? { "x-nexus-terminal": "true", "Content-Type": "application/json" } : { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("citymotion_token", data.token);
        setCurrentUser(data.user);
        setUserRole(mapRole(data.user.role));
        await fetchData(true);
        if (shouldRedirect) router.push("/dashboard");
      } else throw new Error(data.message);
    } catch (e) {
      throw e;
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    localStorage.removeItem("citymotion_token");
    setCurrentUser(null);
    setUserRole("employee");
    router.push("/login");
  };
  const addVehicleRequest = async (data) => {
    await fetch("/api/nexus/requests", { method: "POST", headers: getHeaders(), body: JSON.stringify(data) });
    await fetchData(true);
  };
  const sendMessage = async (receiverId, content) => {
    await fetch("/api/nexus/chat/messages", { method: "POST", headers: getHeaders(), body: JSON.stringify({ receiverId, content }) });
    await fetchData(true);
  };
  const addEmployee = async (data) => {
    await fetch("/api/nexus/employees", { method: "POST", headers: getHeaders(), body: JSON.stringify(data) });
    await fetchData(true);
  };
  const updateEmployee = async (id, data) => {
    await fetch("/api/nexus/employees", { method: "PUT", headers: getHeaders(), body: JSON.stringify({ id, ...data }) });
    await fetchData(true);
  };
  const deleteEmployee = async (id) => {
    await fetch("/api/nexus/employees", { method: "DELETE", headers: getHeaders(), body: JSON.stringify({ id }) });
    await fetchData(true);
  };
  const updateMaintenanceRequestStatus = (id, status) => {
    setMaintenanceRequests(
      (prev) => prev.map((req) => req.id === id ? { ...req, status } : req)
    );
  };
  return /* @__PURE__ */ React.createElement(AppContext.Provider, { value: {
    isLoading,
    isRefreshing,
    userRole,
    currentUser,
    activeOrganization,
    setActiveOrganization: setActiveOrganizationState,
    selectedSector,
    setSelectedSector: setSelectedSectorState,
    login,
    requestPasswordRecovery,
    resetPassword,
    logout,
    refreshData: () => fetchData(true),
    schedules,
    setSchedules,
    vehicleRequests,
    addVehicleRequest,
    employees,
    setEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    vehicles,
    setVehicles,
    sectors,
    setSectors,
    workSchedules,
    maintenanceRequests,
    updateMaintenanceRequestStatus,
    refuelings,
    organizations,
    messages,
    sendMessage,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    addNotification,
    telemetryData
  } }, children);
}
const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp deve ser utilizado dentro de um AppProvider");
  return context;
};
export {
  AppProvider,
  useApp
};
