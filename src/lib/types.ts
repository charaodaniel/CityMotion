export type DriverStatus = 'Disponível' | 'Em Viagem' | 'Afastado' | 'Em Serviço';

export type Driver = {
  id: string;
  name: string;
  status: DriverStatus;
  sector: string;
  cnh?: string;
  matricula?: string;
};

export type VehicleStatus = 'Disponível' | 'Em Serviço' | 'Em Viagem' | 'Manutenção';

export type Vehicle = {
  id: string;
  driverName?: string; 
  vehicleModel: string;
  licensePlate: string;
  status: VehicleStatus;
  destination?: string;
  mileage: number;
  sector: string;
};

export type ScheduleStatus = 'Agendada' | 'Em Andamento' | 'Concluída' | 'Cancelada';

export type Passenger = {
  name: string;
  document: string;
};

export type Schedule = {
  id: string;
  title: string;
  driver: string;
  vehicle: string;
  origin: string;
  destination:string;
  departureTime: string;
  arrivalTime?: string;
  startMileage?: number;
  endMileage?: number;
  status: ScheduleStatus;
  category: string;
  passengers?: Passenger[];
  startNotes?: string;
  endNotes?: string;
};

export type RequestPriority = 'Alta' | 'Média' | 'Baixa';

export type VehicleRequestStatus = 'Pendente' | 'Aprovada' | 'Rejeitada';

export type VehicleRequest = {
  id: string;
  title: string;
  sector: string;
  details: string;
  priority: RequestPriority;
  requestDate: string;
  status: VehicleRequestStatus;
};

export type Sector = {
  id: string;
  name: string;
  description: string;
  vehicleCount: number;
  driverCount: number;
};
