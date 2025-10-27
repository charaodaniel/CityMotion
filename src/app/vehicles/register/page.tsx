"use client";

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

const formSchema = z.object({
  driverName: z.string().min(2, "O nome do motorista é obrigatório."),
  vehicleModel: z.string().min(3, "O modelo do veículo é obrigatório."),
  licensePlate: z.string().min(7, "A placa deve ter o formato ABC-1234.").max(8),
  sector: z.string().min(3, "O setor responsável é obrigatório."),
  mileage: z.coerce.number().min(0, "A quilometragem não pode ser negativa."),
  vehicleRegistration: z.any().refine(files => files?.length == 1, "O CRLV é obrigatório."),
  vehicleInspection: z.any().refine(files => files?.length == 1, "O documento de inspeção é obrigatório."),
});

export default function RegisterVehiclePage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        driverName: '',
        vehicleModel: '',
        licensePlate: '',
        sector: '',
        mileage: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Cadastro de Veículo Enviado",
      description: "O novo veículo foi adicionado à frota e está pendente de verificação.",
    });
    router.push('/vehicles');
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Cadastro de Veículo</CardTitle>
          <CardDescription>Preencha o formulário para adicionar um novo veículo à frota municipal.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <h3 className="font-headline text-lg font-semibold">Informações do Veículo e Motorista</h3>
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
                  name="driverName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Motorista Principal</FormLabel>
                      <FormControl>
                        <Input placeholder="Carlos Silva" {...field} />
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
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quilometragem Inicial</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="font-headline text-lg font-semibold">Documentação</h3>
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
              <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90">Enviar Cadastro</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
