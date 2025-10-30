import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-4 sm:p-8">
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
          <CardTitle>Configurações do Sistema</CardTitle>
          <CardDescription>
            Ajustes gerais de funcionamento do CityMotion.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center text-muted-foreground py-8">
                <p>Nenhuma configuração disponível no momento.</p>
                <p className="text-sm">Esta seção será implementada em breve.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
