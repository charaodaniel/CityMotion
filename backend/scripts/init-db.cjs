#!/usr/bin/env node
/** Initialize SQLite database from backend directory */
const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const hash = bcrypt.hashSync('123456', 10);
const rootHash = bcrypt.hashSync('123456789', 10);
const demoHash = bcrypt.hashSync('nexus2024', 10);

const dbDir = path.resolve(__dirname, '../../database');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const dbPath = path.join(dbDir, 'citymotion.db');
console.log('DB path:', dbPath);

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Create tables
console.log('Creating tables...');
db.exec(`
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL DEFAULT '123456', role TEXT NOT NULL, sector TEXT,
    status TEXT DEFAULT 'Disponível', matricula TEXT UNIQUE, phone TEXT, cnh TEXT,
    is_demo INTEGER DEFAULT 0, reset_token TEXT, created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT, vehicle_model TEXT NOT NULL,
    license_plate TEXT NOT NULL UNIQUE, sector TEXT NOT NULL,
    mileage INTEGER DEFAULT 0, status TEXT DEFAULT 'Disponível', created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, driver TEXT NOT NULL,
    vehicle TEXT NOT NULL, origin TEXT NOT NULL, destination TEXT NOT NULL,
    departure_time TEXT NOT NULL, arrival_time TEXT, start_mileage INTEGER, end_mileage INTEGER,
    status TEXT DEFAULT 'Agendada', category TEXT, start_checklist TEXT, end_checklist TEXT
  );
  CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'Ativa', plan TEXT DEFAULT 'Basic', admin_email TEXT,
    active_vehicles INTEGER DEFAULT 0, active_users INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT, sender_id TEXT NOT NULL, receiver_id TEXT NOT NULL,
    content TEXT NOT NULL, is_read INTEGER DEFAULT 0, timestamp TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS refuelings (
    id INTEGER PRIMARY KEY AUTOINCREMENT, vehicle_id TEXT NOT NULL, vehicle_model TEXT,
    license_plate TEXT, date TEXT DEFAULT (datetime('now')), mileage INTEGER,
    liters REAL, price REAL, total_value REAL, fuel_type TEXT, gas_station TEXT,
    driver_name TEXT, notes TEXT
  );
  CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT, vehicle_id TEXT NOT NULL, vehicle_model TEXT,
    license_plate TEXT, requester_name TEXT, request_date TEXT DEFAULT (datetime('now')),
    type TEXT, description TEXT, status TEXT DEFAULT 'Pendente'
  );
  CREATE TABLE IF NOT EXISTS work_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, employee TEXT NOT NULL,
    type TEXT, status TEXT DEFAULT 'Agendada', start_date TEXT, end_date TEXT, description TEXT
  );
  CREATE TABLE IF NOT EXISTS vehicle_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, sector TEXT, details TEXT,
    priority TEXT DEFAULT 'Média', requester TEXT, status TEXT DEFAULT 'Pendente',
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS sectors (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, organization_id TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

console.log('Tables created. Seeding data...');

// Seed users
const users = [
  ['Desenvolvedor Root', 'dev@dev.com', rootHash, 'Desenvolvedor Global', '["TI - Infraestrutura"]', 'root', '000000000', 0],
  ['Júlio César', 'admin@citymotion.com', hash, 'Administrador', '["Gabinete do Prefeito"]', 'GP-001', '5511999999999', 0],
  ['João da Silva', 'driver@citymotion.com', hash, 'Motorista', '["Secretaria de Obras, Viação e Urbanismo"]', 'M-001', '5511777777777', 0],
  ['Avaliador Demonstração', 'demo@citymotion.com', demoHash, 'Gestor de Setor', '["Gabinete do Prefeito"]', 'DEMO-ROOT', '5511000000000', 1],
];

const insertUser = db.prepare(
  `INSERT OR IGNORE INTO employees (name, email, password, role, sector, matricula, phone, is_demo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
);
for (const u of users) insertUser.run(...u);

// Seed orgs
const orgs = [
  ['ORG001', 'Prefeitura de CityMotion', 'citymotion-gov', 'admin@citymotion.com', 25, 120],
  ['ORG002', 'Logística TransRápido', 'transrapido', 'ceo@transrapido.com.br', 12, 45],
  ['ORG003', 'Saúde em Movimento', 'saude-mov', 'contato@saudemov.org', 3, 8],
];

const insertOrg = db.prepare(
  `INSERT OR IGNORE INTO organizations (id, name, slug, admin_email, active_vehicles, active_users) VALUES (?, ?, ?, ?, ?, ?)`
);
for (const o of orgs) insertOrg.run(...o);

// Seed sectors
const sectors = [
  ['TI - Infraestrutura', 'ORG001'],
  ['Gabinete do Prefeito', 'ORG001'],
  ['Secretaria de Obras, Viação e Urbanismo', 'ORG001'],
];
const insertSector = db.prepare(
  `INSERT OR IGNORE INTO sectors (name, organization_id) VALUES (?, ?)`
);
for (const s of sectors) insertSector.run(...s);

db.close();
console.log('Database initialized successfully!');
