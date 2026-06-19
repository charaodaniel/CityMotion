
"use client";

import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/app-provider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle, Zap, RefreshCw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QuickRequestForm } from '@/components/forms/quick-request-form';
import AdminDashboard from '@/components/dashboards/admin-dashboard';
import ManagerDashboard from '@/components/dashboards/manager-dashboard';
import DriverDashboard from '@/components/dashboards/driver-dashboard';
import MechanicDashboard from '@/components/dashboards/mechanic-dashboard';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
    const { userRole, currentUser, addNotification, selectedSector, isRefreshing, refreshData } = useApp();
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    
    const isCurrentUserDriver = useMemo(() => {
        if (!currentUser || !currentUser.role) return false;
        return currentUser.role.toLowerCase().includes('motorista');
    }, [currentUser]);

    const isCurrentUserMechanic = useMemo(() => {
        if (!currentUser || !currentUser.role) return false;
        return currentUser.role.toLowerCase().includes('mecânico') || currentUser.role.toLowerCase().includes('mecanico');
    }, [currentUser]);

    const simulateExternalAlert = () => {
        if (userRole === 'manager' && selectedSector) {
            addNotification({
                title: "Simulação: Nova Solicitação",
                message: `Um colaborador acabou de solicitar um veículo para o setor: ${selectedSector}.`,
                type: 'request'
            });
        } else if (isCurrentUserDriver) {
            addNotification({
                title: "Simulação: Viagem Atribuída",
                message: "Uma nova viagem foi agendada para você agora mesmo.",
                type: 'trip'
            });
        } else {
            addNotification({
                title: "Aviso do Sistema",
                message: "Sua conta está ativa e sincronizada com a organização.",
                type: 'system'
            });
        }
    };

    const renderDashboard = () => {
        switch (userRole) {
            case 'dev':
            case 'ti':
            case 'admin':
                return <AdminDashboard />;
            case 'manager':
                 if (isCurrentUserMechanic) {
                    return <MechanicDashboard />;
                }
                return <ManagerDashboard />;
            case 'employee':
                if (isCurrentUserDriver) {
                    return <DriverDashboard />;
                }
                return (
                    <div className="text-center text-muted-foreground py-12 border-dashed border-2 rounded-lg">
                        <p className="text-lg">Bem-vindo(a) ao CityMotion.</p>
                        <p className="text-sm mt-2">Use o botão "Pedir Transporte" para iniciar uma solicitação de veículo.</p>
                    </div>
                );
            default:
                 return (
                    <div className="text-center text-muted-foreground py-12 border-dashed border-2 rounded-lg">
                        <p className="text-lg">Painel não disponível para este perfil.</p>
                    </div>
                );
        }
    }

    return (
        <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Painel de Controle
                    </h1>
                    <p className="text-muted-foreground">
                        {userRole === 'admin' || userRole === 'dev' ? 'Visão geral da frota e operações.' : 'Acompanhe suas tarefas e solicitações de transporte.'}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => refreshData()} 
                        disabled={isRefreshing}
                        className="text-xs"
                    >
                        <RefreshCw className={cn("mr-2 h-3 w-3", isRefreshing && "animate-spin")} />
                        Atualizar
                    </Button>

                    <Button variant="outline" size="sm" onClick={simulateExternalAlert} className="text-xs bg-accent/10 border-accent/20 hover:bg-accent/20">
                        <Zap className="mr-2 h-3 w-3" /> Testar Alerta
                    </Button>

                    {(userRole === 'employee' || userRole === 'manager') && !isCurrentUserDriver && !isCurrentUserMechanic && (
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
                                        Preencha o formulário para fazer um pedido rápido. O gestor da sua unidade será notificado.
                                    </DialogDescription>
                                </DialogHeader>
                                <ScrollArea className="max-h-[70vh] p-4">
                                    <QuickRequestForm onFormSubmit={() => setIsRequestModalOpen(false)} />
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>
            {renderDashboard()}
        </div>
    );
}
