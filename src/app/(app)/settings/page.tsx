
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
import { Mail, Globe, ShieldCheck, Cpu, HardDrive, Network, Server, Settings2 } from 'lucide-react';
import { useApp } from '@/contexts/app-provider';
import { Separator } from '@/components/ui/separator';

const settingsSchema = z.object({
  organizationName: z.string().min(3, "Nome obrigatório"),
  defaultRequestPriority: z.enum(['Baixa', 'Média', 'Alta']),
  requireDestination: z.boolean(),
  
  // Infraestrutura Local
  smtpHost: z.string(),
  smtpPort: z.coerce.number(),
  smtpUser: z.string(),
  smtpPass: z.string(),
  smtpSecure: z.boolean(),

  platformIp: z.string().ip({ version: "v4" }),
  dnsHost: z.string(),
  proxyEnabled: z.boolean(),
  proxyUrl: z.string().optional(),
  
  autoBackup: z.boolean(),
  dualDatabaseSync: z.boolean()
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
      smtpHost: '127.0.0.1',
      smtpPort: 587,
      smtpUser: 'admin',
      smtpPass: '******',
      smtpSecure: false,
      platformIp: '192.168.1.100',
      dnsHost: 'citymotion.local',
      proxyEnabled: false,
      proxyUrl: '',
      autoBackup: true,
      dualDatabaseSync: true
    },
  });

  const onSubmit = (values: z.infer<typeof settingsSchema>) => {
    toast({
      title: "Protocolo de Infraestrutura Atualizado",
      description: "As configurações de rede e persistência foram salvas no kernel.",
    });
  };

  const isITAdmin = ['dev', 'ti', 'admin'].includes(userRole);

  return (
    <div className="container mx-auto p-4 sm:p-8 space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter flex items-center gap-4 text-on-surface">
          <Settings2 className="h-10 w-10 text-primary" />
          Gerenciamento da Instância
        </h1>
        <p className="text-muted-foreground font-medium text-lg">
          Controle de protocolos de rede, persistência local e segurança.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="operations" className="space-y-6">
            <TabsList className="bg-sidebar border border-border/50 p-1 w-full lg:w-fit justify-start h-auto gap-1">
              <TabsTrigger value="operations" className="text-[10px] font-bold uppercase tracking-widest px-6">Operações</TabsTrigger>
              <TabsTrigger value="network" className="text-[10px] font-bold uppercase tracking-widest px-6">Rede & Proxy</TabsTrigger>
              <TabsTrigger value="database" className="text-[10px] font-bold uppercase tracking-widest px-6">Persistência</TabsTrigger>
              <TabsTrigger value="communication" className="text-[10px] font-bold uppercase tracking-widest px-6">E-mail (SMTP)</TabsTrigger>
            </TabsList>

            {/* ABA OPERAÇÕES */}
            <TabsContent value="operations">
              <Card className="bg-sidebar/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-widest text-primary">Regras de Negócio</CardTitle>
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
            </TabsContent>

            {/* ABA REDE & PROXY */}
            <TabsContent value="network">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-sidebar/50 border-border/50 scanlines">
                  <CardHeader><CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Network className="h-4 w-4" /> Protocolos de Rede</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="platformIp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">IP do Servidor Local</FormLabel>
                          <FormControl><Input className="bg-black/40 font-mono text-xs" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dnsHost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Nome de Host Interno</FormLabel>
                          <FormControl><Input className="bg-black/40 font-mono text-xs" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="bg-sidebar/50 border-border/50">
                  <CardHeader><CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Globe className="h-4 w-4" /> Gateway e Proxy</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="proxyEnabled"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-3 border rounded bg-black/20">
                          <FormLabel className="text-xs">Habilitar Saída via Proxy</FormLabel>
                          <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="proxyUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">URL do Proxy</FormLabel>
                          <FormControl><Input className="bg-black/40 text-xs" placeholder="http://proxy.internal:3128" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ABA PERSISTÊNCIA */}
            <TabsContent value="database">
               <Card className="bg-zinc-950 border-primary/20 tui-scanline">
                <CardHeader><CardTitle className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2"><HardDrive className="h-4 w-4" /> Nexus-Dual Engine</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-md">
                    <p className="text-[11px] font-mono text-primary/70 leading-relaxed">
                      [INFO] O sistema está operando em modo de persistência espelhada. 
                      Dados locais (SQLite) são sincronizados atomicamente com o PostgreSQL da nuvem.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="dualDatabaseSync"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between p-4 border rounded bg-black/40">
                            <div><FormLabel className="text-xs uppercase font-bold">Sync Híbrido Ativo</FormLabel></div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="autoBackup"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between p-4 border rounded bg-black/40">
                            <div><FormLabel className="text-xs uppercase font-bold">Auto-Backup SQLite</FormLabel></div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          </FormItem>
                        )}
                      />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ABA COMUNICAÇÃO */}
            <TabsContent value="communication">
               <Card className="bg-sidebar/50 border-border/50">
                  <CardHeader><CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Mail className="h-4 w-4" /> Servidor de E-mail (SMTP)</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField
                        control={form.control}
                        name="smtpHost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Host SMTP</FormLabel>
                            <FormControl><Input className="bg-black/40 text-xs" {...field} /></FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="smtpPort"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Porta</FormLabel>
                            <FormControl><Input type="number" className="bg-black/40 text-xs" {...field} /></FormControl>
                          </FormItem>
                        )}
                      />
                  </CardContent>
               </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-8 border-t border-border/30">
            <Button type="submit" className="h-12 px-12 bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/20">
              Sincronizar Kernel & Salvar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
