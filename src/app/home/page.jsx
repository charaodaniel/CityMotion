"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/contexts/app-provider";
import { CalendarDays, Clock, User } from "lucide-react";
import Loading from "@/app/loading";
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
function HomePage() {
  const { workSchedules, currentUser, isLoading } = useApp();
  const router = useRouter();
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  useEffect(() => {
    if (currentUser) {
      router.replace("/dashboard");
    }
  }, [currentUser, router]);
  const handleCardClick = (schedule) => {
    setSelectedSchedule(schedule);
  };
  const closeDetailsModal = () => {
    setSelectedSchedule(null);
  };
  if (isLoading && !currentUser) {
    return /* @__PURE__ */ React.createElement(Loading, null);
  }
  if (currentUser) {
    return /* @__PURE__ */ React.createElement(Loading, null);
  }
  return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto p-4 sm:p-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold tracking-tight font-headline text-primary" }, "Quadro de Escalas Operacionais"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground" }, "Consulte o cronograma de atividades, plant\xF5es e jornadas da organiza\xE7\xE3o."))), workSchedules.length > 0 ? /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" }, workSchedules.map((schedule) => /* @__PURE__ */ React.createElement(
    Card,
    {
      key: schedule.id,
      onClick: () => handleCardClick(schedule),
      className: "cursor-pointer hover:shadow-md transition-shadow border-primary/10"
    },
    /* @__PURE__ */ React.createElement(CardHeader, { className: "pb-4" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-base flex items-center gap-2" }, /* @__PURE__ */ React.createElement(CalendarDays, { className: "h-4 w-4 text-primary" }), schedule.title), /* @__PURE__ */ React.createElement(CardDescription, { asChild: true, className: "flex items-center text-xs pt-1" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Badge, { variant: "outline", className: "text-[10px]" }, schedule.type)))),
    /* @__PURE__ */ React.createElement(CardContent, { className: "text-sm space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(User, { className: "mr-2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, schedule.employee)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-xs text-muted-foreground" }, /* @__PURE__ */ React.createElement(Clock, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ React.createElement("span", null, schedule.startDate, " - ", schedule.endDate)), /* @__PURE__ */ React.createElement("div", { className: "pt-2" }, /* @__PURE__ */ React.createElement(Badge, { variant: getStatusVariant(schedule.status) }, schedule.status)))
  ))) : /* @__PURE__ */ React.createElement("div", { className: "text-center text-muted-foreground py-20 border-dashed border-2 rounded-lg" }, /* @__PURE__ */ React.createElement("p", { className: "text-lg italic" }, "Nenhuma escala p\xFAblica dispon\xEDvel para consulta no momento.")), /* @__PURE__ */ React.createElement(Dialog, { open: !!selectedSchedule, onOpenChange: closeDetailsModal }, /* @__PURE__ */ React.createElement(DialogContent, null, /* @__PURE__ */ React.createElement(ScrollArea, { className: "max-h-[80vh] p-4" }, selectedSchedule && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DialogHeader, null, /* @__PURE__ */ React.createElement(DialogTitle, { className: "text-2xl text-primary" }, selectedSchedule.title), /* @__PURE__ */ React.createElement(DialogDescription, null, "Informa\xE7\xF5es detalhadas do cronograma.")), /* @__PURE__ */ React.createElement("div", { className: "space-y-4 py-4 pr-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground" }, "Tipo de Atividade"), /* @__PURE__ */ React.createElement("p", { className: "text-lg font-medium" }, selectedSchedule.type)), /* @__PURE__ */ React.createElement(Separator, null), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground" }, "Respons\xE1vel"), /* @__PURE__ */ React.createElement("p", { className: "text-lg font-medium" }, selectedSchedule.employee)), /* @__PURE__ */ React.createElement(Separator, null), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground" }, "Per\xEDodo de Vig\xEAncia"), /* @__PURE__ */ React.createElement("p", { className: "text-lg font-medium" }, selectedSchedule.startDate, " at\xE9 ", selectedSchedule.endDate)), /* @__PURE__ */ React.createElement(Separator, null), selectedSchedule.description && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground" }, "Observa\xE7\xF5es Operacionais"), /* @__PURE__ */ React.createElement("p", { className: "text-sm mt-2 p-3 bg-muted rounded-md border" }, selectedSchedule.description)), /* @__PURE__ */ React.createElement(Separator, null)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground" }, "Status Atual"), /* @__PURE__ */ React.createElement("div", { className: "mt-2" }, /* @__PURE__ */ React.createElement(Badge, { variant: getStatusVariant(selectedSchedule.status) }, selectedSchedule.status)))))))));
}
export {
  HomePage as default
};
