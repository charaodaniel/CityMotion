import type { Employee, Vehicle, Schedule, VehicleRequest, Sector, WorkSchedule } from './types';

// As importações de dados JSON estáticos foram removidas, pois a lógica
// de dados agora é centralizada e fornecida pelo AppProvider, que busca de uma API simulada.
// Esta limpeza prepara o código para a futura substituição da API simulada por um backend real (ex: Firebase).

import { chartData as chartDataJson, driverActivity as driverActivityJson } from '@/data/charts.json';


// Os arrays de dados são inicializados vazios, pois os dados dinâmicos são gerenciados pelo AppContext.
// Manter as declarações pode ser útil para inferência de tipo em algumas partes do código.
export const sectors: Sector[] = [];
export const employees: Employee[] = [];
export const vehicles: Vehicle[] = [];
export const workSchedules: WorkSchedule[] = [];
export const schedules: Schedule[] = [];
export const vehicleRequests: VehicleRequest[] = [];

// Os dados para gráficos podem continuar sendo estáticos por enquanto.
export const chartData = chartDataJson;
export const driverActivity = driverActivityJson;

export const timeToDestination = [
  { zone: 'A', time: 12 },
  { zone: 'B', time: 8 },
  { zone: 'C', time: 15 },
  { zone: 'D', time: 7 },
  { zone: 'E', time: 10 },
];
