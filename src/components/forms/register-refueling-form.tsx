"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/app-provider';
import { Fuel, MapPin, Gauge, Calculator } from 'lucide-react';
import { useEffect, useMemo } from 'react';

const formSchema = z.object({
  vehicleId: z.string().min(1, "Selecione o veículo."),
  mileage: z.coerce.number().min(1, "KM é obrigatória."),
  liters: z.coerce.number().min(0.1, "Litragem é obrigatória."),
  price: z.coerce.number().min(0.1, "Preço por litro é obrigatório."),
  fuelType: z.string().min(1, "Tipo de combustível é obrigatório."),
  gasStation: z.string().optional(),
  notes: z.string().optional(),
});

interface RegisterRefuelingFormProps {
  onFormSubmit: () => void;
  defaultVehicleId?: string;
}

export function RegisterRefuelingForm({ onFormSubmit, defaultVehicleId }: RegisterRefuelingFormProps) {
  const { vehicles, addRefueling } = useApp();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleId: defaultVehicleId || '',
      liters: 0,
      price: 0,
      fuelType: 'Gasolina',
    },
  });

  const watchLiters = form.watch('liters');
  const watchPrice = form.watch('price');
  const selectedVehicleId = form.watch('vehicleId');

  const total = useMemo(() => {
    return (watchLiters * watchPrice).toFixed(2);
  }, [watchLiters, watchPrice]);

  useEffect(() => {
    if (selectedVehicleId) {
        const v = vehicles.find(v => v.id === selectedVehicleId);
        if (v) form.setValue('mileage', v.mileage);
    }
  }, [selectedVehicleId, vehicles, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const vehicle = vehicles.find(v => v.id === values.vehicleId);
    if (!vehicle) return;

    await addRefueling({
        ...values,
        vehicleModel: vehicle.vehicleModel,
        licensePlate: vehicle.licensePlate,
    });
    onFormSubmit();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="vehicleId"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Veículo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger className="bg-black/20 border-border/50">
                        <SelectValue placeholder="Selecione o veículo" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {vehicles.map(v => (
                        <SelectItem key={v.id} value={v.id}>{v.vehicleModel} ({v.licensePlate})</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="fuelType"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Tipo de Combustível</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger className="bg-black/20 border-border/50">
                        <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {['Gasolina', 'Etanol', 'Diesel', 'GNV', 'Arla 32'].map(f => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center gap-2"><Gauge className="h-3 w-3" /> Odômetro Atual (KM)</FormLabel>
                    <FormControl><Input type="number" className="bg-black/20" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="liters"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center gap-2"><Fuel className="h-3 w-3" /> Litros</FormLabel>
                    <FormControl><Input type="number" step="0.01" className="bg-black/20" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center gap-2"><Calculator className="h-3 w-3" /> Preço p/ Litro</FormLabel>
                    <FormControl><Input type="number" step="0.01" className="bg-black/20" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Total Calculado:</span>
            <span className="text-2xl font-black tracking-tighter text-primary">R$ {total}</span>
        </div>

        <FormField
            control={form.control}
            name="gasStation"
            render={({ field }) => (
            <FormItem>
                <FormLabel className="flex items-center gap-2"><MapPin className="h-3 w-3" /> Posto / Fornecedor</FormLabel>
                <FormControl><Input placeholder="Ex: Posto Central Shell" className="bg-black/20" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl><Textarea className="bg-black/20 resize-none" rows={3} {...field} /></FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        <Button type="submit" className="w-full bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-[10px] h-12">
            Confirmar Registro de Abastecimento
        </Button>
      </form>
    </Form>
  );
}
