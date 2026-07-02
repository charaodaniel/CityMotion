"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings2, Building2, Server } from 'lucide-react';
import { useApp } from '@/contexts/app-provider';
import { InfrastructurePanel } from '@/components/infrastructure-panel';

const settingsSchema = z.object({
  organizationName: z.string().min(3, "Nome obrigatório"),
  defaultRequestPriority: z.enum(['Baixa', 'Média', 'Alta']),
  requireDestination: z.boolean(),
});

export default function SettingsPage() {
  const { toast } = useToast();
  const { userRole } = useApp();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      organizationName: 'Instância Local CityMotion',
      defaultRequestPriority: 'Média',
      requireDestination: true,
    },
  });

  const onSubmit = (values: z.infer<typeof settingsSchema>) => {
    toast({
      title: "Configurações Salvas",
      description: "As regras de negócio foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter flex items-center gap-4 text-on-surface">
          <Settings2 className="h-10 w-10 text-primary" />
          Configurações
        </h1>
        <p className="text-muted-foreground font-medium text-lg">
          Gerencie regras de negócio e infraestrutura do sistema.
        </p>
      </div>

      <Tabs defaultValue="operations" className="space-y-6">
        <TabsList className="bg-sidebar border border-border/50 p-1 w-full lg:w-fit justify-start h-auto gap-1">
          <TabsTrigger value="operations" className="text-[10px] font-bold uppercase tracking-widest px-6 gap-1.5">
            <Building2 className="h-3 w-3" /> Operações
          </TabsTrigger>
          <TabsTrigger value="infrastructure" className="text-[10px] font-bold uppercase tracking-widest px-6 gap-1.5">
            <Server className="h-3 w-3" /> Infraestrutura
          </TabsTrigger>
        </TabsList>

        {/* ABA OPERAÇÕES */}
        <TabsContent value="operations">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card className="bg-sidebar/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-widest text-primary">Regras de Negócio</CardTitle>
                  <CardDescription className="text-xs">
                    Configurações gerais de operação da organização.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Unidade / Prefeitura</FormLabel>
                        <FormControl><Input className="bg-black/20" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="defaultRequestPriority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prioridade Padrão</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="Baixa">Baixa</SelectItem>
                              <SelectItem value="Média">Média</SelectItem>
                              <SelectItem value="Alta">Alta</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="requireDestination"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-4 border rounded-lg bg-black/20 mt-4">
                          <div>
                            <FormLabel>Exigir Destino</FormLabel>
                            <FormDescription className="text-[10px]">Obriga o preenchimento detalhado.</FormDescription>
                          </div>
                          <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end pt-8 border-t border-border/30">
                <Button type="submit" className="h-12 px-12 bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/20">
                  Salvar Configurações
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        {/* ABA INFRAESTRUTURA */}
        <TabsContent value="infrastructure">
          <InfrastructurePanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
