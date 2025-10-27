import { drivers } from '@/lib/data';
import type { Driver, DriverStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

function getStatusVariant(status: DriverStatus) {
  switch (status) {
    case 'Disponível':
      return 'secondary';
    case 'Em Serviço':
      return 'default';
    case 'Em Viagem':
      return 'outline';
    case 'Afastado':
      return 'destructive';
    default:
      return 'outline';
  }
}

export default function DriversPage() {
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
                Gestão de Motoristas
            </h1>
            <p className="text-muted-foreground">Veja, gerencie e cadastre os motoristas da prefeitura.</p>
        </div>
        <Link href="/motoristas/register">
          <Button className="bg-accent hover:bg-accent/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Cadastrar Novo Motorista
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Motoristas</CardTitle>
          <CardDescription>Uma lista de todos os motoristas cadastrados no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">Setor</TableHead>
                <TableHead>Veículo Designado</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{driver.sector}</TableCell>
                  <TableCell>
                    {driver.vehicleModel ? `${driver.vehicleModel} (${driver.licensePlate})` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(driver.status)}>{driver.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
