"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
const formSchema = z.object({
  vehicleModel: z.string().min(3, "O modelo do ve\xEDculo \xE9 obrigat\xF3rio."),
  licensePlate: z.string().min(7, "A placa deve ter o formato ABC-1234.").max(8),
  sector: z.string().min(3, "O setor respons\xE1vel \xE9 obrigat\xF3rio."),
  mileage: z.coerce.number().min(0, "A quilometragem n\xE3o pode ser negativa."),
  vehicleRegistration: z.any().optional(),
  vehicleInspection: z.any().optional()
});
function RegisterVehicleForm({ onFormSubmit, existingVehicle }) {
  const { toast } = useToast();
  const isEditMode = !!existingVehicle;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleModel: "",
      licensePlate: "",
      sector: "",
      mileage: 0
    }
  });
  useEffect(() => {
    if (isEditMode) {
      form.reset({
        vehicleModel: existingVehicle.vehicleModel,
        licensePlate: existingVehicle.licensePlate,
        sector: existingVehicle.sector,
        mileage: existingVehicle.mileage
      });
    }
  }, [isEditMode, existingVehicle, form]);
  const onSubmit = (values) => {
    onFormSubmit(values);
    toast({
      title: isEditMode ? "Ve\xEDculo Atualizado" : "Cadastro de Ve\xEDculo Enviado",
      description: `O ve\xEDculo foi ${isEditMode ? "atualizado" : "adicionado \xE0 frota"}.`
    });
    form.reset();
  };
  return /* @__PURE__ */ React.createElement(Form, { ...form }, /* @__PURE__ */ React.createElement("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-8 mt-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold mb-4" }, "Informa\xE7\xF5es do Ve\xEDculo"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "vehicleModel",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Modelo do Ve\xEDculo"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "Ex: Fiat Strada 2023", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "licensePlate",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Placa do Ve\xEDculo"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "ABC-1234", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "sector",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Setor Respons\xE1vel"), /* @__PURE__ */ React.createElement(Select, { onValueChange: field.onChange, value: field.value }, /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(SelectTrigger, null, /* @__PURE__ */ React.createElement(SelectValue, { placeholder: "Selecione o setor" }))), /* @__PURE__ */ React.createElement(SelectContent, null, /* @__PURE__ */ React.createElement(SelectItem, { value: "Secretaria de Sa\xFAde" }, "Secretaria de Sa\xFAde"), /* @__PURE__ */ React.createElement(SelectItem, { value: "Secretaria de Educa\xE7\xE3o" }, "Secretaria de Educa\xE7\xE3o"), /* @__PURE__ */ React.createElement(SelectItem, { value: "Secretaria de Obras" }, "Secretaria de Obras"), /* @__PURE__ */ React.createElement(SelectItem, { value: "Administra\xE7\xE3o" }, "Administra\xE7\xE3o"), /* @__PURE__ */ React.createElement(SelectItem, { value: "Vigil\xE2ncia Sanit\xE1ria" }, "Vigil\xE2ncia Sanit\xE1ria"))), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "mileage",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Quilometragem"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "number", placeholder: "0", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ))), /* @__PURE__ */ React.createElement(Separator, null), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold mb-4" }, "Documenta\xE7\xE3o"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "vehicleRegistration",
      render: ({ field: { value, onChange, ...fieldProps } }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "CRLV do Ve\xEDculo"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "file", accept: "image/*,application/pdf", onChange: (event) => onChange(event.target.files), ...fieldProps })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "vehicleInspection",
      render: ({ field: { value, onChange, ...fieldProps } }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Certificado de Inspe\xE7\xE3o"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "file", accept: "image/*,application/pdf", onChange: (event) => onChange(event.target.files), ...fieldProps })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-end" }, /* @__PURE__ */ React.createElement(Button, { type: "submit", className: "w-full md:w-auto bg-accent hover:bg-accent/90" }, isEditMode ? "Salvar Altera\xE7\xF5es" : "Enviar Cadastro"))));
}
export {
  RegisterVehicleForm
};
