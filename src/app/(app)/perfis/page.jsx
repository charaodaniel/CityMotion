"use client";
import { useMemo } from "react";
import { useApp } from "@/contexts/app-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserCog, ShieldAlert } from "lucide-react";
function ProfilesPage() {
  const { employees, setEmployees, userRole, updateEmployee, refreshData } = useApp();
  const { toast } = useToast();
  const availableRoles = useMemo(() => {
    const baseRoles = [
      "Funcion\xE1rio",
      "Motorista",
      "Gestor de Setor",
      "Administrador",
      "T\xE9cnico de TI",
      "T\xE9cnico Mec\xE2nico"
    ];
    if (userRole === "dev") {
      return [...baseRoles, "Desenvolvedor Global"];
    }
    return baseRoles;
  }, [userRole]);
  const handleRoleChange = async (employeeId, newRole) => {
    try {
      await updateEmployee(employeeId, { role: newRole });
      toast({
        title: "Perfil Atualizado!",
        description: `O perfil do colaborador foi alterado para ${newRole}.`
      });
    } catch (error) {
      toast({
        title: "Erro!",
        description: "N\xE3o foi poss\xEDvel salvar a altera\xE7\xE3o no banco de dados.",
        variant: "destructive"
      });
    }
  };
  if (!["dev", "ti", "admin"].includes(userRole)) {
    return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto p-4 sm:p-8" }, /* @__PURE__ */ React.createElement(Card, { className: "text-center" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement("div", { className: "flex justify-center mb-2 text-destructive" }, /* @__PURE__ */ React.createElement(ShieldAlert, { className: "h-10 w-10" })), /* @__PURE__ */ React.createElement(CardTitle, null, "Acesso Negado")), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground" }, "Esta p\xE1gina est\xE1 dispon\xEDvel apenas para desenvolvedores, t\xE9cnicos de TI e administradores."))));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto p-4 sm:p-8" }, /* @__PURE__ */ React.createElement("div", { className: "mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold tracking-tight font-headline flex items-center gap-3" }, /* @__PURE__ */ React.createElement(UserCog, null), "Gerenciamento de Perfis e Permiss\xF5es"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground" }, userRole === "dev" ? "Modo Global: Visualizando todos os usu\xE1rios do ecossistema." : "Controle de acesso t\xE9cnico para a organiza\xE7\xE3o.")), userRole === "dev" && /* @__PURE__ */ React.createElement(Badge, { variant: "outline", className: "bg-amber-500/10 text-amber-500 border-amber-500/20 w-fit" }, "Acesso Root Ativo")), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, null, "Tabela de Funcion\xE1rios e Credenciais"), /* @__PURE__ */ React.createElement(CardDescription, null, "Alterar o cargo de um usu\xE1rio modifica instantaneamente o que ele pode visualizar e executar no sistema.")), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Table, null, /* @__PURE__ */ React.createElement(TableHeader, null, /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableHead, null, "Funcion\xE1rio"), /* @__PURE__ */ React.createElement(TableHead, null, "Setor Principal"), /* @__PURE__ */ React.createElement(TableHead, { className: "w-[250px]" }, "Perfil de Acesso"))), /* @__PURE__ */ React.createElement(TableBody, null, employees.map((employee) => {
    const isTargetDev = employee.role === "Desenvolvedor Global";
    const canEdit = userRole === "dev" || !isTargetDev;
    return /* @__PURE__ */ React.createElement(TableRow, { key: employee.id }, /* @__PURE__ */ React.createElement(TableCell, { className: "font-medium" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(Avatar, { className: "h-9 w-9" }, /* @__PURE__ */ React.createElement(AvatarImage, { src: `https://i.pravatar.cc/150?u=${employee.id}`, alt: employee.name }), /* @__PURE__ */ React.createElement(AvatarFallback, null, employee.name.split(" ").map((n) => n[0]).join(""))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "font-semibold" }, employee.name), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground font-mono" }, employee.email)))), /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-1" }, Array.isArray(employee.sector) ? employee.sector.map((s) => /* @__PURE__ */ React.createElement(Badge, { key: s, variant: "secondary", className: "text-[10px]" }, s)) : /* @__PURE__ */ React.createElement(Badge, { variant: "secondary", className: "text-[10px]" }, employee.sector))), /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(
      Select,
      {
        defaultValue: employee.role,
        onValueChange: (newRole) => handleRoleChange(employee.id, newRole),
        disabled: !canEdit
      },
      /* @__PURE__ */ React.createElement(SelectTrigger, null, /* @__PURE__ */ React.createElement(SelectValue, { placeholder: "Selecione um perfil" })),
      /* @__PURE__ */ React.createElement(SelectContent, null, availableRoles.map((role) => /* @__PURE__ */ React.createElement(SelectItem, { key: role, value: role }, role)))
    ), !canEdit && /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-destructive mt-1" }, "Hierarquia Protegida")));
  }))))));
}
export {
  ProfilesPage as default
};
