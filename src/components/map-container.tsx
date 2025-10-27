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
                            Configuration Needed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            Please provide a Google Maps API key to display the map. Create a{' '}
                            <code className="bg-primary/10 text-primary p-1 rounded-sm">.env.local</code> file at the root of your project
                            and add your key:
                        </p>
                        <pre className="mt-4 p-2 bg-slate-800 text-white rounded-md text-sm">
                            GOOGLE_MAPS_API_KEY=your_api_key_here
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
                        strokeColor={'var(--color-accent)'}
                        strokeOpacity={0.8}
                        strokeWeight={2}
                        fillColor={'var(--color-accent)'}
                        fillOpacity={0.35}
                    />
                ))}
            </Map>
        </APIProvider>
    );
}
