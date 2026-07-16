"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, User, Wrench, Check, CircleHelp, Settings, CheckCircle, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApp } from "@/contexts/app-provider";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RequestPartForm } from "@/components/forms/request-part-form";
function getStatusVariant(status) {
  switch (status) {
    case "Pendente":
      return "secondary";
    case "Em Andamento":
      return "default";
    case "Conclu\xEDda":
      return "outline";
    default:
      return "outline";
  }
}
const statusColumns = [
  { title: "Pendentes", status: "Pendente", icon: CircleHelp },
  { title: "Em Andamento", status: "Em Andamento", icon: Settings },
  { title: "Conclu\xEDdas", status: "Conclu\xEDda", icon: CheckCircle }
];
function MaintenancePage() {
  const { maintenanceRequests, updateMaintenanceRequestStatus, userRole } = useApp();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isPartRequestModalOpen, setIsPartRequestModalOpen] = useState(false);
  const requestsByStatus = (status) => {
    return maintenanceRequests.filter((s) => s.status === status);
  };
  const handleCardClick = (request) => {
    setSelectedRequest(request);
  };
  const closeModal = () => {
    setSelectedRequest(null);
    setIsPartRequestModalOpen(false);
  };
  const handleUpdateStatus = (newStatus) => {
    if (selectedRequest) {
      updateMaintenanceRequestStatus(selectedRequest.id, newStatus);
      closeModal();
    }
  };
  const isAdminOrManager = userRole === "admin" || userRole === "manager" || userRole === "dev";
  return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto p-4 sm:p-8 space-y-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "text-5xl font-black tracking-tighter text-on-surface flex items-center gap-4" }, /* @__PURE__ */ React.createElement(Wrench, { className: "h-10 w-10 text-primary" }), "Manuten\xE7\xE3o"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground text-lg mt-1 font-medium" }, "Gest\xE3o t\xE9cnica e operacional de reparos da frota NexusOS."))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" }, statusColumns.map((column) => /* @__PURE__ */ React.createElement("div", { key: column.status, className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xs font-bold uppercase tracking-widest flex items-center text-primary/70" }, /* @__PURE__ */ React.createElement(column.icon, { className: "mr-2 h-3.5 w-3.5" }), column.title, " (", requestsByStatus(column.status).length, ")"), /* @__PURE__ */ React.createElement("div", { className: "bg-sidebar/30 rounded-xl p-4 space-y-4 min-h-[300px] border border-border/50 scanlines" }, requestsByStatus(column.status).length > 0 ? requestsByStatus(column.status).map((request) => /* @__PURE__ */ React.createElement(
    Card,
    {
      key: request.id,
      onClick: () => handleCardClick(request),
      className: "cursor-pointer hover:border-primary transition-all duration-300 bg-sidebar/80 border-border/50 group"
    },
    /* @__PURE__ */ React.createElement(CardHeader, { className: "p-4 pb-2" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-base font-bold tracking-tight" }, request.vehicleModel), /* @__PURE__ */ React.createElement(CardDescription, { asChild: true }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-[10px] uppercase font-mono tracking-widest font-bold text-primary/60 mt-1" }, /* @__PURE__ */ React.createElement(Badge, { variant: "outline", className: "mr-2 text-[8px] h-4 px-1.5 border-primary/30" }, request.licensePlate), /* @__PURE__ */ React.createElement(Clock, { className: "mr-1 h-3 w-3" }), format(new Date(request.requestDate), "dd/MM/yyyy", { locale: ptBR })))),
    /* @__PURE__ */ React.createElement(CardContent, { className: "p-4 pt-0 space-y-3" }, /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-muted-foreground line-clamp-2 leading-relaxed" }, request.description), /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-[10px] font-medium pt-1 text-muted-foreground border-t border-border/20" }, /* @__PURE__ */ React.createElement(User, { className: "mr-1.5 h-3 w-3" }), /* @__PURE__ */ React.createElement("span", null, "Solicitante: ", /* @__PURE__ */ React.createElement("strong", { className: "text-on-surface" }, request.requesterName))))
  )) : /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center h-full text-[10px] text-muted-foreground uppercase tracking-widest opacity-50 gap-2" }, /* @__PURE__ */ React.createElement(column.icon, { className: "h-8 w-8 mb-2" }), "Vazio"))))), /* @__PURE__ */ React.createElement(Dialog, { open: !!selectedRequest, onOpenChange: closeModal }, /* @__PURE__ */ React.createElement(DialogContent, { className: "sm:max-w-2xl border-border/50 bg-sidebar p-0 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "h-1.5 w-full bg-primary" }), /* @__PURE__ */ React.createElement(ScrollArea, { className: "max-h-[80vh] p-8" }, selectedRequest && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DialogHeader, { className: "mb-6" }, /* @__PURE__ */ React.createElement(DialogTitle, { className: "text-3xl font-black tracking-tight" }, selectedRequest.vehicleModel, " (", selectedRequest.licensePlate, ")"), /* @__PURE__ */ React.createElement(DialogDescription, { className: "text-xs font-mono uppercase tracking-widest text-primary/70" }, "Protocolo MNT-", selectedRequest.id.replace(/\D/g, ""), " // Solicitado em ", format(new Date(selectedRequest.requestDate), "dd/MM/yyyy '\xE0s' HH:mm", { locale: ptBR }))), /* @__PURE__ */ React.createElement("div", { className: "scanlines rounded-lg border border-border/50 p-6 bg-accent/10 space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground" }, "Status Atual"), /* @__PURE__ */ React.createElement("div", { className: "mt-1" }, /* @__PURE__ */ React.createElement(Badge, { variant: getStatusVariant(selectedRequest.status), className: "text-[10px] font-bold uppercase tracking-tight" }, selectedRequest.status))), /* @__PURE__ */ React.createElement(Separator, { className: "bg-border/30" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground" }, "Tipo de Manuten\xE7\xE3o"), /* @__PURE__ */ React.createElement("p", { className: "text-lg font-bold" }, selectedRequest.type)), /* @__PURE__ */ React.createElement(Separator, { className: "bg-border/30" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground" }, "Descri\xE7\xE3o do Diagn\xF3stico"), /* @__PURE__ */ React.createElement("p", { className: "text-sm mt-2 p-4 bg-black/40 rounded-md font-mono leading-relaxed text-foreground/90 border border-border/20" }, selectedRequest.description)), isAdminOrManager && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Separator, { className: "bg-border/30" }), /* @__PURE__ */ React.createElement("div", { className: "pt-2" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xs font-black uppercase tracking-widest mb-4 text-primary" }, "A\xE7\xF5es de Oficina"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-3" }, selectedRequest.status === "Pendente" && /* @__PURE__ */ React.createElement(Button, { onClick: () => handleUpdateStatus("Em Andamento"), className: "bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] h-10 px-4" }, /* @__PURE__ */ React.createElement(Settings, { className: "mr-2 h-4 w-4" }), " Iniciar Protocolo"), selectedRequest.status === "Em Andamento" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, { onClick: () => handleUpdateStatus("Conclu\xEDda"), className: "bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-4" }, /* @__PURE__ */ React.createElement(Check, { className: "mr-2 h-4 w-4" }), " Finalizar Reparo"), /* @__PURE__ */ React.createElement(Button, { variant: "outline", onClick: () => setIsPartRequestModalOpen(true), className: "border-primary text-primary hover:bg-primary/10 font-bold uppercase tracking-widest text-[10px] h-10 px-4" }, /* @__PURE__ */ React.createElement(ShoppingCart, { className: "mr-2 h-4 w-4" }), " Solicitar Pe\xE7as")), selectedRequest.status === "Conclu\xEDda" && /* @__PURE__ */ React.createElement(Button, { variant: "outline", onClick: () => handleUpdateStatus("Pendente"), className: "text-xs uppercase font-bold tracking-widest" }, "Reabrir Chamado"))))))))), /* @__PURE__ */ React.createElement(Dialog, { open: isPartRequestModalOpen, onOpenChange: setIsPartRequestModalOpen }, /* @__PURE__ */ React.createElement(DialogContent, { className: "sm:max-w-xl border-border/50 bg-sidebar p-0 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "h-1.5 w-full bg-primary" }), /* @__PURE__ */ React.createElement(ScrollArea, { className: "max-h-[80vh] p-8" }, /* @__PURE__ */ React.createElement(DialogHeader, { className: "mb-6" }, /* @__PURE__ */ React.createElement(DialogTitle, { className: "text-2xl font-black tracking-tight flex items-center" }, /* @__PURE__ */ React.createElement(ShoppingCart, { className: "mr-3 h-6 w-6 text-primary" }), "Pedido de Pe\xE7as"), /* @__PURE__ */ React.createElement(DialogDescription, { className: "text-xs font-mono uppercase tracking-widest text-primary/70" }, "MNT-REF: ", selectedRequest?.vehicleModel, " // ", selectedRequest?.licensePlate)), /* @__PURE__ */ React.createElement("div", { className: "scanlines rounded-lg border border-border/50 p-6 bg-accent/10" }, /* @__PURE__ */ React.createElement(
    RequestPartForm,
    {
      maintenanceRequest: selectedRequest,
      onFormSubmit: () => setIsPartRequestModalOpen(false)
    }
  ))))));
}
export {
  MaintenancePage as default
};
