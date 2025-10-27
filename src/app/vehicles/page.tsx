import { vehicles } from '@/lib/data';
import type { Vehicle, VehicleStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

function getStatusVariant(status: VehicleStatus) {
  switch (status) {
    case 'Em Serviço':
      return 'default';
    case 'Em Viagem':
      return 'outline';
    case 'Disponível':
      return 'secondary';
    case 'Manutenção':
      return 'destructive';
    default:
      return 'outline';
  }
}

export default function VehiclesPage() {
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
                Gerenciamento da Frota Municipal
            </h1>
            <p className="text-muted-foreground">Veja, gerencie e cadastre os veículos da prefeitura.</p>
        </div>
        <Link href="/vehicles/register">
          <Button className="bg-accent hover:bg-accent/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Cadastrar Novo Veículo
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frota de Veículos</CardTitle>
          <CardDescription>Uma lista de todos os veículos cadastrados no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placa</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead className="hidden md:table-cell">Modelo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Setor</TableHead>
                <TableHead className="text-right">Quilometragem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                  <TableCell>{vehicle.driverName}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {vehicle.vehicleModel}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(vehicle.status)}>
                      {vehicle.status}
                      {vehicle.status === 'Em Viagem' && vehicle.destination && ` - ${vehicle.destination}`}
                      {vehicle.status === 'Em Serviço' && vehicle.destination && ` - ${vehicle.destination}`}
                    </Badge>
                  </TableCell>
                   <TableCell className="hidden md:table-cell">{vehicle.sector}</TableCell>
                  <TableCell className="text-right">{vehicle.mileage.toLocaleString('pt-BR')} km</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
