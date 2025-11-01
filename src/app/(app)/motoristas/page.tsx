

"use client";

import { drivers as initialDrivers } from '@/lib/data';
import type { Driver, DriverStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, User, ShieldCheck, Edit, FileText, Link as LinkIcon } from 'lucide-react';
import { RegisterDriverForm } from '@/components/register-driver-form';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

function getStatusVariant(status: DriverStatus) {
  switch (status) {
    case 'Disponível':
      return 'secondary';
    case 'Em Serviço':
    case 'Em Viagem':
      return 'default';
    case 'Afastado':
      return 'destructive';
    default:
      return 'outline';
  }
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'register' | 'details' | 'edit'>('register');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const handleCardClick = (driver: Driver) => {
    setSelectedDriver(driver);
    setModalMode('details');
    setIsModalOpen(true);
  };
  
  const handleOpenRegisterModal = () => {
    setSelectedDriver(null);
    setModalMode('register');
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setModalMode('edit');
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDriver(null);
  };

  const handleFormSubmit = (newDriverData: Partial<Driver>) => {
    if (modalMode === 'edit' && selectedDriver) {
      setDrivers(drivers.map(d => d.id === selectedDriver.id ? { ...d, ...newDriverData } : d));
    } else {
      const newDriver: Driver = {
        id: `${drivers.length + 1}`,
        status: 'Disponível',
        ...newDriverData
      } as Driver;
      setDrivers([...drivers, newDriver]);
    }
    closeModal();
  };
  
  const getModalContent = () => {
    switch (modalMode) {
      case 'register':
        return {
          title: 'Cadastro de Motorista',
          description: 'Preencha o formulário para cadastrar um novo motorista da prefeitura.',
          content: <RegisterDriverForm onFormSubmit={handleFormSubmit} />
        };
      case 'edit':
         return {
          title: 'Editar Motorista',
          description: 'Altere as informações do motorista.',
          content: <RegisterDriverForm onFormSubmit={handleFormSubmit} existingDriver={selectedDriver} />
        };
      case 'details':
      default:
        return {
          title: selectedDriver?.name || '',
          description: 'Detalhes do motorista.',
          content: (
            <>
              <DialogHeader className="items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${selectedDriver?.id}`} alt={selectedDriver?.name} />
                      <AvatarFallback>{selectedDriver?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <DialogTitle className="text-2xl">{selectedDriver?.name}</DialogTitle>
                  <DialogDescription>
                      Detalhes do motorista.
                  </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 pr-4">
                <div>
                    <span className="text-sm font-semibold text-muted-foreground">Nome Completo</span>
                    <p className="text-lg">{selectedDriver?.name}</p>
                </div>
                <Separator />
                {selectedDriver?.cnh && (
                  <>
                      <div>
                          <span className="text-sm font-semibold text-muted-foreground">CNH</span>
                          <p className="text-lg">{selectedDriver.cnh}</p>
                      </div>
                      <Separator />
                  </>
                )}
                 {selectedDriver?.matricula && (
                  <>
                      <div>
                          <span className="text-sm font-semibold text-muted-foreground">Matrícula</span>
                          <p className="text-lg">{selectedDriver.matricula}</p>
                      </div>
                      <Separator />
                  </>
                )}
                <div>
                    <span className="text-sm font-semibold text-muted-foreground">Setor</span>
                    <p className="text-lg">{selectedDriver?.sector}</p>
                </div>
                <Separator />
                <div>
                    <span className="text-sm font-semibold text-muted-foreground">Status</span>
                    <div>
                        {selectedDriver && <Badge variant={getStatusVariant(selectedDriver.status)}>{selectedDriver.status}</Badge>}
                    </div>
                </div>
                {(selectedDriver?.idPhoto || selectedDriver?.cnhPhoto) && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-base font-semibold mb-3 flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        Documentos
                      </h3>
                      <div className="space-y-2 text-sm">
                        {selectedDriver.idPhoto && (
                          <Link href="#" className="flex items-center text-primary hover:underline">
                            <LinkIcon className="mr-2 h-4 w-4" />
                            <span>Foto 3x4: {selectedDriver.idPhoto}</span>
                          </Link>
                        )}
                        {selectedDriver.cnhPhoto && (
                          <Link href="#" className="flex items-center text-primary hover:underline">
                            <LinkIcon className="mr-2 h-4 w-4" />
                            <span>CNH: {selectedDriver.cnhPhoto}</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </>
                )}
                <div className="flex justify-end pt-4">
                    <Button variant="outline" onClick={() => handleOpenEditModal(selectedDriver!)}>
                        <Edit className="mr-2 h-4 w-4"/>
                        Editar
                    </Button>
                </div>
              </div>
            </>
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
                Gestão de Motoristas
            </h1>
            <p className="text-muted-foreground">Veja, gerencie e cadastre os motoristas da prefeitura.</p>
        </div>
        <Button onClick={handleOpenRegisterModal} className="bg-primary hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Cadastrar Novo Motorista
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {drivers.map((driver) => (
          <Card 
            key={driver.id} 
            onClick={() => handleCardClick(driver)} 
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${driver.id}`} alt={driver.name} />
                  <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="truncate">{driver.name}</span>
              </CardTitle>
              <CardDescription>{driver.sector}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <Badge variant={getStatusVariant(driver.status)}>{driver.status}</Badge>
              {driver.cnh && (
                <div className="flex items-center text-xs text-muted-foreground">
                    <ShieldCheck className="mr-1.5 h-3 w-3" />
                    <span>CNH: {driver.cnh.slice(-4)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {drivers.length === 0 && (
        <div className="text-center text-muted-foreground py-8 border-dashed border-2 rounded-lg col-span-full">
            <p>Nenhum motorista cadastrado no momento.</p>
            <p className="text-sm mt-2">Clique em "Cadastrar Novo Motorista" para começar.</p>
        </div>
      )}

      {/* Driver Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className={modalMode !== 'details' ? 'sm:max-w-3xl' : ''}>
          <ScrollArea className="max-h-[80vh] p-4">
              {modalMode === 'details' ? content : (
                <>
                  <DialogHeader>
                      <DialogTitle className="text-2xl">{title}</DialogTitle>
                      <DialogDescription>{description}</DialogDescription>
                  </DialogHeader>
                  {content}
                </>
              )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

    </div>
  );
}
