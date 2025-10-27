"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { geofences } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Carregamento dinâmico do mapa para evitar problemas com SSR
const Map = dynamic(() => import('@/components/map-container').then((mod) => mod.MapContainer), {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />
});

export default function GeofencingClient() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 h-full">
            <div className="lg:col-span-2 h-[60vh] lg:h-auto rounded-lg overflow-hidden shadow-lg border">
                <Map geofences={geofences} />
            </div>
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Cercas Virtuais Ativas</CardTitle>
                        <CardDescription>Estas são as zonas monitoradas atualmente.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {geofences.map(fence => (
                                <li key={fence.id} className="p-3 bg-muted/50 rounded-md">
                                    <p className="font-semibold">{fence.name}</p>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
