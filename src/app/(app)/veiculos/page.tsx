

"use client";

import type { Vehicle, VehicleStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Car, Gauge, Building, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RegisterVehicleForm } from '@/components/register-vehicle-form';
import { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/app-provider';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'register' | 'details' | 'edit'>('register');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const managerSector = "Secretaria de Obras"; // Simulating manager's sector for filtering

  const visibleVehicles = useMemo(() => {
    if (userRole === 'manager') {
      return vehicles.filter(v => v.sector === managerSector);
    }
    return vehicles;
  }, [vehicles, userRole, managerSector]);


  const handleCardClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setModalMode('details');
    setIsModalOpen(true);
  };

  const handleOpenRegisterModal = () => {
    setSelectedVehicle(null);
    setModalMode('register');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setModalMode('edit');
    setIsModalOpen(true);
  }

  const handleFormSubmit = (newVehicleData: Partial<Vehicle>) => {
    if (modalMode === 'edit' && selectedVehicle) {
      setVehicles(vehicles.map(v => v.id === selectedVehicle.id ? { ...v, ...newVehicleData } as Vehicle : v));
    } else {
      const newVehicle: Vehicle = {
        id: `V${vehicles.length + 1}`,
        status: 'Disponível',
        ...newVehicleData
      } as Vehicle;
      setVehicles([...vehicles, newVehicle]);
    }
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
  }

  const getModalContent = () => {
    switch (modalMode) {
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
                    <Button variant="outline" onClick={() => handleOpenEditModal(selectedVehicle!)}>
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
        <Button onClick={handleOpenRegisterModal} className="bg-primary hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Cadastrar Novo Veículo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleVehicles.map((vehicle) => (
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

      {visibleVehicles.length === 0 && (
        <div className="text-center text-muted-foreground py-8 border-dashed border-2 rounded-lg col-span-full">
            <p>Nenhum veículo para exibir.</p>
        </div>
      )}

      {/* Modal */}
       <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className={modalMode !== 'details' ? 'sm:max-w-3xl' : ''}>
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
