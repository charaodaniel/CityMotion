import type { Driver, Vehicle, Schedule, VehicleRequest, Sector } from './types';

export const sectors: Sector[] = [
  { id: 'SEC01', name: 'Secretaria de Saúde', description: 'Gestão de saúde pública, hospitais e postos de saúde.', vehicleCount: 2, driverCount: 3 },
  { id: 'SEC02', name: 'Secretaria de Obras', description: 'Manutenção de vias, construções e infraestrutura urbana.', vehicleCount: 1, driverCount: 1 },
  { id: 'SEC03', name: 'Secretaria de Educação', description: 'Administração de escolas, creches e transporte escolar.', vehicleCount: 1, driverCount: 1 },
  { id: 'SEC04', name: 'Administração', description: 'Serviços gerais, finanças e recursos humanos da prefeitura.', vehicleCount: 1, driverCount: 1 },
  { id: 'SEC05', name: 'Vigilância Sanitária', description: 'Fiscalização e controle sanitário de estabelecimentos.', vehicleCount: 1, driverCount: 1 },
];

export const drivers: Driver[] = [
  { id: '1', name: 'João da Silva', cnh: '123456789', sector: 'Secretaria de Obras', status: 'Em Serviço' },
  { id: '2', name: 'Maria Oliveira', cnh: '987654321', sector: 'Secretaria de Saúde', status: 'Disponível' },
  { id: '3', name: 'Pedro Santos', cnh: '112233445', sector: 'Administração', status: 'Disponível' },
  { id: '4', name: 'Ana Souza', cnh: '556677889', sector: 'Secretaria de Educação', status: 'Afastado' },
  { id: '5', name: 'Carlos Pereira', cnh: '998877665', sector: 'Vigilância Sanitária', status: 'Em Viagem' },
  { id: '6', name: 'Lúcia Ferreira', cnh: '123123123', sector: 'Secretaria de Saúde', status: 'Disponível' },
];

export const vehicles: Vehicle[] = [
  { id: 'V1', driverName: 'João da Silva', vehicleModel: 'Fiat Strada', licensePlate: 'PM-001', status: 'Em Serviço', destination: 'Hospital Municipal', mileage: 15000, sector: 'Secretaria de Obras' },
  { id: 'V2', vehicleModel: 'VW Gol', licensePlate: 'PM-002', status: 'Disponível', mileage: 8500, sector: 'Secretaria de Saúde' },
  { id: 'V3', vehicleModel: 'Renault Kwid', licensePlate: 'PM-003', status: 'Disponível', mileage: 22000, sector: 'Administração' },
  { id: 'V4', vehicleModel: 'Chevrolet Onix', licensePlate: 'PM-004', status: 'Manutenção', mileage: 41000, sector: 'Secretaria de Educação' },
  { id: 'V5', driverName: 'Carlos Pereira', vehicleModel: 'Fiat Mobi', licensePlate: 'PM-005', status: 'Em Viagem', destination: 'Uruguaiana/RS', mileage: 5200, sector: 'Vigilância Sanitária' },
];

export const schedules: Schedule[] = [
    { 
        id: 'SCH001', 
        title: 'Transporte de Paciente', 
        driver: 'Maria Oliveira', 
        vehicle: 'VW Gol (PM-002)', 
        origin: 'Posto de Saúde Central', 
        destination: 'Hospital Regional', 
        time: '28/07/2024 08:00',
        status: 'Concluída',
        category: 'Transporte de Paciente',
    },
    { 
        id: 'SCH002', 
        title: 'Entrega de Documentos', 
        driver: 'Pedro Santos', 
        vehicle: 'Renault Kwid (PM-003)', 
        origin: 'Prefeitura', 
        destination: 'Secretaria de Educação', 
        time: '29/07/2024 09:30',
        status: 'Em Andamento',
        category: 'Entrega de Documentos',
    },
    { 
        id: 'SCH003', 
        title: 'Visita Técnica em Obra', 
        driver: 'João da Silva', 
        vehicle: 'Fiat Strada (PM-001)', 
        origin: 'Secretaria de Obras', 
        destination: 'Bairro Novo Horizonte', 
        time: '30/07/2024 14:00',
        status: 'Agendada',
        category: 'Visita Técnica',
    },
     { 
        id: 'SCH004', 
        title: 'Inspeção Sanitária', 
        driver: 'Carlos Pereira', 
        vehicle: 'Fiat Mobi (PM-005)', 
        origin: 'Vigilância Sanitária', 
        destination: 'Restaurante Central', 
        time: '27/07/2024 11:00',
        status: 'Concluída',
        category: 'Inspeção Sanitária',
    },
];

export const vehicleRequests: VehicleRequest[] = [
    {
        id: 'REQ001',
        title: 'Buscar materiais de construção',
        sector: 'Secretaria de Obras',
        details: 'É necessário um veículo com caçamba para buscar cimento e areia no fornecedor X.',
        priority: 'Alta',
        requestDate: '2024-07-29T10:00:00Z',
    },
    {
        id: 'REQ002',
        title: 'Levar equipe para evento',
        sector: 'Secretaria de Cultura',
        details: 'Transportar 3 pessoas da equipe de eventos para a Praça Central para a montagem do palco.',
        priority: 'Média',
        requestDate: '2024-07-29T11:30:00Z',
    },
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
