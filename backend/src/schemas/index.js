import { z } from "zod";
const loginSchema = z.object({
  email: z.string().min(1, "Email/Matr\xEDcula/Telefone \xE9 obrigat\xF3rio"),
  password: z.string().min(1, "Senha \xE9 obrigat\xF3ria")
});
const forgotPasswordSchema = z.object({
  email: z.string().email("Email inv\xE1lido")
});
const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token \xE9 obrigat\xF3rio"),
  password: z.string().min(6, "Senha deve ter no m\xEDnimo 6 caracteres")
});
const createEmployeeSchema = z.object({
  name: z.string().min(1, "Nome \xE9 obrigat\xF3rio"),
  email: z.string().email("Email inv\xE1lido"),
  password: z.string().min(6, "Senha deve ter no m\xEDnimo 6 caracteres").optional(),
  role: z.string().min(1, "Cargo \xE9 obrigat\xF3rio"),
  sector: z.string().optional(),
  matricula: z.string().optional(),
  phone: z.string().optional(),
  cnh: z.string().optional()
});
const updateEmployeeSchema = createEmployeeSchema.partial();
const createVehicleSchema = z.object({
  vehicleModel: z.string().min(1, "Modelo \xE9 obrigat\xF3rio"),
  licensePlate: z.string().min(1, "Placa \xE9 obrigat\xF3ria"),
  sector: z.string().min(1, "Setor \xE9 obrigat\xF3rio"),
  mileage: z.number().optional(),
  status: z.string().optional()
});
const updateVehicleSchema = createVehicleSchema.partial();
const sendMessageSchema = z.object({
  receiverId: z.string().min(1, "Destinat\xE1rio \xE9 obrigat\xF3rio"),
  content: z.string().min(1, "Mensagem n\xE3o pode estar vazia")
});
const createRefuelingSchema = z.object({
  vehicleId: z.string().min(1, "Ve\xEDculo \xE9 obrigat\xF3rio"),
  vehicleModel: z.string().optional(),
  licensePlate: z.string().optional(),
  mileage: z.number().optional(),
  liters: z.number().optional(),
  price: z.number().optional(),
  totalValue: z.number().optional(),
  fuelType: z.string().optional(),
  gasStation: z.string().optional(),
  driverName: z.string().optional(),
  notes: z.string().optional()
});
const createRequestSchema = z.object({
  title: z.string().min(1, "T\xEDtulo \xE9 obrigat\xF3rio"),
  sector: z.string().optional(),
  details: z.string().optional(),
  priority: z.enum(["Baixa", "M\xE9dia", "Alta", "Urgente"]).optional().default("M\xE9dia")
});
const testDbSchema = z.object({
  type: z.enum(["sqlite", "postgresql", "mongodb", "supabase"]),
  url: z.string().optional()
});
const saveConfigSchema = z.object({
  section: z.enum(["database", "proxy", "smtp", "server"]),
  config: z.record(z.any())
});
const testSmtpSchema = z.object({
  host: z.string().optional(),
  port: z.coerce.number().optional(),
  user: z.string().optional(),
  pass: z.string().optional(),
  secure: z.boolean().optional()
});
export {
  createEmployeeSchema,
  createRefuelingSchema,
  createRequestSchema,
  createVehicleSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  saveConfigSchema,
  sendMessageSchema,
  testDbSchema,
  testSmtpSchema,
  updateEmployeeSchema,
  updateVehicleSchema
};
