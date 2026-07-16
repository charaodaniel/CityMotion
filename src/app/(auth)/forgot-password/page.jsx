"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/app-provider";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, ArrowLeft, Loader2, Info, MailCheck } from "lucide-react";
import Link from "next/link";
function ForgotPasswordPage() {
  const router = useRouter();
  const { requestPasswordRecovery } = useApp();
  const { toast } = useToast();
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setIsLoading(true);
    try {
      await requestPasswordRecovery(identifier);
      toast({
        title: "Protocolo Iniciado",
        description: "Um c\xF3digo de recupera\xE7\xE3o foi enviado para seu e-mail cadastrado."
      });
      setEmailSent(true);
      setTimeout(() => {
        router.push(`/reset-password?id=${encodeURIComponent(identifier)}`);
      }, 4e3);
    } catch (error) {
      toast({
        title: "Falha na Solicita\xE7\xE3o",
        description: error.message || "Usu\xE1rio n\xE3o localizado no sistema.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex min-h-screen items-center justify-center bg-background p-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-md space-y-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center text-center space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "bg-primary/10 text-primary p-3 rounded-full mb-2" }, /* @__PURE__ */ React.createElement(KeyRound, { className: "h-8 w-8" })), /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold tracking-tight" }, "Recuperar Acesso"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground" }, "Informe seus dados para receber o protocolo de redefini\xE7\xE3o.")), /* @__PURE__ */ React.createElement(Card, { className: "border-border/50 bg-sidebar/50" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-lg" }, "Protocolo de Seguran\xE7a"), /* @__PURE__ */ React.createElement(CardDescription, null, "Insira o e-mail corporativo ou sua matr\xEDcula.")), /* @__PURE__ */ React.createElement(CardContent, null, !emailSent ? /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "id" }, "Identificador"), /* @__PURE__ */ React.createElement(
    Input,
    {
      id: "id",
      placeholder: "Ex: admin@citymotion.com ou MAT-001",
      value: identifier,
      onChange: (e) => setIdentifier(e.target.value),
      disabled: isLoading,
      required: true
    }
  )), /* @__PURE__ */ React.createElement(Button, { type: "submit", className: "w-full h-11 font-bold uppercase tracking-widest text-[10px]", disabled: isLoading }, isLoading ? /* @__PURE__ */ React.createElement(Loader2, { className: "h-4 w-4 animate-spin mr-2" }) : "Gerar C\xF3digo de Acesso")) : /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center text-center py-6 space-y-4 animate-in fade-in zoom-in duration-500" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center" }, /* @__PURE__ */ React.createElement(MailCheck, { className: "h-8 w-8" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "font-bold text-lg" }, "E-mail Despachado!"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground mt-1" }, "Verifique sua caixa de entrada (e pasta de spam) para obter o c\xF3digo de 6 d\xEDgitos.")), /* @__PURE__ */ React.createElement("div", { className: "w-full h-1 bg-emerald-500/20 rounded-full overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "h-full bg-emerald-500 animate-progress origin-left", style: { animationDuration: "4s" } })), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-muted-foreground uppercase tracking-widest" }, "Redirecionando para a valida\xE7\xE3o..."))), /* @__PURE__ */ React.createElement(CardFooter, null, /* @__PURE__ */ React.createElement(Button, { variant: "ghost", className: "w-full text-xs", asChild: true }, /* @__PURE__ */ React.createElement(Link, { href: "/login" }, /* @__PURE__ */ React.createElement(ArrowLeft, { className: "h-3 w-3 mr-2" }), " Voltar ao Login")))), /* @__PURE__ */ React.createElement("div", { className: "bg-muted/30 p-4 rounded-lg flex items-start gap-3 border border-border/30" }, /* @__PURE__ */ React.createElement(Info, { className: "h-5 w-5 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-muted-foreground leading-relaxed italic" }, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "Dica de Desenvolvimento:")), /* @__PURE__ */ React.createElement("p", null, "Como estamos em modo de demonstra\xE7\xE3o, o backend exibir\xE1 um link no terminal para voc\xEA visualizar o e-mail enviado sem precisar de um servidor SMTP real.")))), /* @__PURE__ */ React.createElement("style", { jsx: true, global: true }, `
        @keyframes progress {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
        }
        .animate-progress {
            animation: progress linear forwards;
        }
      `));
}
export {
  ForgotPasswordPage as default
};
