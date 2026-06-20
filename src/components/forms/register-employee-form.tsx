"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { Employee } from '@/lib/types';
import { useEffect } from 'react';
import { useApp } from '@/contexts/app-provider';
import { Checkbox } from '@/components/ui/checkbox';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(2, "O nome completo deve ter pelo menos 2 caracteres."),
  matricula: z.string().min(1, "A matrícula é obrigatória."),
  email: z.string().email("Por favor, insira um email válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres.").optional().or(z.literal('')),
  role: z.string().min(1, "O cargo é obrigatório."),
  cnh: z.string().optional(),
  sector: z.array(z.string()).min(1, "Selecione ao menos um setor."),
  idPhoto: z.any().optional(),
  cnhPhoto: z.any().optional(),
  lgpdConsent: z.boolean().refine(val => val === true, "É necessário aceitar os termos de uso de dados."),
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
      sector: [],
      lgpdConsent: isEditMode,
    },
  });

  useEffect(() => {
    if (isEditMode && existingEmployee) {
      form.reset({
        name: existingEmployee.name || '',
        matricula: existingEmployee.matricula || '',
        email: existingEmployee.email || '',
        role: existingEmployee.role || '',
        cnh: existingEmployee.cnh || '',
        sector: Array.isArray(existingEmployee.sector) ? existingEmployee.sector : [],
        lgpdConsent: true,
      });
    }
  }, [isEditMode, existingEmployee, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { lgpdConsent, ...rest } = values;
    const dataToSubmit: Partial<Employee> = {
      ...rest,
      idPhoto: values.idPhoto?.[0]?.name || existingEmployee?.idPhoto,
      cnhPhoto: values.cnhPhoto?.[0]?.name || existingEmployee?.cnhPhoto,
    };

    if (!dataToSubmit.password) {
      delete dataToSubmit.password;
    }

    onFormSubmit(dataToSubmit);
    toast({
      title: isEditMode ? "Cadastro Atualizado" : "Cadastro Enviado",
      description: `O cadastro do colaborador foi ${isEditMode ? 'atualizado' : 'realizado'} com sucesso.`,
    });
    form.reset();
  };
  
  const employeeRoles = ["Motorista", "Motorista de Ambulância", "Motorista Escolar", "Secretário(a)", "Médico(a)", "Enfermeiro(a)", "Técnico Administrativo", "Professor(a)", "Engenheiro(a)", "Operador de Máquinas", "Gerente Geral", "Diretor", "CEO", "Coordenador de Setor", "Supervisor", "Estagiário", "Técnico de TI", "Técnico Mecânico"];


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
                    <FormLabel>Email Corporativo</FormLabel>
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
          <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Informações Pessoais e Funcionais (LGPD)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do colaborador" {...field} />
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
                  <FormLabel>Matrícula / ID Interno</FormLabel>
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
              name="cnh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nº da CNH (apenas para motoristas)</FormLabel>
                  <FormControl>
                    <Input placeholder="0123456789" {...field} />
                  </FormControl>
                  <FormDescription className="text-[10px]">
                    Dado coletado para fins de validação jurídica de condutor.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
           <FormField
              control={form.control}
              name="sector"
              render={() => (
                <FormItem className="mt-6">
                  <div className="mb-4">
                    <FormLabel className="text-base">Setor(es) de Lotação</FormLabel>
                    <FormMessage />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {sectors.map((sector) => (
                      <FormField
                        key={sector.id}
                        control={form.control}
                        name="sector"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={sector.id}
                              className="flex flex-row items-center space-x-2 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(sector.name)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), sector.name])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== sector.name
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {sector.name}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
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
                  <FormLabel>Foto Funcional (3x4)</FormLabel>
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
                  <FormLabel>Foto da CNH (se condutor)</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*,application/pdf" onChange={(event) => onChange(event.target.files)} {...fieldProps} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <FormField
          control={form.control}
          name="lgpdConsent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/30">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Declaro que li e aceito a <Link href="/privacy" className="text-primary underline">Política de Privacidade</Link>
                </FormLabel>
                <FormDescription className="text-xs">
                  Autorizo o processamento dos dados acima pela organização para fins de gestão operacional da frota municipal/corporativa, conforme a LGPD.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
            <Button type="submit" className="w-full md:w-auto h-10 font-bold uppercase tracking-widest text-xs">
                {isEditMode ? 'Salvar Alterações' : 'Cadastrar Colaborador'}
            </Button>
        </div>
      </form>
    </Form>
  );
}