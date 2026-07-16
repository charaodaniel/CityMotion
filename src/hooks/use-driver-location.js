"use client";
import { useState, useEffect, useCallback, useRef } from "react";
const LOCATION_INTERVAL = 30 * 60 * 1e3;
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=pt`,
      { headers: { "User-Agent": "CityMotion/1.0" } }
    );
    if (!res.ok) return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    const data = await res.json();
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}
function useDriverLocation(activeTrips, currentDriverId, currentDriverName) {
  const [driverLocations, setDriverLocations] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const intervalRef = useRef(null);
  const watchIdRef = useRef(null);
  const captureLocation = useCallback(async () => {
    if (!navigator.geolocation) return;
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 1e4,
          maximumAge: 6e4
        });
      });
      const { latitude, longitude } = position.coords;
      setCurrentPosition({ latitude, longitude });
      const address = await reverseGeocode(latitude, longitude);
      const newLocations = activeTrips.map((trip) => ({
        driverId: currentDriverId || "unknown",
        driverName: currentDriverName || trip.driver,
        vehicleId: trip.vehicle,
        vehiclePlate: trip.vehicle,
        latitude,
        longitude,
        address,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        tripId: trip.id,
        speed: position.coords.speed || void 0
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
        return updated.slice(-100);
      });
    } catch (err) {
      console.warn("[Geo] Erro ao capturar localiza\xE7\xE3o:", err);
    }
  }, [activeTrips, currentDriverId, currentDriverName]);
  const startTracking = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      console.warn("[Geo] Geolocaliza\xE7\xE3o n\xE3o dispon\xEDvel");
      return;
    }
    setIsTracking(true);
    captureLocation();
    intervalRef.current = setInterval(captureLocation, LOCATION_INTERVAL);
    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ latitude, longitude });
      },
      (err) => console.warn("[Geo] Watch error:", err),
      { enableHighAccuracy: true, timeout: 15e3, maximumAge: 12e4 }
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
    currentPosition
  };
}
export {
  useDriverLocation
};
