"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Network, Server, Route as RouteIcon, Play, Code, CheckCircle2, X, Search, FileText, Activity, Clock } from "lucide-react";
import nexusConfig from "@/nexusbridge/config/nexus-settings.json";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
function NexusControlPage() {
  const [testPath, setTestTestPath] = useState("users");
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const saved = localStorage.getItem("nexus_bridge_logs");
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem("nexus_bridge_logs");
      }
    }
  }, []);
  const addLog = (method, path, status, duration) => {
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      method,
      path,
      status,
      type: status >= 500 ? "error" : status >= 400 ? "warning" : "success",
      duration
    };
    setLogs((prev) => {
      const updated = [newLog, ...prev].slice(0, 50);
      localStorage.setItem("nexus_bridge_logs", JSON.stringify(updated));
      return updated;
    });
  };
  const runTest = async () => {
    const cleanPath = testPath.trim().replace(/^\//, "");
    if (!cleanPath) return;
    setIsTesting(true);
    const startTime = Date.now();
    try {
      const response = await fetch(`/api/nexus/${cleanPath}`);
      const duration = Date.now() - startTime;
      const data = await response.json();
      setTestResult({
        status: response.status,
        duration: `${duration}ms`,
        payload: data
      });
      addLog("GET", `/api/nexus/${cleanPath}`, response.status, duration);
    } catch (error) {
      const duration = Date.now() - startTime;
      setTestResult({ status: 500, error: "Falha Cr\xEDtica", message: error.message });
      addLog("GET", `/api/nexus/${cleanPath}`, 500, duration);
    } finally {
      setIsTesting(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto p-4 sm:p-8 space-y-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold tracking-tight font-headline flex items-center gap-3" }, /* @__PURE__ */ React.createElement(Network, { className: "h-8 w-8 text-primary" }), "NexusBridge Control"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground" }, "Monitoramento de tr\xE1fego e diagn\xF3stico de backends.")), /* @__PURE__ */ React.createElement(Badge, { variant: "outline", className: "bg-green-500/10 text-green-500 border-green-500/20 py-1.5 px-4" }, /* @__PURE__ */ React.createElement("div", { className: "h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" }), "Engine: Operacional")), /* @__PURE__ */ React.createElement(Tabs, { defaultValue: "overview", className: "space-y-6" }, /* @__PURE__ */ React.createElement(TabsList, { className: "bg-sidebar border border-border/50 p-1 w-full lg:w-fit justify-start overflow-x-auto h-auto gap-1" }, /* @__PURE__ */ React.createElement(TabsTrigger, { value: "overview", className: "text-[10px] font-bold uppercase tracking-widest px-6 py-2" }, "Vis\xE3o Geral"), /* @__PURE__ */ React.createElement(TabsTrigger, { value: "routes", className: "text-[10px] font-bold uppercase tracking-widest px-6 py-2" }, "Dicion\xE1rio de Rotas"), /* @__PURE__ */ React.createElement(TabsTrigger, { value: "logs", className: "text-[10px] font-bold uppercase tracking-widest px-6 py-2" }, "Traffic Logs"), /* @__PURE__ */ React.createElement(TabsTrigger, { value: "console", className: "text-[10px] font-bold uppercase tracking-widest px-6 py-2" }, "Test Console")), /* @__PURE__ */ React.createElement(TabsContent, { value: "overview", className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6" }, /* @__PURE__ */ React.createElement(Card, { className: "bg-sidebar/50 border-border/50" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "pb-2" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Server, { className: "h-3 w-3" }), " Servi\xE7os Conectados")), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement("div", { className: "text-3xl font-black tracking-tighter" }, Object.keys(nexusConfig.backends).length), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] font-mono text-green-500 flex items-center mt-1" }, /* @__PURE__ */ React.createElement(CheckCircle2, { className: "h-3 w-3 mr-1" }), " Sincronizados"))), /* @__PURE__ */ React.createElement(Card, { className: "bg-sidebar/50 border-border/50" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "pb-2" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2" }, /* @__PURE__ */ React.createElement(RouteIcon, { className: "h-3 w-3" }), " Endpoints Ativos")), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement("div", { className: "text-3xl font-black tracking-tighter" }, nexusConfig.routes.length), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] font-mono text-muted-foreground mt-1" }, "Mapeamento virtual V1.2"))), /* @__PURE__ */ React.createElement(Card, { className: "bg-sidebar/50 border-border/50" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "pb-2" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Activity, { className: "h-3 w-3" }), " Taxa de Sucesso")), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement("div", { className: "text-3xl font-black tracking-tighter text-primary" }, "99.8%"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] font-mono text-muted-foreground mt-1" }, "\xDAltimas 1.000 requisi\xE7\xF5es")))), /* @__PURE__ */ React.createElement(Card, { className: "bg-sidebar/50 border-border/50 overflow-hidden" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "border-b border-border/30 bg-accent/10" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-sm font-bold uppercase tracking-widest" }, "Configura\xE7\xE3o de Roteamento (JSON)")), /* @__PURE__ */ React.createElement(CardContent, { className: "p-0" }, /* @__PURE__ */ React.createElement(ScrollArea, { className: "h-[300px]" }, /* @__PURE__ */ React.createElement("div", { className: "p-6 font-mono text-[11px] text-primary/70 leading-relaxed" }, /* @__PURE__ */ React.createElement("pre", null, JSON.stringify(nexusConfig, null, 2))))))), /* @__PURE__ */ React.createElement(TabsContent, { value: "routes" }, /* @__PURE__ */ React.createElement(Card, { className: "bg-sidebar/50 border-border/50" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-sm font-bold uppercase tracking-widest" }, "Mapeamento de Rotas")), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Table, null, /* @__PURE__ */ React.createElement(TableHeader, { className: "bg-accent/20" }, /* @__PURE__ */ React.createElement(TableRow, { className: "border-border/30" }, /* @__PURE__ */ React.createElement(TableHead, { className: "text-[10px] uppercase font-black h-10" }, "Path (Virtual)"), /* @__PURE__ */ React.createElement(TableHead, { className: "text-[10px] uppercase font-black h-10" }, "M\xE9todo"), /* @__PURE__ */ React.createElement(TableHead, { className: "text-[10px] uppercase font-black h-10" }, "Target Path"), /* @__PURE__ */ React.createElement(TableHead, { className: "text-[10px] uppercase font-black h-10" }, "Transformer"))), /* @__PURE__ */ React.createElement(TableBody, { className: "font-mono text-xs" }, nexusConfig.routes.map((route, idx) => /* @__PURE__ */ React.createElement(TableRow, { key: idx, className: "border-border/30" }, /* @__PURE__ */ React.createElement(TableCell, { className: "text-primary" }, "/api/nexus/", route.path), /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Badge, { variant: "outline", className: "text-[9px] font-bold h-5" }, route.method)), /* @__PURE__ */ React.createElement(TableCell, { className: "text-muted-foreground" }, route.target), /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Badge, { variant: "secondary", className: "text-[9px] bg-primary/10 text-primary border-primary/20" }, route.transformer))))))))), /* @__PURE__ */ React.createElement(TabsContent, { value: "logs" }, /* @__PURE__ */ React.createElement(Card, { className: "bg-sidebar/50 border-border/50" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "border-b border-border/30" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-sm font-bold uppercase tracking-widest flex items-center gap-2" }, /* @__PURE__ */ React.createElement(FileText, { className: "h-4 w-4" }), " Traffic Analyzer"), /* @__PURE__ */ React.createElement(CardDescription, { className: "text-xs" }, "Hist\xF3rico em tempo real das chamadas processadas.")), /* @__PURE__ */ React.createElement(CardContent, { className: "p-0" }, /* @__PURE__ */ React.createElement(Table, null, /* @__PURE__ */ React.createElement(TableHeader, { className: "bg-accent/20" }, /* @__PURE__ */ React.createElement(TableRow, { className: "border-border/30" }, /* @__PURE__ */ React.createElement(TableHead, { className: "w-[100px] text-[10px] uppercase font-black text-center h-10" }, "Status"), /* @__PURE__ */ React.createElement(TableHead, { className: "w-[80px] text-[10px] uppercase font-black h-10" }, "M\xE9todo"), /* @__PURE__ */ React.createElement(TableHead, { className: "text-[10px] uppercase font-black h-10" }, "Path Virtual"), /* @__PURE__ */ React.createElement(TableHead, { className: "w-[100px] text-right text-[10px] uppercase font-black h-10" }, "Dura\xE7\xE3o"), /* @__PURE__ */ React.createElement(TableHead, { className: "w-[150px] text-right text-[10px] uppercase font-black h-10 pr-6" }, "Hor\xE1rio"))), /* @__PURE__ */ React.createElement(TableBody, { className: "font-mono text-[11px]" }, logs.length > 0 ? logs.map((log) => /* @__PURE__ */ React.createElement(TableRow, { key: log.id, className: "border-border/20 hover:bg-accent/10" }, /* @__PURE__ */ React.createElement(TableCell, { className: "text-center" }, /* @__PURE__ */ React.createElement(
    Badge,
    {
      variant: log.type === "error" ? "destructive" : log.type === "warning" ? "secondary" : "default",
      className: cn(
        "w-12 justify-center text-[9px] font-black",
        log.type === "success" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
        log.type === "warning" && "bg-amber-500/10 text-amber-500 border-amber-500/30"
      )
    },
    log.status
  )), /* @__PURE__ */ React.createElement(TableCell, { className: "font-black" }, log.method), /* @__PURE__ */ React.createElement(TableCell, { className: "text-primary/70" }, log.path), /* @__PURE__ */ React.createElement(TableCell, { className: "text-right text-muted-foreground" }, log.duration, "ms"), /* @__PURE__ */ React.createElement(TableCell, { className: "text-right text-muted-foreground pr-6 flex items-center justify-end gap-1.5 h-12" }, /* @__PURE__ */ React.createElement(Clock, { className: "h-3 w-3 opacity-50" }), new Date(log.timestamp).toLocaleTimeString("pt-BR")))) : /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, { colSpan: 5, className: "h-40 text-center italic text-muted-foreground uppercase text-[10px] tracking-widest opacity-40" }, "Sem atividade."))))))), /* @__PURE__ */ React.createElement(TabsContent, { value: "console" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement(Card, { className: "bg-sidebar/50 border-border/50" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "border-b border-border/30" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-sm font-bold uppercase tracking-widest flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Activity, { className: "h-4 w-4" }), " Requisi\xE7\xE3o Manual")), /* @__PURE__ */ React.createElement(CardContent, { className: "space-y-6 pt-6" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("label", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground" }, "Endpoint Virtual"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex items-center px-4 border border-border/50 rounded-md bg-black/40 text-muted-foreground text-xs font-mono overflow-hidden" }, /* @__PURE__ */ React.createElement("span", { className: "shrink-0 select-none opacity-50" }, "/api/nexus/"), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "bg-transparent border-none outline-none text-foreground ml-1 flex-1 min-w-0 h-10",
      value: testPath,
      onChange: (e) => setTestTestPath(e.target.value),
      placeholder: "ex: users",
      onKeyDown: (e) => e.key === "Enter" && runTest()
    }
  ), testPath && /* @__PURE__ */ React.createElement("button", { onClick: () => setTestTestPath(""), className: "ml-2 opacity-50 hover:opacity-100" }, /* @__PURE__ */ React.createElement(X, { className: "h-4 w-4" }))), /* @__PURE__ */ React.createElement(Button, { onClick: runTest, disabled: isTesting || !testPath.trim(), className: "h-10 bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] px-6" }, isTesting ? "AGUARDE..." : "EXECUTAR", /* @__PURE__ */ React.createElement(Play, { className: "ml-2 h-3 w-3" })))))), /* @__PURE__ */ React.createElement(Card, { className: "bg-zinc-950 border-border/50 flex flex-col tui-scanline" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "border-b border-border/30 flex flex-row items-center justify-between" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Code, { className: "h-4 w-4" }), " Network Response"), testResult && /* @__PURE__ */ React.createElement(Badge, { variant: "outline", className: cn(
    "text-[9px] font-black",
    testResult.status < 400 ? "text-emerald-500 border-emerald-500/30" : "text-destructive border-destructive/30"
  ) }, testResult.status, " ", testResult.status === 200 ? "OK" : "FAIL", " // ", testResult.duration)), /* @__PURE__ */ React.createElement(CardContent, { className: "flex-1 p-0 overflow-hidden" }, /* @__PURE__ */ React.createElement(ScrollArea, { className: "h-[400px] w-full" }, /* @__PURE__ */ React.createElement("div", { className: "p-6" }, testResult ? /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "p-3 bg-black/40 rounded border border-border/20 text-[10px] font-mono grid grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("span", null, "Status:"), " ", /* @__PURE__ */ React.createElement("span", { className: "text-primary" }, testResult.status)), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("span", null, "Tempo:"), " ", /* @__PURE__ */ React.createElement("span", { className: "text-emerald-500" }, testResult.duration))), /* @__PURE__ */ React.createElement("pre", { className: "text-[11px] font-mono text-primary/80 bg-black/40 p-4 rounded border border-border/20" }, JSON.stringify(testResult.payload || testResult, null, 2))) : /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center h-[300px] text-zinc-700 italic text-sm gap-4" }, /* @__PURE__ */ React.createElement(Search, { className: "h-10 w-10 opacity-20" }), /* @__PURE__ */ React.createElement("span", { className: "uppercase text-[10px] font-bold tracking-[0.2em] opacity-30" }, "Aguardando Execu\xE7\xE3o..."))))))))));
}
export {
  NexusControlPage as default
};
