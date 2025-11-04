
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Vehicle } from '@/lib/types';
import { useApp } from '@/contexts/app-provider';

const formSchema = z.object({
  type: z.string().min(1, "O tipo de manutenção é obrigatório."),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
});

interface RequestMaintenanceFormProps {
  vehicle: Vehicle | null;
  onFormSubmit: () => void;
}

export function RequestMaintenanceForm({ vehicle, onFormSubmit }: RequestMaintenanceFormProps) {
  const { toast } = useToast();
  const { addMaintenanceRequest } = useApp();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: '',
      description: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!vehicle) return;

    addMaintenanceRequest({
        vehicleId: vehicle.id,
        vehicleModel: vehicle.vehicleModel,
        licensePlate: vehicle.licensePlate,
        type: values.type as 'Manutenção Corretiva' | 'Revisão Preventiva',
        description: values.description,
    });
    
    toast({
      title: "Solicitação Enviada!",
      description: "O pedido de manutenção foi registrado e será analisado pela equipe responsável.",
    });
    onFormSubmit();
    form.reset();
  };

  const maintenanceTypes = ['Manutenção Corretiva', 'Revisão Preventiva'];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Solicitação</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de manutenção" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {maintenanceTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo/Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva o problema ou o serviço necessário. Ex: 'Barulho estranho no motor ao ligar' ou 'Troca de óleo e filtros'."
                  className="resize-none"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          Enviar Solicitação de Manutenção
        </Button>
      </form>
    </Form>
  );
}
