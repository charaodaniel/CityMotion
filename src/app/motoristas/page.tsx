"use client";

import { drivers } from '@/lib/data';
import type { Driver, DriverStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { RegisterDriverForm } from '@/components/register-driver-form';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

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

  const handleRowClick = (driver: Driver) => {
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
                <Button className="bg-accent hover:bg-accent/90">
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

      <Card>
        <CardHeader>
          <CardTitle>Lista de Motoristas</CardTitle>
          <CardDescription>Uma lista de todos os motoristas cadastrados no sistema. Clique em uma linha para ver os detalhes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CNH</TableHead>
                <TableHead className="hidden md:table-cell">Setor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((driver) => (
                <TableRow key={driver.id} onClick={() => handleRowClick(driver)} className="cursor-pointer">
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell>{driver.cnh}</TableCell>
                  <TableCell className="hidden md:table-cell">{driver.sector}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(driver.status)}>{driver.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Driver Details Modal */}
      <Dialog open={!!selectedDriver} onOpenChange={closeDetailsModal}>
        <DialogContent>
          <ScrollArea className="max-h-[80vh]">
            {selectedDriver && (
              <>
                <DialogHeader>
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
                      <p>
                          <Badge variant={getStatusVariant(selectedDriver.status)}>{selectedDriver.status}</Badge>
                      </p>
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
