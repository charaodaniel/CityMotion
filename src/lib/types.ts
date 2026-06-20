export type UserRole = 'dev' | 'ti' | 'admin' | 'manager' | 'employee';

export type EmployeeStatus = 'Disponível' | 'Em Viagem' | 'Afastado' | 'Em Serviço';

export type Employee = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  status: EmployeeStatus;
  sector: string[];
  role: string;
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
  lastRefuelingDate?: string;
};

export type ScheduleStatus = 'Agendada' | 'Em Andamento' | 'Concluída' | 'Cancelada';

export type Passenger = {
  name: string;
  document: string;
};

export type Refueling = {
  id: string;
  vehicleId: string;
  vehicleModel?: string;
  licensePlate?: string;
  tripId?: string;
  date: string;
  mileage: number;
  liters: number;
  price: number;
  totalValue: number;
  fuelType: string;
  gasStation?: string;
  driverName: string;
  notes?: string;
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

export type MaintenanceRequestStatus = 'Pendente' | 'Em Andamento' | 'Concluída';
export type MaintenanceRequestType = 'Manutenção Corretiva' | 'Revisão Preventiva';

export type MaintenanceRequest = {
    id: string;
    vehicleId: string;
    vehicleModel: string;
    licensePlate: string;
    requesterName: string;
    requestDate: string;
    type: MaintenanceRequestType;
    description: string;
    status: MaintenanceRequestStatus;
};

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  type: 'request' | 'trip' | 'maintenance' | 'system';
  date: string;
  read: boolean;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  status: 'Ativa' | 'Suspensa' | 'Demonstração';
  plan: 'Basic' | 'Pro' | 'Enterprise';
  createdAt: string;
  adminEmail: string;
  activeVehicles: number;
  activeUsers: number;
};
