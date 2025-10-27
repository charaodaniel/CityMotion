import { MapContainer } from '@/components/map-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { geofences } from '@/lib/data';

export default function GeofencingPage() {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    return (
        <div className="container mx-auto p-4 sm-p-8 h-full flex flex-col">
             <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">
                        Cercas Virtuais
                    </h1>
                    <p className="text-muted-foreground">Crie e gerencie cercas virtuais para áreas específicas da cidade.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                <div className="lg:col-span-2 h-[60vh] lg:h-auto rounded-lg overflow-hidden shadow-lg">
                    <MapContainer apiKey={apiKey} geofences={geofences} />
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
        </div>
    );
}
