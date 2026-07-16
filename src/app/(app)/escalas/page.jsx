"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Clock, User, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateScheduleForm } from "@/components/forms/create-schedule-form";
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
function SchedulesPage() {
  const { workSchedules } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const handleCardClick = (schedule) => {
    setSelectedSchedule(schedule);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto p-4 sm:p-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold tracking-tight font-headline" }, "Escalas de Funcion\xE1rios"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground" }, "Gest\xE3o de plant\xF5es e jornadas.")), /* @__PURE__ */ React.createElement(Dialog, { open: isModalOpen, onOpenChange: setIsModalOpen }, /* @__PURE__ */ React.createElement(DialogTrigger, { asChild: true }, /* @__PURE__ */ React.createElement(Button, { className: "bg-primary hover:bg-primary/90" }, /* @__PURE__ */ React.createElement(PlusCircle, { className: "mr-2 h-4 w-4" }), "Criar Nova Escala")), /* @__PURE__ */ React.createElement(DialogContent, { className: "sm:max-w-3xl" }, /* @__PURE__ */ React.createElement(DialogHeader, null, /* @__PURE__ */ React.createElement(DialogTitle, { className: "text-2xl" }, "Agendamento de Escala")), /* @__PURE__ */ React.createElement(ScrollArea, { className: "max-h-[70vh] p-4" }, /* @__PURE__ */ React.createElement(CreateScheduleForm, { onFormSubmit: () => setIsModalOpen(false) }))))), workSchedules.length > 0 ? /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" }, workSchedules.map((schedule) => /* @__PURE__ */ React.createElement(
    Card,
    {
      key: schedule.id,
      onClick: () => handleCardClick(schedule),
      className: "cursor-pointer hover:shadow-md transition-shadow"
    },
    /* @__PURE__ */ React.createElement(CardHeader, { className: "pb-4" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-base flex items-center gap-2" }, /* @__PURE__ */ React.createElement(CalendarDays, { className: "h-4 w-4 text-muted-foreground" }), schedule.title), /* @__PURE__ */ React.createElement(CardDescription, { asChild: true }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-xs pt-1" }, /* @__PURE__ */ React.createElement(Badge, { variant: "outline" }, schedule.type)))),
    /* @__PURE__ */ React.createElement(CardContent, { className: "text-sm space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(User, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ React.createElement("span", null, schedule.employee)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-xs text-muted-foreground" }, /* @__PURE__ */ React.createElement(Clock, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ React.createElement("span", null, schedule.startDate, " - ", schedule.endDate)), /* @__PURE__ */ React.createElement("div", { className: "pt-2" }, /* @__PURE__ */ React.createElement(Badge, { variant: getStatusVariant(schedule.status) }, schedule.status)))
  ))) : /* @__PURE__ */ React.createElement("div", { className: "text-center text-muted-foreground py-8 border-dashed border-2 rounded-lg" }, /* @__PURE__ */ React.createElement("p", { className: "text-lg" }, "Nenhuma escala agendada.")), /* @__PURE__ */ React.createElement(Dialog, { open: !!selectedSchedule, onOpenChange: () => setSelectedSchedule(null) }, /* @__PURE__ */ React.createElement(DialogContent, null, /* @__PURE__ */ React.createElement(ScrollArea, { className: "max-h-[80vh] p-4" }, selectedSchedule && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DialogHeader, null, /* @__PURE__ */ React.createElement(DialogTitle, { className: "text-2xl" }, selectedSchedule.title)), /* @__PURE__ */ React.createElement("div", { className: "space-y-4 py-4 pr-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold text-muted-foreground" }, "Tipo"), /* @__PURE__ */ React.createElement("p", { className: "text-lg" }, selectedSchedule.type)), /* @__PURE__ */ React.createElement(Separator, null), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold text-muted-foreground" }, "Status"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Badge, { variant: getStatusVariant(selectedSchedule.status) }, selectedSchedule.status)))))))));
}
export {
  SchedulesPage as default
};
