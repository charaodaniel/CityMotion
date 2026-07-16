"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/contexts/app-provider";
const formSchema = z.object({
  type: z.string().min(1, "O tipo de manuten\xE7\xE3o \xE9 obrigat\xF3rio."),
  description: z.string().min(10, "A descri\xE7\xE3o deve ter pelo menos 10 caracteres.")
});
function RequestMaintenanceForm({ vehicle, onFormSubmit }) {
  const { toast } = useToast();
  const { addMaintenanceRequest } = useApp();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      description: ""
    }
  });
  const onSubmit = (values) => {
    if (!vehicle) return;
    addMaintenanceRequest({
      vehicleId: vehicle.id,
      vehicleModel: vehicle.vehicleModel,
      licensePlate: vehicle.licensePlate,
      type: values.type,
      description: values.description
    });
    toast({
      title: "Solicita\xE7\xE3o Enviada!",
      description: "O pedido de manuten\xE7\xE3o foi registrado e ser\xE1 analisado pela equipe respons\xE1vel."
    });
    onFormSubmit();
    form.reset();
  };
  const maintenanceTypes = ["Manuten\xE7\xE3o Corretiva", "Revis\xE3o Preventiva"];
  return /* @__PURE__ */ React.createElement(Form, { ...form }, /* @__PURE__ */ React.createElement("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6 mt-4" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "type",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Tipo de Solicita\xE7\xE3o"), /* @__PURE__ */ React.createElement(Select, { onValueChange: field.onChange, value: field.value }, /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(SelectTrigger, null, /* @__PURE__ */ React.createElement(SelectValue, { placeholder: "Selecione o tipo de manuten\xE7\xE3o" }))), /* @__PURE__ */ React.createElement(SelectContent, null, maintenanceTypes.map((type) => /* @__PURE__ */ React.createElement(SelectItem, { key: type, value: type }, type)))), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "description",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Motivo/Descri\xE7\xE3o"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(
        Textarea,
        {
          placeholder: "Descreva o problema ou o servi\xE7o necess\xE1rio. Ex: 'Barulho estranho no motor ao ligar' ou 'Troca de \xF3leo e filtros'.",
          className: "resize-none",
          rows: 5,
          ...field
        }
      )), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(Button, { type: "submit", className: "w-full bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest text-[10px] h-10" }, "Enviar Solicita\xE7\xE3o de Manuten\xE7\xE3o")));
}
export {
  RequestMaintenanceForm
};
