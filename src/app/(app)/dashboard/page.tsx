
"use client";

import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/app-provider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QuickRequestForm } from '@/components/quick-request-form';
import AdminDashboard from '@/components/dashboards/admin-dashboard';
import ManagerDashboard from '@/components/dashboards/manager-dashboard';
import DriverDashboard from '@/components/dashboards/driver-dashboard';

export default function DashboardPage() {
    const { userRole, currentUser } = useApp();
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    
    const isCurrentUserDriver = useMemo(() => {
        if (!currentUser || !currentUser.role) return false;
        return currentUser.role.toLowerCase().includes('motorista');
    }, [currentUser]);

    const renderDashboard = () => {
        switch (userRole) {
            case 'admin':
                return <AdminDashboard />;
            case 'manager':
                return <ManagerDashboard />;
            case 'employee':
                if (isCurrentUserDriver) {
                    return <DriverDashboard />;
                }
                // Fallback for a standard employee
                return (
                    <div className="text-center text-muted-foreground py-8 border-dashed border-2 rounded-lg">
                        <p className="text-lg">Bem-vindo(a) ao CityMotion.</p>
                        <p className="text-sm mt-2">Use o botão "Pedir Transporte" para iniciar uma solicitação.</p>
                    </div>
                );
            default:
                 return (
                    <div className="text-center text-muted-foreground py-8 border-dashed border-2 rounded-lg">
                        <p className="text-lg">Painel não disponível para este perfil.</p>
                    </div>
                );
        }
    }

    return (
        <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Painel de Controle
                    </h1>
                    <p className="text-muted-foreground">
                        {userRole === 'admin' ? 'Visão geral do sistema e da frota.' : 'Acompanhe suas tarefas e solicitações.'}
                    </p>
                </div>
                {(userRole === 'employee' || userRole === 'manager') && !isCurrentUserDriver && (
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
            
            {renderDashboard()}
        </div>
    );
}
