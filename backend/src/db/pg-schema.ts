import {
  pgTable,
  serial,
  text,
  integer,
  real,
  timestamp,
  boolean,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// =============================================================
// Employees (Funcionários)
// =============================================================
export const employees = pgTable(
  'employees',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull().default('123456'),
    role: text('role').notNull(),
    sector: text('sector'), // JSON string: ["Setor A"]
    status: text('status').default('Disponível'),
    matricula: text('matricula').unique(),
    phone: text('phone'),
    cnh: text('cnh'),
    isDemo: integer('is_demo').default(0),
    resetToken: text('reset_token'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex('employees_email_idx').on(table.email),
    matriculaIdx: uniqueIndex('employees_matricula_idx').on(table.matricula),
  })
);

// =============================================================
// Vehicles (Veículos)
// =============================================================
export const vehicles = pgTable('vehicles', {
  id: serial('id').primaryKey(),
  vehicleModel: text('vehicle_model').notNull(),
  licensePlate: text('license_plate').notNull().unique(),
  sector: text('sector').notNull(),
  mileage: integer('mileage').default(0),
  status: text('status').default('Disponível'),
  createdAt: timestamp('created_at').defaultNow(),
});

// =============================================================
// Trips (Viagens/Missões)
// =============================================================
export const trips = pgTable('trips', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  driver: text('driver').notNull(),
  vehicle: text('vehicle').notNull(),
  origin: text('origin').notNull(),
  destination: text('destination').notNull(),
  departureTime: text('departure_time').notNull(),
  arrivalTime: text('arrival_time'),
  startMileage: integer('start_mileage'),
  endMileage: integer('end_mileage'),
  status: text('status').default('Agendada'),
  category: text('category'),
  startChecklist: text('start_checklist'),
  endChecklist: text('end_checklist'),
});

// =============================================================
// Organizations (Multitenancy)
// =============================================================
export const organizations = pgTable('organizations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  status: text('status').default('Ativa'),
  plan: text('plan').default('Basic'),
  adminEmail: text('admin_email'),
  activeVehicles: integer('active_vehicles').default(0),
  activeUsers: integer('active_users').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// =============================================================
// Messages (Chat)
// =============================================================
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  senderId: text('sender_id').notNull(),
  receiverId: text('receiver_id').notNull(),
  content: text('content').notNull(),
  isRead: integer('is_read').default(0),
  timestamp: timestamp('timestamp').defaultNow(),
});

// =============================================================
// Refuelings (Abastecimentos)
// =============================================================
export const refuelings = pgTable('refuelings', {
  id: serial('id').primaryKey(),
  vehicleId: text('vehicle_id').notNull(),
  vehicleModel: text('vehicle_model'),
  licensePlate: text('license_plate'),
  date: timestamp('date').defaultNow(),
  mileage: integer('mileage'),
  liters: real('liters'),
  price: real('price'),
  totalValue: real('total_value'),
  fuelType: text('fuel_type'),
  gasStation: text('gas_station'),
  driverName: text('driver_name'),
  notes: text('notes'),
});

// =============================================================
// Audit Logs
// =============================================================
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  timestamp: timestamp('timestamp').defaultNow(),
  userIdentity: text('user_identity'),
  action: text('action'),
  tableName: text('table_name'),
  details: text('details'),
});

// =============================================================
// Maintenance Requests
// =============================================================
export const maintenanceRequests = pgTable('maintenance_requests', {
  id: serial('id').primaryKey(),
  vehicleId: text('vehicle_id').notNull(),
  vehicleModel: text('vehicle_model'),
  licensePlate: text('license_plate'),
  requesterName: text('requester_name'),
  requestDate: timestamp('request_date').defaultNow(),
  type: text('type'),
  description: text('description'),
  status: text('status').default('Pendente'),
});

// =============================================================
// Work Schedules (Escalas)
// =============================================================
export const workSchedules = pgTable('work_schedules', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  employee: text('employee').notNull(),
  type: text('type'),
  status: text('status').default('Agendada'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  description: text('description'),
});

// =============================================================
// Vehicle Requests (Solicitações)
// =============================================================
export const vehicleRequests = pgTable('vehicle_requests', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  sector: text('sector'),
  details: text('details'),
  priority: text('priority').default('Média'),
  requester: text('requester'),
  status: text('status').default('Pendente'),
  createdAt: timestamp('created_at').defaultNow(),
});

// =============================================================
// Sectors (Setores)
// =============================================================
export const sectors = pgTable('sectors', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  organizationId: text('organization_id'),
  createdAt: timestamp('created_at').defaultNow(),
});
