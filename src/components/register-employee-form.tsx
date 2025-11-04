
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

// Esquema Zod atualizado para lidar com objetos de arquivo
const formSchema = z.object({
  name: z.string().min(2, "O nome completo deve ter pelo menos 2 caracteres."),
  matricula: z.string().min(1, "A matrícula é obrigatória."),
  email: z.string().email("Por favor, insira um email válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres.").optional().or(z.literal('')),
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
      email: '',
      password: '',
      role: '',
      cnh: '',
      sector: '',
    },
  });

  useEffect(() => {
    if (isEditMode && existingEmployee) {
      form.reset({
        name: existingEmployee.name,
        matricula: existingEmployee.matricula,
        email: existingEmployee.email,
        // A senha não é pré-preenchida por segurança
        role: existingEmployee.role,
        cnh: existingEmployee.cnh,
        sector: existingEmployee.sector,
      });
    }
  }, [isEditMode, existingEmployee, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const dataToSubmit: Partial<Employee> = {
      ...values,
      // Se um arquivo foi selecionado, pegue o nome dele.
      // Em uma aplicação real, aqui você faria o upload do arquivo.
      idPhoto: values.idPhoto?.[0]?.name || existingEmployee?.idPhoto,
      cnhPhoto: values.cnhPhoto?.[0]?.name || existingEmployee?.cnhPhoto,
    };

    // Não envia a senha se o campo estiver vazio (útil em edições)
    if (!dataToSubmit.password) {
      delete dataToSubmit.password;
    }

    onFormSubmit(dataToSubmit);
    toast({
      title: isEditMode ? "Cadastro Atualizado" : "Cadastro Enviado",
      description: `O cadastro do funcionário foi ${isEditMode ? 'atualizado' : 'realizado'} com sucesso.`,
    });
    form.reset();
  };
  
  const employeeRoles = ["Motorista", "Motorista de Ambulância", "Motorista Escolar", "Secretário(a)", "Médico(a)", "Enfermeiro(a)", "Técnico Administrativo", "Professor(a)", "Engenheiro(a)", "Operador de Máquinas", "Prefeito", "Assessor de Comunicação", "Agente de Arrecadação", "Assistente Social", "Psicóloga", "Veterinário", "Estagiário de TI"];


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">Credenciais de Acesso</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email.de@acesso.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={isEditMode ? "Deixe em branco para não alterar" : "Senha de 6+ dígitos"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
        </div>
        <Separator />
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
                      {employeeRoles.sort().map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
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
           <p className="text-sm text-muted-foreground mb-4">
              {isEditMode ? "Para alterar um documento, basta fazer um novo upload." : "Faça o upload dos documentos necessários."}
            </p>
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
                  <FormLabel>Foto da CNH (se motorista)</FormLabel>
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
            <Button type="submit" className="w-full md:w-auto">
                {isEditMode ? 'Salvar Alterações' : 'Cadastrar Funcionário'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
