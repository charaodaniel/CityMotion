import {
  sqliteTable,
  text,
  integer,
  real,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// =============================================================
// Employees (Funcionários)
// =============================================================
export const employees = sqliteTable('employees', {
  id: integer('id').primaryKey({ autoIncrement: true }),
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
  createdAt: text('created_at').default(sql`(datetime('now'))`),
});

// =============================================================
// Vehicles (Veículos)
// =============================================================
export const vehicles = sqliteTable('vehicles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vehicleModel: text('vehicle_model').notNull(),
  licensePlate: text('license_plate').notNull().unique(),
  sector: text('sector').notNull(),
  mileage: integer('mileage').default(0),
  status: text('status').default('Disponível'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
});

// =============================================================
// Trips (Viagens/Missões)
// =============================================================
export const trips = sqliteTable('trips', {
  id: integer('id').primaryKey({ autoIncrement: true }),
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
export const organizations = sqliteTable('organizations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  status: text('status').default('Ativa'),
  plan: text('plan').default('Basic'),
  adminEmail: text('admin_email'),
  activeVehicles: integer('active_vehicles').default(0),
  activeUsers: integer('active_users').default(0),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
});

// =============================================================
// Messages (Chat)
// =============================================================
export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  senderId: text('sender_id').notNull(),
  receiverId: text('receiver_id').notNull(),
  content: text('content').notNull(),
  isRead: integer('is_read').default(0),
  timestamp: text('timestamp').default(sql`(datetime('now'))`),
});

// =============================================================
// Refuelings (Abastecimentos)
// =============================================================
export const refuelings = sqliteTable('refuelings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vehicleId: text('vehicle_id').notNull(),
  vehicleModel: text('vehicle_model'),
  licensePlate: text('license_plate'),
  date: text('date').default(sql`(datetime('now'))`),
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
export const auditLogs = sqliteTable('audit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  timestamp: text('timestamp').default(sql`(datetime('now'))`),
  userIdentity: text('user_identity'),
  action: text('action'),
  tableName: text('table_name'),
  details: text('details'),
});

// =============================================================
// Maintenance Requests
// =============================================================
export const maintenanceRequests = sqliteTable('maintenance_requests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vehicleId: text('vehicle_id').notNull(),
  vehicleModel: text('vehicle_model'),
  licensePlate: text('license_plate'),
  requesterName: text('requester_name'),
  requestDate: text('request_date').default(sql`(datetime('now'))`),
  type: text('type'),
  description: text('description'),
  status: text('status').default('Pendente'),
});

// =============================================================
// Work Schedules (Escalas)
// =============================================================
export const workSchedules = sqliteTable('work_schedules', {
  id: integer('id').primaryKey({ autoIncrement: true }),
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
export const vehicleRequests = sqliteTable('vehicle_requests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  sector: text('sector'),
  details: text('details'),
  priority: text('priority').default('Média'),
  requester: text('requester'),
  status: text('status').default('Pendente'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
});

// =============================================================
// Sectors (Setores)
// =============================================================
export const sectors = sqliteTable('sectors', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  organizationId: text('organization_id'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
});
