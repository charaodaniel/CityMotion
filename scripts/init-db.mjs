#!/usr/bin/env node
/**
 * Initialize SQLite database with schema and seed data
 */
import 'dotenv/config';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sqliteSchema } from '../backend/src/db/sqlite-schema.ts';
import bcrypt from 'bcryptjs';

const hash = bcrypt.hashSync('123456', 10);
const rootHash = bcrypt.hashSync('123456789', 10);
const demoHash = bcrypt.hashSync('nexus2024', 10);

// Create database
const sqliteDb = new Database('database/citymotion.db');
sqliteDb.pragma('journal_mode = WAL');
sqliteDb.pragma('foreign_keys = ON');

const db = drizzle(sqliteDb, { schema: sqliteSchema });
const s = sqliteSchema;

// Create tables via raw SQL
console.log('Creating tables...');

sqliteDb.exec(`
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL DEFAULT '123456',
    role TEXT NOT NULL,
    sector TEXT,
    status TEXT DEFAULT 'Disponível',
    matricula TEXT UNIQUE,
    phone TEXT,
    cnh TEXT,
    is_demo INTEGER DEFAULT 0,
    reset_token TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_model TEXT NOT NULL,
    license_plate TEXT NOT NULL UNIQUE,
    sector TEXT NOT NULL,
    mileage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Disponível',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    driver TEXT NOT NULL,
    vehicle TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_time TEXT NOT NULL,
    arrival_time TEXT,
    start_mileage INTEGER,
    end_mileage INTEGER,
    status TEXT DEFAULT 'Agendada',
    category TEXT,
    start_checklist TEXT,
    end_checklist TEXT
  );

  CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'Ativa',
    plan TEXT DEFAULT 'Basic',
    admin_email TEXT,
    active_vehicles INTEGER DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    timestamp TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS refuelings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id TEXT NOT NULL,
    vehicle_model TEXT,
    license_plate TEXT,
    date TEXT DEFAULT (datetime('now')),
    mileage INTEGER,
    liters REAL,
    price REAL,
    total_value REAL,
    fuel_type TEXT,
    gas_station TEXT,
    driver_name TEXT,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT DEFAULT (datetime('now')),
    user_identity TEXT,
    action TEXT,
    table_name TEXT,
    details TEXT
  );

  CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id TEXT NOT NULL,
    vehicle_model TEXT,
    license_plate TEXT,
    requester_name TEXT,
    request_date TEXT DEFAULT (datetime('now')),
    type TEXT,
    description TEXT,
    status TEXT DEFAULT 'Pendente'
  );

  CREATE TABLE IF NOT EXISTS work_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    employee TEXT NOT NULL,
    type TEXT,
    status TEXT DEFAULT 'Agendada',
    start_date TEXT,
    end_date TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS vehicle_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    sector TEXT,
    details TEXT,
    priority TEXT DEFAULT 'Média',
    requester TEXT,
    status TEXT DEFAULT 'Pendente',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sectors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    organization_id TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

console.log('Tables created successfully.');

// Seed data
console.log('Seeding data...');

const users = [
  { name: 'Desenvolvedor Root', email: 'dev@dev.com', password: rootHash, role: 'Desenvolvedor Global', sector: JSON.stringify(['TI - Infraestrutura']), matricula: 'root', phone: '000000000', is_demo: 0 },
  { name: 'Júlio César', email: 'admin@citymotion.com', password: hash, role: 'Administrador', sector: JSON.stringify(['Gabinete do Prefeito']), matricula: 'GP-001', phone: '5511999999999', is_demo: 0 },
  { name: 'João da Silva', email: 'driver@citymotion.com', password: hash, role: 'Motorista', sector: JSON.stringify(['Secretaria de Obras, Viação e Urbanismo']), matricula: 'M-001', phone: '5511777777777', is_demo: 0 },
  { name: 'Avaliador Demonstração', email: 'demo@citymotion.com', password: demoHash, role: 'Gestor de Setor', sector: JSON.stringify(['Gabinete do Prefeito']), matricula: 'DEMO-ROOT', phone: '5511000000000', is_demo: 1 },
];

for (const u of users) {
  sqliteDb.prepare(
    `INSERT OR IGNORE INTO employees (name, email, password, role, sector, matricula, phone, is_demo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(u.name, u.email, u.password, u.role, u.sector, u.matricula, u.phone, u.is_demo);
}

const orgs = [
  { id: 'ORG001', name: 'Prefeitura de CityMotion', slug: 'citymotion-gov', admin_email: 'admin@citymotion.com', active_vehicles: 25, active_users: 120 },
  { id: 'ORG002', name: 'Logística TransRápido', slug: 'transrapido', admin_email: 'ceo@transrapido.com.br', active_vehicles: 12, active_users: 45 },
  { id: 'ORG003', name: 'Saúde em Movimento', slug: 'saude-mov', admin_email: 'contato@saudemov.org', active_vehicles: 3, active_users: 8 },
];

for (const o of orgs) {
  sqliteDb.prepare(
    `INSERT OR IGNORE INTO organizations (id, name, slug, admin_email, active_vehicles, active_users)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(o.id, o.name, o.slug, o.admin_email, o.active_vehicles, o.active_users);
}

console.log('Seed data inserted successfully.');
sqliteDb.close();
console.log('Database ready.');
