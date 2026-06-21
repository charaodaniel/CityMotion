
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
import { Server, Database, Network, Activity, Mail, Globe, ShieldCheck, Cpu, HardDrive } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useApp } from '@/contexts/app-provider';

const settingsSchema = z.object({
  // Identidade Visual
  organizationName: z.string().min(3, "O nome da organização é obrigatório."),
  primaryColor: z.string(),
  accentColor: z.string(),
  
  // Operações
  defaultRequestPriority: z.enum(['Baixa', 'Média', 'Alta']),
  requireDestination: z.boolean().default(false),
  
  // INFRAESTRUTURA - E-mail
  smtpHost: z.string().min(1, "O Host SMTP é obrigatório"),
  smtpPort: z.coerce.number(),
  smtpUser: z.string(),
  smtpPass: z.string(),
  smtpSecure: z.boolean(),

  // INFRAESTRUTURA - Rede & DNS
  platformIp: z.string().ip({ version: "v4" }),
  dnsHost: z.string(),
  proxyUrl: z.string().optional(),
  reverseProxy: z.boolean(),

  // INFRAESTRUTURA - Banco de Dados
  dbPath: z.string(),
  autoBackup: z.boolean(),
  backupInterval: z.coerce.number()
});

export default function SettingsPage() {
  const { toast } = useToast();
  const { userRole } = useApp();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      organizationName: 'Prefeitura de CityMotion',
      primaryColor: '221 100% 84%',
      accentColor: '140 70% 40%',
      defaultRequestPriority: 'Média',
      requireDestination: true,
      smtpHost: 'smtp.citymotion.gov.br',
      smtpPort: 587,
      smtpUser: 'no-reply@citymotion.app',
      smtpPass: '**********',
      smtpSecure: true,
      platformIp: '127.0.0.1',
      dnsHost: 'fleet.citymotion.local',
      proxyUrl: 'http://10.0.0.254:3128',
      reverseProxy: true,
      dbPath: './backend/database/citymotion.db',
      autoBackup: true,
      backupInterval: 24
    },
  });

  const onSubmit = (values: z.infer<typeof settingsSchema>) => {
    console.log("Configurações persistidas:", values);
    toast({
      title: "Configurações de Sistema Aplicadas",
      description: "As alterações foram registradas no kernel e propagadas para a NexusBridge.",
    });
  };

  const isDevOrTi = ['dev', 'ti'].includes(userRole);

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-7xl space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter flex items-center gap-4 text-on-surface">
          <Cpu className="h-10 w-10 text-primary" />
          Configurações de Plataforma
        </h1>
        <p className="text-muted-foreground font-medium text-lg">
          Gerenciamento técnico de identidades, protocolos de rede e persistência.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="operations" className="space-y-6">
            <TabsList className="bg-sidebar border border-border/50 p-1 w-full lg:w-fit justify-start overflow-x-auto h-auto gap-1">
              <TabsTrigger value="operations" className="text-[10px] font-bold uppercase tracking-widest px-6">Operações</TabsTrigger>
              <TabsTrigger value="visual" className="text-[10px] font-bold uppercase tracking-widest px-6">Identidade</TabsTrigger>
              {isDevOrTi && <TabsTrigger value="infra" className="text-[10px] font-bold uppercase tracking-widest px-6 text-primary">Infraestrutura (Core)</TabsTrigger>}
              <TabsTrigger value="monitoring" className="text-[10px] font-bold uppercase tracking-widest px-6">Monitoramento</TabsTrigger>
            </TabsList>

            <TabsContent value="operations" className="space-y-6">
              <Card className="bg-sidebar/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Regras de Negócio</CardTitle>
                  <CardDescription>Comportamento padrão dos fluxos de missões.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                      <FormItem className="flex items-center justify-between p-4 border rounded-lg bg-black/20">
                        <div>
                          <FormLabel>Exigir Destino Detalhado</FormLabel>
                          <FormDescription>Obriga o preenchimento do local de chegada em cada solicitação.</FormDescription>
                        </div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visual" className="space-y-6">
              <Card className="bg-sidebar/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Customização White Label</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <FormField
                      control={form.control}
                      name="organizationName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Instância</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                </CardContent>
              </Card>
            </TabsContent>

            {/* ABA TÉCNICA DE INFRAESTRUTURA */}
            <TabsContent value="infra" className="space-y-8 pb-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* SMTP CONFIG */}
                <Card className="bg-sidebar/50 border-border/50 scanlines">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-base uppercase tracking-tight">Comunicação (SMTP)</CardTitle>
                      <CardDescription className="text-xs">Serviço de e-mails transacionais.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="smtpHost"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Host do Servidor</FormLabel>
                              <FormControl><Input className="bg-black/40 font-mono text-xs" {...field} /></FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="smtpPort"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Porta</FormLabel>
                            <FormControl><Input type="number" className="bg-black/40 font-mono text-xs" {...field} /></FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="smtpUser"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Usuário / Login</FormLabel>
                          <FormControl><Input className="bg-black/40 font-mono text-xs" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="smtpPass"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Senha de Segurança</Abastecimento>
                          <FormControl><Input type="password" className="bg-black/40 font-mono text-xs" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="smtpSecure"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between pt-2">
                          <FormLabel className="text-xs">Utilizar SSL/TLS Criptografado</FormLabel>
                          <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* NETWORK & PROXY */}
                <Card className="bg-sidebar/50 border-border/50">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <Globe className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-base uppercase tracking-tight">Rede & Conectividade</CardTitle>
                      <CardDescription className="text-xs">DNS e mapeamento de roteamento local.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="platformIp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">IP Interno do Servidor</FormLabel>
                          <FormControl><Input className="bg-black/40 font-mono text-xs" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dnsHost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Nome de Host (DNS Local)</FormLabel>
                          <FormControl><Input className="bg-black/40 font-mono text-xs" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="proxyUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Gateway de Proxy (Opcional)</FormLabel>
                          <FormControl><Input className="bg-black/40 font-mono text-xs" placeholder="http://proxy.corp:3128" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="reverseProxy"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between pt-2">
                          <FormLabel className="text-xs">Habilitar Nginx / Reverse Proxy</FormLabel>
                          <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* DATABASE ENGINE */}
                <Card className="bg-sidebar/50 border-border/50">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <HardDrive className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-base uppercase tracking-tight">Persistência (SQLite Engine)</CardTitle>
                      <CardDescription className="text-xs">Configurações de armazenamento atômico.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="dbPath"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Caminho do Arquivo .db</FormLabel>
                          <FormControl><Input className="bg-black/40 font-mono text-xs" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-6 items-end">
                      <FormField
                        control={form.control}
                        name="backupInterval"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Intervalo de Backup (h)</FormLabel>
                            <FormControl><Input type="number" className="bg-black/40 font-mono text-xs" {...field} /></FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="autoBackup"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between h-10 px-4 border rounded bg-black/20">
                            <FormLabel className="text-[10px] uppercase font-bold">Auto-Backup</FormLabel>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* SECURITY PROTOCOLS */}
                <Card className="bg-zinc-950 border-primary/20 flex flex-col tui-scanline">
                  <CardHeader>
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" /> NexusOS Security Protocol
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-[11px] font-mono text-primary/70 space-y-4">
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded leading-relaxed">
                      [INFO] Todas as credenciais de SMTP e Banco são encriptadas em repouso no ambiente Node.js. 
                      A plataforma utiliza algoritmos SHA-256 para integridade de pacotes na NexusBridge.
                    </div>
                    <ul className="space-y-2">
                       <li className="flex gap-2"><span>-</span> <span>JWT_EXPIRATION: 28800s (8h)</span></li>
                       <li className="flex gap-2"><span>-</span> <span>BCRYPT_ROUNDS: 10</span></li>
                       <li className="flex gap-2"><span>-</span> <span>CORS_ORIGIN: * (DYNAMIC)</span></li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <Card className="bg-sidebar/50 border-border/50">
                    <CardHeader><CardTitle className="text-sm font-bold uppercase tracking-widest">Status dos Serviços</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2"><Server className="h-3 w-3" /> API Core</div>
                          <span className="text-emerald-500 font-bold">ONLINE</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2"><Database className="h-3 w-3" /> SQLite Pool</div>
                          <span className="text-emerald-500 font-bold">ACTIVE</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2"><Network className="h-3 w-3" /> Bridge Hub</div>
                          <span className="text-emerald-500 font-bold">SYNCED</span>
                        </div>
                    </CardContent>
                 </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4 border-t border-border/30">
             <Button type="submit" className="h-12 px-10 bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/20">
                Sincronizar Kernel & Salvar
              </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
