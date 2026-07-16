"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/app-provider";
import { CarFront, LogIn, Users, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const { toast } = useToast();
  const [email, setEmail] = useState("admin@citymotion.com");
  const [password, setPassword] = useState("123456");
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password, true);
    } catch (error) {
      toast({
        title: "Erro no Acesso",
        description: error.message || "N\xE3o foi poss\xEDvel realizar o login.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSimulatedLogin = (simulatedEmail, simulatedPass = "123456") => {
    setEmail(simulatedEmail);
    setPassword(simulatedPass);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex min-h-screen items-center justify-center bg-background p-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-md space-y-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-center" }, /* @__PURE__ */ React.createElement(Link, { href: "/home", className: "flex items-center gap-3 text-foreground" }, /* @__PURE__ */ React.createElement("div", { className: "bg-foreground text-background p-2.5 rounded-lg" }, /* @__PURE__ */ React.createElement(CarFront, { className: "h-7 w-7" })), /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold tracking-tighter" }, "CityMotion"))), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-2xl" }, "Acessar o Painel"), /* @__PURE__ */ React.createElement(CardDescription, null, "Entre com suas credenciais para gerenciar a frota da sua organiza\xE7\xE3o.")), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement("form", { onSubmit: handleLogin, className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "email" }, "Identificador"), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
    Input,
    {
      id: "email",
      type: "text",
      placeholder: "E-mail, Matr\xEDcula ou Telefone",
      required: true,
      value: email,
      onChange: (e) => setEmail(e.target.value),
      disabled: isLoading,
      className: "pr-10"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 opacity-20" }, /* @__PURE__ */ React.createElement(Users, { className: "h-4 w-4" })))), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "password" }, "Senha"), /* @__PURE__ */ React.createElement(Link, { href: "/forgot-password", className: "text-sm text-primary hover:underline font-medium" }, "Esqueceu sua senha?")), /* @__PURE__ */ React.createElement(
    Input,
    {
      id: "password",
      type: "password",
      required: true,
      value: password,
      onChange: (e) => setPassword(e.target.value),
      disabled: isLoading
    }
  )), /* @__PURE__ */ React.createElement(Button, { type: "submit", className: "w-full h-11 font-bold uppercase tracking-widest text-xs", disabled: isLoading }, isLoading ? /* @__PURE__ */ React.createElement(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ React.createElement(LogIn, { className: "mr-2 h-4 w-4" }), "Entrar no Sistema")))), /* @__PURE__ */ React.createElement(Card, { className: "bg-muted/50 border-dashed" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "pb-2" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-sm font-semibold flex items-center" }, /* @__PURE__ */ React.createElement(Users, { className: "mr-2 h-4 w-4" }), "MODO DEMONSTRA\xC7\xC3O (Perfis SaaS)")), /* @__PURE__ */ React.createElement(CardContent, { className: "text-xs space-y-1.5 pt-2" }, /* @__PURE__ */ React.createElement("p", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement(ShieldCheck, { className: "h-3 w-3 text-amber-500" }), /* @__PURE__ */ React.createElement("strong", null, "Desenvolvedor Root:"), /* @__PURE__ */ React.createElement("button", { onClick: () => handleSimulatedLogin("dev@dev.com", "123456789"), className: "text-primary hover:underline ml-1" }, "dev@dev.com")), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "Admin Geral:"), " ", /* @__PURE__ */ React.createElement("button", { onClick: () => handleSimulatedLogin("admin@citymotion.com"), className: "text-primary hover:underline" }, "admin@citymotion.com")), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "Motorista:"), " ", /* @__PURE__ */ React.createElement("button", { onClick: () => handleSimulatedLogin("driver@citymotion.com"), className: "text-primary hover:underline" }, "driver@citymotion.com")))), /* @__PURE__ */ React.createElement("p", { className: "px-8 text-center text-xs text-muted-foreground" }, "Ao acessar o sistema, voc\xEA concorda com nossos", " ", /* @__PURE__ */ React.createElement("a", { href: "#", className: "underline underline-offset-4 hover:text-primary" }, "Termos de Uso"), " e", " ", /* @__PURE__ */ React.createElement("a", { href: "#", className: "underline underline-offset-4 hover:text-primary" }, "Privacidade"), ".")));
}
export {
  LoginPage as default
};
