"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { FileImage } from "lucide-react";
const formSchema = z.object({
  description: z.string().min(20, "A descri\xE7\xE3o do sinistro \xE9 obrigat\xF3ria e precisa ser detalhada."),
  location: z.string().min(5, "O local do incidente \xE9 obrigat\xF3rio."),
  incidentDate: z.string().min(1, "A data e hora s\xE3o obrigat\xF3rias."),
  photos: z.any().optional()
});
function ReportIncidentForm({ schedule, onFormSubmit }) {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      location: "",
      incidentDate: (/* @__PURE__ */ new Date()).toISOString().substring(0, 16)
    }
  });
  const onSubmit = (values) => {
    if (!schedule) return;
    console.log({
      scheduleId: schedule.id,
      vehicle: schedule.vehicle,
      driver: schedule.driver,
      ...values
    });
    toast({
      title: "Relat\xF3rio de Sinistro Enviado",
      description: `Seu relat\xF3rio foi registrado. A gest\xE3o ser\xE1 notificada.`,
      variant: "destructive"
    });
    onFormSubmit();
    form.reset();
  };
  return /* @__PURE__ */ React.createElement(Form, { ...form }, /* @__PURE__ */ React.createElement("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6 mt-4 p-4" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "incidentDate",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Data e Hora do Incidente"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "datetime-local", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "location",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Localiza\xE7\xE3o do Incidente"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "Ex: Esquina da Av. Brasil com a Rua das Flores", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "description",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Descri\xE7\xE3o Detalhada do Ocorrido"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(
        Textarea,
        {
          placeholder: "Descreva o que aconteceu, os danos, se h\xE1 terceiros envolvidos, etc.",
          className: "resize-none",
          rows: 6,
          ...field
        }
      )), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "photos",
      render: ({ field: { value, onChange, ...fieldProps } }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Anexar Fotos"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(FileImage, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" }), /* @__PURE__ */ React.createElement(
        Input,
        {
          type: "file",
          accept: "image/*",
          multiple: true,
          onChange: (event) => onChange(event.target.files),
          className: "pl-10",
          ...fieldProps
        }
      ))), /* @__PURE__ */ React.createElement(FormDescription, null, "Anexe fotos dos danos, do local, e dos documentos (se houver)."), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "flex justify-end pt-4" }, /* @__PURE__ */ React.createElement(Button, { type: "submit", variant: "destructive", className: "w-full md:w-auto" }, "Enviar Relat\xF3rio de Sinistro"))));
}
export {
  ReportIncidentForm
};
