"use client";
import Link from "next/link";
import { Logo } from "../icons";
import { Button } from "../ui/button";
import { LogIn, LayoutDashboard } from "lucide-react";
import { useApp } from "@/contexts/app-provider";
function Header() {
  const { currentUser } = useApp();
  const isLoggedIn = !!currentUser;
  return /* @__PURE__ */ React.createElement("header", { className: "sticky top-0 z-40 w-full border-b bg-background" }, /* @__PURE__ */ React.createElement("div", { className: "container flex h-14 items-center" }, /* @__PURE__ */ React.createElement(Link, { href: "/home", className: "flex items-center gap-2 text-foreground hover:text-foreground" }, /* @__PURE__ */ React.createElement(Logo, null), /* @__PURE__ */ React.createElement("span", { className: "text-lg font-semibold tracking-tighter" }, "CityMotion")), /* @__PURE__ */ React.createElement("div", { className: "ml-auto" }, isLoggedIn ? /* @__PURE__ */ React.createElement(Button, { asChild: true }, /* @__PURE__ */ React.createElement(Link, { href: "/dashboard" }, /* @__PURE__ */ React.createElement(LayoutDashboard, { className: "mr-2 h-4 w-4" }), "Ir para o Painel")) : /* @__PURE__ */ React.createElement(Button, { asChild: true }, /* @__PURE__ */ React.createElement(Link, { href: "/login" }, /* @__PURE__ */ React.createElement(LogIn, { className: "mr-2 h-4 w-4" }), "Acessar Painel")))));
}
export {
  Header
};
