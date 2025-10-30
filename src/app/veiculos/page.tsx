
"use client";

import { vehicles } from '@/lib/data';
import type { Vehicle, VehicleStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Car, Gauge, Building } from 'lucide-react';
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

  const handleCardClick = (vehicle: Vehicle) => {
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
                <Button className="bg-primary hover:bg-primary/90">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <Card 
              key={vehicle.id} 
              onClick={() => handleCardClick(vehicle)} 
              className="cursor-pointer hover:shadow-md transition-shadow flex flex-col"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-muted-foreground" />
                  <span className="truncate">{vehicle.vehicleModel}</span>
                </CardTitle>
                <CardDescription>Placa: {vehicle.licensePlate}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow justify-between">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Setor: <strong>{vehicle.sector}</strong></span>
                  </div>
                   <div className="flex items-center">
                    <Gauge className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{vehicle.mileage.toLocaleString('pt-BR')} km</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Badge variant={getStatusVariant(vehicle.status)} className="w-full justify-center">
                    {vehicle.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {vehicles.length === 0 && (
        <div className="text-center text-muted-foreground py-8 border-dashed border-2 rounded-lg col-span-full">
            <p>Nenhum veículo cadastrado no momento.</p>
            <p className="text-sm mt-2">Clique em "Cadastrar Novo Veículo" para começar.</p>
        </div>
      )}

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
                      <div className="mt-1">
                          <Badge variant={getStatusVariant(selectedVehicle.status)}>{selectedVehicle.status}</Badge>
                      </div>
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
