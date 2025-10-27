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

const formSchema = z.object({
  driverName: z.string().min(2, "O nome do motorista deve ter pelo menos 2 caracteres."),
  vehicleModel: z.string().min(3, "O modelo do veículo é obrigatório."),
  licensePlate: z.string().min(3, "A placa deve ser uma placa de táxi válida.").regex(/^TAXI-\d{3,}/, "O formato deve ser TAXI-XXX"),
  taxiPermit: z.any().refine(files => files?.length == 1, "A permissão de táxi é obrigatória."),
  vehicleInspection: z.any().refine(files => files?.length == 1, "O documento de inspeção do veículo é obrigatório."),
});

export default function RegisterTaxiPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        driverName: '',
        vehicleModel: '',
        licensePlate: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Cadastro de Táxi Enviado",
      description: "O cadastro do táxi está pendente de verificação.",
    });
    router.push('/taxis');
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Cadastro de Táxi</CardTitle>
          <CardDescription>Preencha o formulário abaixo para cadastrar um novo táxi na frota.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <h3 className="font-headline text-lg font-semibold">Informações do Táxi e Motorista</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="driverName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo do Motorista</FormLabel>
                      <FormControl>
                        <Input placeholder="Carlos Silva" {...field} />
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
                      <FormLabel>Placa do Táxi</FormLabel>
                      <FormControl>
                        <Input placeholder="TAXI-123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo do Veículo</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Fiat Cronos 2023" {...field} />
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
                  name="taxiPermit"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Documento de Permissão do Táxi</FormLabel>
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
                      <FormLabel>Certificado de Inspeção do Veículo</FormLabel>
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
