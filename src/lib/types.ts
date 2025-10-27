export type Driver = {
  id: string;
  name: string;
  category: 'Taxista' | 'Autônomo' | 'Veículo da Prefeitura';
  vehicleModel: string;
  licensePlate: string;
  status: 'Verificado' | 'Pendente' | 'Rejeitado' | 'Verified' | 'Pending' | 'Rejected';
  rating: number;
  rides: number;
};

export type Taxi = {
  id: string;
  driverName: string;
  vehicleModel: string;
  licensePlate: string;
  status: 'Ativo' | 'Inativo' | 'Manutenção' | 'Active' | 'Inactive' | 'Maintenance';
  rating: number;
  ridesToday: number;
};
