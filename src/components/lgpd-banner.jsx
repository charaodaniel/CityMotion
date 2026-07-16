"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, X } from "lucide-react";
import Link from "next/link";
function LGPDBanner() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const consent = localStorage.getItem("citymotion_lgpd_consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);
  const handleAccept = () => {
    localStorage.setItem("citymotion_lgpd_consent", "accepted");
    setIsVisible(false);
  };
  if (!isVisible) return null;
  return /* @__PURE__ */ React.createElement("div", { className: "fixed bottom-4 left-4 right-4 z-[100] md:left-auto md:right-4 md:max-w-md animate-in slide-in-from-bottom-8 duration-500" }, /* @__PURE__ */ React.createElement(Card, { className: "p-6 border-primary/20 shadow-2xl bg-background/95 backdrop-blur-md" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "p-2 bg-primary/10 rounded-full text-primary shrink-0" }, /* @__PURE__ */ React.createElement(ShieldCheck, { className: "h-6 w-6" })), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-lg" }, "Privacidade e Dados"), /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "ghost",
      size: "icon",
      className: "h-6 w-6 rounded-full",
      onClick: () => setIsVisible(false)
    },
    /* @__PURE__ */ React.createElement(X, { className: "h-4 w-4" })
  )), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground leading-relaxed" }, "O CityMotion utiliza dados como sua localiza\xE7\xE3o e informa\xE7\xF5es funcionais para otimizar a gest\xE3o da frota. Ao continuar, voc\xEA concorda com nossa ", /* @__PURE__ */ React.createElement(Link, { href: "/privacy", className: "text-primary underline hover:text-primary/80" }, "Pol\xEDtica de Privacidade"), " sob os termos da LGPD."), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row gap-2 pt-2" }, /* @__PURE__ */ React.createElement(Button, { size: "sm", className: "w-full", onClick: handleAccept }, "Entendi e Aceito"), /* @__PURE__ */ React.createElement(Button, { size: "sm", variant: "outline", className: "w-full", asChild: true }, /* @__PURE__ */ React.createElement(Link, { href: "/privacy" }, "Saber Mais")))))));
}
export {
  LGPDBanner
};
