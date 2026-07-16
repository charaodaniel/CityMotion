"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/app-provider";
import { cn } from "@/lib/utils";
import {
  Database,
  Server,
  Globe,
  Mail,
  Shield,
  HardDrive,
  Network,
  CheckCircle2,
  XCircle,
  Loader2,
  Save,
  Eye,
  EyeOff,
  TestTube2,
  AlertTriangle,
  Settings2,
  Plug
} from "lucide-react";
function InfrastructurePanel() {
  const { toast } = useToast();
  const { userRole } = useApp();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [showPasswords, setShowPasswords] = useState({});
  const [dbType, setDbType] = useState("sqlite");
  const [dbUrl, setDbUrl] = useState("");
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [corsOrigins, setCorsOrigins] = useState("http://localhost:9002");
  const [serverPort, setServerPort] = useState("3001");
  const [demoMode, setDemoMode] = useState(false);
  const getHeaders = useCallback(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("citymotion_token") : null;
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }, []);
  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/nexus/infrastructure/config", { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
        setDbType(data.database?.type || "sqlite");
        setDbUrl(data.database?.urlRaw || "");
        setSmtpHost(data.smtp?.host || "");
        setSmtpPort(data.smtp?.port || "587");
        setSmtpUser(data.smtp?.user || "");
        setSmtpPass(data.smtp?.passRaw || "");
        setSmtpSecure(data.smtp?.secure || false);
        setCorsOrigins(data.proxy?.allowedOrigins || "http://localhost:9002");
        setServerPort(data.server?.port || "3001");
        setDemoMode(data.server?.demoMode || false);
      }
    } catch (e) {
      console.error("Erro ao carregar config:", e);
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);
  const testConnection = async (section, payload) => {
    setTesting(section);
    setTestResults((prev) => ({ ...prev, [section]: { success: false, message: "Testando..." } }));
    try {
      let endpoint = "";
      if (section === "database") endpoint = "/api/nexus/infrastructure/test-db";
      else if (section === "smtp") endpoint = "/api/nexus/infrastructure/test-smtp";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      setTestResults((prev) => ({ ...prev, [section]: result }));
      toast({
        title: result.success ? "\u2705 Conex\xE3o OK" : "\u274C Falha na Conex\xE3o",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
    } catch (e) {
      setTestResults((prev) => ({ ...prev, [section]: { success: false, message: e.message } }));
      toast({ title: "\u274C Erro", description: e.message, variant: "destructive" });
    } finally {
      setTesting(null);
    }
  };
  const saveConfig = async (section, data) => {
    setSaving(true);
    try {
      const res = await fetch("/api/nexus/infrastructure/save", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ section, config: data })
      });
      const result = await res.json();
      toast({
        title: result.success ? "\u2705 Salvo" : "\u274C Erro",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
      if (result.success) fetchConfig();
    } catch (e) {
      toast({ title: "\u274C Erro ao salvar", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };
  const StatusBadge = ({ section }) => {
    const result = testResults[section];
    if (!result) return null;
    return /* @__PURE__ */ React.createElement(
      Badge,
      {
        variant: "outline",
        className: cn(
          "text-[9px] font-black ml-2",
          result.success ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" : "bg-destructive/10 text-destructive border-destructive/30"
        )
      },
      result.success ? /* @__PURE__ */ React.createElement(CheckCircle2, { className: "h-2.5 w-2.5 mr-1" }) : /* @__PURE__ */ React.createElement(XCircle, { className: "h-2.5 w-2.5 mr-1" }),
      result.message
    );
  };
  const DB_TYPES = [
    { value: "sqlite", label: "SQLite3 (Local)", desc: "Banco local, ideal para pendrives e servidores pequenos" },
    { value: "postgresql", label: "PostgreSQL", desc: "Banco robusto para produ\xE7\xE3o em nuvem" },
    { value: "mongodb", label: "MongoDB", desc: "Banco NoSQL para dados flex\xEDveis" },
    { value: "supabase", label: "Supabase", desc: "PostgreSQL gerenciado com API autom\xE1tica" }
  ];
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center p-12" }, /* @__PURE__ */ React.createElement(Loader2, { className: "h-8 w-8 animate-spin text-primary" }), /* @__PURE__ */ React.createElement("span", { className: "ml-3 text-muted-foreground text-sm" }, "Carregando configura\xE7\xF5es de infraestrutura..."));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-black tracking-tight flex items-center gap-3" }, /* @__PURE__ */ React.createElement(Server, { className: "h-7 w-7 text-primary" }), "Infraestrutura & Conectividade"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground text-sm mt-1" }, "Gerencie bancos de dados, proxy, DNS, credenciais e servi\xE7os externos.")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, config?.security?.jwtConfigured ? /* @__PURE__ */ React.createElement(Badge, { className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[9px] font-black" }, /* @__PURE__ */ React.createElement(Shield, { className: "h-2.5 w-2.5 mr-1" }), " JWT Configurado") : /* @__PURE__ */ React.createElement(Badge, { className: "bg-amber-500/10 text-amber-500 border-amber-500/30 text-[9px] font-black" }, /* @__PURE__ */ React.createElement(AlertTriangle, { className: "h-2.5 w-2.5 mr-1" }), " JWT N\xE3o Configurado"), /* @__PURE__ */ React.createElement(Badge, { className: "bg-primary/10 text-primary border-primary/30 text-[9px] font-black" }, /* @__PURE__ */ React.createElement(Plug, { className: "h-2.5 w-2.5 mr-1" }), " Backend: Porta ", serverPort))), /* @__PURE__ */ React.createElement(Tabs, { defaultValue: "database", className: "space-y-6" }, /* @__PURE__ */ React.createElement(TabsList, { className: "bg-sidebar border border-border/50 p-1 w-full lg:w-fit justify-start h-auto gap-1" }, /* @__PURE__ */ React.createElement(TabsTrigger, { value: "database", className: "text-[10px] font-bold uppercase tracking-widest px-4 gap-1.5" }, /* @__PURE__ */ React.createElement(Database, { className: "h-3 w-3" }), " Banco de Dados"), /* @__PURE__ */ React.createElement(TabsTrigger, { value: "network", className: "text-[10px] font-bold uppercase tracking-widest px-4 gap-1.5" }, /* @__PURE__ */ React.createElement(Globe, { className: "h-3 w-3" }), " Proxy & CORS"), /* @__PURE__ */ React.createElement(TabsTrigger, { value: "smtp", className: "text-[10px] font-bold uppercase tracking-widest px-4 gap-1.5" }, /* @__PURE__ */ React.createElement(Mail, { className: "h-3 w-3" }), " SMTP"), /* @__PURE__ */ React.createElement(TabsTrigger, { value: "server", className: "text-[10px] font-bold uppercase tracking-widest px-4 gap-1.5" }, /* @__PURE__ */ React.createElement(Settings2, { className: "h-3 w-3" }), " Servidor")), /* @__PURE__ */ React.createElement(TabsContent, { value: "database", className: "space-y-6" }, /* @__PURE__ */ React.createElement(Card, { className: "bg-sidebar/50 border-border/50" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "border-b border-border/30" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-sm font-bold uppercase tracking-widest flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Database, { className: "h-4 w-4 text-primary" }), " Motor de Persist\xEAncia", /* @__PURE__ */ React.createElement(StatusBadge, { section: "database" })), /* @__PURE__ */ React.createElement(CardDescription, { className: "text-xs" }, "Configure o banco de dados principal. O sistema suporta SQLite local, PostgreSQL, MongoDB e Supabase.")), /* @__PURE__ */ React.createElement(CardContent, { className: "space-y-6 pt-6" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { className: "text-[10px] uppercase font-bold text-muted-foreground" }, "Tipo de Banco"), /* @__PURE__ */ React.createElement(Select, { value: dbType, onValueChange: setDbType }, /* @__PURE__ */ React.createElement(SelectTrigger, { className: "bg-black/40 border-border/50" }, /* @__PURE__ */ React.createElement(SelectValue, null)), /* @__PURE__ */ React.createElement(SelectContent, null, DB_TYPES.map((db) => /* @__PURE__ */ React.createElement(SelectItem, { key: db.value, value: db.value }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-xs" }, db.label), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-muted-foreground" }, db.desc))))))), dbType !== "sqlite" && /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { className: "text-[10px] uppercase font-bold text-muted-foreground" }, "URL de Conex\xE3o"), /* @__PURE__ */ React.createElement(
    Input,
    {
      className: "bg-black/40 font-mono text-xs border-border/50",
      placeholder: dbType === "postgresql" ? "postgresql://user:pass@host:5432/dbname" : dbType === "mongodb" ? "mongodb+srv://user:pass@cluster.mongodb.net/dbname" : "postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres",
      value: dbUrl,
      onChange: (e) => setDbUrl(e.target.value)
    }
  ), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-muted-foreground font-mono" }, dbType === "postgresql" && "Formato: postgresql://usuario:senha@host:porta/nomedb", dbType === "mongodb" && "Formato: mongodb+srv://user:pass@cluster.mongodb.net/dbname", dbType === "supabase" && "Use a Connection String do painel Supabase \u2192 Settings \u2192 Database")), dbType === "sqlite" && /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-primary/5 border border-primary/20 rounded-md" }, /* @__PURE__ */ React.createElement("p", { className: "text-[11px] font-mono text-primary/70 leading-relaxed" }, "[INFO] SQLite n\xE3o requer configura\xE7\xE3o de conex\xE3o. O banco \xE9 armazenado localmente em", /* @__PURE__ */ React.createElement("code", { className: "mx-1 bg-black/30 px-1.5 py-0.5 rounded" }, "backend/database/citymotion.db"), "e \xE9 ideal para uso em pendrives e servidores isolados.")), /* @__PURE__ */ React.createElement("div", { className: "flex gap-3" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "outline",
      size: "sm",
      onClick: () => testConnection("database", { type: dbType, url: dbUrl }),
      disabled: testing === "database",
      className: "text-[10px] font-bold uppercase tracking-widest"
    },
    testing === "database" ? /* @__PURE__ */ React.createElement(Loader2, { className: "h-3 w-3 mr-2 animate-spin" }) : /* @__PURE__ */ React.createElement(TestTube2, { className: "h-3 w-3 mr-2" }),
    "Testar Conex\xE3o"
  ), /* @__PURE__ */ React.createElement(
    Button,
    {
      size: "sm",
      onClick: () => saveConfig("database", { type: dbType, url: dbUrl }),
      disabled: saving,
      className: "text-[10px] font-bold uppercase tracking-widest"
    },
    saving ? /* @__PURE__ */ React.createElement(Loader2, { className: "h-3 w-3 mr-2 animate-spin" }) : /* @__PURE__ */ React.createElement(Save, { className: "h-3 w-3 mr-2" }),
    "Salvar"
  )))), /* @__PURE__ */ React.createElement(Card, { className: "bg-zinc-950 border-primary/20" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2" }, /* @__PURE__ */ React.createElement(HardDrive, { className: "h-4 w-4" }), " Status Atual")), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "p-3 bg-black/40 rounded border border-border/20" }, /* @__PURE__ */ React.createElement("p", { className: "text-[9px] uppercase font-black text-muted-foreground tracking-widest" }, "Motor Ativo"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-bold mt-1 font-mono text-primary" }, config?.database?.type === "sqlite" ? "SQLite3" : config?.database?.type?.toUpperCase() || "N/A")), /* @__PURE__ */ React.createElement("div", { className: "p-3 bg-black/40 rounded border border-border/20" }, /* @__PURE__ */ React.createElement("p", { className: "text-[9px] uppercase font-black text-muted-foreground tracking-widest" }, "Modo"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-bold mt-1 font-mono text-emerald-500" }, "Operacional")), /* @__PURE__ */ React.createElement("div", { className: "p-3 bg-black/40 rounded border border-border/20" }, /* @__PURE__ */ React.createElement("p", { className: "text-[9px] uppercase font-black text-muted-foreground tracking-widest" }, "Porta Backend"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-bold mt-1 font-mono" }, serverPort)))))), /* @__PURE__ */ React.createElement(TabsContent, { value: "network", className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement(Card, { className: "bg-sidebar/50 border-border/50" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-xs font-bold uppercase tracking-widest flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Globe, { className: "h-4 w-4" }), " CORS & Origens Permitidas")), /* @__PURE__ */ React.createElement(CardContent, { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { className: "text-[10px] uppercase font-bold text-muted-foreground" }, "Origens Permitidas (separadas por v\xEDrgula)"), /* @__PURE__ */ React.createElement(
    Textarea,
    {
      className: "bg-black/40 font-mono text-xs border-border/50 min-h-[80px]",
      placeholder: "http://localhost:9002, https://citymotion.seudominio.com",
      value: corsOrigins,
      onChange: (e) => setCorsOrigins(e.target.value)
    }
  ), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-muted-foreground" }, "Dom\xEDnios que podem fazer requisi\xE7\xF5es ao backend. Em produ\xE7\xE3o, defina apenas seu dom\xEDnio.")), /* @__PURE__ */ React.createElement(
    Button,
    {
      size: "sm",
      onClick: () => saveConfig("proxy", { allowedOrigins: corsOrigins }),
      disabled: saving,
      className: "text-[10px] font-bold uppercase tracking-widest"
    },
    /* @__PURE__ */ React.createElement(Save, { className: "h-3 w-3 mr-2" }),
    " Salvar CORS"
  ))), /* @__PURE__ */ React.createElement(Card, { className: "bg-sidebar/50 border-border/50" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-xs font-bold uppercase tracking-widest flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Network, { className: "h-4 w-4" }), " Rate Limiting")), /* @__PURE__ */ React.createElement(CardContent, { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "p-3 bg-emerald-500/5 border border-emerald-500/20 rounded" }, /* @__PURE__ */ React.createElement("p", { className: "text-[10px] font-bold text-emerald-500 flex items-center gap-1" }, /* @__PURE__ */ React.createElement(CheckCircle2, { className: "h-3 w-3" }), " Prote\xE7\xE3o Ativa"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-muted-foreground mt-1 font-mono" }, "Global: 100 req/15min | Login: 10 tentativas/15min")), /* @__PURE__ */ React.createElement("div", { className: "p-3 bg-black/40 rounded border border-border/20 space-y-2" }, /* @__PURE__ */ React.createElement("p", { className: "text-[9px] uppercase font-black text-muted-foreground tracking-widest" }, "Endere\xE7os Protegidos"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] font-mono text-primary/70" }, "POST /api/login \u2014 Rate limit dedicado"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] font-mono text-primary/70" }, "* /api/* \u2014 Rate limit global")))))), /* @__PURE__ */ React.createElement(TabsContent, { value: "smtp", className: "space-y-6" }, /* @__PURE__ */ React.createElement(Card, { className: "bg-sidebar/50 border-border/50" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "border-b border-border/30" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-sm font-bold uppercase tracking-widest flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Mail, { className: "h-4 w-4" }), " Servidor de E-mail (SMTP)", /* @__PURE__ */ React.createElement(StatusBadge, { section: "smtp" })), /* @__PURE__ */ React.createElement(CardDescription, { className: "text-xs" }, "Configura\xE7\xE3o para envio de e-mails transacionais (recupera\xE7\xE3o de senha, notifica\xE7\xF5es).")), /* @__PURE__ */ React.createElement(CardContent, { className: "space-y-6 pt-6" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { className: "text-[10px] uppercase font-bold text-muted-foreground" }, "Host SMTP"), /* @__PURE__ */ React.createElement(
    Input,
    {
      className: "bg-black/40 font-mono text-xs border-border/50",
      placeholder: "smtp.gmail.com",
      value: smtpHost,
      onChange: (e) => setSmtpHost(e.target.value)
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { className: "text-[10px] uppercase font-bold text-muted-foreground" }, "Porta"), /* @__PURE__ */ React.createElement(
    Input,
    {
      type: "number",
      className: "bg-black/40 font-mono text-xs border-border/50",
      placeholder: "587",
      value: smtpPort,
      onChange: (e) => setSmtpPort(e.target.value)
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { className: "text-[10px] uppercase font-bold text-muted-foreground" }, "Usu\xE1rio"), /* @__PURE__ */ React.createElement(
    Input,
    {
      className: "bg-black/40 font-mono text-xs border-border/50",
      placeholder: "seu-email@gmail.com",
      value: smtpUser,
      onChange: (e) => setSmtpUser(e.target.value)
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { className: "text-[10px] uppercase font-bold text-muted-foreground" }, "Senha / App Password"), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
    Input,
    {
      type: showPasswords.smtp ? "text" : "password",
      className: "bg-black/40 font-mono text-xs border-border/50 pr-10",
      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
      value: smtpPass,
      onChange: (e) => setSmtpPass(e.target.value)
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setShowPasswords((prev) => ({ ...prev, smtp: !prev.smtp })),
      className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
    },
    showPasswords.smtp ? /* @__PURE__ */ React.createElement(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ React.createElement(Eye, { className: "h-3.5 w-3.5" })
  )))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between p-3 border rounded bg-black/20" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Label, { className: "text-xs font-bold" }, "TLS/SSL Seguro"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-muted-foreground" }, "Usar conex\xE3o segura (porta 465)")), /* @__PURE__ */ React.createElement(Switch, { checked: smtpSecure, onCheckedChange: setSmtpSecure })), /* @__PURE__ */ React.createElement("div", { className: "flex gap-3" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "outline",
      size: "sm",
      onClick: () => testConnection("smtp", { host: smtpHost, port: smtpPort, user: smtpUser, pass: smtpPass, secure: smtpSecure }),
      disabled: testing === "smtp",
      className: "text-[10px] font-bold uppercase tracking-widest"
    },
    testing === "smtp" ? /* @__PURE__ */ React.createElement(Loader2, { className: "h-3 w-3 mr-2 animate-spin" }) : /* @__PURE__ */ React.createElement(TestTube2, { className: "h-3 w-3 mr-2" }),
    "Testar SMTP"
  ), /* @__PURE__ */ React.createElement(
    Button,
    {
      size: "sm",
      onClick: () => saveConfig("smtp", { host: smtpHost, port: smtpPort, user: smtpUser, pass: smtpPass, secure: smtpSecure }),
      disabled: saving,
      className: "text-[10px] font-bold uppercase tracking-widest"
    },
    /* @__PURE__ */ React.createElement(Save, { className: "h-3 w-3 mr-2" }),
    " Salvar"
  ))))), /* @__PURE__ */ React.createElement(TabsContent, { value: "server", className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement(Card, { className: "bg-sidebar/50 border-border/50" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-xs font-bold uppercase tracking-widest flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Server, { className: "h-4 w-4" }), " Configura\xE7\xF5es do Servidor")), /* @__PURE__ */ React.createElement(CardContent, { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { className: "text-[10px] uppercase font-bold text-muted-foreground" }, "Porta do Backend"), /* @__PURE__ */ React.createElement(
    Input,
    {
      type: "number",
      className: "bg-black/40 font-mono text-xs border-border/50",
      value: serverPort,
      onChange: (e) => setServerPort(e.target.value)
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between p-3 border rounded bg-black/20" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Label, { className: "text-xs font-bold" }, "Modo Demonstra\xE7\xE3o"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-muted-foreground" }, "Reset di\xE1rio autom\xE1tico dos dados")), /* @__PURE__ */ React.createElement(Switch, { checked: demoMode, onCheckedChange: setDemoMode })), demoMode && /* @__PURE__ */ React.createElement("div", { className: "p-3 bg-amber-500/5 border border-amber-500/20 rounded flex items-start gap-2" }, /* @__PURE__ */ React.createElement(AlertTriangle, { className: "h-4 w-4 text-amber-500 shrink-0 mt-0.5" }), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-amber-500" }, "ATEN\xC7\xC3O: O modo demo apaga todos os dados todos os dias \xE0 meia-noite. N\xE3o use em produ\xE7\xE3o!")), /* @__PURE__ */ React.createElement(
    Button,
    {
      size: "sm",
      onClick: () => saveConfig("server", { port: serverPort, demoMode }),
      disabled: saving,
      className: "text-[10px] font-bold uppercase tracking-widest"
    },
    /* @__PURE__ */ React.createElement(Save, { className: "h-3 w-3 mr-2" }),
    " Salvar"
  ))), /* @__PURE__ */ React.createElement(Card, { className: "bg-sidebar/50 border-border/50" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-xs font-bold uppercase tracking-widest flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Shield, { className: "h-4 w-4" }), " Seguran\xE7a")), /* @__PURE__ */ React.createElement(CardContent, { className: "space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between p-3 border rounded bg-black/20" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Label, { className: "text-xs font-bold" }, "JWT Secret"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-muted-foreground font-mono" }, config?.security?.jwtConfigured ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022 configurado" : "N\xC3O CONFIGURADO")), config?.security?.jwtConfigured ? /* @__PURE__ */ React.createElement(Badge, { className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[9px] font-black" }, /* @__PURE__ */ React.createElement(CheckCircle2, { className: "h-2.5 w-2.5 mr-1" }), " OK") : /* @__PURE__ */ React.createElement(Badge, { className: "bg-destructive/10 text-destructive border-destructive/30 text-[9px] font-black" }, /* @__PURE__ */ React.createElement(XCircle, { className: "h-2.5 w-2.5 mr-1" }), " FALTA")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between p-3 border rounded bg-black/20" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Label, { className: "text-xs font-bold" }, "CORS Origin"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-muted-foreground font-mono truncate max-w-[200px]" }, config?.security?.corsOrigin || "N\xE3o configurado")), /* @__PURE__ */ React.createElement(Badge, { className: "bg-primary/10 text-primary border-primary/30 text-[9px] font-black" }, /* @__PURE__ */ React.createElement(Globe, { className: "h-2.5 w-2.5 mr-1" }), " Ativo")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between p-3 border rounded bg-black/20" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Label, { className: "text-xs font-bold" }, "Rate Limiting"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-muted-foreground" }, "Prote\xE7\xE3o contra brute force")), /* @__PURE__ */ React.createElement(Badge, { className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[9px] font-black" }, /* @__PURE__ */ React.createElement(CheckCircle2, { className: "h-2.5 w-2.5 mr-1" }), " Ativo"))))))));
}
export {
  InfrastructurePanel
};
