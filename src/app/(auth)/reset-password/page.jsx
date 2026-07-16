"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/app-provider";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useApp();
  const { toast } = useToast();
  const [identifier, setIdentifier] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  useEffect(() => {
    const idParam = searchParams.get("id");
    if (idParam) setIdentifier(idParam);
  }, [searchParams]);
  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast({
        title: "Erro de Valida\xE7\xE3o",
        description: "As senhas n\xE3o coincidem.",
        variant: "destructive"
      });
    }
    if (newPassword.length < 6) {
      return toast({
        title: "Seguran\xE7a Fraca",
        description: "A senha deve ter no m\xEDnimo 6 caracteres.",
        variant: "destructive"
      });
    }
    setIsLoading(true);
    try {
      await resetPassword(identifier, token, newPassword);
      toast({
        title: "Senha Redefinida!",
        description: "Seu acesso foi atualizado. Use sua nova senha para entrar."
      });
      router.push("/login");
    } catch (error) {
      toast({
        title: "Falha na Redefini\xE7\xE3o",
        description: error.message || "C\xF3digo inv\xE1lido ou expirado.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex min-h-screen items-center justify-center bg-background p-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-md space-y-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center text-center space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "bg-emerald-500/10 text-emerald-500 p-3 rounded-full mb-2 border border-emerald-500/20" }, /* @__PURE__ */ React.createElement(ShieldCheck, { className: "h-8 w-8" })), /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold tracking-tight" }, "Redefinir Senha"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground" }, "Insira o protocolo e escolha sua nova credencial.")), /* @__PURE__ */ React.createElement(Card, { className: "border-border/50 bg-sidebar/50" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-lg" }, "Nova Credencial"), /* @__PURE__ */ React.createElement(CardDescription, null, "Para o usu\xE1rio: ", /* @__PURE__ */ React.createElement("span", { className: "text-foreground font-bold" }, identifier))), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement("form", { onSubmit: handleReset, className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "token" }, "C\xF3digo de 6 D\xEDgitos"), /* @__PURE__ */ React.createElement(
    Input,
    {
      id: "token",
      placeholder: "000000",
      className: "text-center text-2xl font-black tracking-[0.5em] h-14",
      maxLength: 6,
      value: token,
      onChange: (e) => setToken(e.target.value),
      disabled: isLoading,
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "space-y-4 pt-2" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "pass" }, "Nova Senha"), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
    Input,
    {
      id: "pass",
      type: showPass ? "text" : "password",
      placeholder: "M\xEDnimo 6 caracteres",
      value: newPassword,
      onChange: (e) => setNewPassword(e.target.value),
      disabled: isLoading,
      required: true
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100",
      onClick: () => setShowPass(!showPass)
    },
    showPass ? /* @__PURE__ */ React.createElement(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ React.createElement(Eye, { className: "h-4 w-4" })
  ))), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "confirm" }, "Confirmar Nova Senha"), /* @__PURE__ */ React.createElement(
    Input,
    {
      id: "confirm",
      type: showPass ? "text" : "password",
      placeholder: "Repita a senha",
      value: confirmPassword,
      onChange: (e) => setConfirmPassword(e.target.value),
      disabled: isLoading,
      required: true
    }
  ))), /* @__PURE__ */ React.createElement(Button, { type: "submit", className: "w-full h-11 font-bold uppercase tracking-widest text-[10px] bg-emerald-500 hover:bg-emerald-600 text-white", disabled: isLoading }, isLoading ? /* @__PURE__ */ React.createElement(Loader2, { className: "h-4 w-4 animate-spin mr-2" }) : "Atualizar Acesso"))), /* @__PURE__ */ React.createElement(CardFooter, null, /* @__PURE__ */ React.createElement(Button, { variant: "ghost", className: "w-full text-xs", asChild: true }, /* @__PURE__ */ React.createElement(Link, { href: "/login" }, /* @__PURE__ */ React.createElement(ArrowLeft, { className: "h-3 w-3 mr-2" }), " Cancelar e Voltar"))))));
}
export {
  ResetPasswordPage as default
};
