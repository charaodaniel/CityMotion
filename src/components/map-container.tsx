'use client';

import { APIProvider, Map, Polygon } from '@vis.gl/react-google-maps';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type Geofence = {
    id: string;
    name: string;
    path: { lat: number; lng: number }[];
};

interface MapContainerProps {
    apiKey?: string;
    geofences: Geofence[];
}

export function MapContainer({ apiKey, geofences }: MapContainerProps) {
    if (!apiKey) {
        return (
            <div className="h-full flex items-center justify-center bg-muted">
                <Card className="max-w-md m-4 text-center">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2 font-headline">
                            <AlertCircle className="text-destructive" />
                            Configuração Necessária
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            Por favor, forneça uma chave de API do Google Maps para exibir o mapa. Crie um arquivo{' '}
                            <code className="bg-primary/10 text-primary p-1 rounded-sm">.env.local</code> na raiz do seu projeto
                            e adicione sua chave:
                        </p>
                        <pre className="mt-4 p-2 bg-slate-800 text-white rounded-md text-sm">
                            GOOGLE_MAPS_API_KEY=sua_chave_de_api_aqui
                        </pre>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const position = { lat: -23.55052, lng: -46.633308 };

    return (
        <APIProvider apiKey={apiKey}>
            <Map
                defaultCenter={position}
                defaultZoom={11}
                mapId="citymotion_map"
                gestureHandling={'greedy'}
                disableDefaultUI={true}
            >
                {geofences.map(fence => (
                     <Polygon
                        key={fence.id}
                        paths={fence.path}
                        strokeColor={'hsl(var(--accent))'}
                        strokeOpacity={0.8}
                        strokeWeight={2}
                        fillColor={'hsl(var(--accent))'}
                        fillOpacity={0.35}
                    />
                ))}
            </Map>
        </APIProvider>
    );
}
