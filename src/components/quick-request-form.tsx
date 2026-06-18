
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, ShieldCheck } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { useApp } from '@/contexts/app-provider';
import Link from 'next/link';


const formSchema = z.object({
  title: z.string().min(1, "O motivo da viagem é obrigatório."),
  sector: z.string().min(1, "O setor solicitante é obrigatório."),
  destination: z.string().optional(),
  departureDate: z.date().optional(),
  departureTime: z.string().optional(),
  details: z.string().optional(),
});

interface QuickRequestFormProps {
  onFormSubmit: () => void;
}

export function QuickRequestForm({ onFormSubmit }: QuickRequestFormProps) {
  const { toast } = useToast();
  const { addVehicleRequest, sectors } = useApp();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      sector: '',
      destination: '',
      departureTime: '',
      details: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    
    const requestData = {
        title: values.title,
        sector: values.sector,
        details: `${values.destination ? `Destino: ${values.destination}. ` : ''}${values.details || ''}`,
    }
    
    addVehicleRequest(requestData);

    toast({
      title: "Pedido Enviado!",
      description: "Sua solicitação foi enviada. O gestor do setor será notificado.",
    });
    onFormSubmit();
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <FormField
          control={form.control}
          name="sector"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seu Setor / Unidade</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o seu setor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sectors.map(sector => (
                    <SelectItem key={sector.id} value={sector.name}>{sector.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo da Viagem / Trabalho</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Levar documentos ao Fórum ou Visita técnica" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Destino</FormLabel>
                <FormControl>
                <Input placeholder="Endereço ou local de destino" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="departureDate"
                render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Data Desejada</FormLabel>
                    <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                            )}
                        >
                            {field.value ? format(field.value, "dd/MM/yyyy") : <span>Escolha uma data</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="departureTime"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <FormControl>
                    <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações Adicionais</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Alguma informação adicional importante?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="bg-muted/50 p-3 rounded-lg flex items-start gap-2 border">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-tight">
                Os dados geográficos e motivos de viagem informados são coletados exclusivamente para fins de auditoria e otimização logística da organização, em conformidade com a <Link href="/privacy" className="underline">Política de Privacidade (LGPD)</Link>.
            </p>
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          Enviar Pedido de Transporte
        </Button>
      </form>
    </Form>
  );
}
