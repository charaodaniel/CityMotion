import GeofencingClient from './geofencing-client';

export default function GeofencingPage() {
    return (
        <div className="container mx-auto p-4 sm:p-8 h-full flex flex-col">
             <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">
                        Cercas Virtuais
                    </h1>
                    <p className="text-muted-foreground">Crie e gerencie cercas virtuais para áreas específicas da cidade.</p>
                </div>
            </div>
            <GeofencingClient />
        </div>
    );
}
