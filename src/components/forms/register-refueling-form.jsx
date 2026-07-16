"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/contexts/app-provider";
import { Fuel, MapPin, Gauge, Calculator } from "lucide-react";
import { useEffect, useMemo } from "react";
const formSchema = z.object({
  vehicleId: z.string().min(1, "Selecione o ve\xEDculo."),
  mileage: z.coerce.number().min(1, "KM \xE9 obrigat\xF3ria."),
  liters: z.coerce.number().min(0.1, "Litragem \xE9 obrigat\xF3ria."),
  price: z.coerce.number().min(0.1, "Pre\xE7o por litro \xE9 obrigat\xF3rio."),
  fuelType: z.string().min(1, "Tipo de combust\xEDvel \xE9 obrigat\xF3rio."),
  gasStation: z.string().optional(),
  notes: z.string().optional()
});
function RegisterRefuelingForm({ onFormSubmit, defaultVehicleId }) {
  const { vehicles, addRefueling } = useApp();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleId: defaultVehicleId || "",
      liters: 0,
      price: 0,
      fuelType: "Gasolina"
    }
  });
  const watchLiters = form.watch("liters");
  const watchPrice = form.watch("price");
  const selectedVehicleId = form.watch("vehicleId");
  const total = useMemo(() => {
    return (watchLiters * watchPrice).toFixed(2);
  }, [watchLiters, watchPrice]);
  useEffect(() => {
    if (selectedVehicleId) {
      const v = vehicles.find((v2) => v2.id === selectedVehicleId);
      if (v) form.setValue("mileage", v.mileage);
    }
  }, [selectedVehicleId, vehicles, form]);
  const onSubmit = async (values) => {
    const vehicle = vehicles.find((v) => v.id === values.vehicleId);
    if (!vehicle) return;
    await addRefueling({
      ...values,
      vehicleModel: vehicle.vehicleModel,
      licensePlate: vehicle.licensePlate
    });
    onFormSubmit();
  };
  return /* @__PURE__ */ React.createElement(Form, { ...form }, /* @__PURE__ */ React.createElement("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "vehicleId",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Ve\xEDculo"), /* @__PURE__ */ React.createElement(Select, { onValueChange: field.onChange, defaultValue: field.value }, /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(SelectTrigger, { className: "bg-black/20 border-border/50" }, /* @__PURE__ */ React.createElement(SelectValue, { placeholder: "Selecione o ve\xEDculo" }))), /* @__PURE__ */ React.createElement(SelectContent, null, vehicles.map((v) => /* @__PURE__ */ React.createElement(SelectItem, { key: v.id, value: v.id }, v.vehicleModel, " (", v.licensePlate, ")")))), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "fuelType",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Tipo de Combust\xEDvel"), /* @__PURE__ */ React.createElement(Select, { onValueChange: field.onChange, defaultValue: field.value }, /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(SelectTrigger, { className: "bg-black/20 border-border/50" }, /* @__PURE__ */ React.createElement(SelectValue, { placeholder: "Tipo" }))), /* @__PURE__ */ React.createElement(SelectContent, null, ["Gasolina", "Etanol", "Diesel", "GNV", "Arla 32"].map((f) => /* @__PURE__ */ React.createElement(SelectItem, { key: f, value: f }, f)))), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "mileage",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Gauge, { className: "h-3 w-3" }), " Od\xF4metro Atual (KM)"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "number", className: "bg-black/20", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "liters",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Fuel, { className: "h-3 w-3" }), " Litros"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "number", step: "0.01", className: "bg-black/20", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "price",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Calculator, { className: "h-3 w-3" }), " Pre\xE7o p/ Litro"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "number", step: "0.01", className: "bg-black/20", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold uppercase tracking-widest text-primary/70" }, "Total Calculado:"), /* @__PURE__ */ React.createElement("span", { className: "text-2xl font-black tracking-tighter text-primary" }, "R$ ", total)), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "gasStation",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(MapPin, { className: "h-3 w-3" }), " Posto / Fornecedor"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "Ex: Posto Central Shell", className: "bg-black/20", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "notes",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Observa\xE7\xF5es"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Textarea, { className: "bg-black/20 resize-none", rows: 3, ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(Button, { type: "submit", className: "w-full bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-[10px] h-12" }, "Confirmar Registro de Abastecimento")));
}
export {
  RegisterRefuelingForm
};
