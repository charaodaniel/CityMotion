import type { Driver, Vehicle } from './types';

export const drivers: Driver[] = [
  { id: '1', name: 'João da Silva', category: 'Veículo da Prefeitura', vehicleModel: 'Fiat Strada', licensePlate: 'PM-001', status: 'Verificado', rating: 4.8, rides: 125 },
  { id: '2', name: 'Maria Oliveira', category: 'Veículo da Prefeitura', vehicleModel: 'VW Gol', licensePlate: 'PM-002', status: 'Pendente', rating: 4.9, rides: 88 },
  { id: '3', name: 'Pedro Santos', category: 'Veículo da Prefeitura', vehicleModel: 'Renault Kwid', licensePlate: 'PM-003', status: 'Verificado', rating: 4.5, rides: 210 },
  { id: '4', name: 'Ana Souza', category: 'Veículo da Prefeitura', vehicleModel: 'Chevrolet Onix', licensePlate: 'PM-004', status: 'Rejeitado', rating: 3.2, rides: 42 },
  { id: '5', name: 'Carlos Pereira', category: 'Veículo da Prefeitura', vehicleModel: 'Fiat Mobi', licensePlate: 'PM-005', status: 'Verificado', rating: 5.0, rides: 301 },
  { id: '6', name: 'Lúcia Ferreira', category: 'Veículo da Prefeitura', vehicleModel: 'VW Nivus', licensePlate: 'PM-006', status: 'Verificado', rating: 4.7, rides: 150 },
];

export const vehicles: Vehicle[] = [
  { id: 'V1', driverName: 'João da Silva', vehicleModel: 'Fiat Strada', licensePlate: 'PM-001', status: 'Em Serviço', mileage: 15000, sector: 'Secretaria de Obras' },
  { id: 'V2', driverName: 'Maria Oliveira', vehicleModel: 'VW Gol', licensePlate: 'PM-002', status: 'Na Sede', mileage: 8500, sector: 'Secretaria de Saúde' },
  { id: 'V3', driverName: 'Pedro Santos', vehicleModel: 'Renault Kwid', licensePlate: 'PM-003', status: 'Na Sede', mileage: 22000, sector: 'Administração' },
  { id: 'V4', driverName: 'Ana Souza', vehicleModel: 'Chevrolet Onix', licensePlate: 'PM-004', status: 'Manutenção', mileage: 41000, sector: 'Secretaria de Educação' },
  { id: 'V5', driverName: 'Carlos Pereira', vehicleModel: 'Fiat Mobi', licensePlate: 'PM-005', status: 'Em Serviço', mileage: 5200, sector: 'Vigilância Sanitária' },
];


export const chartData = [
  { month: 'Janeiro', rides: 186, drivers: 80 },
  { month: 'Fevereiro', rides: 305, drivers: 92 },
  { month: 'Março', rides: 237, drivers: 105 },
  { month: 'Abril', rides: 273, drivers: 110 },
  { month: 'Maio', rides: 209, drivers: 115 },
  { month: 'Junho', rides: 214, drivers: 120 },
];


export const driverActivity = [
    { time: '00:00', activeDrivers: 50, onRide: 20 },
    { time: '03:00', activeDrivers: 40, onRide: 15 },
    { time: '06:00', activeDrivers: 80, onRide: 60 },
    { time: '09:00', activeDrivers: 250, onRide: 200 },
    { time: '12:00', activeDrivers: 300, onRide: 220 },
    { time: '15:00', activeDrivers: 280, onRide: 210 },
    { time: '18:00', activeDrivers: 320, onRide: 280 },
    { time: '21:00', activeDrivers: 150, onRide: 100 },
];

export const timeToDestination = [
  { zone: 'A', time: 12 },
  { zone: 'B', time: 8 },
  { zone: 'C', time: 15 },
  { zone: 'D', time: 7 },
  { zone: 'E', time: 10 },
];
