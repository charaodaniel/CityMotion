"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Terminal,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/contexts/app-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
function AppHeader({ onTerminalOpen }) {
  const pathname = usePathname();
  const {
    userRole,
    logout,
    currentUser,
    isRefreshing,
    refreshData,
    notifications,
    markNotificationAsRead,
    clearNotifications
  } = useApp();
  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const getRoleName = (role) => {
    switch (role) {
      case "dev":
        return "Desenvolvedor";
      case "ti":
        return "Especialista de TI";
      case "admin":
        return "Administrador";
      case "manager":
        return "Gestor de Frota";
      default:
        return currentUser?.role || "Usu\xE1rio";
    }
  };
  const menuItems = [
    { label: "Painel", href: "/dashboard", path: "dashboard" },
    { label: "Frota", href: "/veiculos", path: "veiculos" },
    { label: "Rede", href: "/nexus", path: "nexus" }
  ];
  return /* @__PURE__ */ React.createElement("header", { className: "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/95 backdrop-blur-md px-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-6" }, /* @__PURE__ */ React.createElement(SidebarTrigger, { className: "h-8 w-8" }), /* @__PURE__ */ React.createElement("nav", { className: "hidden lg:flex items-center gap-6" }, menuItems.map((item) => /* @__PURE__ */ React.createElement(
    Link,
    {
      key: item.label,
      href: item.href,
      className: cn(
        "text-[10px] font-bold uppercase tracking-widest transition-colors pb-1 border-b-2",
        pathname.includes(item.path) ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-primary"
      )
    },
    item.label
  )))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "icon", onClick: () => refreshData(), disabled: isRefreshing, className: "h-8 w-8 text-muted-foreground hover:text-primary" }, /* @__PURE__ */ React.createElement(RefreshCw, { className: cn("h-4 w-4", isRefreshing && "animate-spin text-primary") })), ["dev", "ti", "admin"].includes(userRole) && /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "icon", onClick: onTerminalOpen, className: "h-8 w-8 text-muted-foreground hover:text-primary" }, /* @__PURE__ */ React.createElement(Terminal, { className: "h-4 w-4" })), /* @__PURE__ */ React.createElement(DropdownMenu, null, /* @__PURE__ */ React.createElement(DropdownMenuTrigger, { asChild: true }, /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "icon", className: "relative h-8 w-8 text-muted-foreground hover:text-primary" }, /* @__PURE__ */ React.createElement(Bell, { className: "h-4 w-4" }), unreadCount > 0 && /* @__PURE__ */ React.createElement("span", { className: "absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" }))), /* @__PURE__ */ React.createElement(DropdownMenuContent, { align: "end", className: "w-80 p-0 border-border/50 bg-sidebar" }, /* @__PURE__ */ React.createElement(DropdownMenuLabel, { className: "px-4 py-3 border-b border-border/50 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs uppercase font-bold tracking-widest" }, "Notifica\xE7\xF5es"), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", onClick: clearNotifications, className: "h-auto p-0 text-[10px] text-muted-foreground hover:text-primary" }, "LIMPAR")), /* @__PURE__ */ React.createElement(ScrollArea, { className: "h-80" }, notifications.length > 0 ? notifications.map((n) => /* @__PURE__ */ React.createElement("div", { key: n.id, className: cn("p-4 border-b border-border/30 hover:bg-accent/30 cursor-pointer transition-colors", !n.read && "bg-primary/5"), onClick: () => markNotificationAsRead(n.id) }, /* @__PURE__ */ React.createElement("div", { className: "text-xs font-bold text-primary mb-1" }, n.title), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-muted-foreground leading-tight line-clamp-2" }, n.message))) : /* @__PURE__ */ React.createElement("div", { className: "p-8 text-center text-xs text-muted-foreground italic" }, "Nenhum alerta recente.")))), /* @__PURE__ */ React.createElement(Separator, { orientation: "vertical", className: "h-6 mx-2" }), /* @__PURE__ */ React.createElement(DropdownMenu, null, /* @__PURE__ */ React.createElement(DropdownMenuTrigger, { asChild: true }, /* @__PURE__ */ React.createElement(Button, { variant: "ghost", className: "relative h-9 w-9 p-0 rounded-full border border-border/50 hover:border-primary transition-all" }, /* @__PURE__ */ React.createElement(Avatar, { className: "h-8 w-8" }, /* @__PURE__ */ React.createElement(AvatarImage, { src: `https://i.pravatar.cc/150?u=${currentUser?.id}` }), /* @__PURE__ */ React.createElement(AvatarFallback, { className: "bg-primary/10 text-primary" }, currentUser?.name?.[0])))), /* @__PURE__ */ React.createElement(DropdownMenuContent, { align: "end", className: "w-56 border-border/50 bg-sidebar" }, /* @__PURE__ */ React.createElement(DropdownMenuLabel, { className: "font-normal p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-1" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-bold tracking-tight" }, currentUser?.name), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] uppercase font-bold text-muted-foreground tracking-widest" }, getRoleName(userRole)))), /* @__PURE__ */ React.createElement(DropdownMenuSeparator, { className: "bg-border/50" }), /* @__PURE__ */ React.createElement(DropdownMenuItem, { asChild: true, className: "focus:bg-primary/10 focus:text-primary cursor-pointer" }, /* @__PURE__ */ React.createElement(Link, { href: "/perfil" }, "Meu Perfil")), /* @__PURE__ */ React.createElement(DropdownMenuItem, { onClick: logout, className: "text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer" }, "Sair do Sistema")))));
}
export {
  AppHeader
};
