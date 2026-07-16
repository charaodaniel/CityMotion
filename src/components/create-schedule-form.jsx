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
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { useApp } from "@/contexts/app-provider";
const weekdays = ["Domingo", "Segunda", "Ter\xE7a", "Quarta", "Quinta", "Sexta", "S\xE1bado"];
const formSchema = z.object({
  title: z.string().min(5, "O t\xEDtulo da escala \xE9 obrigat\xF3rio."),
  employee: z.string().min(1, "\xC9 necess\xE1rio selecionar um funcion\xE1rio."),
  scheduleType: z.string().min(1, "O tipo de escala \xE9 obrigat\xF3rio."),
  startDate: z.date({ required_error: "A data de in\xEDcio \xE9 obrigat\xF3ria." }),
  endDate: z.date({ required_error: "A data de fim \xE9 obrigat\xF3ria." }),
  description: z.string().optional(),
  repetition: z.string().optional(),
  repeatUntil: z.date().optional(),
  daysOfWeek: z.array(z.string()).optional(),
  dayOfMonth: z.coerce.number().optional()
});
function CreateScheduleForm({ onFormSubmit }) {
  const { toast } = useToast();
  const { employees } = useApp();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      employee: "",
      scheduleType: "",
      description: "",
      repetition: "none",
      daysOfWeek: []
    }
  });
  const repetition = form.watch("repetition");
  const onSubmit = (values) => {
    console.log(values);
    toast({
      title: "Escala Criada",
      description: "A nova escala de trabalho foi agendada com sucesso."
    });
    onFormSubmit();
    form.reset();
  };
  const scheduleTypes = ["Jornada Regular", "Plant\xE3o", "Sobreaviso", "Folga", "F\xE9rias", "Hora Extra", "Evento Especial"];
  return /* @__PURE__ */ React.createElement(Form, { ...form }, /* @__PURE__ */ React.createElement("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-8" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "title",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "T\xEDtulo da Escala"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "Ex: Plant\xE3o do Fim de Semana", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "employee",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Funcion\xE1rio"), /* @__PURE__ */ React.createElement(Select, { onValueChange: field.onChange, value: field.value }, /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(SelectTrigger, null, /* @__PURE__ */ React.createElement(SelectValue, { placeholder: "Selecione o funcion\xE1rio" }))), /* @__PURE__ */ React.createElement(SelectContent, null, employees.map((employee) => /* @__PURE__ */ React.createElement(SelectItem, { key: employee.id, value: employee.name }, employee.name)))), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "scheduleType",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Tipo de Escala"), /* @__PURE__ */ React.createElement(Select, { onValueChange: field.onChange, value: field.value }, /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(SelectTrigger, null, /* @__PURE__ */ React.createElement(SelectValue, { placeholder: "Selecione o tipo" }))), /* @__PURE__ */ React.createElement(SelectContent, null, scheduleTypes.map((type) => /* @__PURE__ */ React.createElement(SelectItem, { key: type, value: type }, type)))), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "startDate",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, { className: "flex flex-col" }, /* @__PURE__ */ React.createElement(FormLabel, null, "Data de In\xEDcio"), /* @__PURE__ */ React.createElement(Popover, null, /* @__PURE__ */ React.createElement(PopoverTrigger, { asChild: true }, /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(
        Button,
        {
          variant: "outline",
          className: cn(
            "pl-3 text-left font-normal",
            !field.value && "text-muted-foreground"
          )
        },
        field.value ? format(field.value, "PPP") : /* @__PURE__ */ React.createElement("span", null, "Escolha uma data"),
        /* @__PURE__ */ React.createElement(CalendarIcon, { className: "ml-auto h-4 w-4 opacity-50" })
      ))), /* @__PURE__ */ React.createElement(PopoverContent, { className: "w-auto p-0", align: "start" }, /* @__PURE__ */ React.createElement(
        Calendar,
        {
          mode: "single",
          selected: field.value,
          onSelect: field.onChange,
          initialFocus: true
        }
      ))), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "endDate",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, { className: "flex flex-col" }, /* @__PURE__ */ React.createElement(FormLabel, null, "Data de Fim"), /* @__PURE__ */ React.createElement(Popover, null, /* @__PURE__ */ React.createElement(PopoverTrigger, { asChild: true }, /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(
        Button,
        {
          variant: "outline",
          className: cn(
            "pl-3 text-left font-normal",
            !field.value && "text-muted-foreground"
          )
        },
        field.value ? format(field.value, "PPP") : /* @__PURE__ */ React.createElement("span", null, "Escolha uma data"),
        /* @__PURE__ */ React.createElement(CalendarIcon, { className: "ml-auto h-4 w-4 opacity-50" })
      ))), /* @__PURE__ */ React.createElement(PopoverContent, { className: "w-auto p-0", align: "start" }, /* @__PURE__ */ React.createElement(
        Calendar,
        {
          mode: "single",
          selected: field.value,
          onSelect: field.onChange,
          initialFocus: true
        }
      ))), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  )), /* @__PURE__ */ React.createElement(Separator, null), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold mb-4" }, "Recorr\xEAncia"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "repetition",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Repetir"), /* @__PURE__ */ React.createElement(Select, { onValueChange: field.onChange, defaultValue: field.value }, /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(SelectTrigger, null, /* @__PURE__ */ React.createElement(SelectValue, { placeholder: "Selecione a recorr\xEAncia" }))), /* @__PURE__ */ React.createElement(SelectContent, null, /* @__PURE__ */ React.createElement(SelectItem, { value: "none" }, "N\xE3o repetir"), /* @__PURE__ */ React.createElement(SelectItem, { value: "daily" }, "Diariamente"), /* @__PURE__ */ React.createElement(SelectItem, { value: "weekly" }, "Semanalmente"), /* @__PURE__ */ React.createElement(SelectItem, { value: "monthly" }, "Mensalmente"))), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), repetition && repetition !== "none" && /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "repeatUntil",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, { className: "flex flex-col" }, /* @__PURE__ */ React.createElement(FormLabel, null, "Repetir at\xE9"), /* @__PURE__ */ React.createElement(Popover, null, /* @__PURE__ */ React.createElement(PopoverTrigger, { asChild: true }, /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(
        Button,
        {
          variant: "outline",
          className: cn(
            "pl-3 text-left font-normal",
            !field.value && "text-muted-foreground"
          )
        },
        field.value ? format(field.value, "PPP") : /* @__PURE__ */ React.createElement("span", null, "Data final"),
        /* @__PURE__ */ React.createElement(CalendarIcon, { className: "ml-auto h-4 w-4 opacity-50" })
      ))), /* @__PURE__ */ React.createElement(PopoverContent, { className: "w-auto p-0", align: "start" }, /* @__PURE__ */ React.createElement(
        Calendar,
        {
          mode: "single",
          selected: field.value,
          onSelect: field.onChange,
          initialFocus: true
        }
      ))), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  )), repetition === "weekly" && /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "daysOfWeek",
      render: () => /* @__PURE__ */ React.createElement(FormItem, { className: "mt-6" }, /* @__PURE__ */ React.createElement("div", { className: "mb-4" }, /* @__PURE__ */ React.createElement(FormLabel, null, "Dias da Semana")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-4" }, weekdays.map((day) => /* @__PURE__ */ React.createElement(
        FormField,
        {
          key: day,
          control: form.control,
          name: "daysOfWeek",
          render: ({ field }) => {
            return /* @__PURE__ */ React.createElement(
              FormItem,
              {
                key: day,
                className: "flex flex-row items-start space-x-2 space-y-0"
              },
              /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(
                Checkbox,
                {
                  checked: field.value?.includes(day),
                  onCheckedChange: (checked) => {
                    return checked ? field.onChange([...field.value || [], day]) : field.onChange(
                      field.value?.filter(
                        (value) => value !== day
                      )
                    );
                  }
                }
              )),
              /* @__PURE__ */ React.createElement(FormLabel, { className: "font-normal" }, day)
            );
          }
        }
      ))), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), repetition === "monthly" && /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "dayOfMonth",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, { className: "mt-6" }, /* @__PURE__ */ React.createElement(FormLabel, null, "Dia do M\xEAs"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "number", min: "1", max: "31", placeholder: "Ex: 15", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  )), /* @__PURE__ */ React.createElement(Separator, null), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "description",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Observa\xE7\xF5es"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(
        Textarea,
        {
          placeholder: "Adicione informa\xE7\xF5es relevantes sobre a escala.",
          className: "resize-none",
          ...field
        }
      )), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "flex justify-end" }, /* @__PURE__ */ React.createElement(Button, { type: "submit", className: "w-full md:w-auto" }, "Agendar Escala"))));
}
export {
  CreateScheduleForm
};
