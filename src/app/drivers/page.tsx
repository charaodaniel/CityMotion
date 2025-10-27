import { drivers } from '@/lib/data';
import type { Driver } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Star } from 'lucide-react';
import Link from 'next/link';

function getStatusVariant(status: Driver['status']) {
  switch (status) {
    case 'Verificado':
      return 'default';
    case 'Pendente':
      return 'secondary';
    case 'Rejeitado':
      return 'destructive';
    default:
      return 'outline';
  }
}

function translateStatus(status: Driver['status']): string {
    switch (status) {
        case 'Verified':
            return 'Verificado';
        case 'Pending':
            return 'Pendente';
        case 'Rejected':
            return 'Rejeitado';
        default:
            return status;
    }
}

export default function DriversPage() {
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
                Gerenciamento de Motoristas
            </h1>
            <p className="text-muted-foreground">Veja, gerencie e cadastre motoristas.</p>
        </div>
        <Link href="/drivers/register">
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
                <TableHead className="hidden md:table-cell">Veículo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Avaliação</TableHead>
                <TableHead className="text-right">Corridas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {driver.vehicleModel} ({driver.licensePlate})
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(translateStatus(driver.status) as any)}>{translateStatus(driver.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-right flex justify-end items-center gap-1">
                    {driver.rating.toFixed(1)}
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />
                  </TableCell>
                  <TableCell className="text-right">{driver.rides}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
