"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/contexts/app-provider";
import { Mail, Building, ShieldCheck, Briefcase, ShieldAlert, FileText } from "lucide-react";
import { useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
function getStatusVariant(status) {
  switch (status) {
    case "Pendente":
      return "secondary";
    case "Aprovada":
      return "default";
    case "Rejeitada":
      return "destructive";
    default:
      return "outline";
  }
}
function ProfilePage() {
  const { currentUser, vehicleRequests, isLoading } = useApp();
  const userRequests = useMemo(() => {
    if (!currentUser) return [];
    return vehicleRequests.filter((req) => req.requester === currentUser.name);
  }, [currentUser, vehicleRequests]);
  if (isLoading) {
    return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto p-4 sm:p-8 max-w-4xl space-y-8" }, /* @__PURE__ */ React.createElement(Skeleton, { className: "h-10 w-48" }), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8" }, /* @__PURE__ */ React.createElement(Skeleton, { className: "md:col-span-1 h-96" }), /* @__PURE__ */ React.createElement(Skeleton, { className: "md:col-span-2 h-96" })));
  }
  if (!currentUser) {
    return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto p-4 sm:p-8" }, /* @__PURE__ */ React.createElement(Card, { className: "text-center p-8" }, /* @__PURE__ */ React.createElement(CardTitle, null, "Nenhum usu\xE1rio logado"), /* @__PURE__ */ React.createElement(CardDescription, null, "Por favor, acesse a p\xE1gina de login para selecionar um perfil.")));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto p-4 sm:p-8 max-w-4xl" }, /* @__PURE__ */ React.createElement("div", { className: "mb-6 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold tracking-tight font-headline" }, "Meu Perfil"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground" }, "Suas informa\xE7\xF5es funcionais e hist\xF3rico de atividades.")), /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", asChild: true }, /* @__PURE__ */ React.createElement(Link, { href: "/privacy" }, /* @__PURE__ */ React.createElement(ShieldAlert, { className: "mr-2 h-4 w-4" }), "Sua Privacidade (LGPD)"))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8" }, /* @__PURE__ */ React.createElement("div", { className: "md:col-span-1 space-y-6" }, /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardHeader, { className: "items-center text-center" }, /* @__PURE__ */ React.createElement(Avatar, { className: "h-24 w-24 mb-4" }, /* @__PURE__ */ React.createElement(AvatarImage, { src: `https://i.pravatar.cc/150?u=${currentUser.id}`, alt: currentUser.name }), /* @__PURE__ */ React.createElement(AvatarFallback, null, currentUser.name.split(" ").map((n) => n[0]).join(""))), /* @__PURE__ */ React.createElement(CardTitle, { className: "text-2xl" }, currentUser.name), /* @__PURE__ */ React.createElement(CardDescription, null, currentUser.role)), /* @__PURE__ */ React.createElement(CardContent, { className: "space-y-4 text-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Mail, { className: "mr-3 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ React.createElement("span", { className: "truncate" }, currentUser.email || "N\xE3o dispon\xEDvel")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Building, { className: "mr-3 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ React.createElement("span", null, "Setor: ", /* @__PURE__ */ React.createElement("strong", null, Array.isArray(currentUser.sector) ? currentUser.sector.join(", ") : currentUser.sector))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Briefcase, { className: "mr-3 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ React.createElement("span", null, "Cargo: ", /* @__PURE__ */ React.createElement("strong", null, currentUser.role))), currentUser.cnh && /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(ShieldCheck, { className: "mr-3 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ React.createElement("span", null, "CNH: ", currentUser.cnh)))), /* @__PURE__ */ React.createElement(Card, { className: "bg-muted/30" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "pb-2" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-sm font-semibold flex items-center gap-2" }, /* @__PURE__ */ React.createElement(FileText, { className: "h-4 w-4 text-primary" }), "Dados e LGPD")), /* @__PURE__ */ React.createElement(CardContent, { className: "text-[11px] text-muted-foreground leading-tight" }, "Seus dados pessoais s\xE3o processados apenas para finalidades leg\xEDtimas de gest\xE3o de frota.", /* @__PURE__ */ React.createElement(Link, { href: "/privacy", className: "text-primary underline ml-1" }, "Leia nossa pol\xEDtica completa.")))), /* @__PURE__ */ React.createElement("div", { className: "md:col-span-2" }, /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, null, "Hist\xF3rico de Solicita\xE7\xF5es"), /* @__PURE__ */ React.createElement(CardDescription, null, userRequests.length > 0 ? "Suas solicita\xE7\xF5es de viagem mais recentes." : "Voc\xEA ainda n\xE3o fez nenhuma solicita\xE7\xE3o de viagem.")), /* @__PURE__ */ React.createElement(CardContent, null, userRequests.length > 0 ? /* @__PURE__ */ React.createElement(Table, null, /* @__PURE__ */ React.createElement(TableHeader, null, /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableHead, null, "Motivo"), /* @__PURE__ */ React.createElement(TableHead, null, "Data"), /* @__PURE__ */ React.createElement(TableHead, null, "Status"))), /* @__PURE__ */ React.createElement(TableBody, null, userRequests.map((request) => /* @__PURE__ */ React.createElement(TableRow, { key: request.id }, /* @__PURE__ */ React.createElement(TableCell, { className: "font-medium" }, request.title), /* @__PURE__ */ React.createElement(TableCell, null, format(new Date(request.requestDate), "dd/MM/yyyy", { locale: ptBR })), /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Badge, { variant: getStatusVariant(request.status) }, request.status)))))) : /* @__PURE__ */ React.createElement("div", { className: "text-center text-muted-foreground py-8" }, /* @__PURE__ */ React.createElement("p", null, "Nenhum hist\xF3rico para exibir.")))))));
}
export {
  ProfilePage as default
};
