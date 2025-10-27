import type { Driver, Taxi } from './types';

export const drivers: Driver[] = [
  { id: '1', name: 'John Doe', vehicleModel: 'Toyota Prius', licensePlate: 'ABC-123', status: 'Verified', rating: 4.8, rides: 125 },
  { id: '2', name: 'Jane Smith', vehicleModel: 'Honda Civic', licensePlate: 'XYZ-789', status: 'Pending', rating: 4.9, rides: 88 },
  { id: '3', name: 'Peter Jones', vehicleModel: 'Ford Focus', licensePlate: 'FGH-456', status: 'Verified', rating: 4.5, rides: 210 },
  { id: '4', name: 'Mary Johnson', vehicleModel: 'Chevrolet Bolt', licensePlate: 'JKL-101', status: 'Rejected', rating: 3.2, rides: 42 },
  { id: '5', name: 'Chris Lee', vehicleModel: 'Tesla Model 3', licensePlate: 'TES-333', status: 'Verified', rating: 5.0, rides: 301 },
  { id: '6', name: 'Patricia Williams', vehicleModel: 'Nissan Leaf', licensePlate: 'LEF-200', status: 'Verified', rating: 4.7, rides: 150 },
];

export const taxis: Taxi[] = [
  { id: 'T1', driverName: 'Carlos Silva', vehicleModel: 'Fiat Cronos', licensePlate: 'TAXI-001', status: 'Active', rating: 4.9, ridesToday: 15 },
  { id: 'T2', driverName: 'Ana Pereira', vehicleModel: 'Chevrolet Onix', licensePlate: 'TAXI-002', status: 'Active', rating: 4.7, ridesToday: 12 },
  { id: 'T3', driverName: 'Rafael Souza', vehicleModel: 'Renault Logan', licensePlate: 'TAXI-003', status: 'Inactive', rating: 4.6, ridesToday: 0 },
  { id: 'T4', driverName: 'Mariana Costa', vehicleModel: 'Volkswagen Voyage', licensePlate: 'TAXI-004', status: 'Maintenance', rating: 4.8, ridesToday: 2 },
  { id: 'T5', driverName: 'Lucas Almeida', vehicleModel: 'Hyundai HB20S', licensePlate: 'TAXI-005', status: 'Active', rating: 4.9, ridesToday: 22 },
];


export const chartData = [
  { month: 'January', rides: 186, drivers: 80 },
  { month: 'February', rides: 305, drivers: 92 },
  { month: 'March', rides: 237, drivers: 105 },
  { month: 'April', rides: 273, drivers: 110 },
  { month: 'May', rides: 209, drivers: 115 },
  { month: 'June', rides: 214, drivers: 120 },
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

export const geofences = [
    { id: 'airport', name: 'Airport Zone', path: [{ lat: -23.4355556, lng: -46.4730556 }, { lat: -23.43, lng: -46.47 }, { lat: -23.43, lng: -46.46 }, { lat: -23.4355556, lng: -46.4630556 }] },
    { id: 'downtown', name: 'Downtown', path: [{ lat: -23.5505, lng: -46.6333 }, { lat: -23.54, lng: -46.63 }, { lat: -23.54, lng: -46.62 }, { lat: -23.55, lng: -46.62 }] },
];
