

"use client";

import type { Vehicle, VehicleStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Car, Gauge, Building, Edit, Wrench } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RegisterVehicleForm } from '@/components/register-vehicle-form';
import { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/app-provider';
import { RequestMaintenanceForm } from '@/components/request-maintenance-form';

type ModalState = 'register' | 'details' | 'edit' | 'maintenance' | null;

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
  const { vehicles, setVehicles, userRole } = useApp();
  const [activeModal, setActiveModal] = useState<ModalState>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const managerSector = "Secretaria de Obras"; // Simulating manager's sector for filtering

  const visibleVehicles = useMemo(() => {
    if (userRole === 'manager') {
      return vehicles.filter(v => v.sector === managerSector);
    }
    return vehicles;
  }, [vehicles, userRole, managerSector]);

  const openModal = (modal: ModalState, vehicle: Vehicle | null = null) => {
    setSelectedVehicle(vehicle);
    setActiveModal(modal);
  };

  const closeModal = () => {
    openModal(null);
  }

  const handleFormSubmit = (newVehicleData: Partial<Vehicle>) => {
    if (activeModal === 'edit' && selectedVehicle) {
      setVehicles(vehicles.map(v => v.id === selectedVehicle.id ? { ...v, ...newVehicleData } as Vehicle : v));
    } else {
      const newVehicle: Vehicle = {
        id: `V${vehicles.length + 1}`,
        status: 'Disponível',
        ...newVehicleData
      } as Vehicle;
      setVehicles([...vehicles, newVehicle]);
    }
    closeModal();
  };

  const getModalContent = () => {
    switch (activeModal) {
      case 'register':
        return {
          title: 'Cadastro de Veículo',
          description: 'Preencha o formulário para adicionar um novo veículo à frota municipal.',
          content: <RegisterVehicleForm onFormSubmit={handleFormSubmit} />
        };
      case 'edit':
         return {
          title: 'Editar Veículo',
          description: 'Altere as informações do veículo.',
          content: <RegisterVehicleForm onFormSubmit={handleFormSubmit} existingVehicle={selectedVehicle} />
        };
       case 'maintenance':
        return {
          title: 'Solicitar Manutenção',
          description: `Abra um chamado de manutenção para o veículo ${selectedVehicle?.vehicleModel} (${selectedVehicle?.licensePlate}).`,
          content: <RequestMaintenanceForm vehicle={selectedVehicle} onFormSubmit={closeModal} />
        };
      case 'details':
      default:
        return {
          title: `${selectedVehicle?.vehicleModel} - ${selectedVehicle?.licensePlate}`,
          description: 'Detalhes do veículo.',
          content: (
             <div className="space-y-4 py-4 pr-4">
                <div>
                    <span className="text-sm font-semibold text-muted-foreground">Placa</span>
                    <p className="text-lg">{selectedVehicle?.licensePlate}</p>
                </div>
                <Separator />
                <div>
                    <span className="text-sm font-semibold text-muted-foreground">Modelo</span>
                    <p className="text-lg">{selectedVehicle?.vehicleModel}</p>
                </div>
                <Separator />
                <div>
                    <span className="text-sm font-semibold text-muted-foreground">Setor</span>
                    <p className="text-lg">{selectedVehicle?.sector}</p>
                </div>
                <Separator />
                <div>
                    <span className="text-sm font-semibold text-muted-foreground">Quilometragem</span>
                    <p className="text-lg">{selectedVehicle?.mileage.toLocaleString('pt-BR')} km</p>
                </div>
                <Separator />
                <div>
                    <span className="text-sm font-semibold text-muted-foreground">Status</span>
                    <div className="mt-1">
                        {selectedVehicle && <Badge variant={getStatusVariant(selectedVehicle.status)}>{selectedVehicle.status}</Badge>}
                    </div>
                </div>
                {selectedVehicle?.driverName && (
                  <>
                  <Separator />
                  <div>
                      <span className="text-sm font-semibold text-muted-foreground">Motorista Atual</span>
                      <p className="text-lg">{selectedVehicle.driverName}</p>
                  </div>
                  </>
                )}
                {selectedVehicle?.destination && (
                  <>
                  <Separator />
                  <div>
                      <span className="text-sm font-semibold text-muted-foreground">Destino Atual</span>
                      <p className="text-lg">{selectedVehicle.destination}</p>
                  </div>
                  </>
                )}
                 <div className="flex justify-end pt-4">
                    <Button variant="outline" onClick={() => openModal('edit', selectedVehicle)}>
                        <Edit className="mr-2 h-4 w-4"/>
                        Editar
                    </Button>
                </div>
              </div>
          )
        };
    }
  }
  
  const { title, description, content } = getModalContent();

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
                Gerenciamento da Frota Municipal
            </h1>
            <p className="text-muted-foreground">
              {userRole === 'manager'
                ? `Veja e gerencie os veículos do setor de ${managerSector}.`
                : 'Veja, gerencie e cadastre os veículos da prefeitura.'
              }
            </p>
        </div>
        {(userRole === 'admin' || userRole === 'manager') && (
          <Button onClick={() => openModal('register')} className="bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Cadastrar Novo Veículo
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleVehicles.map((vehicle) => (
            <Card 
              key={vehicle.id} 
              className="cursor-pointer hover:shadow-md transition-shadow flex flex-col"
            >
              <div onClick={() => openModal('details', vehicle)}>
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
              </div>
              <CardFooter className="p-2 border-t mt-auto">
                 <Button variant="ghost" size="sm" className="w-full" onClick={() => openModal('maintenance', vehicle)}>
                    <Wrench className="mr-2 h-4 w-4" />
                    Solicitar Manutenção
                  </Button>
              </CardFooter>
            </Card>
          ))}
      </div>

      {visibleVehicles.length === 0 && (
        <div className="text-center text-muted-foreground py-8 border-dashed border-2 rounded-lg col-span-full">
            <p>Nenhum veículo para exibir.</p>
        </div>
      )}

      {/* Modal */}
       <Dialog open={!!activeModal} onOpenChange={closeModal}>
        <DialogContent className={activeModal !== 'details' ? 'sm:max-w-3xl' : ''}>
          <ScrollArea className="max-h-[80vh] p-4">
              <DialogHeader>
                <DialogTitle className="text-2xl">{title}</DialogTitle>
                <DialogDescription>
                  {description}
                </DialogDescription>
              </DialogHeader>
              {content}
          </ScrollArea>
        </DialogContent>
      </Dialog>

    </div>
  );
}
