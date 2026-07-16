"use client";
import React, { useState, useEffect, useRef } from "react";
import { DevTerminal } from "@/components/dev-terminal";
import { Loader2, ShieldAlert, Terminal as TerminalIcon } from "lucide-react";
import { useApp } from "@/contexts/app-provider";
function TerminalPage() {
  const { login, currentUser, isLoading: contextLoading } = useApp();
  const [step, setStep] = useState("username");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (step !== "authenticated") {
      inputRef.current?.focus();
    }
  }, [step]);
  useEffect(() => {
    if (currentUser && step !== "authenticated") {
      setStep("authenticated");
    }
  }, [currentUser, step]);
  const handleLogin = async (e) => {
    e.preventDefault();
    if (step === "username") {
      if (username.trim()) setStep("password");
    } else if (step === "password") {
      setStep("authenticating");
      try {
        await login(username, password, false, true);
      } catch (err) {
        setError(err.message || "Login incorrect");
        setStep("username");
        setUsername("");
        setPassword("");
        setTimeout(() => setError(""), 3e3);
      }
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-black text-zinc-300 font-mono selection:bg-primary/30 relative overflow-hidden flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 pointer-events-none z-50 tui-scanline opacity-10" }), step !== "authenticated" ? /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex items-center justify-center p-4 sm:p-8" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-md space-y-4 animate-in fade-in duration-500" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1 mb-8 border-l-2 border-primary pl-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-primary font-bold text-sm sm:text-base mb-1" }, /* @__PURE__ */ React.createElement(TerminalIcon, { className: "h-4 w-4" }), /* @__PURE__ */ React.createElement("span", null, "CityMotion NexusOS v2.4.0 (tty1)")), /* @__PURE__ */ React.createElement("p", { className: "text-zinc-500 text-[10px] uppercase tracking-widest" }, "Acesso Restrito: Modo Demonstra\xE7\xE3o Dispon\xEDvel")), error && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-red-500 text-xs bg-red-500/10 p-2 border border-red-500/20 rounded" }, /* @__PURE__ */ React.createElement(ShieldAlert, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ React.createElement("span", { className: "animate-pulse" }, error)), /* @__PURE__ */ React.createElement("form", { onSubmit: handleLogin, className: "space-y-3 text-sm sm:text-base" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "shrink-0 text-zinc-500" }, "nexusos login:"), /* @__PURE__ */ React.createElement(
    "input",
    {
      ref: step === "username" ? inputRef : null,
      type: "text",
      value: username,
      onChange: (e) => setUsername(e.target.value),
      disabled: step !== "username" && step !== "authenticating",
      className: "bg-transparent border-none outline-none text-white flex-1 focus:ring-0 p-0",
      autoComplete: "off",
      spellCheck: "false"
    }
  )), step === "password" && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "shrink-0 text-zinc-500" }, "Password:"), /* @__PURE__ */ React.createElement(
    "input",
    {
      ref: inputRef,
      type: "password",
      value: password,
      onChange: (e) => setPassword(e.target.value),
      className: "bg-transparent border-none outline-none text-white flex-1 focus:ring-0 p-0",
      autoComplete: "off"
    }
  )), (step === "authenticating" || contextLoading) && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 pt-2 text-primary text-xs italic" }, /* @__PURE__ */ React.createElement(Loader2, { className: "h-3 w-3 animate-spin" }), /* @__PURE__ */ React.createElement("span", null, "Validando credenciais na camada Nexus-Dual...")), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "hidden" })), /* @__PURE__ */ React.createElement("div", { className: "pt-10 opacity-20 text-[9px] uppercase tracking-[0.3em] text-center leading-relaxed" }, /* @__PURE__ */ React.createElement("p", null, "Secure Terminal Session"), /* @__PURE__ */ React.createElement("p", null, "Demo User Auto-Purge: 24h cycle")))) : /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex flex-col h-full w-full overflow-hidden" }, /* @__PURE__ */ React.createElement(
    DevTerminal,
    {
      isOpen: true,
      onClose: () => setStep("username")
    }
  ), /* @__PURE__ */ React.createElement("style", { jsx: true, global: true }, `
                .fixed.bottom-6.right-6 {
                    position: relative !important;
                    bottom: 0 !important;
                    right: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    max-width: none !important;
                    border: none !important;
                    margin: 0 !important;
                    box-shadow: none !important;
                    flex: 1 !important;
                }
                [data-sidebar="trigger"], header {
                    display: none !important;
                }
             `)));
}
export {
  TerminalPage as default
};
