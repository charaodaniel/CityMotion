"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import { useApp } from "@/contexts/app-provider";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, Phone } from "lucide-react";
import Link from "next/link";
const formSchema = z.object({
  name: z.string().min(2, "O nome completo deve ter pelo menos 2 caracteres."),
  matricula: z.string().min(1, "A matr\xEDcula \xE9 obrigat\xF3ria."),
  email: z.string().email("Por favor, insira um email v\xE1lido."),
  phone: z.string().optional(),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres.").optional().or(z.literal("")),
  role: z.string().min(1, "O cargo \xE9 obrigat\xF3rio."),
  cnh: z.string().optional(),
  sector: z.array(z.string()).min(1, "Selecione ao menos um setor."),
  idPhoto: z.any().optional(),
  cnhPhoto: z.any().optional(),
  lgpdConsent: z.boolean().refine((val) => val === true, "\xC9 necess\xE1rio aceitar os termos de uso de dados.")
});
function RegisterEmployeeForm({ onFormSubmit, existingEmployee }) {
  const { toast } = useToast();
  const { sectors } = useApp();
  const isEditMode = !!existingEmployee;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      matricula: "",
      email: "",
      phone: "",
      password: "",
      role: "",
      cnh: "",
      sector: [],
      lgpdConsent: isEditMode
    }
  });
  useEffect(() => {
    if (isEditMode && existingEmployee) {
      form.reset({
        name: existingEmployee.name || "",
        matricula: existingEmployee.matricula || "",
        email: existingEmployee.email || "",
        phone: existingEmployee.phone || "",
        role: existingEmployee.role || "",
        cnh: existingEmployee.cnh || "",
        sector: Array.isArray(existingEmployee.sector) ? existingEmployee.sector : [],
        lgpdConsent: true
      });
    }
  }, [isEditMode, existingEmployee, form]);
  const onSubmit = (values) => {
    const { lgpdConsent, ...rest } = values;
    const dataToSubmit = {
      ...rest,
      idPhoto: values.idPhoto?.[0]?.name || existingEmployee?.idPhoto,
      cnhPhoto: values.cnhPhoto?.[0]?.name || existingEmployee?.cnhPhoto
    };
    if (!dataToSubmit.password) {
      delete dataToSubmit.password;
    }
    onFormSubmit(dataToSubmit);
    toast({
      title: isEditMode ? "Cadastro Atualizado" : "Cadastro Enviado",
      description: `O cadastro do colaborador foi ${isEditMode ? "atualizado" : "realizado"} com sucesso.`
    });
    form.reset();
  };
  const employeeRoles = ["Motorista", "Motorista de Ambul\xE2ncia", "Motorista Escolar", "Secret\xE1rio(a)", "M\xE9dico(a)", "Enfermeiro(a)", "T\xE9cnico Administrativo", "Professor(a)", "Engenheiro(a)", "Operador de M\xE1quinas", "Gerente Geral", "Diretor", "CEO", "Coordenador de Setor", "Supervisor", "Estagi\xE1rio", "T\xE9cnico de TI", "T\xE9cnico Mec\xE2nico"];
  return /* @__PURE__ */ React.createElement(Form, { ...form }, /* @__PURE__ */ React.createElement("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-8 mt-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold mb-4" }, "Credenciais de Acesso"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "email",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Email Corporativo"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "email", placeholder: "email.de@acesso.com", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "password",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Senha"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "password", placeholder: isEditMode ? "Deixe em branco para n\xE3o alterar" : "Senha de 6+ d\xEDgitos", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "phone",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Telefone / WhatsApp"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(Phone, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" }), /* @__PURE__ */ React.createElement(Input, { placeholder: "5511999999999", className: "pl-10", ...field }))), /* @__PURE__ */ React.createElement(FormDescription, { className: "text-[10px]" }, "Utilizado para login e notifica\xE7\xF5es de viagem."), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ))), /* @__PURE__ */ React.createElement(Separator, null), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold mb-4 text-primary flex items-center gap-2" }, /* @__PURE__ */ React.createElement(ShieldCheck, { className: "h-5 w-5" }), "Informa\xE7\xF5es Pessoais e Funcionais (LGPD)"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "name",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Nome Completo"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "Nome do colaborador", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "matricula",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Matr\xEDcula / ID Interno"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "N\xFAmero da matr\xEDcula", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "role",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Cargo"), /* @__PURE__ */ React.createElement(Select, { onValueChange: field.onChange, value: field.value }, /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(SelectTrigger, null, /* @__PURE__ */ React.createElement(SelectValue, { placeholder: "Selecione o cargo" }))), /* @__PURE__ */ React.createElement(SelectContent, null, employeeRoles.sort().map((role) => /* @__PURE__ */ React.createElement(SelectItem, { key: role, value: role }, role)))), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "cnh",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "N\xBA da CNH (apenas para motoristas)"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "0123456789", ...field })), /* @__PURE__ */ React.createElement(FormDescription, { className: "text-[10px]" }, "Dado coletado para fins de valida\xE7\xE3o jur\xEDdica de condutor."), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  )), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "sector",
      render: () => /* @__PURE__ */ React.createElement(FormItem, { className: "mt-6" }, /* @__PURE__ */ React.createElement("div", { className: "mb-4" }, /* @__PURE__ */ React.createElement(FormLabel, { className: "text-base" }, "Setor(es) de Lota\xE7\xE3o"), /* @__PURE__ */ React.createElement(FormMessage, null)), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4" }, sectors.map((sector) => /* @__PURE__ */ React.createElement(
        FormField,
        {
          key: sector.id,
          control: form.control,
          name: "sector",
          render: ({ field }) => {
            return /* @__PURE__ */ React.createElement(
              FormItem,
              {
                key: sector.id,
                className: "flex flex-row items-center space-x-2 space-y-0"
              },
              /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(
                Checkbox,
                {
                  checked: field.value?.includes(sector.name),
                  onCheckedChange: (checked) => {
                    return checked ? field.onChange([...field.value || [], sector.name]) : field.onChange(
                      field.value?.filter(
                        (value) => value !== sector.name
                      )
                    );
                  }
                }
              )),
              /* @__PURE__ */ React.createElement(FormLabel, { className: "text-sm font-normal" }, sector.name)
            );
          }
        }
      ))))
    }
  )), /* @__PURE__ */ React.createElement(Separator, null), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold mb-4" }, "Documenta\xE7\xE3o"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "idPhoto",
      render: ({ field: { value, onChange, ...fieldProps } }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Foto Funcional (3x4)"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "file", accept: "image/*", onChange: (event) => onChange(event.target.files), ...fieldProps })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "cnhPhoto",
      render: ({ field: { value, onChange, ...fieldProps } }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Foto da CNH (se condutor)"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "file", accept: "image/*,application/pdf", onChange: (event) => onChange(event.target.files), ...fieldProps })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ))), /* @__PURE__ */ React.createElement(Separator, null), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "lgpdConsent",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, { className: "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/30" }, /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(
        Checkbox,
        {
          checked: field.value,
          onCheckedChange: field.onChange
        }
      )), /* @__PURE__ */ React.createElement("div", { className: "space-y-1 leading-none" }, /* @__PURE__ */ React.createElement(FormLabel, null, "Declaro que li e aceito a ", /* @__PURE__ */ React.createElement(Link, { href: "/privacy", className: "text-primary underline" }, "Pol\xEDtica de Privacidade")), /* @__PURE__ */ React.createElement(FormDescription, { className: "text-xs" }, "Autorizo o processamento dos dados acima pela organiza\xE7\xE3o para fins de gest\xE3o operacional da frota municipal/corporativa, conforme a LGPD."), /* @__PURE__ */ React.createElement(FormMessage, null)))
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "flex justify-end" }, /* @__PURE__ */ React.createElement(Button, { type: "submit", className: "w-full md:w-auto h-10 font-bold uppercase tracking-widest text-xs" }, isEditMode ? "Salvar Altera\xE7\xF5es" : "Cadastrar Colaborador"))));
}
export {
  RegisterEmployeeForm
};
