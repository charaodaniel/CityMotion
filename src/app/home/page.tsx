
"use client";

import { useApp } from '@/contexts/app-provider';
import TripKanbanView from '@/components/trip-kanban-view';

export default function HomePage() {
    const { userRole } = useApp();

    return (
        <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Acompanhamento da Frota Municipal
                    </h1>
                    <p className="text-muted-foreground">
                        Visualize o status dos veículos da prefeitura em tempo real.
                    </p>
                </div>
            </div>
            <TripKanbanView isPublic />
        </div>
    );
}
