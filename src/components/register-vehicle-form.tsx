
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { Vehicle } from '@/lib/types';
import { useEffect } from 'react';

const formSchema = z.object({
  vehicleModel: z.string().min(3, "O modelo do veículo é obrigatório."),
  licensePlate: z.string().min(7, "A placa deve ter o formato ABC-1234.").max(8),
  sector: z.string().min(3, "O setor responsável é obrigatório."),
  mileage: z.coerce.number().min(0, "A quilometragem não pode ser negativa."),
  vehicleRegistration: z.any().optional(),
  vehicleInspection: z.any().optional(),
});

interface RegisterVehicleFormProps {
  onFormSubmit: (data: Partial<Vehicle>) => void;
  existingVehicle?: Vehicle | null;
}

export function RegisterVehicleForm({ onFormSubmit, existingVehicle }: RegisterVehicleFormProps) {
  const { toast } = useToast();
  const isEditMode = !!existingVehicle;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        vehicleModel: '',
        licensePlate: '',
        sector: '',
        mileage: 0,
    },
  });

   useEffect(() => {
    if (isEditMode) {
      form.reset({
        vehicleModel: existingVehicle.vehicleModel,
        licensePlate: existingVehicle.licensePlate,
        sector: existingVehicle.sector,
        mileage: existingVehicle.mileage,
      });
    }
  }, [isEditMode, existingVehicle, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onFormSubmit(values);
    toast({
      title: isEditMode ? "Veículo Atualizado" : "Cadastro de Veículo Enviado",
      description: `O veículo foi ${isEditMode ? 'atualizado' : 'adicionado à frota'}.`,
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">Informações do Veículo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="vehicleModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo do Veículo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Fiat Strada 2023" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="licensePlate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placa do Veículo</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC-1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setor Responsável</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Secretaria de Saúde">Secretaria de Saúde</SelectItem>
                      <SelectItem value="Secretaria de Educação">Secretaria de Educação</SelectItem>
                      <SelectItem value="Secretaria de Obras">Secretaria de Obras</SelectItem>
                      <SelectItem value="Administração">Administração</SelectItem>
                      <SelectItem value="Vigilância Sanitária">Vigilância Sanitária</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quilometragem</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-4">Documentação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="vehicleRegistration"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>CRLV do Veículo</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*,application/pdf" onChange={(event) => onChange(event.target.files)} {...fieldProps} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleInspection"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Certificado de Inspeção</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*,application/pdf" onChange={(event) => onChange(event.target.files)} {...fieldProps} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
            <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90">
                {isEditMode ? 'Salvar Alterações' : 'Enviar Cadastro'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
