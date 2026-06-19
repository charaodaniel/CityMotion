-- CityMotion Database Structure

-- SECTORS
CREATE TABLE IF NOT EXISTS sectors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    vehicleCount INTEGER DEFAULT 0,
    driverCount INTEGER DEFAULT 0
);

-- EMPLOYEES
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT,
    status TEXT DEFAULT 'Disponível',
    sector TEXT, -- Armazenado como JSON array string
    matricula TEXT,
    cnh TEXT,
    idPhoto TEXT,
    cnhPhoto TEXT
);

-- VEHICLES
CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'Disponível',
    mileage INTEGER DEFAULT 0,
    sector TEXT,
    driverName TEXT,
    destination TEXT,
    lastRefuelingDate TEXT -- Data do último abastecimento registrado
);

-- TRIPS (SCHEDULES)
CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    driver TEXT,
    vehicle TEXT,
    origin TEXT,
    destination TEXT,
    departureTime TEXT,
    arrivalTime TEXT,
    startMileage INTEGER,
    endMileage INTEGER,
    status TEXT DEFAULT 'Agendada',
    category TEXT,
    passengers TEXT, -- JSON array
    startChecklist TEXT, -- JSON array
    endChecklist TEXT, -- JSON array
    startNotes TEXT,
    endNotes TEXT
);

-- VEHICLE REQUESTS
CREATE TABLE IF NOT EXISTS vehicle_requests (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    sector TEXT,
    details TEXT,
    priority TEXT DEFAULT 'Média',
    requestDate TEXT,
    requester TEXT,
    status TEXT DEFAULT 'Pendente'
);

-- WORK SCHEDULES
CREATE TABLE IF NOT EXISTS work_schedules (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    employee TEXT,
    type TEXT,
    status TEXT DEFAULT 'Agendada',
    startDate TEXT,
    endDate TEXT,
    description TEXT
);

-- MAINTENANCE REQUESTS
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id TEXT PRIMARY KEY,
    vehicleId TEXT,
    vehicleModel TEXT,
    licensePlate TEXT,
    requesterName TEXT,
    requestDate TEXT,
    type TEXT,
    description TEXT,
    status TEXT DEFAULT 'Pendente'
);

-- REFUELINGS
CREATE TABLE IF NOT EXISTS refuelings (
    id TEXT PRIMARY KEY,
    vehicleId TEXT,
    tripId TEXT,
    date TEXT,
    mileage INTEGER,
    liters REAL,
    price REAL,
    receiptPhoto TEXT,
    notes TEXT,
    FOREIGN KEY(vehicleId) REFERENCES vehicles(id),
    FOREIGN KEY(tripId) REFERENCES trips(id)
);

-- INITIAL DATA SEEDING
INSERT INTO sectors (id, name, description) VALUES 
('SEC01', 'Gabinete do Prefeito', 'Assessoramento direto ao Prefeito e Vice-Prefeito.'),
('SEC02', 'Secretaria de Administração e Planejamento', 'Gestão de pessoal, patrimônio e planejamento.'),
('SEC03', 'Secretaria da Fazenda', 'Gestão financeira e tributária.'),
('SEC04', 'Secretaria de Educação, Cultura, Desporto e Lazer', 'Administração de escolas e transporte escolar.'),
('SEC05', 'Secretaria de Saúde', 'Gestão de saúde pública e vigilância sanitária.'),
('SEC06', 'Secretaria de Obras, Viação e Urbanismo', 'Manutenção de infraestrutura urbana.');

INSERT INTO employees (id, name, email, password, role, status, sector, matricula) VALUES 
('11', 'Júlio César', 'admin@citymotion.com', '123456', 'Administrador', 'Disponível', '["Gabinete do Prefeito"]', 'GP-001'),
('12', 'Ricardo Nunes', 'manager@citymotion.com', '123456', 'Gestor de Setor', 'Disponível', '["Secretaria de Obras, Viação e Urbanismo"]', 'OBR-012'),
('9', 'Marcos Lima', 'driver@citymotion.com', '123456', 'Motorista', 'Disponível', '["Secretaria de Saúde"]', 'M-009'),
('4', 'Ana Souza', 'employee@citymotion.com', '123456', 'Técnico Administrativo', 'Disponível', '["Secretaria de Educação, Cultura, Desporto e Lazer"]', 'EDU-004'),
('17', 'Sérgio Moraes', 'mecanico@citymotion.com', '123456', 'Mecânico Chefe', 'Disponível', '["Secretaria de Obras, Viação e Urbanismo"]', 'MEC-001');

INSERT INTO vehicles (id, vehicleModel, licensePlate, status, mileage, sector) VALUES 
('V1', 'Fiat Strada', 'PM-001', 'Disponível', 15000, 'Secretaria de Obras, Viação e Urbanismo'),
('V2', 'VW Gol', 'PM-002', 'Disponível', 8500, 'Secretaria de Saúde'),
('V3', 'Renault Kwid', 'PM-003', 'Disponível', 22000, 'Secretaria de Administração e Planejamento');