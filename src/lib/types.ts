export type DriverStatus = 'Disponível' | 'Em Viagem' | 'Afastado' | 'Em Serviço';

export type Driver = {
  id: string;
  name: string;
  status: DriverStatus;
  vehicleModel?: string;
  licensePlate?: string;
  sector: string;
  cnh: string;
};

export type VehicleStatus = 'Disponível' | 'Em Serviço' | 'Em Viagem' | 'Manutenção';

export type Vehicle = {
  id: string;
  driverName: string;
  vehicleModel: string;
  licensePlate: string;
  status: VehicleStatus;
  destination?: string;
  mileage: number;
  sector: string;
};
