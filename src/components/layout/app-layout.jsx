"use client";
import React, { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/icons";
import { LayoutDashboard, Car, Menu, Settings, LifeBuoy, Route, CalendarClock, Users, UserCog, ScrollText, Building, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useApp } from "@/contexts/app-provider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
const navItems = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard, roles: ["admin", "manager", "employee"] },
  { href: "/setores", label: "Setores", icon: Building, roles: ["admin"] },
  { href: "/funcionarios", label: "Funcion\xE1rios", icon: Users, roles: ["admin", "manager"] },
  { href: "/veiculos", label: "Ve\xEDculos", icon: Car, roles: ["admin", "manager"] },
  { href: "/viagens", label: "Viagens", icon: Route, roles: ["admin", "manager", "employee"] },
  // Employee can be a driver
  { href: "/escalas", label: "Escalas", icon: CalendarClock, roles: ["admin", "manager"] },
  { href: "/relatorios", label: "Relat\xF3rios", icon: ScrollText, roles: ["admin", "manager", "employee"] }
  // Employee can be a driver
];
const bottomNavItems = [
  { href: "/perfil", label: "Meu Perfil", icon: UserCog, roles: ["admin", "manager", "employee"] },
  { href: "/settings", label: "Configura\xE7\xF5es", icon: Settings, roles: ["admin"] },
  { href: "/support", label: "Suporte", icon: LifeBuoy, roles: ["admin", "manager", "employee"] }
];
function AppLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole, setUserRole, currentUser } = useApp();
  const isCurrentUserDriver = useMemo(() => currentUser?.role.toLowerCase().includes("motorista"), [currentUser]);
  const filteredNavItems = useMemo(() => {
    return navItems.filter((item) => {
      if (!item.roles.includes(userRole)) return false;
      if (item.href === "/viagens" || item.href === "/relatorios") {
        return userRole !== "employee" || isCurrentUserDriver;
      }
      return true;
    });
  }, [userRole, isCurrentUserDriver]);
  const filteredBottomNavItems = useMemo(() => {
    return bottomNavItems.filter((item) => item.roles.includes(userRole));
  }, [userRole]);
  const getRoleName = (role) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "manager":
        return "Gestor de Setor";
      case "employee":
        return currentUser?.role || "Funcion\xE1rio";
      // Show specific role if available
      default:
        return "Desconhecido";
    }
  };
  const getInitials = (name) => {
    return name?.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "U";
  };
  const handleLogout = () => {
    setUserRole("employee");
    router.push("/login");
  };
  return /* @__PURE__ */ React.createElement(SidebarProvider, null, /* @__PURE__ */ React.createElement("div", { className: "flex min-h-screen" }, /* @__PURE__ */ React.createElement(Sidebar, null, /* @__PURE__ */ React.createElement(SidebarHeader, null, /* @__PURE__ */ React.createElement(Link, { href: "/", className: "flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-foreground" }, /* @__PURE__ */ React.createElement(Logo, null), /* @__PURE__ */ React.createElement("span", { className: "text-lg font-semibold tracking-tighter" }, "CityMotion"))), /* @__PURE__ */ React.createElement(SidebarContent, null, /* @__PURE__ */ React.createElement(SidebarMenu, null, filteredNavItems.map((item) => /* @__PURE__ */ React.createElement(SidebarMenuItem, { key: item.href }, /* @__PURE__ */ React.createElement(
    SidebarMenuButton,
    {
      asChild: true,
      isActive: pathname === item.href,
      tooltip: item.label
    },
    /* @__PURE__ */ React.createElement(Link, { href: item.href }, /* @__PURE__ */ React.createElement(item.icon, null), /* @__PURE__ */ React.createElement("span", null, item.label))
  ))))), /* @__PURE__ */ React.createElement(SidebarFooter, { className: "mt-auto" }, /* @__PURE__ */ React.createElement(Separator, { className: "mb-2" }), /* @__PURE__ */ React.createElement(SidebarMenu, null, filteredBottomNavItems.map((item) => /* @__PURE__ */ React.createElement(SidebarMenuItem, { key: item.href }, /* @__PURE__ */ React.createElement(
    SidebarMenuButton,
    {
      asChild: true,
      isActive: pathname.startsWith(item.href),
      tooltip: item.label
    },
    /* @__PURE__ */ React.createElement(Link, { href: item.href }, /* @__PURE__ */ React.createElement(item.icon, null), /* @__PURE__ */ React.createElement("span", null, item.label))
  )))))), /* @__PURE__ */ React.createElement(SidebarInset, null, /* @__PURE__ */ React.createElement("header", { className: "sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6" }, /* @__PURE__ */ React.createElement(SidebarTrigger, { asChild: true, className: "sm:hidden" }, /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "icon" }, /* @__PURE__ */ React.createElement(Menu, null))), /* @__PURE__ */ React.createElement("div", { className: "ml-auto flex items-center gap-4" }, /* @__PURE__ */ React.createElement(DropdownMenu, null, /* @__PURE__ */ React.createElement(DropdownMenuTrigger, { asChild: true }, /* @__PURE__ */ React.createElement(Button, { variant: "ghost", className: "relative h-9 w-9 rounded-full" }, /* @__PURE__ */ React.createElement(Avatar, { className: "h-9 w-9" }, /* @__PURE__ */ React.createElement(AvatarImage, { src: `https://avatar.vercel.sh/${currentUser?.id}`, alt: "Avatar" }), /* @__PURE__ */ React.createElement(AvatarFallback, null, getInitials(currentUser?.name))))), /* @__PURE__ */ React.createElement(DropdownMenuContent, { align: "end" }, /* @__PURE__ */ React.createElement(DropdownMenuLabel, { className: "font-normal" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col space-y-1" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium leading-none" }, currentUser?.name || getRoleName(userRole)), /* @__PURE__ */ React.createElement("p", { className: "text-xs leading-none text-muted-foreground" }, getRoleName(userRole)))), /* @__PURE__ */ React.createElement(DropdownMenuSeparator, null), /* @__PURE__ */ React.createElement(DropdownMenuItem, { asChild: true }, /* @__PURE__ */ React.createElement(Link, { href: "/perfil" }, /* @__PURE__ */ React.createElement(UserCog, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ React.createElement("span", null, "Meu Perfil"))), userRole === "admin" && /* @__PURE__ */ React.createElement(DropdownMenuItem, { asChild: true }, /* @__PURE__ */ React.createElement(Link, { href: "/settings" }, /* @__PURE__ */ React.createElement(Settings, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ React.createElement("span", null, "Configura\xE7\xF5es"))), /* @__PURE__ */ React.createElement(DropdownMenuSeparator, null), /* @__PURE__ */ React.createElement(DropdownMenuItem, { onClick: handleLogout }, /* @__PURE__ */ React.createElement(LogOut, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ React.createElement("span", null, "Sair")))))), /* @__PURE__ */ React.createElement("main", { className: "flex-1 overflow-auto" }, children))));
}
export {
  AppLayout
};
