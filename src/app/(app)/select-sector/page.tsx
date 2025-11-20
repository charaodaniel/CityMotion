
"use client";

import { useApp } from "@/contexts/app-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Building, Car, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function SelectSectorPage() {
    const { currentUser, vehicles, employees, setSelectedSector, isLoading } = useApp();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="container mx-auto p-4 sm:p-8 max-w-4xl space-y-8">
                    <Skeleton className="h-10 w-1/2 mx-auto" />
                    <Skeleton className="h-8 w-3/4 mx-auto" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                        <Skeleton className="h-48" />
                        <Skeleton className="h-48" />
                    </div>
                </div>
            </div>
        );
    }
    
    if (!currentUser || !currentUser.sector || currentUser.sector.length === 0) {
        return (
             <div className="flex items-center justify-center min-h-screen bg-background">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle>Nenhum Setor Encontrado</CardTitle>
                        <CardDescription>
                            Você não está associado a nenhum setor. Entre em contato com um administrador.
                        </CardDescription>
                    </CardHeader>
                </Card>
             </div>
        );
    }

    // Se tiver apenas um setor, redireciona direto
    if (currentUser.sector.length === 1) {
        setSelectedSector(currentUser.sector[0]);
        router.push('/dashboard');
        return <Skeleton className="h-screen w-full" />; // Mostra um skeleton durante o redirecionamento
    }

    const handleSectorSelect = (sector: string) => {
        setSelectedSector(sector);
        router.push('/dashboard');
    };
    
    const getSectorStats = (sectorName: string) => {
        const vehicleCount = vehicles.filter(v => v.sector === sectorName).length;
        const employeeCount = employees.filter(e => e.sector.includes(sectorName)).length;
        return { vehicleCount, employeeCount };
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="container mx-auto p-4 sm:p-8 max-w-4xl text-center">
                <Building className="mx-auto h-16 w-16 mb-4 text-primary" />
                <h1 className="text-4xl font-bold tracking-tight mb-2">Selecione um Setor</h1>
                <p className="text-lg text-muted-foreground mb-12">
                    Você tem permissão para gerenciar mais de um setor. Escolha qual deles você deseja administrar agora.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {currentUser.sector.map((sectorName) => {
                        const { vehicleCount, employeeCount } = getSectorStats(sectorName);
                        return (
                            <Card 
                                key={sectorName}
                                onClick={() => handleSectorSelect(sectorName)}
                                className="cursor-pointer hover:border-primary hover:shadow-lg transition-all transform hover:-translate-y-1"
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <Building className="h-5 w-5"/>
                                        {sectorName}
                                    </CardTitle>
                                    <CardDescription>Clique para gerenciar este setor.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Car className="mr-2 h-4 w-4" />
                                        <span>{vehicleCount} {vehicleCount === 1 ? 'veículo' : 'veículos'}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Users className="mr-2 h-4 w-4" />
                                        <span>{employeeCount} {employeeCount === 1 ? 'funcionário' : 'funcionários'}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
