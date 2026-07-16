"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Clock, User, Pin, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/contexts/app-provider";
function getStatusVariant(status) {
  switch (status) {
    case "Agendada":
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
  { title: "Agendadas", status: "Agendada" },
  { title: "Em Andamento", status: "Em Andamento" },
  { title: "Conclu\xEDdas", status: "Conclu\xEDda" }
];
function TripKanbanView({ isPublic = false }) {
  const { schedules } = useApp();
  const schedulesByStatus = (status) => {
    return schedules.filter((s) => s.status === status);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, statusColumns.map((column) => /* @__PURE__ */ React.createElement("div", { key: column.status, className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-semibold tracking-tight" }, column.title, " (", schedulesByStatus(column.status).length, ")"), /* @__PURE__ */ React.createElement("div", { className: "bg-muted/50 rounded-lg p-4 space-y-4 min-h-[200px]" }, schedulesByStatus(column.status).length > 0 ? schedulesByStatus(column.status).map((schedule) => /* @__PURE__ */ React.createElement(Card, { key: schedule.id }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-lg" }, schedule.title), /* @__PURE__ */ React.createElement(Badge, { variant: getStatusVariant(schedule.status) }, schedule.status)), /* @__PURE__ */ React.createElement(CardDescription, { className: "flex items-center text-sm text-muted-foreground mt-2" }, /* @__PURE__ */ React.createElement(Clock, { className: "mr-2 h-4 w-4" }), " ", schedule.departureTime)), /* @__PURE__ */ React.createElement(CardContent, { className: "space-y-3 text-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(User, { className: "mr-2 h-4 w-4 text-primary" }), /* @__PURE__ */ React.createElement("strong", null, "Motorista:"), /* @__PURE__ */ React.createElement("span", { className: "ml-2" }, schedule.driver)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Car, { className: "mr-2 h-4 w-4 text-primary" }), /* @__PURE__ */ React.createElement("strong", null, "Ve\xEDculo:"), /* @__PURE__ */ React.createElement("span", { className: "ml-2" }, schedule.vehicle)), /* @__PURE__ */ React.createElement(Separator, null), /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Pin, { className: "mr-2 h-4 w-4 text-green-500" }), /* @__PURE__ */ React.createElement("span", null, schedule.origin), /* @__PURE__ */ React.createElement(ArrowRight, { className: "mx-2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ React.createElement(Pin, { className: "mr-2 h-4 w-4 text-red-500" }), /* @__PURE__ */ React.createElement("span", null, schedule.destination))))) : /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center h-full text-sm text-muted-foreground" }, "Nenhuma viagem nesta etapa.")))));
}
export {
  TripKanbanView as default
};
