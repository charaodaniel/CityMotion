"use client";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Trash2, UserPlus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useApp } from "@/contexts/app-provider";
const passengerSchema = z.object({
  name: z.string().min(3, "O nome do passageiro \xE9 obrigat\xF3rio."),
  document: z.string().min(5, "O documento \xE9 obrigat\xF3rio.")
});
const formSchema = z.object({
  title: z.string().min(5, "O t\xEDtulo da viagem \xE9 obrigat\xF3rio."),
  sector: z.string().min(1, "O setor solicitante \xE9 obrigat\xF3rio."),
  category: z.string().min(1, "A categoria da viagem \xE9 obrigat\xF3ria."),
  driver: z.string().min(1, "\xC9 necess\xE1rio selecionar um motorista."),
  vehicle: z.string().min(1, "\xC9 necess\xE1rio selecionar um ve\xEDculo."),
  origin: z.string().min(3, "O local de origem \xE9 obrigat\xF3rio."),
  destination: z.string().min(3, "O local de destino \xE9 obrigat\xF3rio."),
  departureDate: z.date({ required_error: "A data de partida \xE9 obrigat\xF3ria." }),
  departureTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inv\xE1lido. Use HH:MM."),
  passengers: z.array(passengerSchema).optional(),
  description: z.string().optional()
});
function ScheduleTripForm({ onFormSubmit }) {
  const { toast } = useToast();
  const { employees, vehicles, sectors } = useApp();
  const drivers = employees.filter((e) => e.role === "Motorista");
  const tripCategoriesBySector = {
    "Secretaria de Sa\xFAde": ["Transporte de Paciente", "Consulta Agendada", "Entrega de Medicamentos", "Visita Domiciliar"],
    "Secretaria de Educa\xE7\xE3o, Cultura, Desporto e Lazer": ["Transporte Escolar", "Viagem Pedag\xF3gica", "Transporte de Professores", "Evento Cultural"],
    "Secretaria de Obras, Via\xE7\xE3o e Urbanismo": ["Visita T\xE9cnica", "Transporte de Material", "Inspe\xE7\xE3o de Obra", "Manuten\xE7\xE3o de Vias"],
    "Secretaria de Administra\xE7\xE3o e Planejamento": ["Entrega de Documentos", "Reuni\xE3o Externa", "Servi\xE7o Banc\xE1rio", "Recursos Humanos"],
    "Gabinete do Prefeito": ["Agenda Oficial", "Visita a Comunidades", "Reuni\xE3o Governamental"],
    "Secretaria da Fazenda": ["Coleta de Tributos", "Fiscaliza\xE7\xE3o", "Servi\xE7os de Contabilidade"],
    "Secretaria de Assist\xEAncia Social": ["Visita Domiciliar", "Acompanhamento Familiar", "Entrega de Benef\xEDcios"],
    "Secretaria de Agricultura e Meio Ambiente": ["Inspe\xE7\xE3o Rural", "Fiscaliza\xE7\xE3o Ambiental", "Apoio ao Produtor"],
    "Secretaria de Turismo e Desenvolvimento Econ\xF4mico": ["Visita a Pontos Tur\xEDsticos", "Apoio a Eventos", "Fomento ao Com\xE9rcio"]
  };
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      sector: "",
      category: "",
      driver: "",
      vehicle: "",
      origin: "",
      destination: "",
      departureTime: "",
      passengers: [],
      description: ""
    }
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "passengers"
  });
  const selectedSector = form.watch("sector");
  useEffect(() => {
    form.setValue("category", "");
  }, [selectedSector, form]);
  const onSubmit = (values) => {
    console.log(values);
    toast({
      title: "Agendamento Enviado",
      description: "A solicita\xE7\xE3o de viagem foi criada e aguarda aprova\xE7\xE3o."
    });
    onFormSubmit();
    form.reset();
  };
  return /* @__PURE__ */ React.createElement(Form, { ...form }, /* @__PURE__ */ React.createElement("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-8" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "title",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "T\xEDtulo da Viagem"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "Ex: Transporte de equipe para evento", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(Separator, { className: "bg-border/30" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold mb-4" }, "Detalhes da Viagem"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "sector",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Setor Solicitante"), /* @__PURE__ */ React.createElement(Select, { onValueChange: field.onChange, value: field.value }, /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(SelectTrigger, null, /* @__PURE__ */ React.createElement(SelectValue, { placeholder: "Selecione o setor" }))), /* @__PURE__ */ React.createElement(SelectContent, null, sectors.map((sector) => /* @__PURE__ */ React.createElement(SelectItem, { key: sector.id, value: sector.name }, sector.name)))), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "category",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Categoria da Viagem"), /* @__PURE__ */ React.createElement(
        Select,
        {
          onValueChange: field.onChange,
          value: field.value,
          disabled: !selectedSector
        },
        /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(SelectTrigger, null, /* @__PURE__ */ React.createElement(
          SelectValue,
          {
            placeholder: selectedSector ? "Selecione a categoria" : "Selecione um setor primeiro"
          }
        ))),
        /* @__PURE__ */ React.createElement(SelectContent, null, selectedSector && tripCategoriesBySector[selectedSector]?.map((category) => /* @__PURE__ */ React.createElement(SelectItem, { key: category, value: category }, category)))
      ), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "driver",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Motorista Respons\xE1vel"), /* @__PURE__ */ React.createElement(Select, { onValueChange: field.onChange, value: field.value }, /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(SelectTrigger, null, /* @__PURE__ */ React.createElement(SelectValue, { placeholder: "Selecione o motorista" }))), /* @__PURE__ */ React.createElement(SelectContent, null, drivers.map((driver) => /* @__PURE__ */ React.createElement(SelectItem, { key: driver.id, value: driver.name }, driver.name)))), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "vehicle",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Ve\xEDculo Designado"), /* @__PURE__ */ React.createElement(Select, { onValueChange: field.onChange, value: field.value }, /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(SelectTrigger, null, /* @__PURE__ */ React.createElement(SelectValue, { placeholder: "Selecione o ve\xEDculo" }))), /* @__PURE__ */ React.createElement(SelectContent, null, vehicles.map((vehicle) => /* @__PURE__ */ React.createElement(
        SelectItem,
        {
          key: vehicle.id,
          value: `${vehicle.vehicleModel} (${vehicle.licensePlate})`
        },
        vehicle.vehicleModel,
        " (",
        vehicle.licensePlate,
        ")"
      )))), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "departureDate",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, { className: "flex flex-col" }, /* @__PURE__ */ React.createElement(FormLabel, null, "Data de Partida"), /* @__PURE__ */ React.createElement(Popover, null, /* @__PURE__ */ React.createElement(PopoverTrigger, { asChild: true }, /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(
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
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Hor\xE1rio de Partida"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "time", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "origin",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Origem"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "Local de partida", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "destination",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Destino"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "Local de chegada", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  )), /* @__PURE__ */ React.createElement(Separator, { className: "bg-border/30" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold" }, "Passageiros"), /* @__PURE__ */ React.createElement(
    Button,
    {
      type: "button",
      variant: "outline",
      size: "sm",
      onClick: () => append({ name: "", document: "" }),
      className: "text-[10px] font-bold uppercase tracking-widest h-8"
    },
    /* @__PURE__ */ React.createElement(UserPlus, { className: "mr-2 h-3.5 w-3.5" }),
    "Adicionar"
  )), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, fields.map((field, index) => /* @__PURE__ */ React.createElement("div", { key: field.id, className: "flex items-center gap-4 p-4 border border-border/50 rounded-md bg-black/20" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-4 flex-1" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: `passengers.${index}.name`,
      render: ({ field: field2 }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, { className: "text-[10px] uppercase font-bold text-muted-foreground" }, "Nome"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "Nome completo", className: "h-9 text-xs", ...field2 })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: `passengers.${index}.document`,
      render: ({ field: field2 }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, { className: "text-[10px] uppercase font-bold text-muted-foreground" }, "CPF/RG"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "N\xFAmero", className: "h-9 text-xs", ...field2 })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  )), /* @__PURE__ */ React.createElement(
    Button,
    {
      type: "button",
      variant: "ghost",
      size: "icon",
      onClick: () => remove(index),
      className: "h-9 w-9 text-destructive hover:bg-destructive/10"
    },
    /* @__PURE__ */ React.createElement(Trash2, { className: "h-4 w-4" })
  ))), fields.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground text-center py-4 border border-dashed rounded-md italic" }, "Nenhum passageiro adicionado."))), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "description",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Motivo/Descri\xE7\xE3o"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(
        Textarea,
        {
          placeholder: "Descreva o motivo da viagem, pessoas envolvidas ou outras informa\xE7\xF5es relevantes.",
          className: "resize-none",
          rows: 4,
          ...field
        }
      )), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "flex justify-end pt-4" }, /* @__PURE__ */ React.createElement(Button, { type: "submit", className: "w-full md:w-auto h-11 px-10 bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-[10px]" }, "Confirmar Miss\xE3o"))));
}
export {
  ScheduleTripForm
};
