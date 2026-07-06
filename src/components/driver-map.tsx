"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { DriverLocation } from '@/lib/types';

// Fix para ícones do Leaflet no Next.js
const iconDefault = L.icon({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Ícone diferente para veículos em movimento (azul)
const iconMoving = L.icon({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'marker-moving',
});

interface DriverMapProps {
  locations: DriverLocation[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  showAllTrips?: boolean;
}

export default function DriverMap({
  locations,
  center = [-15.7801, -47.9292], // Brasília como centro padrão
  zoom = 5,
  height = '400px',
  showAllTrips = true,
}: DriverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: true,
    });

    // Camada OpenStreetMap (gratuita, sem API key)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | CityMotion',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [center, zoom]);

  // Atualizar marcadores quando locations mudam
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remover marcadores antigos
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (locations.length === 0) return;

    const bounds = L.latLngBounds([]);

    locations.forEach((loc) => {
      const marker = L.marker([loc.latitude, loc.longitude], {
        icon: loc.speed && loc.speed > 0 ? iconMoving : iconDefault,
      });

      const speedText = loc.speed
        ? `Velocidade: ${(loc.speed * 3.6).toFixed(1)} km/h<br/>`
        : '';

      marker.bindPopup(`
        <div style="font-family: monospace; font-size: 12px; min-width: 180px;">
          <strong style="color: #3b82f6; font-size: 14px;">${loc.driverName}</strong><br/>
          ${loc.vehiclePlate ? `🚗 ${loc.vehiclePlate}<br/>` : ''}
          ${speedText}
          📍 ${loc.address || `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`}<br/>
          <span style="color: #888; font-size: 10px;">
            ${new Date(loc.timestamp).toLocaleString('pt-BR')}
          </span>
        </div>
      `);

      marker.addTo(map);
      markersRef.current.push(marker);
      bounds.extend([loc.latitude, loc.longitude]);
    });

    // Ajustar zoom para mostrar todos os marcadores
    if (locations.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [locations]);

  // CSS customizado para marcador em movimento
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .marker-moving .leaflet-marker-icon {
        filter: hue-rotate(200deg) saturate(2);
      }
      .leaflet-popup-content-wrapper {
        border-radius: 8px !important;
        background: #1a1a2e !important;
        color: #e0e0e0 !important;
        border: 1px solid rgba(59, 130, 246, 0.3) !important;
      }
      .leaflet-popup-tip {
        background: #1a1a2e !important;
        border: 1px solid rgba(59, 130, 246, 0.3) !important;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden' }}
      className="border border-border/50"
    />
  );
}
