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

const formSchema = z.object({
  fullName: z.string().min(2, "O nome completo deve ter pelo menos 2 caracteres."),
  matricula: z.string().min(1, "A matrícula é obrigatória."),
  cnh: z.string().min(9, "O número da CNH é obrigatório."),
  sector: z.string().min(3, "O setor é obrigatório."),
  idPhoto: z.any().refine(files => files?.length == 1, "A foto 3x4 é obrigatória."),
  cnhPhoto: z.any().refine(files => files?.length == 1, "A foto da CNH é obrigatória."),
});

interface RegisterDriverFormProps {
  onFormSubmit: () => void;
}

export function RegisterDriverForm({ onFormSubmit }: RegisterDriverFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      matricula: '',
      cnh: '',
      sector: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Cadastro Enviado",
      description: "O cadastro do motorista foi realizado com sucesso.",
    });
    onFormSubmit();
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do motorista" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="matricula"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matrícula</FormLabel>
                  <FormControl>
                    <Input placeholder="Número da matrícula" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cnh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nº da CNH</FormLabel>
                  <FormControl>
                    <Input placeholder="0123456789" {...field} />
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
                  <FormLabel>Setor de Lotação</FormLabel>
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
          </div>
        </div>
        
        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-4">Documentação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="idPhoto"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Foto 3x4</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={(event) => onChange(event.target.files)} {...fieldProps} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cnhPhoto"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Foto da CNH</FormLabel>
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
            <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90">Enviar Cadastro</Button>
        </div>
      </form>
    </Form>
  );
}
