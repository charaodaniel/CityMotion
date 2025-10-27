export type Driver = {
  id: string;
  name: string;
  category: 'Veículo da Prefeitura';
  vehicleModel: string;
  licensePlate: string;
  status: 'Verificado' | 'Pendente' | 'Rejeitado';
  rating: number;
  rides: number;
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
