"use client";

import { useApp } from '@/contexts/app-provider';
import AdminDashboard from '@/components/dashboards/admin-dashboard';
import ManagerDashboard from '@/components/dashboards/manager-dashboard';
import DriverDashboard from '@/components/dashboards/driver-dashboard';

export default function DashboardPage() {
    const { userRole } = useApp();

    const renderDashboard = () => {
        switch (userRole) {
            case 'admin':
                return <AdminDashboard />;
            case 'manager':
                return <ManagerDashboard />;
            case 'driver':
                return <DriverDashboard />;
            default:
                return <AdminDashboard />;
        }
    }

    return (
        <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Painel de Controle
                </h1>
                <p className="text-muted-foreground">
                    Bem-vindo ao CityMotion.
                </p>
            </div>
            {renderDashboard()}
        </div>
    );
}
