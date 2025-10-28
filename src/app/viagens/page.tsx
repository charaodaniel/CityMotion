import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function TripsPage() {
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Agendamento de Viagens
          </h1>
          <p className="text-muted-foreground">
            Gerencie e agende os deslocamentos da frota.
          </p>
        </div>
        <Link href="/viagens/agendar">
          <Button className="bg-accent hover:bg-accent/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Agendar Nova Viagem
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Viagens Agendadas</CardTitle>
          <CardDescription>
            Ainda não há viagens agendadas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Clique em "Agendar Nova Viagem" para começar.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
