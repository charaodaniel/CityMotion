
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import type { Schedule } from '@/lib/types';
import { FileImage } from 'lucide-react';

const formSchema = z.object({
  description: z.string().min(20, "A descrição do sinistro é obrigatória e precisa ser detalhada."),
  location: z.string().min(5, "O local do incidente é obrigatório."),
  incidentDate: z.string().min(1, "A data e hora são obrigatórias."),
  photos: z.any().optional(),
});

interface ReportIncidentFormProps {
  schedule: Schedule | null;
  onFormSubmit: () => void;
}

export function ReportIncidentForm({ schedule, onFormSubmit }: ReportIncidentFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      location: '',
      incidentDate: new Date().toISOString().substring(0, 16),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!schedule) return;
    
    // In a real app, this would be sent to a server/API
    console.log({
        scheduleId: schedule.id,
        vehicle: schedule.vehicle,
        driver: schedule.driver,
        ...values
    });

    toast({
      title: "Relatório de Sinistro Enviado",
      description: `Seu relatório foi registrado. A gestão será notificada.`,
      variant: "destructive",
    });
    onFormSubmit();
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4 p-4">
        
        <FormField
          control={form.control}
          name="incidentDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data e Hora do Incidente</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Localização do Incidente</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Esquina da Av. Brasil com a Rua das Flores" {...field} />
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
              <FormLabel>Descrição Detalhada do Ocorrido</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva o que aconteceu, os danos, se há terceiros envolvidos, etc."
                  className="resize-none"
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="photos"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Anexar Fotos</FormLabel>
              <FormControl>
                <div className="relative">
                    <FileImage className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={(event) => onChange(event.target.files)} 
                        className="pl-10"
                        {...fieldProps} 
                    />
                </div>
              </FormControl>
              <FormDescription>
                Anexe fotos dos danos, do local, e dos documentos (se houver).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


        <div className="flex justify-end pt-4">
            <Button type="submit" variant="destructive" className="w-full md:w-auto">
                Enviar Relatório de Sinistro
            </Button>
        </div>
      </form>
    </Form>
  );
}
