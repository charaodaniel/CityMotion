"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  BookOpen,
  Users,
  Car,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Smartphone,
  LayoutDashboard,
  Route,
  Wrench,
  FileText,
  CalendarClock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
function DocsPage() {
  return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto p-4 sm:p-8 space-y-8 pb-20" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-2" }, /* @__PURE__ */ React.createElement("h1", { className: "text-4xl font-black tracking-tighter flex items-center gap-4 text-on-surface" }, /* @__PURE__ */ React.createElement(BookOpen, { className: "h-10 w-10 text-primary" }), "Central de Ajuda // CityMotion"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground font-medium text-lg" }, "Guia completo para utiliza\xE7\xE3o e gerenciamento da frota inteligente.")), /* @__PURE__ */ React.createElement(Tabs, { defaultValue: "intro", className: "space-y-6" }, /* @__PURE__ */ React.createElement(TabsList, { className: "bg-sidebar border border-border/50 p-1 w-full lg:w-fit justify-start overflow-x-auto h-auto gap-1" }, /* @__PURE__ */ React.createElement(TabsTrigger, { value: "intro", className: "text-xs font-bold uppercase tracking-widest gap-2" }, /* @__PURE__ */ React.createElement(Info, { className: "h-3 w-3" }), " Introdu\xE7\xE3o"), /* @__PURE__ */ React.createElement(TabsTrigger, { value: "roles", className: "text-xs font-bold uppercase tracking-widest gap-2" }, /* @__PURE__ */ React.createElement(Users, { className: "h-3 w-3" }), " Perfis"), /* @__PURE__ */ React.createElement(TabsTrigger, { value: "trips", className: "text-xs font-bold uppercase tracking-widest gap-2" }, /* @__PURE__ */ React.createElement(Route, { className: "h-3 w-3" }), " Miss\xF5es"), /* @__PURE__ */ React.createElement(TabsTrigger, { value: "badge", className: "text-xs font-bold uppercase tracking-widest gap-2" }, /* @__PURE__ */ React.createElement(Smartphone, { className: "h-3 w-3" }), " Crach\xE1 Virtual"), /* @__PURE__ */ React.createElement(TabsTrigger, { value: "faq", className: "text-xs font-bold uppercase tracking-widest gap-2 text-primary" }, /* @__PURE__ */ React.createElement(HelpCircle, { className: "h-3 w-3" }), " FAQ")), /* @__PURE__ */ React.createElement(TabsContent, { value: "intro", className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6" }, /* @__PURE__ */ React.createElement(Card, { className: "bg-sidebar/50 border-border/50 col-span-1 md:col-span-2" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-2xl font-bold" }, "Bem-vindo ao CityMotion"), /* @__PURE__ */ React.createElement(CardDescription, null, "O sistema operacional para a log\xEDstica da sua organiza\xE7\xE3o.")), /* @__PURE__ */ React.createElement(CardContent, { className: "space-y-4 text-muted-foreground leading-relaxed" }, /* @__PURE__ */ React.createElement("p", null, "O CityMotion \xE9 um ecossistema SaaS desenvolvido para modernizar a gest\xE3o de frotas p\xFAblicas e privadas. Nossa plataforma centraliza desde a solicita\xE7\xE3o de transporte por colaboradores at\xE9 o controle t\xE9cnico de manuten\xE7\xE3o em oficina."), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-border/30" }, /* @__PURE__ */ React.createElement(LayoutDashboard, { className: "h-5 w-5 text-primary shrink-0" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "text-sm font-bold text-foreground" }, "Dashboards"), /* @__PURE__ */ React.createElement("p", { className: "text-xs" }, "Vis\xE3o em tempo real de toda a opera\xE7\xE3o."))), /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-border/30" }, /* @__PURE__ */ React.createElement(ShieldCheck, { className: "h-5 w-5 text-primary shrink-0" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "text-sm font-bold text-foreground" }, "Seguran\xE7a"), /* @__PURE__ */ React.createElement("p", { className: "text-xs" }, "Conformidade total com a LGPD e auditoria.")))))), /* @__PURE__ */ React.createElement(Card, { className: "bg-primary/5 border-primary/20" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-sm font-bold uppercase tracking-widest text-primary" }, "Status do Sistema")), /* @__PURE__ */ React.createElement(CardContent, { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-xs" }, /* @__PURE__ */ React.createElement("span", null, "Engine NexusBridge"), /* @__PURE__ */ React.createElement(Badge, { variant: "outline", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" }, "Operacional")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-xs" }, /* @__PURE__ */ React.createElement("span", null, "Banco de Dados"), /* @__PURE__ */ React.createElement(Badge, { variant: "outline", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" }, "Sincronizado")), /* @__PURE__ */ React.createElement(Separator, { className: "bg-primary/10" }), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-muted-foreground italic" }, "O acesso p\xFAblico permite visualizar guias e manuais. Fun\xE7\xF5es operacionais exigem autentica\xE7\xE3o segura."))))), /* @__PURE__ */ React.createElement(TabsContent, { value: "roles", className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, [
    {
      role: "Administrador",
      desc: "Gest\xE3o estrat\xE9gica total da frota, faturamento e configura\xE7\xF5es globais do sistema.",
      icon: ShieldCheck,
      color: "text-amber-500"
    },
    {
      role: "Gestor de Unidade",
      desc: "Respons\xE1vel por aprovar solicita\xE7\xF5es e gerenciar a escala local de motoristas e ve\xEDculos.",
      icon: Users,
      color: "text-primary"
    },
    {
      role: "Motorista",
      desc: "Executa miss\xF5es, realiza checklists de seguran\xE7a e registra ocorr\xEAncias de campo.",
      icon: Car,
      color: "text-emerald-500"
    },
    {
      role: "Colaborador",
      desc: "Perfil de uso geral para solicitar transportes corporativos de forma r\xE1pida.",
      icon: Info,
      color: "text-zinc-400"
    },
    {
      role: "T\xE9cnico Mec\xE2nico",
      desc: "Gerencia ordens de servi\xE7o, manuten\xE7\xE3o preventiva e compra de componentes.",
      icon: Wrench,
      color: "text-primary"
    }
  ].map((item, idx) => /* @__PURE__ */ React.createElement(Card, { key: idx, className: "bg-sidebar/50 border-border/50 overflow-hidden" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "flex flex-row items-center gap-3 pb-2" }, /* @__PURE__ */ React.createElement("div", { className: cn("p-2 rounded-lg bg-background border border-border/50", item.color) }, /* @__PURE__ */ React.createElement(item.icon, { className: "h-5 w-5" })), /* @__PURE__ */ React.createElement(CardTitle, { className: "text-lg" }, item.role)), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground leading-relaxed" }, item.desc)))))), /* @__PURE__ */ React.createElement(TabsContent, { value: "trips", className: "space-y-6" }, /* @__PURE__ */ React.createElement(Card, { className: "bg-sidebar/50 border-border/50" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, null, "Fluxo de Miss\xF5es Log\xEDsticas"), /* @__PURE__ */ React.createElement(CardDescription, null, "Como transformar um pedido em uma viagem conclu\xEDda.")), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement("div", { className: "relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent" }, [
    { title: "Solicita\xE7\xE3o", desc: "O colaborador preenche o formul\xE1rio 'Pedir Transporte' informando motivo e destino.", icon: FileText },
    { title: "An\xE1lise", desc: "O gestor do setor analisa a prioridade e aprova ou rejeita o pedido no painel.", icon: CheckCircle2 },
    { title: "Escala", desc: "O sistema aloca automaticamente um motorista dispon\xEDvel e um ve\xEDculo da frota.", icon: CalendarClock },
    { title: "Execu\xE7\xE3o", desc: "O motorista realiza o checklist de sa\xEDda no app e inicia o trajeto.", icon: Play },
    { title: "Conclus\xE3o", desc: "Ao chegar, a quilometragem \xE9 registrada e o ve\xEDculo retorna ao status 'Dispon\xEDvel'.", icon: Flag }
  ].map((step, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center w-10 h-10 rounded-full border border-primary bg-background text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold text-xs" }, i + 1), /* @__PURE__ */ React.createElement("div", { className: "w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-border/50 bg-accent/5" }, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-foreground flex items-center gap-2" }, /* @__PURE__ */ React.createElement(step.icon, { className: "h-4 w-4 text-primary" }), step.title), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground mt-1" }, step.desc)))))))), /* @__PURE__ */ React.createElement(TabsContent, { value: "badge", className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 items-center" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("h2", { className: "text-3xl font-bold tracking-tight" }, "Identifica\xE7\xE3o Digital Inviol\xE1vel"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground" }, "O Crach\xE1 Virtual CityMotion substitui o pl\xE1stico tradicional por uma identidade din\xE2mica protegida por QR Code criptografado."), /* @__PURE__ */ React.createElement("ul", { className: "space-y-3" }, [
    "Valida\xE7\xE3o em tempo real via NexusBridge",
    "Hist\xF3rico de acesso vinculado \xE0 matr\xEDcula",
    "Otimizado para leitura em tablets de guarita",
    "Modo Offline para situa\xE7\xF5es de baixa conectividade"
  ].map((item, i) => /* @__PURE__ */ React.createElement("li", { key: i, className: "flex items-center gap-3 text-sm text-muted-foreground" }, /* @__PURE__ */ React.createElement(CheckCircle2, { className: "h-4 w-4 text-emerald-500" }), " ", item)))), /* @__PURE__ */ React.createElement(Card, { className: "bg-zinc-950 border-primary/20 relative overflow-hidden p-8 aspect-[3/4] max-w-sm mx-auto flex flex-col items-center justify-center text-center" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 scanlines opacity-5 pointer-events-none" }), /* @__PURE__ */ React.createElement("div", { className: "w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 mb-4" }), /* @__PURE__ */ React.createElement("div", { className: "h-4 w-32 bg-primary/20 rounded mb-2" }), /* @__PURE__ */ React.createElement("div", { className: "h-3 w-20 bg-muted rounded mb-8" }), /* @__PURE__ */ React.createElement("div", { className: "w-32 h-32 bg-white rounded-lg opacity-80 mb-4" }), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] font-mono text-primary/50 uppercase tracking-widest" }, "Digital Badge Preview")))), /* @__PURE__ */ React.createElement(TabsContent, { value: "faq", className: "space-y-6" }, /* @__PURE__ */ React.createElement(Card, { className: "bg-sidebar/50 border-border/50" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, null, "Perguntas Frequentes"), /* @__PURE__ */ React.createElement(CardDescription, null, "Respostas r\xE1pidas para as d\xFAvidas mais comuns da opera\xE7\xE3o.")), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Accordion, { type: "single", collapsible: true, className: "w-full" }, /* @__PURE__ */ React.createElement(AccordionItem, { value: "item-1", className: "border-border/30" }, /* @__PURE__ */ React.createElement(AccordionTrigger, null, "Como alterar minha senha?"), /* @__PURE__ */ React.createElement(AccordionContent, { className: "text-muted-foreground" }, "Para garantir a seguran\xE7a, a altera\xE7\xE3o de senha deve ser solicitada ao administrador de TI da sua organiza\xE7\xE3o. Em breve, permitiremos a troca direta pelo painel de perfil.")), /* @__PURE__ */ React.createElement(AccordionItem, { value: "item-2", className: "border-border/30" }, /* @__PURE__ */ React.createElement(AccordionTrigger, null, "O que fazer se o ve\xEDculo apresentar defeito durante a viagem?"), /* @__PURE__ */ React.createElement(AccordionContent, { className: "text-muted-foreground" }, "Acesse o menu 'Miss\xF5es', selecione sua viagem ativa e clique em 'Relatar Sinistro'. Isso notificar\xE1 instantaneamente a oficina e o seu gestor imediato.")), /* @__PURE__ */ React.createElement(AccordionItem, { value: "item-3", className: "border-border/30" }, /* @__PURE__ */ React.createElement(AccordionTrigger, null, "Minha solicita\xE7\xE3o foi rejeitada. Por qu\xEA?"), /* @__PURE__ */ React.createElement(AccordionContent, { className: "text-muted-foreground" }, "As solicita\xE7\xF5es podem ser rejeitadas por falta de disponibilidade de ve\xEDculos no setor, manuten\xE7\xE3o agendada ou baixa prioridade frente a emerg\xEAncias de sa\xFAde e seguran\xE7a p\xFAblica."))))))));
}
function Play(props) {
  return /* @__PURE__ */ React.createElement(ArrowRight, { ...props });
}
function Flag(props) {
  return /* @__PURE__ */ React.createElement(CheckCircle2, { ...props });
}
export {
  DocsPage as default
};
