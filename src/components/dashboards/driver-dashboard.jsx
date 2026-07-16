"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Car, Pin, ArrowRight, FileText, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/contexts/app-provider";
import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
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
function exportDriverReport(driverName, allTrips) {
  const doc = new jsPDF("landscape", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(9, 9, 11);
  doc.rect(0, 0, pageWidth, 35, "F");
  doc.setTextColor(147, 197, 253);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("CityMotion", 14, 18);
  doc.setTextColor(200, 200, 210);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Relat\xF3rio de Viagens \u2014 ${driverName}`, 14, 28);
  doc.text((/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR"), pageWidth - 14, 28, { align: "right" });
  const driverTrips = allTrips.filter((s) => s.driver === driverName);
  const agendadas = driverTrips.filter((s) => s.status === "Agendada").length;
  const andamento = driverTrips.filter((s) => s.status === "Em Andamento").length;
  const concluidas = driverTrips.filter((s) => s.status === "Conclu\xEDda").length;
  const kmTotal = driverTrips.reduce((acc, s) => acc + ((s.endMileage || 0) - (s.startMileage || 0)), 0);
  doc.setTextColor(100, 100, 120);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("RESUMO", 14, 45);
  doc.setFillColor(240, 240, 245);
  doc.rect(14, 48, pageWidth - 28, 18, "F");
  doc.setTextColor(50, 50, 60);
  doc.setFontSize(9);
  doc.text(`Total de Viagens: ${driverTrips.length}`, 18, 57);
  doc.text(`Agendadas: ${agendadas}`, 70, 57);
  doc.text(`Em Andamento: ${andamento}`, 120, 57);
  doc.text(`Conclu\xEDdas: ${concluidas}`, 175, 57);
  doc.text(`KM Total: ${kmTotal} km`, 230, 57);
  doc.setTextColor(100, 100, 120);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("VIAGENS", 14, 76);
  const tableData = driverTrips.map((s) => [
    s.title,
    s.departureTime,
    s.origin,
    s.destination,
    s.vehicle,
    s.startMileage?.toString() || "-",
    s.endMileage?.toString() || "-",
    s.status
  ]);
  autoTable(doc, {
    startY: 80,
    head: [["T\xEDtulo", "Data/Hora", "Origem", "Destino", "Ve\xEDculo", "KM Inicial", "KM Final", "Status"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [9, 9, 11],
      textColor: [147, 197, 253],
      fontStyle: "bold",
      fontSize: 8,
      halign: "center"
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [50, 50, 60]
    },
    alternateRowStyles: {
      fillColor: [245, 245, 250]
    },
    columnStyles: {
      0: { cellWidth: 40 },
      2: { cellWidth: 35 },
      3: { cellWidth: 35 },
      7: { cellWidth: 20, halign: "center" }
    },
    margin: { left: 14, right: 14 }
  });
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(180, 180, 190);
    doc.setFontSize(7);
    doc.text(
      `CityMotion \u2014 Relat\xF3rio gerado em ${(/* @__PURE__ */ new Date()).toLocaleString("pt-BR")} | P\xE1gina ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    );
  }
  const filename = `relatorio-viagens-${driverName.replace(/\s+/g, "-").toLowerCase()}-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
}
function DriverDashboard() {
  const { schedules, currentUser } = useApp();
  const currentDriverName = currentUser?.name || "Maria Oliveira";
  const [isExporting, setIsExporting] = useState(false);
  const driverSchedules = useMemo(() => {
    return schedules.filter((s) => s.driver === currentDriverName && s.status !== "Cancelada");
  }, [schedules, currentDriverName]);
  const pendingSchedules = useMemo(() => {
    return driverSchedules.filter((s) => s.status !== "Conclu\xEDda");
  }, [driverSchedules]);
  const handleExport = () => {
    setIsExporting(true);
    try {
      exportDriverReport(currentDriverName, schedules);
    } catch (err) {
      console.error("[Export] Erro ao gerar PDF:", err);
    } finally {
      setTimeout(() => setIsExporting(false), 1e3);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-semibold" }, "Minhas Viagens"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground" }, pendingSchedules.length, " pendente(s) \u2022 ", driverSchedules.filter((s) => s.status === "Conclu\xEDda").length, " conclu\xEDda(s)")), /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "outline",
      size: "sm",
      onClick: handleExport,
      disabled: isExporting,
      className: "text-[10px] font-bold uppercase tracking-widest border-primary/30 text-primary hover:bg-primary/10"
    },
    /* @__PURE__ */ React.createElement(FileText, { className: "mr-2 h-3.5 w-3.5" }),
    isExporting ? "Exportando..." : "Exportar Relat\xF3rio PDF"
  )), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, pendingSchedules.length > 0 ? pendingSchedules.map((schedule) => /* @__PURE__ */ React.createElement(Card, { key: schedule.id }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-lg" }, schedule.title), /* @__PURE__ */ React.createElement(Badge, { variant: getStatusVariant(schedule.status) }, schedule.status)), /* @__PURE__ */ React.createElement(CardDescription, { className: "flex items-center text-sm text-muted-foreground mt-2" }, /* @__PURE__ */ React.createElement(Clock, { className: "mr-2 h-4 w-4" }), " ", schedule.departureTime)), /* @__PURE__ */ React.createElement(CardContent, { className: "space-y-3 text-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(User, { className: "mr-2 h-4 w-4 text-primary" }), /* @__PURE__ */ React.createElement("strong", null, "Motorista:"), /* @__PURE__ */ React.createElement("span", { className: "ml-2" }, schedule.driver)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Car, { className: "mr-2 h-4 w-4 text-primary" }), /* @__PURE__ */ React.createElement("strong", null, "Ve\xEDculo:"), /* @__PURE__ */ React.createElement("span", { className: "ml-2" }, schedule.vehicle)), /* @__PURE__ */ React.createElement(Separator, null), /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Pin, { className: "mr-2 h-4 w-4 text-green-500" }), /* @__PURE__ */ React.createElement("span", null, schedule.origin), /* @__PURE__ */ React.createElement(ArrowRight, { className: "mx-2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ React.createElement(Pin, { className: "mr-2 h-4 w-4 text-red-500" }), /* @__PURE__ */ React.createElement("span", null, schedule.destination))))) : /* @__PURE__ */ React.createElement("div", { className: "text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg" }, "Voc\xEA n\xE3o tem nenhuma viagem agendada no momento."), driverSchedules.filter((s) => s.status === "Conclu\xEDda").length > 0 && /* @__PURE__ */ React.createElement("div", { className: "mt-8" }, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Download, { className: "h-3.5 w-3.5" }), "\xDAltimas Viagens Conclu\xEDdas"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, driverSchedules.filter((s) => s.status === "Conclu\xEDda").slice(-5).reverse().map((schedule) => /* @__PURE__ */ React.createElement(Card, { key: schedule.id, className: "opacity-70 hover:opacity-100 transition-opacity" }, /* @__PURE__ */ React.createElement(CardContent, { className: "p-4 flex items-center justify-between text-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, schedule.title), /* @__PURE__ */ React.createElement("span", { className: "text-muted-foreground text-xs" }, schedule.destination)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-xs text-muted-foreground" }, /* @__PURE__ */ React.createElement("span", null, schedule.departureTime), schedule.endMileage && schedule.startMileage && /* @__PURE__ */ React.createElement("span", { className: "text-primary" }, schedule.endMileage - schedule.startMileage, " km")))))))));
}
export {
  DriverDashboard as default
};
