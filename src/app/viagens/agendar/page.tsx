"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { drivers, vehicles } from '@/lib/data';

const formSchema = z.object({
  title: z.string().min(5, "O título da viagem é obrigatório."),
  sector: z.string().min(1, "O setor solicitante é obrigatório."),
  category: z.string().min(1, "A categoria da viagem é obrigatória."),
  driver: z.string().min(1, "É necessário selecionar um motorista."),
  vehicle: z.string().min(1, "É necessário selecionar um veículo."),
  origin: z.string().min(3, "O local de origem é obrigatório."),
  destination: z.string().min(3, "O local de destino é obrigatório."),
  description: z.string().optional(),
});

const tripCategoriesBySector: Record<string, string[]> = {
  "Secretaria de Saúde": ["Transporte de Paciente", "Consulta Agendada", "Entrega de Medicamentos"],
  "Secretaria de Educação": ["Transporte Escolar Diário", "Viagem Pedagógica", "Transporte de Professores"],
  "Secretaria de Obras": ["Visita Técnica", "Transporte de Material", "Inspeção de Obra"],
  "Administração": ["Entrega de Documentos", "Reunião Externa", "Serviço Bancário"],
  "Vigilância Sanitária": ["Inspeção Sanitária", "Coleta de Amostras", "Ação Educativa"],
};

export default function ScheduleTripPage() {
  const { toast } = useToast();
  const router = useRouter();

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
      description: '',
    },
  });

  const selectedSector = form.watch('sector');

  useEffect(() => {
    form.setValue('category', '');
  }, [selectedSector, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Agendamento Enviado",
      description: "A solicitação de viagem foi criada e aguarda aprovação.",
    });
    router.push('/viagens');
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-3xl">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl">Agendar Nova Viagem</CardTitle>
          <CardDescription>Preencha o formulário para solicitar um veículo e agendar um deslocamento.</CardDescription>
        </CardHeader>
        <CardContent>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria da Viagem</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedSector}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={selectedSector ? "Selecione a categoria" : "Selecione um setor primeiro"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedSector && tripCategoriesBySector[selectedSector]?.map(category => (
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o motorista" />
                            </Trigger>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o veículo" />
                            </Trigger>
                          </FormControl>
                          <SelectContent>
                             {vehicles.map(vehicle => (
                                <SelectItem key={vehicle.id} value={`${vehicle.vehicleModel} (${vehicle.licensePlate})`}>
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

              <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90">Enviar Solicitação</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
