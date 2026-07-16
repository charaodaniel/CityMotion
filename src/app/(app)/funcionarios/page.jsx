"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle, ShieldCheck, Edit, Briefcase, Users, Loader2, Trash2 } from "lucide-react";
import { RegisterEmployeeForm } from "@/components/forms/register-employee-form";
import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useApp } from "@/contexts/app-provider";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
function getStatusVariant(status) {
  switch (status) {
    case "Dispon\xEDvel":
      return "secondary";
    case "Em Servi\xE7o":
    case "Em Viagem":
      return "default";
    case "Afastado":
    case "Desativado":
      return "destructive";
    default:
      return "outline";
  }
}
function EmployeesPage() {
  const { employees, userRole, selectedSector, updateEmployee, addEmployee, deleteEmployee } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("register");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const visibleEmployees = useMemo(() => {
    if (userRole === "dev") return employees;
    let list = employees.filter((e) => e.status !== "Desativado");
    if (userRole === "manager" && selectedSector) {
      return list.filter((d) => d.sector.includes(selectedSector));
    }
    return list;
  }, [employees, userRole, selectedSector]);
  const handleCardClick = (employee) => {
    setSelectedEmployee(employee);
    setModalMode("details");
    setIsModalOpen(true);
  };
  const handleOpenRegisterModal = () => {
    setSelectedEmployee(null);
    setModalMode("register");
    setIsModalOpen(true);
  };
  const handleOpenEditModal = (employee) => {
    setSelectedEmployee(employee);
    setModalMode("edit");
    setIsModalOpen(true);
  };
  const closeModal = () => {
    if (isProcessing) return;
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };
  const handleFormSubmit = async (newEmployeeData) => {
    setIsProcessing(true);
    try {
      if (modalMode === "edit" && selectedEmployee) {
        await updateEmployee(selectedEmployee.id, newEmployeeData);
      } else {
        await addEmployee({
          ...newEmployeeData,
          status: "Dispon\xEDvel"
        });
      }
      setIsModalOpen(false);
      setSelectedEmployee(null);
    } catch (e) {
      console.error("Falha ao salvar funcion\xE1rio");
    } finally {
      setIsProcessing(false);
    }
  };
  const handleDelete = async (id) => {
    setIsProcessing(true);
    try {
      await deleteEmployee(id);
      setIsModalOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };
  const getModalContent = () => {
    switch (modalMode) {
      case "register":
        return {
          title: "Cadastro de Funcion\xE1rio",
          description: "Preencha o formul\xE1rio para cadastrar um novo funcion\xE1rio.",
          content: /* @__PURE__ */ React.createElement(RegisterEmployeeForm, { onFormSubmit: handleFormSubmit })
        };
      case "edit":
        return {
          title: "Editar Funcion\xE1rio",
          description: "Altere as informa\xE7\xF5es do funcion\xE1rio.",
          content: /* @__PURE__ */ React.createElement(RegisterEmployeeForm, { onFormSubmit: handleFormSubmit, existingEmployee: selectedEmployee })
        };
      case "details":
      default:
        return {
          title: selectedEmployee?.name || "",
          description: "Detalhes do funcion\xE1rio.",
          content: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DialogHeader, { className: "items-center text-center" }, /* @__PURE__ */ React.createElement(Avatar, { className: "h-24 w-24 mb-4 border-2 border-primary/20" }, /* @__PURE__ */ React.createElement(AvatarImage, { src: `https://i.pravatar.cc/150?u=${selectedEmployee?.id}`, alt: selectedEmployee?.name }), /* @__PURE__ */ React.createElement(AvatarFallback, null, selectedEmployee?.name.charAt(0))), /* @__PURE__ */ React.createElement(DialogTitle, { className: "text-2xl font-bold tracking-tight" }, selectedEmployee?.name), /* @__PURE__ */ React.createElement(DialogDescription, { className: "text-xs uppercase tracking-widest font-mono text-primary/70" }, selectedEmployee?.role, " \u2022 ", selectedEmployee?.sector.join(", "))), /* @__PURE__ */ React.createElement("div", { className: "space-y-4 py-4 pr-4 mt-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground" }, "Nome Completo"), /* @__PURE__ */ React.createElement("p", { className: "text-lg font-bold" }, selectedEmployee?.name)), /* @__PURE__ */ React.createElement(Separator, { className: "bg-border/30" }), selectedEmployee?.email && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground" }, "Email de Acesso"), /* @__PURE__ */ React.createElement("p", { className: "text-base font-mono" }, selectedEmployee.email)), /* @__PURE__ */ React.createElement(Separator, { className: "bg-border/30" })), selectedEmployee?.matricula && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground" }, "Matr\xEDcula"), /* @__PURE__ */ React.createElement("p", { className: "text-base font-mono font-bold text-primary" }, selectedEmployee.matricula)), /* @__PURE__ */ React.createElement(Separator, { className: "bg-border/30" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground" }, "Status"), /* @__PURE__ */ React.createElement("div", { className: "mt-1" }, selectedEmployee && /* @__PURE__ */ React.createElement(Badge, { variant: getStatusVariant(selectedEmployee.status) }, selectedEmployee.status))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center pt-8" }, /* @__PURE__ */ React.createElement(AlertDialog, null, /* @__PURE__ */ React.createElement(AlertDialogTrigger, { asChild: true }, /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", className: "text-destructive hover:text-destructive hover:bg-destructive/10 text-xs font-bold uppercase tracking-widest" }, /* @__PURE__ */ React.createElement(Trash2, { className: "mr-2 h-3.5 w-3.5" }), userRole === "dev" ? "Remover Definitivo" : "Desativar Registro")), /* @__PURE__ */ React.createElement(AlertDialogContent, { className: "bg-sidebar border-border/50" }, /* @__PURE__ */ React.createElement(AlertDialogHeader, null, /* @__PURE__ */ React.createElement(AlertDialogTitle, null, "Voc\xEA tem certeza?"), /* @__PURE__ */ React.createElement(AlertDialogHeader, null, userRole === "dev" ? "Esta a\xE7\xE3o remover\xE1 permanentemente o funcion\xE1rio do banco de dados SQLite. Esta a\xE7\xE3o n\xE3o pode ser desfeita." : "O funcion\xE1rio ser\xE1 marcado como 'Desativado' e n\xE3o aparecer\xE1 mais nas listagens operacionais, mas o hist\xF3rico ser\xE1 preservado.")), /* @__PURE__ */ React.createElement(AlertDialogFooter, null, /* @__PURE__ */ React.createElement(AlertDialogCancel, { className: "border-border/50" }, "Cancelar"), /* @__PURE__ */ React.createElement(
            AlertDialogAction,
            {
              onClick: () => selectedEmployee && handleDelete(selectedEmployee.id),
              className: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            },
            "Confirmar"
          )))), /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", onClick: () => handleOpenEditModal(selectedEmployee), className: "text-xs uppercase font-bold tracking-widest" }, /* @__PURE__ */ React.createElement(Edit, { className: "mr-2 h-3.5 w-3.5" }), "Editar Registro"))))
        };
    }
  };
  const { title, description, content } = getModalContent();
  return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto p-4 sm:p-8 space-y-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "text-5xl font-black tracking-tighter text-on-surface flex items-center gap-4" }, /* @__PURE__ */ React.createElement(Users, { className: "h-10 w-10 text-primary" }), "Funcion\xE1rios"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground text-lg mt-1 font-medium" }, userRole === "manager" ? `Gest\xE3o de equipe para o setor de ${selectedSector}.` : "Controle de acesso e identifica\xE7\xE3o NexusOS.")), /* @__PURE__ */ React.createElement(Button, { onClick: handleOpenRegisterModal, className: "bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 rounded-lg font-bold uppercase tracking-widest text-xs" }, /* @__PURE__ */ React.createElement(PlusCircle, { className: "mr-2 h-4 w-4" }), "Novo Colaborador")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" }, visibleEmployees.map((employee) => /* @__PURE__ */ React.createElement(
    Card,
    {
      key: employee.id,
      className: cn(
        "cursor-pointer hover:border-primary transition-all duration-300 bg-sidebar/50 border-border/50 overflow-hidden group",
        employee.status === "Desativado" && "opacity-60 grayscale border-destructive/20"
      )
    },
    /* @__PURE__ */ React.createElement("div", { onClick: () => handleCardClick(employee), className: "p-6" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "p-0 mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement(Avatar, { className: "h-12 w-12 border-2 border-primary/20" }, /* @__PURE__ */ React.createElement(AvatarImage, { src: `https://i.pravatar.cc/150?u=${employee.id}`, alt: employee.name }), /* @__PURE__ */ React.createElement(AvatarFallback, null, employee.name.charAt(0))), /* @__PURE__ */ React.createElement("div", { className: "overflow-hidden" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-lg font-bold truncate leading-tight" }, employee.name), /* @__PURE__ */ React.createElement(CardDescription, { className: "text-[10px] uppercase tracking-widest font-mono text-primary/70 truncate" }, employee.role)))), /* @__PURE__ */ React.createElement(CardContent, { className: "p-0 flex items-center justify-between" }, /* @__PURE__ */ React.createElement(Badge, { variant: getStatusVariant(employee.status), className: "text-[10px] font-bold uppercase tracking-tight" }, employee.status), employee.cnh && /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-[10px] font-mono font-bold text-emerald-500/70" }, /* @__PURE__ */ React.createElement(ShieldCheck, { className: "mr-1.5 h-3 w-3" }), /* @__PURE__ */ React.createElement("span", null, "CNH_OK")))),
    /* @__PURE__ */ React.createElement(CardContent, { className: "p-2 pt-0" }, /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", className: "w-full justify-start text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors", asChild: true }, /* @__PURE__ */ React.createElement(Link, { href: `/cracha/${employee.id}`, target: "_blank" }, /* @__PURE__ */ React.createElement(Briefcase, { className: "mr-2 h-3.5 w-3.5" }), "Ver Crach\xE1 Virtual")))
  ))), visibleEmployees.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "text-center text-muted-foreground py-20 border-dashed border-2 rounded-xl bg-sidebar/30" }, /* @__PURE__ */ React.createElement("p", { className: "text-lg italic" }, "Nenhum funcion\xE1rio cadastrado no momento."), /* @__PURE__ */ React.createElement(Button, { variant: "link", onClick: handleOpenRegisterModal, className: "mt-2 text-primary font-bold uppercase tracking-widest text-xs" }, "Cadastrar agora")), /* @__PURE__ */ React.createElement(Dialog, { open: isModalOpen, onOpenChange: closeModal }, /* @__PURE__ */ React.createElement(DialogContent, { className: modalMode !== "details" ? "sm:max-w-3xl border-border/50 bg-sidebar p-0 overflow-hidden" : "border-border/50 bg-sidebar p-0 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "h-1.5 w-full bg-primary" }), /* @__PURE__ */ React.createElement(ScrollArea, { className: "max-h-[80vh] p-8" }, modalMode === "details" ? content : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DialogHeader, { className: "mb-6" }, /* @__PURE__ */ React.createElement(DialogTitle, { className: "text-2xl font-black tracking-tight" }, title), /* @__PURE__ */ React.createElement(DialogDescription, { className: "text-xs font-mono uppercase tracking-widest text-primary/70" }, description)), /* @__PURE__ */ React.createElement("div", { className: "scanlines rounded-lg border border-border/50 p-6 bg-accent/10 relative" }, isProcessing && /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-lg" }, /* @__PURE__ */ React.createElement(Loader2, { className: "h-8 w-8 animate-spin text-primary" })), content))))));
}
export {
  EmployeesPage as default
};
