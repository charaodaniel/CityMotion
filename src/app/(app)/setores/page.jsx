"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Car, PlusCircle, User, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RegisterSectorForm } from "@/components/forms/register-sector-form";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/contexts/app-provider";
function SectorsPage() {
  const { sectors, setSectors, employees, vehicles } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("register");
  const [selectedSector, setSelectedSector] = useState(null);
  const handleCardClick = (sector) => {
    setSelectedSector(sector);
    setModalMode("details");
    setIsModalOpen(true);
  };
  const handleOpenRegisterModal = () => {
    setSelectedSector(null);
    setModalMode("register");
    setIsModalOpen(true);
  };
  const handleOpenEditModal = (sector) => {
    setSelectedSector(sector);
    setModalMode("edit");
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSector(null);
  };
  const handleFormSubmit = (newSectorData) => {
    if (modalMode === "edit" && selectedSector) {
      setSectors(sectors.map((s) => s.id === selectedSector.id ? { ...s, ...newSectorData } : s));
    } else {
      const newSector = {
        id: `SEC${sectors.length + 1}`,
        driverCount: 0,
        vehicleCount: 0,
        ...newSectorData
      };
      setSectors([...sectors, newSector]);
    }
    closeModal();
  };
  const sectorEmployees = selectedSector ? employees.filter((d) => d.sector.includes(selectedSector.name)) : [];
  const sectorVehicles = selectedSector ? vehicles.filter((v) => v.sector === selectedSector.name) : [];
  const getModalContent = () => {
    switch (modalMode) {
      case "register":
        return {
          title: "Adicionar Novo Setor",
          description: "Preencha o formul\xE1rio para cadastrar um novo setor.",
          content: /* @__PURE__ */ React.createElement(RegisterSectorForm, { onFormSubmit: handleFormSubmit })
        };
      case "edit":
        return {
          title: "Editar Setor",
          description: "Altere as informa\xE7\xF5es do setor.",
          content: /* @__PURE__ */ React.createElement(RegisterSectorForm, { onFormSubmit: handleFormSubmit, existingSector: selectedSector })
        };
      case "details":
      default:
        return {
          title: selectedSector?.name || "",
          description: selectedSector?.description || "",
          content: /* @__PURE__ */ React.createElement("div", { className: "space-y-6 py-4 pr-4 mt-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-end" }, /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", onClick: () => handleOpenEditModal(selectedSector) }, /* @__PURE__ */ React.createElement(Edit, { className: "mr-2 h-4 w-4" }), "Editar")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold mb-2 flex items-center" }, /* @__PURE__ */ React.createElement(User, { className: "mr-2 h-5 w-5" }), "Funcion\xE1rios Vinculados"), sectorEmployees.length > 0 ? /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(Table, null, /* @__PURE__ */ React.createElement(TableHeader, null, /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableHead, null, "Nome"), /* @__PURE__ */ React.createElement(TableHead, null, "Cargo"), /* @__PURE__ */ React.createElement(TableHead, null, "Status"))), /* @__PURE__ */ React.createElement(TableBody, null, sectorEmployees.map((employee) => /* @__PURE__ */ React.createElement(TableRow, { key: employee.id }, /* @__PURE__ */ React.createElement(TableCell, { className: "font-medium" }, employee.name), /* @__PURE__ */ React.createElement(TableCell, null, employee.role), /* @__PURE__ */ React.createElement(TableCell, null, employee.status)))))) : /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground" }, "Nenhum funcion\xE1rio vinculado a este setor.")), /* @__PURE__ */ React.createElement(Separator, null), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold mb-2 flex items-center" }, /* @__PURE__ */ React.createElement(Car, { className: "mr-2 h-5 w-5" }), "Ve\xEDculos Vinculados"), sectorVehicles.length > 0 ? /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(Table, null, /* @__PURE__ */ React.createElement(TableHeader, null, /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableHead, null, "Modelo"), /* @__PURE__ */ React.createElement(TableHead, null, "Placa"), /* @__PURE__ */ React.createElement(TableHead, null, "Status"))), /* @__PURE__ */ React.createElement(TableBody, null, sectorVehicles.map((vehicle) => /* @__PURE__ */ React.createElement(TableRow, { key: vehicle.id }, /* @__PURE__ */ React.createElement(TableCell, { className: "font-medium" }, vehicle.vehicleModel), /* @__PURE__ */ React.createElement(TableCell, null, vehicle.licensePlate), /* @__PURE__ */ React.createElement(TableCell, null, vehicle.status)))))) : /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground" }, "Nenhum ve\xEDculo vinculado a este setor.")))
        };
    }
  };
  const { title, description, content } = getModalContent();
  return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto p-4 sm:p-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold tracking-tight font-headline" }, "Gest\xE3o de Setores"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground" }, "Configura\xE7\xE3o de unidades e departamentos.")), /* @__PURE__ */ React.createElement(Button, { onClick: handleOpenRegisterModal, className: "bg-primary hover:bg-primary/90" }, /* @__PURE__ */ React.createElement(PlusCircle, { className: "mr-2 h-4 w-4" }), "Adicionar Novo Setor")), sectors.length > 0 ? /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, sectors.map((sector) => /* @__PURE__ */ React.createElement(
    Card,
    {
      key: sector.id,
      className: "flex flex-col cursor-pointer hover:shadow-md transition-shadow",
      onClick: () => handleCardClick(sector)
    },
    /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(Building, { className: "w-5 h-5 text-muted-foreground" }), /* @__PURE__ */ React.createElement("span", { className: "truncate" }, sector.name)), /* @__PURE__ */ React.createElement(CardDescription, { className: "line-clamp-2" }, sector.description)),
    /* @__PURE__ */ React.createElement(CardContent, { className: "flex flex-col flex-grow justify-end text-sm space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-muted-foreground" }, /* @__PURE__ */ React.createElement(Car, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ React.createElement("span", null, vehicles.filter((v) => v.sector === sector.name).length, " ve\xEDculos")))
  ))) : /* @__PURE__ */ React.createElement("div", { className: "text-center text-muted-foreground py-8 border-dashed border-2 rounded-lg" }, /* @__PURE__ */ React.createElement("p", { className: "text-lg" }, "Nenhum setor cadastrado no momento.")), /* @__PURE__ */ React.createElement(Dialog, { open: isModalOpen, onOpenChange: closeModal }, /* @__PURE__ */ React.createElement(DialogContent, { className: modalMode === "details" ? "sm:max-w-3xl" : "sm:max-w-xl" }, /* @__PURE__ */ React.createElement(ScrollArea, { className: "max-h-[80vh] p-4" }, /* @__PURE__ */ React.createElement(DialogHeader, null, /* @__PURE__ */ React.createElement(DialogTitle, { className: "text-2xl" }, title), /* @__PURE__ */ React.createElement(DialogDescription, null, description)), content))));
}
export {
  SectorsPage as default
};
