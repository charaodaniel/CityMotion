"use client";
import React, { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuSkeleton,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  Car,
  Route,
  CalendarClock,
  Users,
  ScrollText,
  Building,
  UserCog,
  Wrench,
  BookOpen,
  Network,
  ShieldCheck,
  DollarSign,
  LogOut,
  ChevronRight,
  Terminal,
  FileCode,
  Fuel,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/app-provider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
const platformNavItems = [
  { href: "/dev-global", label: "Gest\xE3o Global", icon: ShieldCheck, roles: ["dev"] },
  { href: "/dev-docs", label: "Documenta\xE7\xE3o Central", icon: FileCode, roles: ["dev", "ti", "admin"] },
  { href: "/faturamento", label: "Faturamento", icon: DollarSign, roles: ["dev", "ti"] },
  { href: "/nexus", label: "NexusBridge", icon: Network, roles: ["dev", "ti"] },
  { href: "/terminal", label: "Console TTY", icon: Terminal, roles: ["dev", "ti"] },
  { href: "/perfis", label: "Gerenciar Perfis", icon: UserCog, roles: ["dev", "ti", "admin"] }
];
const operationalNavItems = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard, roles: ["dev", "ti", "admin", "manager", "employee"] },
  { href: "/chat", label: "Comunica\xE7\xE3o", icon: MessageSquare, roles: ["dev", "ti", "admin", "manager", "employee"] },
  { href: "/setores", label: "Setores", icon: Building, roles: ["dev", "ti", "admin"] },
  { href: "/funcionarios", label: "Funcion\xE1rios", icon: Users, roles: ["dev", "ti", "admin", "manager"] },
  { href: "/veiculos", label: "Frota", icon: Car, roles: ["dev", "ti", "admin", "manager", "employee"] },
  { href: "/viagens", label: "Miss\xF5es", icon: Route, roles: ["dev", "ti", "admin", "manager", "employee"] },
  { href: "/abastecimento", label: "Abastecimento", icon: Fuel, roles: ["dev", "ti", "admin", "manager", "employee"] },
  { href: "/manutencao", label: "Manuten\xE7\xE3o", icon: Wrench, roles: ["dev", "ti", "admin", "manager", "employee"] },
  { href: "/escalas", label: "Escalas", icon: CalendarClock, roles: ["dev", "ti", "admin", "manager"] },
  { href: "/relatorios", label: "Relat\xF3rios", icon: ScrollText, roles: ["dev", "ti", "admin", "manager", "employee"] }
];
function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole, logout, currentUser, isLoading, activeOrganization, setActiveOrganization } = useApp();
  const isCurrentUserDriver = useMemo(() => currentUser?.role?.toLowerCase().includes("motorista"), [currentUser]);
  const filteredPlatformItems = useMemo(() => platformNavItems.filter((item) => item.roles.includes(userRole)), [userRole]);
  const filteredOperationalItems = useMemo(() => operationalNavItems.filter((item) => {
    if (["dev", "ti"].includes(userRole) && !activeOrganization) return false;
    if (!item.roles.includes(userRole)) return false;
    if (userRole === "employee") {
      const restricted = ["/veiculos", "/viagens", "/abastecimento", "/manutencao", "/relatorios"];
      if (restricted.includes(item.href)) return isCurrentUserDriver;
    }
    return true;
  }), [userRole, isCurrentUserDriver, activeOrganization]);
  const handleExitOrganization = () => {
    setActiveOrganization(null);
    router.push("/dev-global");
  };
  return /* @__PURE__ */ React.createElement(Sidebar, { className: "border-r border-border/50 bg-sidebar/80 backdrop-blur-xl" }, /* @__PURE__ */ React.createElement(SidebarHeader, { className: "h-16 flex items-center px-6 border-b border-border/50" }, /* @__PURE__ */ React.createElement(Link, { href: userRole === "dev" ? "/dev-global" : "/dashboard", className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      whileHover: { scale: 1.1, rotate: 5 },
      className: "w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20"
    },
    /* @__PURE__ */ React.createElement(Network, { className: "h-5 w-5" })
  ), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm font-bold tracking-tight leading-none" }, "CityMotion"), /* @__PURE__ */ React.createElement("span", { className: "text-[9px] uppercase font-black text-primary/70 tracking-widest mt-1" }, "NexusOS Kernel")))), /* @__PURE__ */ React.createElement(SidebarContent, { className: "px-2 py-4" }, filteredPlatformItems.length > 0 && /* @__PURE__ */ React.createElement(Collapsible, { defaultOpen: true, className: "group/collapsible" }, /* @__PURE__ */ React.createElement(SidebarGroup, null, /* @__PURE__ */ React.createElement(SidebarGroupLabel, { asChild: true, className: "text-[10px] font-bold uppercase tracking-widest text-primary/50 mb-2 px-2 hover:text-primary transition-colors cursor-pointer select-none" }, /* @__PURE__ */ React.createElement(CollapsibleTrigger, { className: "flex w-full items-center justify-between" }, "Core Platform", /* @__PURE__ */ React.createElement(ChevronRight, { className: "ml-auto h-3 w-3 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" }))), /* @__PURE__ */ React.createElement(CollapsibleContent, null, /* @__PURE__ */ React.createElement(SidebarMenu, null, filteredPlatformItems.map((item) => /* @__PURE__ */ React.createElement(SidebarMenuItem, { key: item.href }, /* @__PURE__ */ React.createElement(SidebarMenuButton, { asChild: true, isActive: pathname.startsWith(item.href), className: cn("rounded-md transition-all", pathname.startsWith(item.href) ? "bg-primary/10 text-primary border-r-2 border-primary" : "hover:bg-accent/50") }, /* @__PURE__ */ React.createElement(Link, { href: item.href }, /* @__PURE__ */ React.createElement(item.icon, { className: "h-4 w-4" }), /* @__PURE__ */ React.createElement("span", null, item.label))))))))), filteredOperationalItems.length > 0 && /* @__PURE__ */ React.createElement(Collapsible, { defaultOpen: true, className: "group/collapsible-op mt-4" }, /* @__PURE__ */ React.createElement(SidebarGroup, null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between px-2 mb-2" }, /* @__PURE__ */ React.createElement(SidebarGroupLabel, { asChild: true, className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 p-0 hover:text-foreground transition-colors cursor-pointer select-none" }, /* @__PURE__ */ React.createElement(CollapsibleTrigger, { className: "flex w-full items-center justify-between" }, /* @__PURE__ */ React.createElement("span", null, "Logistics Node ", activeOrganization && `(${activeOrganization.name})`), /* @__PURE__ */ React.createElement(ChevronRight, { className: "ml-auto h-3 w-3 transition-transform duration-200 group-data-[state=open]/collapsible-op:rotate-90" }))), activeOrganization && ["dev", "ti"].includes(userRole) && /* @__PURE__ */ React.createElement("button", { onClick: handleExitOrganization, className: "text-[9px] font-black text-primary hover:underline flex items-center gap-1 ml-2" }, "EXIT_NODE")), /* @__PURE__ */ React.createElement(CollapsibleContent, null, /* @__PURE__ */ React.createElement(SidebarMenu, null, isLoading ? /* @__PURE__ */ React.createElement(SidebarMenuSkeleton, { showIcon: true }) : filteredOperationalItems.map((item) => /* @__PURE__ */ React.createElement(SidebarMenuItem, { key: item.href }, /* @__PURE__ */ React.createElement(SidebarMenuButton, { asChild: true, isActive: pathname === item.href, className: cn("rounded-md transition-all", pathname === item.href ? "bg-primary/10 text-primary border-r-2 border-primary" : "hover:bg-accent/50") }, /* @__PURE__ */ React.createElement(Link, { href: item.href }, /* @__PURE__ */ React.createElement(item.icon, { className: "h-4 w-4" }), /* @__PURE__ */ React.createElement("span", null, item.label)))))))))), /* @__PURE__ */ React.createElement(SidebarFooter, { className: "mt-auto p-4 border-t border-border/50" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      className: "flex items-center gap-2 p-2 bg-emerald-500/5 rounded border border-emerald-500/20"
    },
    /* @__PURE__ */ React.createElement("div", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
    /* @__PURE__ */ React.createElement("span", { className: "text-[9px] font-mono text-emerald-500 font-black uppercase tracking-widest" }, "Sys_Status: 100% OK")
  ), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-1 mt-4" }, /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", className: "justify-start h-8 px-2 text-muted-foreground hover:text-primary text-[10px] font-bold uppercase tracking-widest transition-all", asChild: true }, /* @__PURE__ */ React.createElement(Link, { href: "/dev-docs" }, /* @__PURE__ */ React.createElement(BookOpen, { className: "mr-2 h-3.5 w-3.5" }), " Docs_Repo")), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", className: "justify-start h-8 px-2 text-muted-foreground hover:text-destructive text-[10px] font-bold uppercase tracking-widest transition-all", onClick: logout }, /* @__PURE__ */ React.createElement(LogOut, { className: "mr-2 h-3.5 w-3.5" }), " Terminate_Session"))));
}
export {
  AppSidebar
};
