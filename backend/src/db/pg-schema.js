import {
  pgTable,
  serial,
  text,
  integer,
  real,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core";
const employees = pgTable(
  "employees",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull().default("123456"),
    role: text("role").notNull(),
    sector: text("sector"),
    // JSON string: ["Setor A"]
    status: text("status").default("Dispon\xEDvel"),
    matricula: text("matricula").unique(),
    phone: text("phone"),
    cnh: text("cnh"),
    isDemo: integer("is_demo").default(0),
    supabaseUserId: text("supabase_user_id"),
    resetToken: text("reset_token"),
    createdAt: timestamp("created_at").defaultNow()
  },
  (table) => ({
    emailIdx: uniqueIndex("employees_email_idx").on(table.email),
    matriculaIdx: uniqueIndex("employees_matricula_idx").on(table.matricula)
  })
);
const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  vehicleModel: text("vehicle_model").notNull(),
  licensePlate: text("license_plate").notNull().unique(),
  sector: text("sector").notNull(),
  mileage: integer("mileage").default(0),
  status: text("status").default("Dispon\xEDvel"),
  createdAt: timestamp("created_at").defaultNow()
});
const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  driver: text("driver").notNull(),
  vehicle: text("vehicle").notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  departureTime: text("departure_time").notNull(),
  arrivalTime: text("arrival_time"),
  startMileage: integer("start_mileage"),
  endMileage: integer("end_mileage"),
  status: text("status").default("Agendada"),
  category: text("category"),
  startChecklist: text("start_checklist"),
  endChecklist: text("end_checklist")
});
const organizations = pgTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  status: text("status").default("Ativa"),
  plan: text("plan").default("Basic"),
  adminEmail: text("admin_email"),
  activeVehicles: integer("active_vehicles").default(0),
  activeUsers: integer("active_users").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: text("sender_id").notNull(),
  receiverId: text("receiver_id").notNull(),
  content: text("content").notNull(),
  isRead: integer("is_read").default(0),
  timestamp: timestamp("timestamp").defaultNow()
});
const refuelings = pgTable("refuelings", {
  id: serial("id").primaryKey(),
  vehicleId: text("vehicle_id").notNull(),
  vehicleModel: text("vehicle_model"),
  licensePlate: text("license_plate"),
  date: timestamp("date").defaultNow(),
  mileage: integer("mileage"),
  liters: real("liters"),
  price: real("price"),
  totalValue: real("total_value"),
  fuelType: text("fuel_type"),
  gasStation: text("gas_station"),
  driverName: text("driver_name"),
  notes: text("notes")
});
const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow(),
  userIdentity: text("user_identity"),
  action: text("action"),
  tableName: text("table_name"),
  details: text("details")
});
const maintenanceRequests = pgTable("maintenance_requests", {
  id: serial("id").primaryKey(),
  vehicleId: text("vehicle_id").notNull(),
  vehicleModel: text("vehicle_model"),
  licensePlate: text("license_plate"),
  requesterName: text("requester_name"),
  requestDate: timestamp("request_date").defaultNow(),
  type: text("type"),
  description: text("description"),
  status: text("status").default("Pendente")
});
const workSchedules = pgTable("work_schedules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  employee: text("employee").notNull(),
  type: text("type"),
  status: text("status").default("Agendada"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  description: text("description")
});
const vehicleRequests = pgTable("vehicle_requests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  sector: text("sector"),
  details: text("details"),
  priority: text("priority").default("M\xE9dia"),
  requester: text("requester"),
  status: text("status").default("Pendente"),
  createdAt: timestamp("created_at").defaultNow()
});
const sectors = pgTable("sectors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  organizationId: text("organization_id"),
  createdAt: timestamp("created_at").defaultNow()
});
const reportTemplates = pgTable("report_templates", {
  id: serial("id").primaryKey(),
  organizationId: text("organization_id").notNull().default("default"),
  // Cabeçalho
  headerLogo: text("header_logo"),
  // base64 da logo
  headerLogoSecondary: text("header_logo_secondary"),
  // logo secundária (opcional)
  headerTitle: text("header_title"),
  headerSubtitle: text("header_subtitle"),
  headerExtra: text("header_extra"),
  // informações extras no cabeçalho (CNPJ, endereço, etc.)
  // Cores
  primaryColor: text("primary_color").default("#3b82f6"),
  secondaryColor: text("secondary_color").default("#1e293b"),
  accentColor: text("accent_color").default("#10b981"),
  // Rodapé
  footerText: text("footer_text"),
  footerExtra: text("footer_extra"),
  // informações no rodapé (telefone, email, etc.)
  // Setor ativo (se vazio, template global)
  sectorName: text("sector_name"),
  sectorDepartment: text("sector_department"),
  // Metadados
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});
export {
  auditLogs,
  employees,
  maintenanceRequests,
  messages,
  organizations,
  refuelings,
  reportTemplates,
  sectors,
  trips,
  vehicleRequests,
  vehicles,
  workSchedules
};
