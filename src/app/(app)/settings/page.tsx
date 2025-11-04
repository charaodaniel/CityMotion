
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const settingsSchema = z.object({
  // Visual Identity
  organizationName: z.string().min(3, "O nome da organização é obrigatório."),
  logo: z.any().optional(),
  primaryColor: z.string().regex(/^(\d{1,3})\s(\d{1,3})%\s(\d{1,3})%$/, "Formato HSL inválido. Ex: 215 80% 55%"),
  accentColor: z.string().regex(/^(\d{1,3})\s(\d{1,3})%\s(\d{1,3})%$/, "Formato HSL inválido. Ex: 140 70% 40%"),
  backgroundColor: z.string().regex(/^(\d{1,3})\s(\d{1,3})%\s(\d{1,3})%$/, "Formato HSL inválido. Ex: 220 20% 98%"),

  // Operations
  defaultRequestPriority: z.enum(['Baixa', 'Média', 'Alta']),
  requireDestination: z.boolean().default(false),
  maintenanceMileageThreshold: z.coerce.number().min(0, "A quilometragem deve ser um valor positivo.").optional(),
});

export default function SettingsPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      organizationName: 'Prefeitura Municipal',
      primaryColor: '215 80% 55%',
      accentColor: '140 70% 40%',
      backgroundColor: '220 20% 98%',
      defaultRequestPriority: 'Baixa',
      requireDestination: false,
      maintenanceMileageThreshold: 20000,
    },
  });

  const onSubmit = (values: z.infer<typeof settingsSchema>) => {
    console.log(values);
    // Aqui você aplicaria a lógica para atualizar o tema dinamicamente
    document.documentElement.style.setProperty('--primary', values.primaryColor);
    document.documentElement.style.setProperty('--accent', values.accentColor);
    document.documentElement.style.setProperty('--background', values.backgroundColor);

    toast({
      title: "Configurações Salvas",
      description: "As preferências do sistema foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Configurações
        </h1>
        <p className="text-muted-foreground">
          Gerencie as configurações, personalizações e regras do sistema.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="visual">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="visual">Identidade Visual</TabsTrigger>
              <TabsTrigger value="operations">Operações</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>
                    Parâmetros gerais de funcionamento do sistema.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <FormField
                      control={form.control}
                      name="organizationName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Organização</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Prefeitura de..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="logo"
                      render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Logo da Organização</FormLabel>
                          <FormControl>
                            <Input type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={(event) => onChange(event.target.files)} {...fieldProps} />
                          </FormControl>
                          <FormDescription>
                            Faça o upload do logo (recomendado: formato SVG ou PNG com fundo transparente).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visual">
              <Card>
                <CardHeader>
                  <CardTitle>Cores do Tema</CardTitle>
                  <CardDescription>
                    Personalize as cores do sistema para combinar com a identidade visual da sua prefeitura. Insira os valores no formato HSL (matiz, saturação, luminosidade). Ex: 215 80% 55%
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor Primária</FormLabel>
                          <FormControl>
                            <Input placeholder="215 80% 55%" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="accentColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor de Destaque</FormLabel>
                          <FormControl>
                            <Input placeholder="140 70% 40%" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="backgroundColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor de Fundo</FormLabel>
                          <FormControl>
                            <Input placeholder="220 20% 98%" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="operations">
              <Card>
                <CardHeader>
                  <CardTitle>Regras de Operação</CardTitle>
                  <CardDescription>
                    Defina regras para os fluxos de viagens e manutenção.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h3 className="text-md font-medium">Viagens</h3>
                    <Separator className="my-4" />
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="defaultRequestPriority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prioridade Padrão para Solicitações</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma prioridade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Baixa">Baixa</SelectItem>
                                <SelectItem value="Média">Média</SelectItem>
                                <SelectItem value="Alta">Alta</SelectItem>
                              </SelectContent>
                            </Select>
                             <FormDescription>Define a prioridade inicial para todas as novas solicitações de transporte.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="requireDestination"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Exigir Destino na Solicitação</FormLabel>
                              <FormDescription>
                                Se ativado, o campo "Destino" será obrigatório no formulário de solicitação rápida.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-medium">Manutenção</h3>
                    <Separator className="my-4" />
                     <FormField
                        control={form.control}
                        name="maintenanceMileageThreshold"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alerta de Revisão Preventiva (km)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Ex: 10000" {...field} />
                            </FormControl>
                            <FormDescription>
                                O sistema irá sugerir uma revisão preventiva quando um veículo atingir esta quilometragem desde a última revisão.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4">
             <Button type="submit" className="w-full md:w-auto">
                Salvar Todas as Configurações
              </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
