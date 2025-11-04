"use client";

import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Trash2, UserPlus } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { useApp } from '@/contexts/app-provider';

const passengerSchema = z.object({
  name: z.string().min(3, "O nome do passageiro é obrigatório."),
  document: z.string().min(5, "O documento é obrigatório."),
});

const formSchema = z.object({
  title: z.string().min(5, "O título da viagem é obrigatório."),
  sector: z.string().min(1, "O setor solicitante é obrigatório."),
  category: z.string().min(1, "A categoria da viagem é obrigatória."),
  driver: z.string().min(1, "É necessário selecionar um motorista."),
  vehicle: z.string().min(1, "É necessário selecionar um veículo."),
  origin: z.string().min(3, "O local de origem é obrigatório."),
  destination: z.string().min(3, "O local de destino é obrigatório."),
  departureDate: z.date({ required_error: "A data de partida é obrigatória." }),
  departureTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido. Use HH:MM."),
  passengers: z.array(passengerSchema).optional(),
  description: z.string().optional(),
});

interface ScheduleTripFormProps {
  onFormSubmit: () => void;
}

export function ScheduleTripForm({ onFormSubmit }: ScheduleTripFormProps) {
  const { toast } = useToast();
  const { employees, vehicles, sectors } = useApp();
  const drivers = employees.filter(e => e.role === 'Motorista');

  const tripCategoriesBySector: Record<string, string[]> = {
    "Secretaria de Saúde": ["Transporte de Paciente", "Consulta Agendada", "Entrega de Medicamentos"],
    "Secretaria de Educação": ["Transporte Escolar Diário", "Viagem Pedagógica", "Transporte de Professores"],
    "Secretaria de Obras": ["Visita Técnica", "Transporte de Material", "Inspeção de Obra"],
    "Administração": ["Entrega de Documentos", "Reunião Externa", "Serviço Bancário"],
    "Vigilância Sanitária": ["Inspeção Sanitária", "Coleta de Amostras", "Ação Educativa"],
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      sector: '',
      category: '',
      driver: '',
      vehicle: '',
      origin: '',
      destination: '',
      departureTime: '',
      passengers: [],
      description: '',
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "passengers",
  });

  const selectedSector = form.watch('sector');

  useEffect(() => {
    form.setValue('category', '');
  }, [selectedSector, form]);

  const onSubmit = (values: z.infer<typeof formSchema>>) => {
    console.log(values);
    toast({
      title: "Agendamento Enviado",
      description: "A solicitação de viagem foi criada e aguarda aprovação.",
    });
    onFormSubmit();
    form.reset();
  };


  return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título da Viagem</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Transporte de equipe para evento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Detalhes da Viagem</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="sector"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Setor Solicitante</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o setor" />
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria da Viagem</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!selectedSector}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={selectedSector ? "Selecione a categoria" : "Selecione um setor primeiro"}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedSector &&
                              tripCategoriesBySector[selectedSector]?.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="driver"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motorista Responsável</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o motorista" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {drivers.map(driver => (
                              <SelectItem key={driver.id} value={driver.name}>{driver.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vehicle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Veículo Designado</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o veículo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vehicles.map(vehicle => (
                              <SelectItem
                                key={vehicle.id}
                                value={`${vehicle.vehicleModel} (${vehicle.licensePlate})`}
                              >
                                {vehicle.vehicleModel} ({vehicle.licensePlate})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="departureDate"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Data de Partida</FormLabel>
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
                                {field.value ? format(field.value, "PPP") : <span>Escolha uma data</span>}
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
                      <FormLabel>Horário de Partida</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origem</FormLabel>
                      <FormControl>
                        <Input placeholder="Local de partida" {...field} />
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
                        <Input placeholder="Local de chegada" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

                <Separator />
                
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Passageiros</h3>
                         <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ name: '', document: '' })}
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Adicionar Passageiro
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-4 p-4 border rounded-md">
                            <div className="grid grid-cols-2 gap-4 flex-1">
                                <FormField
                                    control={form.control}
                                    name={`passengers.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome do Passageiro</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nome completo" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`passengers.${index}.document`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CPF/RG</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Número do documento" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        ))}
                        {fields.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">Nenhum passageiro adicionado.</p>
                        )}
                    </div>
                </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo/Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o motivo da viagem, pessoas envolvidas ou outras informações relevantes."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90">
                Enviar Solicitação
              </Button>
            </form>
          </Form>
  );
}
