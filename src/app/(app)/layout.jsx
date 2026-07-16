"use client";
import React, { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useApp } from "@/contexts/app-provider";
import { DevTerminal } from "@/components/dev-terminal";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { Header as PublicHeader } from "@/components/layout/header";
import { usePathname } from "next/navigation";
function AppLayout({ children }) {
  const pathname = usePathname();
  const { userRole, currentUser } = useApp();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  if (pathname === "/select-sector") return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-background" }, children);
  const publicRoutes = ["/docs"];
  const isPublicRoute = pathname ? publicRoutes.some((route) => pathname.startsWith(route)) : false;
  if (!currentUser && isPublicRoute) {
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex flex-col bg-background" }, /* @__PURE__ */ React.createElement(PublicHeader, null), /* @__PURE__ */ React.createElement("main", { className: "flex-1 overflow-auto" }, children));
  }
  return /* @__PURE__ */ React.createElement(SidebarProvider, null, /* @__PURE__ */ React.createElement("div", { className: "flex min-h-screen bg-background text-foreground selection:bg-primary/30" }, /* @__PURE__ */ React.createElement(AppSidebar, null), /* @__PURE__ */ React.createElement(SidebarInset, { className: "bg-background" }, /* @__PURE__ */ React.createElement(AppHeader, { onTerminalOpen: () => setIsTerminalOpen(true) }), /* @__PURE__ */ React.createElement("main", { className: "flex-1 overflow-auto" }, children))), ["dev", "ti", "admin"].includes(userRole) && /* @__PURE__ */ React.createElement(
    DevTerminal,
    {
      isOpen: isTerminalOpen,
      onClose: () => setIsTerminalOpen(false)
    }
  ));
}
export {
  AppLayout as default
};
