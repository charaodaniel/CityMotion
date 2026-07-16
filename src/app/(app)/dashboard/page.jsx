"use client";
import { useState, useMemo } from "react";
import { useApp } from "@/contexts/app-provider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Zap, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuickRequestForm } from "@/components/forms/quick-request-form";
import AdminDashboard from "@/components/dashboards/admin-dashboard";
import ManagerDashboard from "@/components/dashboards/manager-dashboard";
import DriverDashboard from "@/components/dashboards/driver-dashboard";
import MechanicDashboard from "@/components/dashboards/mechanic-dashboard";
import { cn } from "@/lib/utils";
function DashboardPage() {
  const { userRole, currentUser, addNotification, selectedSector, isRefreshing, refreshData } = useApp();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const isCurrentUserDriver = useMemo(() => {
    if (!currentUser || !currentUser.role) return false;
    return currentUser.role.toLowerCase().includes("motorista");
  }, [currentUser]);
  const isCurrentUserMechanic = useMemo(() => {
    if (!currentUser || !currentUser.role) return false;
    return currentUser.role.toLowerCase().includes("mec\xE2nico") || currentUser.role.toLowerCase().includes("mecanico");
  }, [currentUser]);
  const simulateExternalAlert = () => {
    if (userRole === "manager" && selectedSector) {
      addNotification({
        title: "Simula\xE7\xE3o: Nova Solicita\xE7\xE3o",
        message: `Um colaborador acabou de solicitar um ve\xEDculo para o setor: ${selectedSector}.`,
        type: "request"
      });
    } else if (isCurrentUserDriver) {
      addNotification({
        title: "Simula\xE7\xE3o: Viagem Atribu\xEDda",
        message: "Uma nova viagem foi agendada para voc\xEA agora mesmo.",
        type: "trip"
      });
    } else {
      addNotification({
        title: "Aviso do Sistema",
        message: "Sua conta est\xE1 ativa e sincronizada com a organiza\xE7\xE3o.",
        type: "system"
      });
    }
  };
  const renderDashboard = () => {
    switch (userRole) {
      case "dev":
      case "ti":
      case "admin":
        return /* @__PURE__ */ React.createElement(AdminDashboard, null);
      case "manager":
        if (isCurrentUserMechanic) {
          return /* @__PURE__ */ React.createElement(MechanicDashboard, null);
        }
        return /* @__PURE__ */ React.createElement(ManagerDashboard, null);
      case "employee":
        if (isCurrentUserDriver) {
          return /* @__PURE__ */ React.createElement(DriverDashboard, null);
        }
        return /* @__PURE__ */ React.createElement("div", { className: "text-center text-muted-foreground py-12 border-dashed border-2 rounded-lg" }, /* @__PURE__ */ React.createElement("p", { className: "text-lg" }, "Bem-vindo(a) ao CityMotion."), /* @__PURE__ */ React.createElement("p", { className: "text-sm mt-2" }, 'Use o bot\xE3o "Pedir Transporte" para iniciar uma solicita\xE7\xE3o de ve\xEDculo.'));
      default:
        return /* @__PURE__ */ React.createElement("div", { className: "text-center text-muted-foreground py-12 border-dashed border-2 rounded-lg" }, /* @__PURE__ */ React.createElement("p", { className: "text-lg" }, "Painel n\xE3o dispon\xEDvel para este perfil."));
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex-1 space-y-8 p-4 sm:p-8 pt-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold tracking-tight" }, "Painel de Controle"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground" }, userRole === "admin" || userRole === "dev" ? "Vis\xE3o geral da frota e opera\xE7\xF5es." : "Acompanhe suas tarefas e solicita\xE7\xF5es de transporte.")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "outline",
      size: "sm",
      onClick: () => refreshData(),
      disabled: isRefreshing,
      className: "text-xs"
    },
    /* @__PURE__ */ React.createElement(RefreshCw, { className: cn("mr-2 h-3 w-3", isRefreshing && "animate-spin") }),
    "Atualizar"
  ), /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", onClick: simulateExternalAlert, className: "text-xs bg-accent/10 border-accent/20 hover:bg-accent/20" }, /* @__PURE__ */ React.createElement(Zap, { className: "mr-2 h-3 w-3" }), " Testar Alerta"), (userRole === "employee" || userRole === "manager") && !isCurrentUserDriver && !isCurrentUserMechanic && /* @__PURE__ */ React.createElement(Dialog, { open: isRequestModalOpen, onOpenChange: setIsRequestModalOpen }, /* @__PURE__ */ React.createElement(DialogTrigger, { asChild: true }, /* @__PURE__ */ React.createElement(Button, null, /* @__PURE__ */ React.createElement(PlusCircle, { className: "mr-2 h-4 w-4" }), "Pedir Transporte")), /* @__PURE__ */ React.createElement(DialogContent, { className: "sm:max-w-xl" }, /* @__PURE__ */ React.createElement(DialogHeader, null, /* @__PURE__ */ React.createElement(DialogTitle, { className: "text-2xl" }, "Solicitar um Transporte"), /* @__PURE__ */ React.createElement(DialogDescription, null, "Preencha o formul\xE1rio para fazer um pedido r\xE1pido. O gestor da sua unidade ser\xE1 notificado.")), /* @__PURE__ */ React.createElement(ScrollArea, { className: "max-h-[70vh] p-4" }, /* @__PURE__ */ React.createElement(QuickRequestForm, { onFormSubmit: () => setIsRequestModalOpen(false) })))))), renderDashboard());
}
export {
  DashboardPage as default
};
