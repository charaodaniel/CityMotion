
"use client";

import { useState } from 'react';
import { useApp } from '@/contexts/app-provider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QuickRequestForm } from '@/components/quick-request-form';
import TripKanbanView from '@/components/trip-kanban-view';

export default function DashboardPage() {
    const { userRole } = useApp();
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    return (
        <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Painel de Viagens
                    </h1>
                    <p className="text-muted-foreground">
                        Acompanhe o status da frota e gerencie suas solicitações.
                    </p>
                </div>
                {(userRole === 'admin' || userRole === 'manager' || userRole === 'employee') && (
                    <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Pedir Transporte
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl">Solicitar um Transporte</DialogTitle>
                                <DialogDescription>
                                    Preencha o formulário para fazer um pedido rápido. O gestor do seu setor será notificado.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[70vh] p-4">
                                <QuickRequestForm onFormSubmit={() => setIsRequestModalOpen(false)} />
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
            <TripKanbanView />
        </div>
    );
}
