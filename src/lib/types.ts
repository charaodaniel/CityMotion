
export type DriverStatus = 'Disponível' | 'Em Viagem' | 'Afastado' | 'Em Serviço';

export type Driver = {
  id: string;
  name: string;
  status: DriverStatus;
  sector: string;
  cnh?: string;
  matricula?: string;
  idPhoto?: string;
  cnhPhoto?: string;
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

export type Refueling = {
  mileage: number;
  liters: number;
  price: number;
  receiptPhoto?: string;
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
  startChecklist?: string[];
  endChecklist?: string[];
  refuelings?: Refueling[];
};

export type WorkScheduleStatus = 'Agendada' | 'Em Andamento' | 'Concluída';
export type WorkScheduleType = "Jornada Regular" | "Plantão" | "Sobreaviso" | "Folga" | "Férias" | "Hora Extra" | "Evento Especial";


export type WorkSchedule = {
  id: string;
  title: string;
  employee: string;
  type: WorkScheduleType;
  status: WorkScheduleStatus;
  startDate: string;
  endDate: string;
  description?: string;
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
  requester?: string;
};

export type Sector = {
  id: string;
  name: string;
  description: string;
  vehicleCount: number;
  driverCount: number;
};
