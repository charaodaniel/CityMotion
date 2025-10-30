"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

const settingsSchema = z.object({
  organizationName: z.string().min(3, "O nome da organização é obrigatório."),
  logo: z.any().optional(),
  primaryColor: z.string().regex(/^(\d{1,3})\s(\d{1,3})%\s(\d{1,3})%$/, "Formato HSL inválido. Ex: 215 80% 55%"),
  accentColor: z.string().regex(/^(\d{1,3})\s(\d{1,3})%\s(\d{1,3})%$/, "Formato HSL inválido. Ex: 140 70% 40%"),
  backgroundColor: z.string().regex(/^(\d{1,3})\s(\d{1,3})%\s(\d{1,3})%$/, "Formato HSL inválido. Ex: 220 20% 98%"),
});

export default function SettingsPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      organizationName: 'Prefeitura Municipal',
      primaryColor: '215 80% 55%',
      accentColor: '140 70% 40%',
      backgroundColor: '220 20% 98%',
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
    <div className="container mx-auto p-4 sm:p-8 max-w-3xl">
       <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Configurações
        </h1>
        <p className="text-muted-foreground">
          Gerencie as configurações e preferências do sistema.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Identidade Visual</CardTitle>
          <CardDescription>Personalize a aparência do sistema para a sua organização.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
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

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Cores do Tema</h3>
                 <FormDescription className="mb-4">
                    Insira os valores no formato HSL (matiz, saturação, luminosidade). Ex: 215 80% 55%
                </FormDescription>
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
              </div>

              <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90">
                Salvar Alterações
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
