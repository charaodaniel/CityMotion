
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import type { MaintenanceRequest } from '@/lib/types';
import { useApp } from '@/contexts/app-provider';

const formSchema = z.object({
  partName: z.string().min(3, "O nome da peça é obrigatório."),
  quantity: z.coerce.number().min(1, "A quantidade deve ser de pelo menos 1."),
  supplier: z.string().optional(),
  justification: z.string().min(10, "A justificativa é obrigatória e deve ter pelo menos 10 caracteres."),
});

interface RequestPartFormProps {
  maintenanceRequest: MaintenanceRequest | null;
  onFormSubmit: () => void;
}

export function RequestPartForm({ maintenanceRequest, onFormSubmit }: RequestPartFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partName: '',
      quantity: 1,
      supplier: '',
      justification: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!maintenanceRequest) return;
    
    console.log({
        maintenanceRequestId: maintenanceRequest.id,
        vehicle: `${maintenanceRequest.vehicleModel} (${maintenanceRequest.licensePlate})`,
        ...values
    });

    toast({
      title: "Pedido de Peça Enviado!",
      description: `O pedido da peça "${values.partName}" foi enviado para o setor de compras.`,
    });
    onFormSubmit();
    form.reset();
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                <FormField
                    control={form.control}
                    name="partName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nome da Peça / Componente</FormLabel>
                        <FormControl>
                            <Input placeholder="Ex: Pastilha de freio dianteira" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
            <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Fornecedor (Opcional)</FormLabel>
                <FormControl>
                    <Input placeholder="Ex: Autopeças do Bairro" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />


        <FormField
          control={form.control}
          name="justification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Justificativa da Necessidade</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva por que esta peça é essencial para a conclusão da manutenção."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          Enviar Pedido de Compra
        </Button>
      </form>
    </Form>
  );
}
