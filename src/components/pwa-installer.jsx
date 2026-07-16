"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setIsVisible(true), 5e3);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("CityMotion instalado com sucesso!");
    }
    setDeferredPrompt(null);
    setIsVisible(false);
  };
  return /* @__PURE__ */ React.createElement(AnimatePresence, null, isVisible && deferredPrompt && /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 50, scale: 0.9 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 20, scale: 0.9 },
      className: "fixed bottom-24 right-4 z-[90] max-w-xs w-full"
    },
    /* @__PURE__ */ React.createElement("div", { className: "bg-sidebar/95 backdrop-blur-md border border-primary/30 p-4 rounded-xl shadow-2xl scanlines" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-start mb-2" }, /* @__PURE__ */ React.createElement("h4", { className: "text-xs font-black uppercase tracking-widest text-primary" }, "Instalar NexusOS"), /* @__PURE__ */ React.createElement("button", { onClick: () => setIsVisible(false), className: "text-muted-foreground hover:text-white" }, /* @__PURE__ */ React.createElement(X, { className: "h-4 w-4" }))), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-muted-foreground mb-4 leading-relaxed" }, "Adicione o CityMotion \xE0 sua tela inicial para acesso r\xE1pido e modo offline no totem."), /* @__PURE__ */ React.createElement(
      Button,
      {
        onClick: handleInstall,
        className: "w-full h-9 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px]"
      },
      /* @__PURE__ */ React.createElement(Download, { className: "mr-2 h-3 w-3" }),
      " Instalar Agora"
    ))
  ));
}
export {
  PWAInstaller
};
