
-- CityMotion - Database Schema and Seed Data
-- Database: SQLite3

-- 1. Sectors
CREATE TABLE IF NOT EXISTS sectors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    vehicleCount INTEGER DEFAULT 0,
    driverCount INTEGER DEFAULT 0
);

-- 2. Employees
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL,
    sector TEXT, -- Store as JSON string ["Sector A", "Sector B"]
    cnh TEXT,
    matricula TEXT,
    idPhoto TEXT,
    cnhPhoto TEXT
);

-- 3. Vehicles
CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL,
    mileage INTEGER DEFAULT 0,
    sector TEXT NOT NULL,
    driverName TEXT,
    destination TEXT
);

-- 4. Trips
CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    driver TEXT NOT NULL,
    vehicle TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departureTime TEXT NOT NULL,
    arrivalTime TEXT,
    startMileage INTEGER,
    endMileage INTEGER,
    status TEXT NOT NULL,
    category TEXT,
    passengers TEXT, -- Store as JSON string
    startChecklist TEXT, -- Store as JSON string
    endChecklist TEXT, -- Store as JSON string
    startNotes TEXT,
    endNotes TEXT
);

-- 5. Vehicle Requests
CREATE TABLE IF NOT EXISTS vehicle_requests (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    sector TEXT NOT NULL,
    details TEXT,
    priority TEXT NOT NULL,
    requestDate TEXT NOT NULL,
    status TEXT NOT NULL,
    requester TEXT NOT NULL
);

-- 6. Work Schedules
CREATE TABLE IF NOT EXISTS work_schedules (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    employee TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    description TEXT
);

-- 7. Maintenance Requests
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id TEXT PRIMARY KEY,
    vehicleId TEXT NOT NULL,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT NOT NULL,
    requesterName TEXT NOT NULL,
    requestDate TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL
);

-- SEED DATA
INSERT INTO sectors (id, name, description) VALUES 
('SEC01', 'Diretoria Executiva', 'Alta gestão e coordenação estratégica.'),
('SEC02', 'Administração e RH', 'Gestão de pessoas e infraestrutura corporativa.'),
('SEC03', 'Operações e Logística', 'Manutenção da frota e fluxos de transporte.');

INSERT INTO employees (id, name, email, password, role, status, sector, matricula) VALUES 
('11', 'Admin CityMotion', 'admin@citymotion.com', '123456', 'Administrador', 'Disponível', '["Diretoria Executiva"]', 'ADM-001'),
('12', 'Ricardo Gestor', 'manager@citymotion.com', '123456', 'Gestor de Unidade', 'Disponível', '["Operações e Logística", "Administração e RH"]', 'GST-001'),
('9', 'Marcos Motorista', 'driver@citymotion.com', '123456', 'Motorista', 'Disponível', '["Operações e Logística"]', 'MOT-001'),
('4', 'Ana Colaboradora', 'employee@citymotion.com', '123456', 'Analista Administrativo', 'Disponível', '["Administração e RH"]', 'EMP-001'),
('17', 'Sérgio Mecânico', 'mecanico@citymotion.com', '123456', 'Mecânico Chefe', 'Disponível', '["Operações e Logística"]', 'MEC-001');

INSERT INTO vehicles (id, vehicleModel, licensePlate, status, mileage, sector) VALUES 
('V1', 'Fiat Strada', 'ABC-1234', 'Disponível', 15000, 'Operações e Logística'),
('V2', 'VW Gol', 'XYZ-5678', 'Disponível', 8500, 'Administração e RH'),
('V4', 'Chevrolet Onix', 'MNT-0000', 'Manutenção', 41000, 'Operações e Logística');
