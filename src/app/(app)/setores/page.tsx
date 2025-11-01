

"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Car, PlusCircle, User, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sectors as initialSectors, drivers, vehicles } from '@/lib/data';
import type { Sector } from '@/lib/types';
import { RegisterSectorForm } from '@/components/register-sector-form';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function SectorsPage() {
  const [sectors, setSectors] = useState<Sector[]>(initialSectors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'register' | 'details' | 'edit'>('register');
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);

  const handleCardClick = (sector: Sector) => {
    setSelectedSector(sector);
    setModalMode('details');
    setIsModalOpen(true);
  };
  
  const handleOpenRegisterModal = () => {
    setSelectedSector(null);
    setModalMode('register');
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (sector: Sector) => {
    setSelectedSector(sector);
    setModalMode('edit');
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSector(null);
  };

  const handleFormSubmit = (newSectorData: Partial<Sector>) => {
    if (modalMode === 'edit' && selectedSector) {
      setSectors(sectors.map(s => s.id === selectedSector.id ? { ...s, ...newSectorData } : s));
    } else {
      const newSector: Sector = {
        id: `SEC${sectors.length + 1}`,
        driverCount: 0,
        vehicleCount: 0,
        ...newSectorData
      } as Sector;
      setSectors([...sectors, newSector]);
    }
    closeModal();
  };

  const sectorDrivers = selectedSector ? drivers.filter(d => d.sector === selectedSector.name) : [];
  const sectorVehicles = selectedSector ? vehicles.filter(v => v.sector === selectedSector.name) : [];

  const getModalContent = () => {
      switch(modalMode) {
          case 'register':
              return {
                  title: 'Adicionar Novo Setor',
                  description: 'Preencha o formulário para cadastrar um novo setor.',
                  content: <RegisterSectorForm onFormSubmit={handleFormSubmit} />
              };
          case 'edit':
              return {
                  title: 'Editar Setor',
                  description: 'Altere as informações do setor.',
                  content: <RegisterSectorForm onFormSubmit={handleFormSubmit} existingSector={selectedSector} />
              };
          case 'details':
          default:
              return {
                  title: selectedSector?.name || '',
                  description: selectedSector?.description || '',
                  content: (
                      <div className="space-y-6 py-4 pr-4 mt-4">
                          <div className="flex items-center justify-end">
                              <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(selectedSector!)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                              </Button>
                          </div>
                          <div>
                              <h3 className="text-lg font-semibold mb-2 flex items-center"><User className="mr-2 h-5 w-5" />Motoristas Vinculados</h3>
                              {sectorDrivers.length > 0 ? (
                              <Card>
                                  <Table>
                                  <TableHeader>
                                      <TableRow>
                                      <TableHead>Nome</TableHead>
                                      <TableHead>Status</TableHead>
                                      </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                      {sectorDrivers.map(driver => (
                                      <TableRow key={driver.id}>
                                          <TableCell className="font-medium">{driver.name}</TableCell>
                                          <TableCell>{driver.status}</TableCell>
                                      </TableRow>
                                      ))}
                                  </TableBody>
                                  </Table>
                              </Card>
                              ) : (
                              <p className="text-sm text-muted-foreground">Nenhum motorista vinculado a este setor.</p>
                              )}
                          </div>
                          <Separator />
                          <div>
                              <h3 className="text-lg font-semibold mb-2 flex items-center"><Car className="mr-2 h-5 w-5" />Veículos Vinculados</h3>
                              {sectorVehicles.length > 0 ? (
                              <Card>
                                  <Table>
                                  <TableHeader>
                                      <TableRow>
                                      <TableHead>Modelo</TableHead>
                                      <TableHead>Placa</TableHead>
                                      <TableHead>Status</TableHead>
                                      </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                      {sectorVehicles.map(vehicle => (
                                      <TableRow key={vehicle.id}>
                                          <TableCell className="font-medium">{vehicle.vehicleModel}</TableCell>
                                          <TableCell>{vehicle.licensePlate}</TableCell>
                                          <TableCell>{vehicle.status}</TableCell>
                                      </TableRow>
                                      ))}
                                  </TableBody>
                                  </Table>
                              </Card>
                              ) : (
                              <p className="text-sm text-muted-foreground">Nenhum veículo vinculado a este setor.</p>
                              )}
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
            Gestão de Setores
          </h1>
          <p className="text-muted-foreground">
            Gerencie os setores e departamentos da prefeitura.
          </p>
        </div>
        <Button onClick={handleOpenRegisterModal} className="bg-primary hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Novo Setor
        </Button>
      </div>

      {sectors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map(sector => (
            <Card 
              key={sector.id} 
              className="flex flex-col cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleCardClick(sector)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-muted-foreground" />
                  <span className="truncate">{sector.name}</span>
                </CardTitle>
                <CardDescription className="line-clamp-2">{sector.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow justify-end text-sm space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <Car className="mr-2 h-4 w-4" />
                  <span>{vehicles.filter(v => v.sector === sector.name).length} {sector.vehicleCount === 1 ? 'veículo' : 'veículos'}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <User className="mr-2 h-4 w-4" />
                  <span>{drivers.filter(d => d.sector === sector.name).length} {sector.driverCount === 1 ? 'motorista' : 'motoristas'}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8 border-dashed border-2 rounded-lg">
          <p className="text-lg">Nenhum setor cadastrado no momento.</p>
          <p className="text-sm mt-2">Clique em "Adicionar Novo Setor" para começar.</p>
        </div>
      )}

      {/* Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className={modalMode === 'details' ? "sm:max-w-3xl" : "sm:max-w-xl"}>
          <ScrollArea className="max-h-[80vh] p-4">
            <DialogHeader>
              <DialogTitle className="text-2xl">{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            {content}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
