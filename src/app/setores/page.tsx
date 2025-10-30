
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Car, PlusCircle, User } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sectors } from '@/lib/data';
import { RegisterSectorForm } from '@/components/register-sector-form';

export default function SectorsPage() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

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
        <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Novo Setor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Adicionar Novo Setor</DialogTitle>
              <DialogDescription>
                Preencha o formulário para cadastrar um novo setor.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] p-4">
              <RegisterSectorForm onFormSubmit={() => setIsRegisterModalOpen(false)} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {sectors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map(sector => (
            <Card key={sector.id} className="flex flex-col">
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
                  <span>{sector.vehicleCount} {sector.vehicleCount === 1 ? 'veículo' : 'veículos'}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <User className="mr-2 h-4 w-4" />
                  <span>{sector.driverCount} {sector.driverCount === 1 ? 'motorista' : 'motoristas'}</span>
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
    </div>
  );
}
