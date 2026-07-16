"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, ShieldCheck } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { useApp } from "@/contexts/app-provider";
import Link from "next/link";
const formSchema = z.object({
  title: z.string().min(1, "O motivo da viagem \xE9 obrigat\xF3rio."),
  sector: z.string().min(1, "O setor solicitante \xE9 obrigat\xF3rio."),
  destination: z.string().optional(),
  departureDate: z.date().optional(),
  departureTime: z.string().optional(),
  details: z.string().optional()
});
function QuickRequestForm({ onFormSubmit }) {
  const { toast } = useToast();
  const { addVehicleRequest, sectors } = useApp();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      sector: "",
      destination: "",
      departureTime: "",
      details: ""
    }
  });
  const onSubmit = (values) => {
    const requestData = {
      title: values.title,
      sector: values.sector,
      details: `${values.destination ? `Destino: ${values.destination}. ` : ""}${values.details || ""}`
    };
    addVehicleRequest(requestData);
    toast({
      title: "Pedido Enviado!",
      description: "Sua solicita\xE7\xE3o foi enviada. O gestor do setor ser\xE1 notificado."
    });
    onFormSubmit();
    form.reset();
  };
  return /* @__PURE__ */ React.createElement(Form, { ...form }, /* @__PURE__ */ React.createElement("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "sector",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Seu Setor / Unidade"), /* @__PURE__ */ React.createElement(Select, { onValueChange: field.onChange, value: field.value }, /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(SelectTrigger, null, /* @__PURE__ */ React.createElement(SelectValue, { placeholder: "Selecione o seu setor" }))), /* @__PURE__ */ React.createElement(SelectContent, null, sectors.map((sector) => /* @__PURE__ */ React.createElement(SelectItem, { key: sector.id, value: sector.name }, sector.name)))), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "title",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Motivo da Viagem / Trabalho"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "Ex: Levar documentos ao F\xF3rum ou Visita t\xE9cnica", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "destination",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Destino"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "Endere\xE7o ou local de destino", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "departureDate",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, { className: "flex flex-col" }, /* @__PURE__ */ React.createElement(FormLabel, null, "Data Desejada"), /* @__PURE__ */ React.createElement(Popover, null, /* @__PURE__ */ React.createElement(PopoverTrigger, { asChild: true }, /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(
        Button,
        {
          variant: "outline",
          className: cn(
            "pl-3 text-left font-normal",
            !field.value && "text-muted-foreground"
          )
        },
        field.value ? format(field.value, "dd/MM/yyyy") : /* @__PURE__ */ React.createElement("span", null, "Escolha uma data"),
        /* @__PURE__ */ React.createElement(CalendarIcon, { className: "ml-auto h-4 w-4 opacity-50" })
      ))), /* @__PURE__ */ React.createElement(PopoverContent, { className: "w-auto p-0", align: "start" }, /* @__PURE__ */ React.createElement(Calendar, { mode: "single", selected: field.value, onSelect: field.onChange, initialFocus: true }))), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "departureTime",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Hor\xE1rio"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "time", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  )), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "details",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Observa\xE7\xF5es Adicionais"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(
        Textarea,
        {
          placeholder: "Alguma informa\xE7\xE3o adicional importante?",
          className: "resize-none",
          ...field
        }
      )), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "bg-muted/50 p-3 rounded-lg flex items-start gap-2 border" }, /* @__PURE__ */ React.createElement(ShieldCheck, { className: "h-4 w-4 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-muted-foreground leading-tight" }, "Os dados geogr\xE1ficos e motivos de viagem informados s\xE3o coletados exclusivamente para fins de auditoria e otimiza\xE7\xE3o log\xEDstica da organiza\xE7\xE3o, em conformidade com a ", /* @__PURE__ */ React.createElement(Link, { href: "/privacy", className: "underline" }, "Pol\xEDtica de Privacidade (LGPD)"), ".")), /* @__PURE__ */ React.createElement(Button, { type: "submit", className: "w-full bg-primary hover:bg-primary/90" }, "Enviar Pedido de Transporte")));
}
export {
  QuickRequestForm
};
