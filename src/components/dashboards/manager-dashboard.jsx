"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Package, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/app-provider";
import { useMemo } from "react";
function getPriorityVariant(priority) {
  switch (priority) {
    case "Alta":
      return "destructive";
    case "M\xE9dia":
      return "secondary";
    case "Baixa":
      return "outline";
    default:
      return "outline";
  }
}
function ManagerDashboard() {
  const { toast } = useToast();
  const { vehicleRequests, updateVehicleRequestStatus, employees, selectedSector } = useApp();
  const handleRequest = (id, approved) => {
    updateVehicleRequestStatus(id, approved ? "Aprovada" : "Rejeitada");
    const request = vehicleRequests.find((req) => req.id === id);
    if (request) {
      toast({
        title: `Solicita\xE7\xE3o ${approved ? "Aprovada" : "Rejeitada"}`,
        description: `A solicita\xE7\xE3o "${request.title}" foi ${approved ? "aprovada" : "rejeitada"}.`
      });
    }
  };
  const managerRequests = useMemo(() => {
    if (!selectedSector) return [];
    return vehicleRequests.filter((r) => r.sector === selectedSector && r.status === "Pendente");
  }, [vehicleRequests, selectedSector]);
  const availableDrivers = useMemo(() => {
    if (!selectedSector) return 0;
    return employees.filter((d) => d.status === "Dispon\xEDvel" && Array.isArray(d.sector) && d.sector.includes(selectedSector) && d.role.toLowerCase().includes("motorista")).length;
  }, [employees, selectedSector]);
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-8" }, /* @__PURE__ */ React.createElement("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4" }, /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-sm font-medium" }, "Motoristas Dispon\xEDveis no Setor"), /* @__PURE__ */ React.createElement(UserCheck, { className: "h-4 w-4 text-muted-foreground" })), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold" }, availableDrivers), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground" }, "Motoristas do seu setor prontos para viagens")))), /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-semibold mb-4" }, "Solicita\xE7\xF5es Pendentes do Setor: ", selectedSector), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, managerRequests.length > 0 ? managerRequests.map((request) => /* @__PURE__ */ React.createElement(Card, { key: request.id }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-lg" }, request.title), /* @__PURE__ */ React.createElement(Badge, { variant: getPriorityVariant(request.priority) }, request.priority === "Alta" && /* @__PURE__ */ React.createElement(AlertTriangle, { className: "mr-1 h-3 w-3" }), "Prioridade ", request.priority)), /* @__PURE__ */ React.createElement(CardDescription, { className: "flex items-center text-sm text-muted-foreground mt-2" }, /* @__PURE__ */ React.createElement(Clock, { className: "mr-2 h-4 w-4" }), " Solicitado em: ", new Date(request.requestDate).toLocaleDateString("pt-BR"), " por ", request.requester || "N/A")), /* @__PURE__ */ React.createElement(CardContent, { className: "space-y-3 text-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Package, { className: "mr-2 h-4 w-4 text-primary" }), /* @__PURE__ */ React.createElement("strong", null, "Setor:"), /* @__PURE__ */ React.createElement("span", { className: "ml-2" }, request.sector)), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground pt-2" }, request.details), /* @__PURE__ */ React.createElement("div", { className: "flex justify-end gap-2 pt-4" }, /* @__PURE__ */ React.createElement(Button, { variant: "outline", onClick: () => handleRequest(request.id, false) }, "Rejeitar"), /* @__PURE__ */ React.createElement(Button, { onClick: () => handleRequest(request.id, true) }, "Aprovar"))))) : /* @__PURE__ */ React.createElement("div", { className: "text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg" }, "N\xE3o h\xE1 solicita\xE7\xF5es de ve\xEDculos pendentes para este setor.")));
}
export {
  ManagerDashboard as default
};
