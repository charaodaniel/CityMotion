
"use client";

import { drivers } from '@/lib/data';
import type { Driver, DriverStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, User, ShieldCheck } from 'lucide-react';
import { RegisterDriverForm } from '@/components/register-driver-form';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const handleCardClick = (driver: Driver) => {
    setSelectedDriver(driver);
  };

  const closeDetailsModal = () => {
    setSelectedDriver(null);
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
                Gestão de Motoristas
            </h1>
            <p className="text-muted-foreground">Veja, gerencie e cadastre os motoristas da prefeitura.</p>
        </div>
        <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Cadastrar Novo Motorista
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Cadastro de Motorista</DialogTitle>
                    <DialogDescription>
                        Preencha o formulário para cadastrar um novo motorista da prefeitura.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] p-4">
                  <RegisterDriverForm onFormSubmit={() => setIsRegisterModalOpen(false)} />
                </ScrollArea>
            </DialogContent>
        </Dialog>
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
                <User className="w-5 h-5 text-muted-foreground" />
                <span className="truncate">{driver.name}</span>
              </CardTitle>
              <CardDescription>{driver.sector}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <Badge variant={getStatusVariant(driver.status)}>{driver.status}</Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <ShieldCheck className="mr-1.5 h-3 w-3" />
                <span>CNH: {driver.cnh.slice(-4)}</span>
              </div>
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

      {/* Driver Details Modal */}
      <Dialog open={!!selectedDriver} onOpenChange={closeDetailsModal}>
        <DialogContent>
          <ScrollArea className="max-h-[80vh] p-4">
            {selectedDriver && (
              <>
                <DialogHeader className="items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${selectedDriver.id}`} alt={selectedDriver.name} />
                        <AvatarFallback>{selectedDriver.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <DialogTitle className="text-2xl">{selectedDriver.name}</DialogTitle>
                    <DialogDescription>
                        Detalhes do motorista.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 pr-4">
                  <div>
                      <span className="text-sm font-semibold text-muted-foreground">Nome Completo</span>
                      <p className="text-lg">{selectedDriver.name}</p>
                  </div>
                  <Separator />
                  <div>
                      <span className="text-sm font-semibold text-muted-foreground">CNH</span>
                      <p className="text-lg">{selectedDriver.cnh}</p>
                  </div>
                  <Separator />
                  <div>
                      <span className="text-sm font-semibold text-muted-foreground">Setor</span>
                      <p className="text-lg">{selectedDriver.sector}</p>
                  </div>
                  <Separator />
                  <div>
                      <span className="text-sm font-semibold text-muted-foreground">Status</span>
                      <div>
                          <Badge variant={getStatusVariant(selectedDriver.status)}>{selectedDriver.status}</Badge>
                      </div>
                  </div>
                </div>
              </>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

    </div>
  );
}
