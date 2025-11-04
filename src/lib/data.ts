import type { Driver, Vehicle, Schedule, VehicleRequest, Sector, WorkSchedule } from './types';

// These imports are no longer needed as data will be fetched from the API
// import sectorsData from '@/data/sectors.json';
// import driversData from '@/data/drivers.json';
// import vehiclesData from '@/data/vehicles.json';
// import workSchedulesData from '@/data/work-schedules.json';

import { chartData as chartDataJson, driverActivity as driverActivityJson } from '@/data/charts.json';


// Data will be provided via AppContext, fetched from an API.
// These arrays can be kept for type inference or completely removed if pages are fully dynamic.
export const sectors: Sector[] = [];
export const drivers: Driver[] = [];
export const vehicles: Vehicle[] = [];
export const workSchedules: WorkSchedule[] = [];
export const schedules: Schedule[] = [];
export const vehicleRequests: VehicleRequest[] = [];

export const chartData = chartDataJson;
export const driverActivity = driverActivityJson;

export const timeToDestination = [
  { zone: 'A', time: 12 },
  { zone: 'B', time: 8 },
  { zone: 'C', time: 15 },
  { zone: 'D', time: 7 },
  { zone: 'E', time: 10 },
];
