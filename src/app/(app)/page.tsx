
"use client";

import { useState } from 'react';
import { useApp } from '@/contexts/app-provider';
import AdminDashboard from '@/components/dashboards/admin-dashboard';
import ManagerDashboard from '@/components/dashboards/manager-dashboard';
import DriverDashboard from '@/components/dashboards/driver-dashboard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QuickRequestForm } from '@/components/quick-request-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

function EmployeeDashboard() {
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Bem-vindo(a)!</CardTitle>
                <CardDescription>
                    Este é o seu painel de funcionário.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-4">Para solicitar um veículo para uma viagem, clique no botão abaixo.</p>
                 <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Solicitar um Transporte
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
            </CardContent>
        </Card>
    )
}

export default function DashboardPage() {
    const { userRole } = useApp();
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    const renderDashboard = () => {
        switch (userRole) {
            case 'admin':
                return <AdminDashboard />;
            case 'manager':
                return <ManagerDashboard />;
            case 'driver':
                return <DriverDashboard />;
            case 'employee':
                return <EmployeeDashboard />;
            default:
                return <AdminDashboard />;
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
                        Bem-vindo ao CityMotion.
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
            {renderDashboard()}
        </div>
    );
}
