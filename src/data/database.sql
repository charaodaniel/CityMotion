
-- CityMotion Universal Schema (Compatible with SQLite and PostgreSQL)

-- TABELA DE FUNCIONÁRIOS
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    sector TEXT, 
    status TEXT DEFAULT 'Disponível',
    matricula TEXT UNIQUE,
    phone TEXT,
    cnh TEXT,
    reset_token TEXT,
    reset_expires TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABELA DE VEÍCULOS
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT UNIQUE NOT NULL,
    sector TEXT NOT NULL,
    mileage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Disponível',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABELA DE SETORES
CREATE TABLE IF NOT EXISTS sectors (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

-- TABELA DE VIAGENS
CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
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
    startChecklist TEXT,
    endChecklist TEXT,
    startNotes TEXT,
    endNotes TEXT
);

-- TABELA DE ABASTECIMENTOS
CREATE TABLE IF NOT EXISTS refuelings (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER,
    vehicle_model TEXT,
    license_plate TEXT,
    trip_id INTEGER,
    mileage INTEGER,
    liters REAL,
    price REAL,
    total_value REAL,
    fuel_type TEXT,
    gas_station TEXT,
    driver_name TEXT,
    notes TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABELA DE MANUTENÇÃO
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER,
    vehicle_model TEXT,
    license_plate TEXT,
    requester_name TEXT,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type TEXT,
    description TEXT,
    status TEXT DEFAULT 'Pendente'
);

-- TABELA DE CHAT
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read INTEGER DEFAULT 0
);
