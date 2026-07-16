"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
const formSchema = z.object({
  name: z.string().min(3, "O nome do setor \xE9 obrigat\xF3rio."),
  description: z.string().optional()
});
function RegisterSectorForm({ onFormSubmit, existingSector }) {
  const { toast } = useToast();
  const isEditMode = !!existingSector;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  });
  useEffect(() => {
    if (isEditMode && existingSector) {
      form.reset({
        name: existingSector.name || "",
        description: existingSector.description || ""
      });
    }
  }, [isEditMode, existingSector, form]);
  const onSubmit = (values) => {
    onFormSubmit(values);
    toast({
      title: isEditMode ? "Setor Atualizado" : "Setor Cadastrado",
      description: `O setor foi ${isEditMode ? "atualizado" : "adicionado"} com sucesso.`
    });
    form.reset();
  };
  return /* @__PURE__ */ React.createElement(Form, { ...form }, /* @__PURE__ */ React.createElement("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6 mt-4" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "name",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Nome do Setor"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "Ex: Secretaria de Finan\xE7as", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "description",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Descri\xE7\xE3o (Opcional)"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(
        Textarea,
        {
          placeholder: "Descreva brevemente a fun\xE7\xE3o do setor.",
          className: "resize-none",
          ...field
        }
      )), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "flex justify-end" }, /* @__PURE__ */ React.createElement(Button, { type: "submit", className: "w-full md:w-auto bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs h-10" }, isEditMode ? "Salvar Altera\xE7\xF5es" : "Salvar Setor"))));
}
export {
  RegisterSectorForm
};
