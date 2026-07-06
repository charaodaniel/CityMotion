"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { DriverLocation, Schedule } from '@/lib/types';

const LOCATION_INTERVAL = 30 * 60 * 1000; // 30 minutos em ms

interface UseDriverLocationReturn {
  driverLocations: DriverLocation[];
  isTracking: boolean;
  startTracking: () => void;
  stopTracking: () => void;
  currentPosition: { latitude: number; longitude: number } | null;
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=pt`,
      { headers: { 'User-Agent': 'CityMotion/1.0' } }
    );
    if (!res.ok) return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    const data = await res.json();
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

export function useDriverLocation(
  activeTrips: Schedule[],
  currentDriverId?: string,
  currentDriverName?: string
): UseDriverLocationReturn {
  const [driverLocations, setDriverLocations] = useState<DriverLocation[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{ latitude: number; longitude: number } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const captureLocation = useCallback(async () => {
    if (!navigator.geolocation) return;

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });

      const { latitude, longitude } = position.coords;
      setCurrentPosition({ latitude, longitude });

      // Para cada viagem ativa, atualiza a localização
      const address = await reverseGeocode(latitude, longitude);

      const newLocations: DriverLocation[] = activeTrips.map((trip) => ({
        driverId: currentDriverId || 'unknown',
        driverName: currentDriverName || trip.driver,
        vehicleId: trip.vehicle,
        vehiclePlate: trip.vehicle,
        latitude,
        longitude,
        address,
        timestamp: new Date().toISOString(),
        tripId: trip.id,
        speed: position.coords.speed || undefined,
      }));

      setDriverLocations((prev) => {
        const updated = [...prev];
        for (const loc of newLocations) {
          const idx = updated.findIndex(
            (l) => l.driverId === loc.driverId && l.tripId === loc.tripId
          );
          if (idx >= 0) {
            updated[idx] = loc;
          } else {
            updated.push(loc);
          }
        }
        // Manter só últimas 100 posições
        return updated.slice(-100);
      });
    } catch (err) {
      console.warn('[Geo] Erro ao capturar localização:', err);
    }
  }, [activeTrips, currentDriverId, currentDriverName]);

  const startTracking = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      console.warn('[Geo] Geolocalização não disponível');
      return;
    }

    setIsTracking(true);

    // Captura imediata
    captureLocation();

    // Intervalo a cada 30 minutos
    intervalRef.current = setInterval(captureLocation, LOCATION_INTERVAL);

    // Watch position para updates mais frequentes (a cada ~1 min em movimento)
    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ latitude, longitude });
      },
      (err) => console.warn('[Geo] Watch error:', err),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 120000 }
    );
  }, [captureLocation]);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  return {
    driverLocations,
    isTracking,
    startTracking,
    stopTracking,
    currentPosition,
  };
}
