import { z } from 'zod';

// =============================================================
// Auth Schemas
// =============================================================
export const loginSchema = z.object({
  email: z.string().min(1, 'Email/Matrícula/Telefone é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

// =============================================================
// Employee Schemas
// =============================================================
export const createEmployeeSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(),
  role: z.string().min(1, 'Cargo é obrigatório'),
  sector: z.string().optional(),
  matricula: z.string().optional(),
  phone: z.string().optional(),
  cnh: z.string().optional(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

// =============================================================
// Vehicle Schemas
// =============================================================
export const createVehicleSchema = z.object({
  vehicleModel: z.string().min(1, 'Modelo é obrigatório'),
  licensePlate: z.string().min(1, 'Placa é obrigatória'),
  sector: z.string().min(1, 'Setor é obrigatório'),
  mileage: z.number().optional(),
  status: z.string().optional(),
});

// =============================================================
// Message Schemas
// =============================================================
export const sendMessageSchema = z.object({
  receiverId: z.string().min(1, 'Destinatário é obrigatório'),
  content: z.string().min(1, 'Mensagem não pode estar vazia'),
});

// =============================================================
// Refueling Schemas
// =============================================================
export const createRefuelingSchema = z.object({
  vehicleId: z.string().min(1, 'Veículo é obrigatório'),
  vehicleModel: z.string().optional(),
  licensePlate: z.string().optional(),
  mileage: z.number().optional(),
  liters: z.number().optional(),
  price: z.number().optional(),
  totalValue: z.number().optional(),
  fuelType: z.string().optional(),
  gasStation: z.string().optional(),
  driverName: z.string().optional(),
  notes: z.string().optional(),
});

// =============================================================
// Vehicle Request Schemas
// =============================================================
export const createRequestSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  sector: z.string().optional(),
  details: z.string().optional(),
  priority: z.enum(['Baixa', 'Média', 'Alta', 'Urgente']).optional().default('Média'),
});

// =============================================================
// Infrastructure Schemas
// =============================================================
export const testDbSchema = z.object({
  type: z.enum(['sqlite', 'postgresql', 'mongodb', 'supabase']),
  url: z.string().optional(),
});

export const saveConfigSchema = z.object({
  section: z.enum(['database', 'proxy', 'smtp', 'server']),
  config: z.record(z.any()),
});

export const testSmtpSchema = z.object({
  host: z.string().optional(),
  port: z.coerce.number().optional(),
  user: z.string().optional(),
  pass: z.string().optional(),
  secure: z.boolean().optional(),
});
