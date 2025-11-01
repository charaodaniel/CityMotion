
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import type { Sector } from '@/lib/types';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string().min(3, "O nome do setor é obrigatório."),
  description: z.string().optional(),
});

interface RegisterSectorFormProps {
  onFormSubmit: (data: Partial<Sector>) => void;
  existingSector?: Sector | null;
}

export function RegisterSectorForm({ onFormSubmit, existingSector }: RegisterSectorFormProps) {
  const { toast } = useToast();
  const isEditMode = !!existingSector;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (isEditMode) {
      form.reset({
        name: existingSector.name,
        description: existingSector.description
      });
    }
  }, [isEditMode, existingSector, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onFormSubmit(values);
    toast({
      title: isEditMode ? "Setor Atualizado" : "Setor Cadastrado",
      description: `O setor foi ${isEditMode ? 'atualizado' : 'adicionado'} com sucesso.`,
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Setor</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Secretaria de Finanças" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva brevemente a função do setor."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90">
            {isEditMode ? 'Salvar Alterações' : 'Salvar Setor'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
