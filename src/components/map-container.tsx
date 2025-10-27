'use client';

import { MapContainer as LeafletMapContainer, TileLayer, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";

type Geofence = {
    id: string;
    name: string;
    path: { lat: number; lng: number }[];
};

interface MapContainerProps {
    geofences: Geofence[];
}

export function MapContainer({ geofences }: MapContainerProps) {
    const position: [number, number] = [-23.55052, -46.633308];

    // Leaflet usa [lat, lng] enquanto os dados estao como {lat, lng}
    const convertedGeofences = geofences.map(fence => ({
        ...fence,
        path: fence.path.map(p => [p.lat, p.lng] as [number, number])
    }));

    return (
        <LeafletMapContainer center={position} zoom={11} scrollWheelZoom={false} className='h-full w-full'>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {convertedGeofences.map(fence => (
                 <Polygon
                    key={fence.id}
                    positions={fence.path}
                    pathOptions={{
                        color: 'hsl(var(--accent))',
                        fillColor: 'hsl(var(--accent))',
                        fillOpacity: 0.35,
                    }}
                 />
            ))}
        </LeafletMapContainer>
    );
}
