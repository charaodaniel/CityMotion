"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useApp } from "@/contexts/app-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Search, Users, ShieldCheck, CheckCheck } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
function ChatPage() {
  const { employees, messages, sendMessage, currentUser, isLoading } = useApp();
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef(null);
  const filteredEmployees = useMemo(() => {
    if (!currentUser) return [];
    return employees.filter(
      (e) => e.id !== currentUser.id && e.name.toLowerCase().includes(search.toLowerCase()) && e.status !== "Desativado"
    );
  }, [employees, currentUser, search]);
  const activeMessages = useMemo(() => {
    if (!selectedUser || !currentUser) return [];
    return messages.filter(
      (m) => m.senderId === currentUser.id && m.receiverId === selectedUser.id || m.senderId === selectedUser.id && m.receiverId === currentUser.id
    );
  }, [messages, selectedUser, currentUser]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeMessages]);
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    await sendMessage(selectedUser.id, newMessage.trim());
    setNewMessage("");
  };
  const getRoleBadgeColor = (role) => {
    const r = role.toLowerCase();
    if (r.includes("admin") || r.includes("dev")) return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    if (r.includes("motorista")) return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (r.includes("gestor")) return "bg-primary/10 text-primary border-primary/20";
    return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  };
  if (isLoading && !currentUser) return /* @__PURE__ */ React.createElement("div", { className: "p-8" }, "Carregando NexusTalk...");
  return /* @__PURE__ */ React.createElement("div", { className: "flex h-[calc(100vh-4rem)] overflow-hidden bg-background" }, /* @__PURE__ */ React.createElement("div", { className: "w-80 border-r border-border/50 bg-sidebar/30 flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "p-6 border-b border-border/50 space-y-4" }, /* @__PURE__ */ React.createElement("h1", { className: "text-2xl font-black tracking-tighter flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Users, { className: "h-6 w-6 text-primary" }), "NexusTalk"), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ React.createElement(
    Input,
    {
      placeholder: "Buscar contato...",
      className: "pl-9 h-9 text-xs bg-black/20 border-border/50",
      value: search,
      onChange: (e) => setSearch(e.target.value)
    }
  ))), /* @__PURE__ */ React.createElement(ScrollArea, { className: "flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "p-2 space-y-1" }, filteredEmployees.map((emp) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: emp.id,
      onClick: () => setSelectedUser(emp),
      className: cn(
        "w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left group",
        selectedUser?.id === emp.id ? "bg-primary/10 border-primary/20" : "hover:bg-accent/30"
      )
    },
    /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(Avatar, { className: "h-10 w-10 border border-border/50" }, /* @__PURE__ */ React.createElement(AvatarImage, { src: `https://i.pravatar.cc/100?u=${emp.id}` }), /* @__PURE__ */ React.createElement(AvatarFallback, null, emp.name[0])), /* @__PURE__ */ React.createElement("div", { className: cn(
      "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background",
      emp.status === "Dispon\xEDvel" ? "bg-emerald-500" : "bg-zinc-500"
    ) })),
    /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-hidden" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-bold truncate" }, emp.name), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-muted-foreground uppercase tracking-widest truncate" }, emp.role))
  ))))), /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex flex-col relative" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 scanlines opacity-[0.02] pointer-events-none" }), selectedUser ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "h-20 border-b border-border/50 px-6 flex items-center justify-between bg-sidebar/10 backdrop-blur-md" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement(Avatar, { className: "h-11 w-11 border-2 border-primary/20" }, /* @__PURE__ */ React.createElement(AvatarImage, { src: `https://i.pravatar.cc/150?u=${selectedUser.id}` }), /* @__PURE__ */ React.createElement(AvatarFallback, null, selectedUser.name[0])), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-lg leading-tight" }, selectedUser.name), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mt-0.5" }, /* @__PURE__ */ React.createElement(Badge, { variant: "outline", className: cn("text-[9px] uppercase font-bold", getRoleBadgeColor(selectedUser.role)) }, selectedUser.role), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-muted-foreground flex items-center gap-1" }, /* @__PURE__ */ React.createElement(ShieldCheck, { className: "h-3 w-3 text-emerald-500" }), " Criptografia NEX-256"))))), /* @__PURE__ */ React.createElement(ScrollArea, { className: "flex-1 p-6" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-4xl mx-auto space-y-6" }, activeMessages.length > 0 ? activeMessages.map((m, idx) => {
    const isMe = m.senderId === currentUser?.id;
    return /* @__PURE__ */ React.createElement("div", { key: m.id, className: cn(
      "flex flex-col max-w-[80%]",
      isMe ? "ml-auto items-end" : "mr-auto items-start"
    ) }, /* @__PURE__ */ React.createElement("div", { className: cn(
      "p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
      isMe ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-sidebar/80 border border-border/50 text-foreground rounded-tl-none"
    ) }, m.content), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5 mt-1.5 px-1 opacity-50" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-mono" }, format(new Date(m.timestamp), "HH:mm", { locale: ptBR })), isMe && /* @__PURE__ */ React.createElement(CheckCheck, { className: "h-3 w-3 text-emerald-400" })));
  }) : /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center h-[50vh] text-center opacity-30 select-none" }, /* @__PURE__ */ React.createElement(Send, { className: "h-12 w-12 mb-4 text-primary" }), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-bold uppercase tracking-widest" }, "Inicie um protocolo de comunica\xE7\xE3o"), /* @__PURE__ */ React.createElement("p", { className: "text-xs" }, "Seguran\xE7a t\xE9cnica ativa para este terminal.")), /* @__PURE__ */ React.createElement("div", { ref: scrollRef }))), /* @__PURE__ */ React.createElement("div", { className: "p-6 bg-background/50 backdrop-blur-md" }, /* @__PURE__ */ React.createElement("form", { onSubmit: handleSend, className: "max-w-4xl mx-auto flex gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1 relative" }, /* @__PURE__ */ React.createElement(
    Input,
    {
      placeholder: "Digite sua mensagem t\xE9cnica...",
      className: "h-12 bg-black/30 border-border/50 pr-12 text-sm",
      value: newMessage,
      onChange: (e) => setNewMessage(e.target.value)
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-primary/40 font-bold" }, "CM-MSG-SYS")), /* @__PURE__ */ React.createElement(
    Button,
    {
      type: "submit",
      size: "icon",
      className: "h-12 w-12 bg-primary hover:bg-primary/90 transition-transform active:scale-95 shadow-lg shadow-primary/20",
      disabled: !newMessage.trim()
    },
    /* @__PURE__ */ React.createElement(Send, { className: "h-5 w-5" })
  )))) : /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex flex-col items-center justify-center text-center p-8" }, /* @__PURE__ */ React.createElement("div", { className: "w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10 mb-6" }, /* @__PURE__ */ React.createElement(Users, { className: "h-10 w-10 text-primary animate-pulse" })), /* @__PURE__ */ React.createElement("h2", { className: "text-3xl font-black tracking-tighter text-on-surface mb-2" }, "Central de Comunica\xE7\xE3o"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground max-w-sm" }, "Selecione um colaborador no terminal lateral para iniciar a transmiss\xE3o de dados e orienta\xE7\xF5es operacionais."))));
}
export {
  ChatPage as default
};
