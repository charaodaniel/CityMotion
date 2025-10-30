import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SupportPage() {
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Suporte
        </h1>
        <p className="text-muted-foreground">
          Precisa de ajuda? Entre em contato conosco.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Central de Ajuda</CardTitle>
          <CardDescription>
            Informações de contato e recursos de suporte.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center text-muted-foreground py-8">
                <p>Seção de suporte em desenvolvimento.</p>
                <p className="text-sm">Em breve, você encontrará aqui FAQs e formas de contato.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
