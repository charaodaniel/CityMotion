
-- --- CITYMOTION NEXUS-DUAL SCHEMA ---
-- Compatível com SQLite3 e PostgreSQL

-- Tabela de Funcionários
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- No Postgres isso é SERIAL
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    sector TEXT, -- Armazenado como JSON ["Setor A"]
    status TEXT DEFAULT 'Disponível',
    matricula TEXT UNIQUE,
    phone TEXT,
    cnh TEXT,
    is_demo INTEGER DEFAULT 0, -- 1 para usuários de demonstração
    reset_token TEXT,
    reset_expires TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Veículos
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT UNIQUE NOT NULL,
    sector TEXT NOT NULL,
    mileage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Disponível',
    lastRefuelingDate TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Viagens (Missões)
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
    passengers TEXT, -- JSON Array
    startChecklist TEXT, -- JSON Array
    endChecklist TEXT, -- JSON Array
    startNotes TEXT,
    endNotes TEXT
);

-- Tabela de Mensagens (Chat)
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Abastecimentos
CREATE TABLE IF NOT EXISTS refuelings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id TEXT NOT NULL,
    driver_name TEXT NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    mileage INTEGER NOT NULL,
    liters REAL NOT NULL,
    price REAL NOT NULL,
    total_value REAL NOT NULL,
    fuel_type TEXT NOT NULL,
    gas_station TEXT,
    notes TEXT
);

-- Tabela de Auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_identity TEXT,
    action TEXT,
    table_name TEXT,
    details TEXT -- JSON string
);
