
-- CityMotion Database Schema

-- Audit Logs (Trilha de Auditoria)
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    details TEXT,
    user_identity TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Employees (Funcionários e Usuários)
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    sector TEXT, -- Armazenado como JSON String ["Setor A", "Setor B"]
    status TEXT DEFAULT 'Disponível',
    matricula TEXT UNIQUE,
    phone TEXT,
    cnh TEXT,
    idPhoto TEXT,
    cnhPhoto TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles (Frota)
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT UNIQUE NOT NULL,
    sector TEXT NOT NULL,
    mileage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Disponível',
    driverName TEXT,
    destination TEXT,
    lastRefuelingDate DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Trips (Missões e Viagens)
CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    driver TEXT NOT NULL,
    vehicle TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departureTime TEXT NOT NULL,
    arrivalTime TEXT,
    startMileage INTEGER,
    endMileage INTEGER,
    status TEXT DEFAULT 'Agendada',
    category TEXT,
    passengers TEXT, -- JSON Array de objetos {name, document}
    startNotes TEXT,
    endNotes TEXT,
    startChecklist TEXT, -- JSON Array
    endChecklist TEXT -- JSON Array
);

-- Vehicle Requests (Solicitações de Transporte)
CREATE TABLE IF NOT EXISTS vehicle_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    sector TEXT NOT NULL,
    details TEXT,
    priority TEXT DEFAULT 'Média',
    requestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    requester TEXT,
    status TEXT DEFAULT 'Pendente'
);

-- Sectors (Unidades e Secretarias)
CREATE TABLE IF NOT EXISTS sectors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    vehicleCount INTEGER DEFAULT 0,
    driverCount INTEGER DEFAULT 0
);

-- Work Schedules (Escalas de Trabalho)
CREATE TABLE IF NOT EXISTS work_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    employee TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'Agendada',
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    description TEXT
);

-- Maintenance Requests (Ordens de Serviço)
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId TEXT NOT NULL,
    vehicleModel TEXT,
    licensePlate TEXT,
    requesterName TEXT,
    requestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    type TEXT,
    description TEXT,
    status TEXT DEFAULT 'Pendente'
);

-- Refuelings (Histórico de Abastecimentos)
CREATE TABLE IF NOT EXISTS refuelings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId TEXT NOT NULL,
    vehicleModel TEXT,
    licensePlate TEXT,
    tripId TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    mileage INTEGER,
    liters REAL,
    price REAL,
    totalValue REAL,
    fuelType TEXT,
    gasStation TEXT,
    driverName TEXT,
    notes TEXT
);

-- Seed Inicial de Setores
INSERT OR IGNORE INTO sectors (name, description) VALUES ('Gabinete do Prefeito', 'Assessoramento direto ao Prefeito.');
INSERT OR IGNORE INTO sectors (name, description) VALUES ('Secretaria de Saúde', 'Gestão de saúde pública.');
INSERT OR IGNORE INTO sectors (name, description) VALUES ('Secretaria de Obras, Viação e Urbanismo', 'Manutenção de vias e infraestrutura.');
INSERT OR IGNORE INTO sectors (name, description) VALUES ('TI - Infraestrutura', 'Suporte tecnológico e redes.');
INSERT OR IGNORE INTO sectors (name, description) VALUES ('Secretaria de Educação, Cultura, Desporto e Lazer', 'Gestão escolar e cultural.');
