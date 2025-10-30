"use client";

import { vehicles } from '@/lib/data';
import type { Vehicle, VehicleStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RegisterVehicleForm } from '@/components/register-vehicle-form';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

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
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const handleRowClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const closeDetailsModal = () => {
    setSelectedVehicle(null);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
                Gerenciamento da Frota Municipal
            </h1>
            <p className="text-muted-foreground">Veja, gerencie e cadastre os veículos da prefeitura.</p>
        </div>
        <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
            <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Cadastrar Novo Veículo
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Cadastro de Veículo</DialogTitle>
                    <DialogDescription>
                        Preencha o formulário para adicionar um novo veículo à frota municipal.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] p-4">
                  <RegisterVehicleForm onFormSubmit={() => setIsRegisterModalOpen(false)} />
                </ScrollArea>
            </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frota de Veículos</CardTitle>
          <CardDescription>Uma lista de todos os veículos cadastrados no sistema. Clique em uma linha para ver detalhes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placa</TableHead>
                <TableHead className="hidden md:table-cell">Modelo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Motorista Atual</TableHead>
                <TableHead className="hidden md:table-cell">Setor</TableHead>
                <TableHead className="text-right">Quilometragem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id} onClick={() => handleRowClick(vehicle)} className="cursor-pointer">
                  <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {vehicle.vehicleModel}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(vehicle.status)}>
                      {vehicle.status}
                      {(vehicle.status === 'Em Viagem' || vehicle.status === 'Em Serviço') && vehicle.destination && ` - ${vehicle.destination}`}
                    </Badge>
                  </TableCell>
                   <TableCell>{vehicle.driverName || 'N/A'}</TableCell>
                   <TableCell className="hidden md:table-cell">{vehicle.sector}</TableCell>
                  <TableCell className="text-right">{vehicle.mileage.toLocaleString('pt-BR')} km</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Vehicle Details Modal */}
       <Dialog open={!!selectedVehicle} onOpenChange={closeDetailsModal}>
        <DialogContent>
          <ScrollArea className="max-h-[80vh]">
            {selectedVehicle && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedVehicle.vehicleModel} - {selectedVehicle.licensePlate}</DialogTitle>
                  <DialogDescription>
                    Detalhes do veículo.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 pr-4">
                  <div>
                      <span className="text-sm font-semibold text-muted-foreground">Placa</span>
                      <p className="text-lg">{selectedVehicle.licensePlate}</p>
                  </div>
                  <Separator />
                  <div>
                      <span className="text-sm font-semibold text-muted-foreground">Modelo</span>
                      <p className="text-lg">{selectedVehicle.vehicleModel}</p>
                  </div>
                  <Separator />
                  <div>
                      <span className="text-sm font-semibold text-muted-foreground">Setor</span>
                      <p className="text-lg">{selectedVehicle.sector}</p>
                  </div>
                  <Separator />
                  <div>
                      <span className="text-sm font-semibold text-muted-foreground">Quilometragem</span>
                      <p className="text-lg">{selectedVehicle.mileage.toLocaleString('pt-BR')} km</p>
                  </div>
                  <Separator />
                  <div>
                      <span className="text-sm font-semibold text-muted-foreground">Status</span>
                      <p>
                          <Badge variant={getStatusVariant(selectedVehicle.status)}>{selectedVehicle.status}</Badge>
                      </p>
                  </div>
                  {selectedVehicle.driverName && (
                    <>
                    <Separator />
                    <div>
                        <span className="text-sm font-semibold text-muted-foreground">Motorista Atual</span>
                        <p className="text-lg">{selectedVehicle.driverName}</p>
                    </div>
                    </>
                  )}
                  {selectedVehicle.destination && (
                    <>
                    <Separator />
                    <div>
                        <span className="text-sm font-semibold text-muted-foreground">Destino Atual</span>
                        <p className="text-lg">{selectedVehicle.destination}</p>
                    </div>
                    </>
                  )}
                </div>
              </>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

    </div>
  );
}
