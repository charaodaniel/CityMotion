"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
const formSchema = z.object({
  partName: z.string().min(3, "O nome da pe\xE7a \xE9 obrigat\xF3rio."),
  quantity: z.coerce.number().min(1, "A quantidade deve ser de pelo menos 1."),
  supplier: z.string().optional(),
  justification: z.string().min(10, "A justificativa \xE9 obrigat\xF3ria e deve ter pelo menos 10 caracteres.")
});
function RequestPartForm({ maintenanceRequest, onFormSubmit }) {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partName: "",
      quantity: 1,
      supplier: "",
      justification: ""
    }
  });
  const onSubmit = (values) => {
    if (!maintenanceRequest) return;
    console.log({
      maintenanceRequestId: maintenanceRequest.id,
      vehicle: `${maintenanceRequest.vehicleModel} (${maintenanceRequest.licensePlate})`,
      ...values
    });
    toast({
      title: "Pedido de Pe\xE7a Enviado!",
      description: `O pedido da pe\xE7a "${values.partName}" foi enviado para o setor de compras.`
    });
    onFormSubmit();
    form.reset();
  };
  return /* @__PURE__ */ React.createElement(Form, { ...form }, /* @__PURE__ */ React.createElement("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6 mt-4" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "md:col-span-2" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "partName",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Nome da Pe\xE7a / Componente"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "Ex: Pastilha de freio dianteira", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  )), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "quantity",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Quantidade"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "number", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  )), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "supplier",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Fornecedor (Opcional)"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "Ex: Autope\xE7as do Bairro", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "justification",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Justificativa da Necessidade"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(
        Textarea,
        {
          placeholder: "Descreva por que esta pe\xE7a \xE9 essencial para a conclus\xE3o da manuten\xE7\xE3o.",
          className: "resize-none",
          rows: 4,
          ...field
        }
      )), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(Button, { type: "submit", className: "w-full bg-primary hover:bg-primary/90" }, "Enviar Pedido de Compra")));
}
export {
  RequestPartForm
};
