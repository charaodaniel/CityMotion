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

export type Vehicle = {
  id: string;
  driverName: string;
  vehicleModel: string;
  licensePlate: string;
  status: 'Na Sede' | 'Em Serviço' | 'Manutenção';
  mileage: number;
  sector: string;
};
