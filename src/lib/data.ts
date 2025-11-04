import type { Driver, Vehicle, Schedule, VehicleRequest, Sector, WorkSchedule } from './types';

import sectorsData from '@/data/sectors.json';
import driversData from '@/data/drivers.json';
import vehiclesData from '@/data/vehicles.json';
import workSchedulesData from '@/data/work-schedules.json';
import { chartData as chartDataJson, driverActivity as driverActivityJson } from '@/data/charts.json';


export const sectors: Sector[] = sectorsData;
export const drivers: Driver[] = driversData;
export const vehicles: Vehicle[] = vehiclesData;
export const workSchedules: WorkSchedule[] = workSchedulesData;

// Schedules and VehicleRequests are now fetched via API in AppProvider
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
