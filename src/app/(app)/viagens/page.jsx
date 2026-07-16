"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Clock, PlusCircle, User, Play, CheckSquare, Gauge, ClipboardCheck, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ScheduleTripForm } from "@/components/forms/schedule-trip-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/app-provider";
import { ReportIncidentForm } from "@/components/forms/report-incident-form";
import dynamic from "next/dynamic";
import { useDriverLocation } from "@/hooks/use-driver-location";
import { MapIcon } from "lucide-react";
const DriverMap = dynamic(() => import("@/components/driver-map"), {
  ssr: false,
  loading: () => /* @__PURE__ */ React.createElement("div", { className: "h-[400px] rounded-lg border border-border/50 bg-sidebar/50 flex items-center justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-center text-muted-foreground" }, /* @__PURE__ */ React.createElement(MapIcon, { className: "h-8 w-8 mx-auto mb-2 animate-pulse" }), /* @__PURE__ */ React.createElement("p", { className: "text-xs font-mono uppercase tracking-widest" }, "Carregando mapa...")))
});
function getStatusVariant(status) {
  switch (status) {
    case "Agendada":
      return "secondary";
    case "Em Andamento":
      return "default";
    case "Conclu\xEDda":
      return "outline";
    case "Cancelada":
      return "destructive";
    default:
      return "outline";
  }
}
const statusColumns = [
  { title: "Agendadas", status: "Agendada" },
  { title: "Em Andamento", status: "Em Andamento" },
  { title: "Conclu\xEDdas", status: "Conclu\xEDda" }
];
function TripsView({
  schedules,
  onCardClick,
  onOpenChecklistModal,
  onOpenFinishModal
}) {
  const schedulesByStatus = (status) => {
    return schedules.filter((s) => s.status === status);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8" }, statusColumns.map((column) => /* @__PURE__ */ React.createElement("div", { key: column.status, className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xs font-bold uppercase tracking-widest text-primary/70 px-2" }, column.title, " (", schedulesByStatus(column.status).length, ")"), /* @__PURE__ */ React.createElement("div", { className: "bg-sidebar/30 rounded-xl p-4 space-y-4 min-h-[300px] border border-border/50 scanlines" }, schedulesByStatus(column.status).length > 0 ? schedulesByStatus(column.status).map((schedule) => /* @__PURE__ */ React.createElement(
    Card,
    {
      key: schedule.id,
      className: "cursor-pointer hover:border-primary transition-all duration-300 bg-sidebar/80 border-border/50 group"
    },
    /* @__PURE__ */ React.createElement("div", { onClick: () => onCardClick(schedule), className: "p-4 pb-2" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "p-0 mb-4" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-base font-bold tracking-tight" }, schedule.title), /* @__PURE__ */ React.createElement(CardDescription, { className: "flex items-center text-[10px] font-mono font-bold uppercase tracking-widest text-primary/60 mt-1" }, /* @__PURE__ */ React.createElement(Clock, { className: "mr-1.5 h-3 w-3" }), " ", schedule.departureTime)), /* @__PURE__ */ React.createElement(CardContent, { className: "p-0 space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-[11px] text-muted-foreground" }, /* @__PURE__ */ React.createElement(User, { className: "mr-2 h-3.5 w-3.5 text-primary/40" }), /* @__PURE__ */ React.createElement("span", { className: "truncate" }, schedule.driver)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-[11px] text-muted-foreground" }, /* @__PURE__ */ React.createElement(Car, { className: "mr-2 h-3.5 w-3.5 text-primary/40" }), /* @__PURE__ */ React.createElement("span", { className: "truncate" }, schedule.vehicle)))),
    /* @__PURE__ */ React.createElement(CardContent, { className: "p-2 pt-0 border-t border-border/10 mt-2 bg-black/20" }, schedule.status === "Agendada" && /* @__PURE__ */ React.createElement(Button, { size: "sm", variant: "ghost", className: "w-full h-8 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground", onClick: () => onOpenChecklistModal(schedule) }, /* @__PURE__ */ React.createElement(Play, { className: "mr-2 h-3 w-3" }), " Iniciar Miss\xE3o"), schedule.status === "Em Andamento" && /* @__PURE__ */ React.createElement(Button, { size: "sm", variant: "ghost", className: "w-full h-8 text-[10px] font-bold uppercase tracking-widest text-emerald-400 hover:bg-emerald-500 hover:text-white", onClick: () => onOpenFinishModal(schedule) }, /* @__PURE__ */ React.createElement(CheckSquare, { className: "mr-2 h-3 w-3" }), " Finalizar"))
  )) : /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center h-full text-[10px] uppercase tracking-widest text-muted-foreground opacity-30 italic" }, "Sem registros")))));
}
function ViagensPage() {
  const { schedules, setSchedules, userRole, vehicles, setVehicles, employees, setEmployees, currentUser, selectedSector } = useApp();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [startMileage, setStartMileage] = useState("");
  const [finalMileage, setFinalMileage] = useState("");
  const [checkedItems, setCheckedItems] = useState([]);
  const [notes, setNotes] = useState("");
  const activeTrips = useMemo(
    () => schedules.filter((s) => s.status === "Em Andamento"),
    [schedules]
  );
  const {
    driverLocations,
    isTracking,
    startTracking,
    stopTracking
  } = useDriverLocation(
    activeTrips,
    currentUser?.id,
    currentUser?.name
  );
  const { toast } = useToast();
  const isCurrentUserDriver = useMemo(() => currentUser?.role.toLowerCase().includes("motorista"), [currentUser]);
  const visibleSchedules = useMemo(() => {
    if (isCurrentUserDriver && currentUser) {
      return schedules.filter((s) => s.driver === currentUser.name);
    }
    if (userRole === "manager" && selectedSector) {
      const sectorVehicles = vehicles.filter((v) => v.sector === selectedSector).map((v) => v.licensePlate);
      return schedules.filter((s) => sectorVehicles.some((plate) => s.vehicle.includes(plate)));
    }
    return schedules;
  }, [schedules, vehicles, userRole, selectedSector, currentUser, isCurrentUserDriver]);
  const openModal = (modal, schedule = null) => {
    setSelectedSchedule(schedule);
    setActiveModal(modal);
  };
  const closeModal = () => {
    openModal(null);
    setStartMileage("");
    setFinalMileage("");
    setCheckedItems([]);
    setNotes("");
  };
  const updateScheduleStatus = (scheduleId, newStatus, details) => {
    let updatedSchedules = [...schedules];
    let updatedEmployees = [...employees];
    let updatedVehicles = [...vehicles];
    const schedule = schedules.find((s) => s.id === scheduleId);
    if (!schedule) return;
    const driver = employees.find((d) => d.name === schedule.driver);
    const vehicle = vehicles.find((v) => schedule.vehicle.includes(v.licensePlate));
    if (newStatus === "Em Andamento" && driver && vehicle) {
      updatedEmployees = employees.map((d) => d.id === driver.id ? { ...d, status: "Em Viagem" } : d);
      updatedVehicles = vehicles.map((v) => v.id === vehicle.id ? { ...v, status: "Em Viagem" } : v);
      toast({ title: "Viagem iniciada!", description: `A viagem "${schedule.title}" foi iniciada.` });
    } else if (newStatus === "Conclu\xEDda" && driver && vehicle && details?.endMileage) {
      updatedEmployees = employees.map((d) => d.id === driver.id ? { ...d, status: "Dispon\xEDvel" } : d);
      updatedVehicles = vehicles.map((v) => v.id === vehicle.id ? { ...v, status: "Dispon\xEDvel", mileage: details.endMileage } : v);
      toast({ title: "Viagem finalizada!", description: `A viagem "${schedule.title}" foi conclu\xEDda.` });
    }
    updatedSchedules = schedules.map((s) => s.id === scheduleId ? {
      ...s,
      status: newStatus,
      ...newStatus === "Em Andamento" && {
        startMileage: details?.startMileage,
        startNotes: details?.startNotes,
        startChecklist: details?.startChecklist
      },
      ...newStatus === "Conclu\xEDda" && {
        endMileage: details?.endMileage,
        endNotes: details?.endNotes,
        endChecklist: details?.endChecklist,
        arrivalTime: (/* @__PURE__ */ new Date()).toLocaleString("pt-BR")
      }
    } : s);
    setSchedules(updatedSchedules);
    setEmployees(updatedEmployees);
    setVehicles(updatedVehicles);
  };
  const handleOpenChecklistModal = (schedule) => {
    const vehicle = vehicles.find((v) => schedule.vehicle.includes(v.licensePlate));
    setStartMileage(vehicle?.mileage || "");
    openModal("start-checklist", schedule);
  };
  const handleOpenFinishModal = (schedule) => {
    setFinalMileage(schedule.startMileage || "");
    openModal("finish", schedule);
  };
  const allSchedules = visibleSchedules.filter((s) => s.status !== "Cancelada");
  const schoolSchedules = allSchedules.filter((s) => s.category.toLowerCase().includes("escolar"));
  const generalSchedules = allSchedules.filter((s) => !s.category.toLowerCase().includes("escolar"));
  return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto p-4 sm:p-8 space-y-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "text-5xl font-black tracking-tighter text-on-surface flex items-center gap-4" }, /* @__PURE__ */ React.createElement(Gauge, { className: "h-10 w-10 text-primary" }), "Miss\xF5es"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground text-lg mt-1 font-medium" }, "Monitoramento de tr\xE1fego e log\xEDstica operacional.")), /* @__PURE__ */ React.createElement(Dialog, { open: activeModal === "form", onOpenChange: () => closeModal() }, /* @__PURE__ */ React.createElement(DialogTrigger, { asChild: true }, /* @__PURE__ */ React.createElement(Button, { className: "bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 rounded-lg font-bold uppercase tracking-widest text-xs", onClick: () => openModal("form") }, /* @__PURE__ */ React.createElement(PlusCircle, { className: "mr-2 h-4 w-4" }), "Agendar Viagem")), /* @__PURE__ */ React.createElement(DialogContent, { className: "sm:max-w-3xl border-border/50 bg-sidebar p-0 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "h-1.5 w-full bg-primary" }), /* @__PURE__ */ React.createElement(ScrollArea, { className: "max-h-[70vh] p-8" }, /* @__PURE__ */ React.createElement(DialogHeader, { className: "mb-6" }, /* @__PURE__ */ React.createElement(DialogTitle, { className: "text-2xl font-black tracking-tight" }, "Novo Protocolo de Viagem"), /* @__PURE__ */ React.createElement(DialogDescription, { className: "text-xs font-mono uppercase tracking-widest text-primary/70" }, "Executando agendamento log\xEDstico V3")), /* @__PURE__ */ React.createElement("div", { className: "scanlines rounded-lg border border-border/50 p-6 bg-accent/10" }, /* @__PURE__ */ React.createElement(ScheduleTripForm, { onFormSubmit: () => closeModal() })))))), /* @__PURE__ */ React.createElement(Tabs, { defaultValue: "general" }, /* @__PURE__ */ React.createElement(TabsList, { className: "bg-sidebar/50 border border-border/50 p-1" }, /* @__PURE__ */ React.createElement(TabsTrigger, { value: "general", className: "text-xs uppercase font-bold tracking-widest" }, "Gerais (", generalSchedules.length, ")"), /* @__PURE__ */ React.createElement(TabsTrigger, { value: "school", className: "text-xs uppercase font-bold tracking-widest" }, "Escolares (", schoolSchedules.length, ")"), /* @__PURE__ */ React.createElement(TabsTrigger, { value: "map", className: "text-xs uppercase font-bold tracking-widest" }, /* @__PURE__ */ React.createElement(MapIcon, { className: "h-3.5 w-3.5 mr-1.5" }), "Mapa ao Vivo", activeTrips.length > 0 && /* @__PURE__ */ React.createElement("span", { className: "ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-400 rounded-full" }, activeTrips.length))), /* @__PURE__ */ React.createElement(TabsContent, { value: "general" }, /* @__PURE__ */ React.createElement(
    TripsView,
    {
      schedules: generalSchedules,
      onCardClick: (schedule) => openModal("details", schedule),
      onOpenChecklistModal: handleOpenChecklistModal,
      onOpenFinishModal: handleOpenFinishModal
    }
  )), /* @__PURE__ */ React.createElement(TabsContent, { value: "school" }, /* @__PURE__ */ React.createElement(
    TripsView,
    {
      schedules: schoolSchedules,
      onCardClick: (schedule) => openModal("details", schedule),
      onOpenChecklistModal: handleOpenChecklistModal,
      onOpenFinishModal: handleOpenFinishModal
    }
  )), /* @__PURE__ */ React.createElement(TabsContent, { value: "map", className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-bold uppercase tracking-widest text-primary" }, "\u{1F697} Rastreamento ao Vivo"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-muted-foreground mt-1" }, activeTrips.length > 0 ? `${activeTrips.length} viagem(ns) em andamento \u2014 ${driverLocations.length} localiza\xE7\xE3o(\xF5es) capturada(s)` : "Nenhuma viagem em andamento no momento.")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, isTracking ? /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "outline",
      size: "sm",
      onClick: stopTracking,
      className: "text-[10px] font-bold uppercase tracking-widest border-destructive/30 text-destructive hover:bg-destructive/10"
    },
    /* @__PURE__ */ React.createElement("span", { className: "h-2 w-2 rounded-full bg-destructive animate-pulse mr-2" }),
    "Parar Rastreio"
  ) : /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "outline",
      size: "sm",
      onClick: startTracking,
      disabled: activeTrips.length === 0,
      className: "text-[10px] font-bold uppercase tracking-widest border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
    },
    /* @__PURE__ */ React.createElement(MapIcon, { className: "h-3 w-3 mr-2" }),
    "Iniciar Rastreio"
  ))), activeTrips.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-2" }, /* @__PURE__ */ React.createElement(
    DriverMap,
    {
      locations: driverLocations,
      height: "500px"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "space-y-2 max-h-[500px] overflow-y-auto" }, /* @__PURE__ */ React.createElement("h4", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground" }, "Ve\xEDculos em Tr\xE2nsito"), activeTrips.map((trip) => {
    const loc = driverLocations.find((l) => l.tripId === trip.id);
    return /* @__PURE__ */ React.createElement(Card, { key: trip.id, className: "bg-sidebar/50 border-border/30" }, /* @__PURE__ */ React.createElement(CardContent, { className: "p-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold truncate" }, trip.title), /* @__PURE__ */ React.createElement(Badge, { variant: "default", className: "text-[8px] h-4 px-1.5" }, loc ? "\u{1F4CD} Rastreado" : "\u23F3 Aguardando")), /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-muted-foreground space-y-0.5" }, /* @__PURE__ */ React.createElement("p", null, "\u{1F697} ", trip.driver, " \u2014 ", trip.vehicle), /* @__PURE__ */ React.createElement("p", null, "\u{1F4CC} ", trip.destination), loc?.address && /* @__PURE__ */ React.createElement("p", { className: "text-[9px] text-primary/60 truncate", title: loc.address }, "\u{1F4CD} ", loc.address), loc?.speed !== void 0 && /* @__PURE__ */ React.createElement("p", { className: "text-emerald-400" }, "\u26A1 ", (loc.speed * 3.6).toFixed(0), " km/h"))));
  }))))), /* @__PURE__ */ React.createElement(Dialog, { open: activeModal === "details", onOpenChange: () => closeModal() }, /* @__PURE__ */ React.createElement(DialogContent, { className: "sm:max-w-2xl border-border/50 bg-sidebar p-0 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "h-1.5 w-full bg-primary" }), /* @__PURE__ */ React.createElement(ScrollArea, { className: "max-h-[80vh] p-8" }, selectedSchedule && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DialogHeader, { className: "mb-6" }, /* @__PURE__ */ React.createElement(DialogTitle, { className: "text-3xl font-black tracking-tight" }, selectedSchedule.title), /* @__PURE__ */ React.createElement(DialogDescription, { className: "text-xs font-mono uppercase tracking-widest text-primary/70" }, "Visualizando telemetria de miss\xE3o")), /* @__PURE__ */ React.createElement("div", { className: "scanlines rounded-lg border border-border/50 p-6 bg-accent/10 space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground" }, "Status"), /* @__PURE__ */ React.createElement("div", { className: "mt-1" }, /* @__PURE__ */ React.createElement(Badge, { variant: getStatusVariant(selectedSchedule.status), className: "text-[10px] font-bold uppercase tracking-tight" }, selectedSchedule.status))), /* @__PURE__ */ React.createElement(Separator, { className: "bg-border/30" }), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-8" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1" }, "Motorista"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-bold" }, selectedSchedule.driver)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1" }, "Ve\xEDculo"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-bold" }, selectedSchedule.vehicle))), /* @__PURE__ */ React.createElement(Separator, { className: "bg-border/30" }), /* @__PURE__ */ React.createElement("div", { className: "flex justify-end gap-3" }, selectedSchedule.status === "Agendada" && /* @__PURE__ */ React.createElement(Button, { onClick: () => openModal("start-checklist", selectedSchedule), className: "bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] h-10 px-6" }, /* @__PURE__ */ React.createElement(ClipboardCheck, { className: "mr-2 h-4 w-4" }), "Executar Checklist"), selectedSchedule.status === "Em Andamento" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, { variant: "destructive", onClick: () => openModal("incident", selectedSchedule), className: "font-bold uppercase tracking-widest text-[10px] h-10 px-6" }, /* @__PURE__ */ React.createElement(AlertTriangle, { className: "mr-2 h-4 w-4" }), "Relatar Sinistro")))))))), /* @__PURE__ */ React.createElement(Dialog, { open: activeModal === "incident", onOpenChange: () => closeModal() }, /* @__PURE__ */ React.createElement(DialogContent, { className: "sm:max-w-2xl border-border/50 bg-sidebar p-0 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "h-1.5 w-full bg-destructive" }), /* @__PURE__ */ React.createElement(ScrollArea, { className: "max-h-[80vh] p-8" }, /* @__PURE__ */ React.createElement(DialogHeader, { className: "mb-6" }, /* @__PURE__ */ React.createElement(DialogTitle, { className: "text-2xl font-black tracking-tight text-destructive" }, "Relat\xF3rio de Sinistro"), /* @__PURE__ */ React.createElement(DialogDescription, { className: "text-xs font-mono uppercase tracking-widest text-destructive/70" }, "Protocolo de incidente cr\xEDtico")), /* @__PURE__ */ React.createElement("div", { className: "scanlines rounded-lg border border-destructive/30 p-6 bg-destructive/5" }, /* @__PURE__ */ React.createElement(ReportIncidentForm, { schedule: selectedSchedule, onFormSubmit: () => closeModal() }))))));
}
export {
  ViagensPage as default
};
