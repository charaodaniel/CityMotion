"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Settings2, Building2, Server } from "lucide-react";
import { useApp } from "@/contexts/app-provider";
import { InfrastructurePanel } from "@/components/infrastructure-panel";
const settingsSchema = z.object({
  organizationName: z.string().min(3, "Nome obrigat\xF3rio"),
  defaultRequestPriority: z.enum(["Baixa", "M\xE9dia", "Alta"]),
  requireDestination: z.boolean()
});
function SettingsPage() {
  const { toast } = useToast();
  const { userRole } = useApp();
  const form = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      organizationName: "Inst\xE2ncia Local CityMotion",
      defaultRequestPriority: "M\xE9dia",
      requireDestination: true
    }
  });
  const onSubmit = (values) => {
    toast({
      title: "Configura\xE7\xF5es Salvas",
      description: "As regras de neg\xF3cio foram atualizadas com sucesso."
    });
  };
  return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto p-4 sm:p-8 space-y-8 pb-20" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-2" }, /* @__PURE__ */ React.createElement("h1", { className: "text-4xl font-black tracking-tighter flex items-center gap-4 text-on-surface" }, /* @__PURE__ */ React.createElement(Settings2, { className: "h-10 w-10 text-primary" }), "Configura\xE7\xF5es"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground font-medium text-lg" }, "Gerencie regras de neg\xF3cio e infraestrutura do sistema.")), /* @__PURE__ */ React.createElement(Tabs, { defaultValue: "operations", className: "space-y-6" }, /* @__PURE__ */ React.createElement(TabsList, { className: "bg-sidebar border border-border/50 p-1 w-full lg:w-fit justify-start h-auto gap-1" }, /* @__PURE__ */ React.createElement(TabsTrigger, { value: "operations", className: "text-[10px] font-bold uppercase tracking-widest px-6 gap-1.5" }, /* @__PURE__ */ React.createElement(Building2, { className: "h-3 w-3" }), " Opera\xE7\xF5es"), /* @__PURE__ */ React.createElement(TabsTrigger, { value: "infrastructure", className: "text-[10px] font-bold uppercase tracking-widest px-6 gap-1.5" }, /* @__PURE__ */ React.createElement(Server, { className: "h-3 w-3" }), " Infraestrutura")), /* @__PURE__ */ React.createElement(TabsContent, { value: "operations" }, /* @__PURE__ */ React.createElement(Form, { ...form }, /* @__PURE__ */ React.createElement("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6" }, /* @__PURE__ */ React.createElement(Card, { className: "bg-sidebar/50 border-border/50" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-sm uppercase tracking-widest text-primary" }, "Regras de Neg\xF3cio"), /* @__PURE__ */ React.createElement(CardDescription, { className: "text-xs" }, "Configura\xE7\xF5es gerais de opera\xE7\xE3o da organiza\xE7\xE3o.")), /* @__PURE__ */ React.createElement(CardContent, { className: "space-y-6" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "organizationName",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Nome da Unidade / Prefeitura"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { className: "bg-black/20", ...field })))
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "defaultRequestPriority",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Prioridade Padr\xE3o"), /* @__PURE__ */ React.createElement(Select, { onValueChange: field.onChange, value: field.value }, /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(SelectTrigger, null, /* @__PURE__ */ React.createElement(SelectValue, null))), /* @__PURE__ */ React.createElement(SelectContent, null, /* @__PURE__ */ React.createElement(SelectItem, { value: "Baixa" }, "Baixa"), /* @__PURE__ */ React.createElement(SelectItem, { value: "M\xE9dia" }, "M\xE9dia"), /* @__PURE__ */ React.createElement(SelectItem, { value: "Alta" }, "Alta"))))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "requireDestination",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, { className: "flex items-center justify-between p-4 border rounded-lg bg-black/20 mt-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(FormLabel, null, "Exigir Destino"), /* @__PURE__ */ React.createElement(FormDescription, { className: "text-[10px]" }, "Obriga o preenchimento detalhado.")), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Switch, { checked: field.value, onCheckedChange: field.onChange })))
    }
  )))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-end pt-8 border-t border-border/30" }, /* @__PURE__ */ React.createElement(Button, { type: "submit", className: "h-12 px-12 bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/20" }, "Salvar Configura\xE7\xF5es"))))), /* @__PURE__ */ React.createElement(TabsContent, { value: "infrastructure" }, /* @__PURE__ */ React.createElement(InfrastructurePanel, null))));
}
export {
  SettingsPage as default
};
