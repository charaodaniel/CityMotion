
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
import type { Employee } from '@/lib/types';
import { useEffect } from 'react';
import { useApp } from '@/contexts/app-provider';

const formSchema = z.object({
  name: z.string().min(2, "O nome completo deve ter pelo menos 2 caracteres."),
  matricula: z.string().min(1, "A matrícula é obrigatória."),
  role: z.string().min(1, "O cargo é obrigatório."),
  cnh: z.string().optional(),
  sector: z.string().min(3, "O setor é obrigatório."),
  idPhoto: z.any().optional(),
  cnhPhoto: z.any().optional(),
});

interface RegisterEmployeeFormProps {
  onFormSubmit: (data: Partial<Employee>) => void;
  existingEmployee?: Employee | null;
}

export function RegisterEmployeeForm({ onFormSubmit, existingEmployee }: RegisterEmployeeFormProps) {
  const { toast } = useToast();
  const { sectors } = useApp();
  const isEditMode = !!existingEmployee;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      matricula: '',
      role: '',
      cnh: '',
      sector: '',
    },
  });

  useEffect(() => {
    if (isEditMode) {
      form.reset({
        name: existingEmployee.name,
        matricula: existingEmployee.matricula,
        role: existingEmployee.role,
        cnh: existingEmployee.cnh,
        sector: existingEmployee.sector,
      });
    }
  }, [isEditMode, existingEmployee, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const dataToSubmit: Partial<Employee> = {
      ...values,
      idPhoto: values.idPhoto?.[0]?.name,
      cnhPhoto: values.cnhPhoto?.[0]?.name,
    };
    onFormSubmit(dataToSubmit);
    toast({
      title: isEditMode ? "Cadastro Atualizado" : "Cadastro Enviado",
      description: `O cadastro do funcionário foi ${isEditMode ? 'atualizado' : 'realizado'} com sucesso.`,
    });
    form.reset();
  };

  const employeeRoles = ["Motorista", "Secretário(a)", "Médico(a)", "Enfermeiro(a)", "Técnico Administrativo", "Professor(a)", "Engenheiro(a)"];


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">Informações Pessoais e Funcionais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do funcionário" {...field} />
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cargo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employeeRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sectors.map(sector => <SelectItem key={sector.id} value={sector.name}>{sector.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cnh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nº da CNH (se aplicável)</FormLabel>
                  <FormControl>
                    <Input placeholder="0123456789" {...field} />
                  </FormControl>
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
                  <FormLabel>Foto da CNH (se aplicável)</FormLabel>
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
            <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90">
                {isEditMode ? 'Salvar Alterações' : 'Enviar Cadastro'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
