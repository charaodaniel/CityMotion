import type { Driver, Vehicle } from './types';

export const drivers: Driver[] = [
  { id: '1', name: 'João da Silva', cnh: '123456789', sector: 'Secretaria de Obras', vehicleModel: 'Fiat Strada', licensePlate: 'PM-001', status: 'Em Serviço' },
  { id: '2', name: 'Maria Oliveira', cnh: '987654321', sector: 'Secretaria de Saúde', vehicleModel: 'VW Gol', licensePlate: 'PM-002', status: 'Disponível' },
  { id: '3', name: 'Pedro Santos', cnh: '112233445', sector: 'Administração', vehicleModel: 'Renault Kwid', licensePlate: 'PM-003', status: 'Disponível' },
  { id: '4', name: 'Ana Souza', cnh: '556677889', sector: 'Secretaria de Educação', vehicleModel: 'Chevrolet Onix', licensePlate: 'PM-004', status: 'Afastado' },
  { id: '5', name: 'Carlos Pereira', cnh: '998877665', sector: 'Vigilância Sanitária', vehicleModel: 'Fiat Mobi', licensePlate: 'PM-005', status: 'Em Viagem' },
  { id: '6', name: 'Lúcia Ferreira', cnh: '123123123', sector: 'Secretaria de Saúde', vehicleModel: 'VW Nivus', licensePlate: 'PM-006', status: 'Disponível' },
];

export const vehicles: Vehicle[] = [
  { id: 'V1', driverName: 'João da Silva', vehicleModel: 'Fiat Strada', licensePlate: 'PM-001', status: 'Em Serviço', destination: 'Hospital Municipal', mileage: 15000, sector: 'Secretaria de Obras' },
  { id: 'V2', driverName: 'Maria Oliveira', vehicleModel: 'VW Gol', licensePlate: 'PM-002', status: 'Disponível', mileage: 8500, sector: 'Secretaria de Saúde' },
  { id: 'V3', driverName: 'Pedro Santos', vehicleModel: 'Renault Kwid', licensePlate: 'PM-003', status: 'Disponível', mileage: 22000, sector: 'Administração' },
  { id: 'V4', driverName: 'Ana Souza', vehicleModel: 'Chevrolet Onix', licensePlate: 'PM-004', status: 'Manutenção', mileage: 41000, sector: 'Secretaria de Educação' },
  { id: 'V5', driverName: 'Carlos Pereira', vehicleModel: 'Fiat Mobi', licensePlate: 'PM-005', status: 'Em Viagem', destination: 'Uruguaiana/RS', mileage: 5200, sector: 'Vigilância Sanitária' },
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
