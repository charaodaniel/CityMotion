import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function SchedulesPage() {
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Escalas de Funcionários
          </h1>
          <p className="text-muted-foreground">
            Gerencie as escalas de trabalho, plantões e jornadas dos funcionários.
          </p>
        </div>
        <Link href="/escalas/criar">
          <Button className="bg-accent hover:bg-accent/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Nova Escala
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Escalas Agendadas</CardTitle>
          <CardDescription>
            Ainda não há escalas agendadas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Clique em "Criar Nova Escala" para começar.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
