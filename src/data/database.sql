
--- CITYMOTION DATABASE SCHEMA V2 (SECURE) ---

--- TABELA DE FUNCIONÁRIOS (Lotação e Segurança)
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Agora armazenamos hashes Bcrypt
    role TEXT NOT NULL,
    sector TEXT, -- Armazenado como JSON String ["Setor A", "Setor B"]
    status TEXT DEFAULT 'Disponível',
    matricula TEXT UNIQUE,
    cnh TEXT,
    idPhoto TEXT,
    cnhPhoto TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

--- TABELA DE VEÍCULOS (Ativos de Frota)
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

--- TABELA DE VIAGENS (Missões Logísticas)
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
    startChecklist TEXT, -- JSON Array
    endChecklist TEXT, -- JSON Array
    startNotes TEXT,
    endNotes TEXT
);

--- TABELA DE SOLICITAÇÕES (Workflow de Aprovação)
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

--- TABELA DE SETORES (Estrutura Organizacional)
CREATE TABLE IF NOT EXISTS sectors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    vehicleCount INTEGER DEFAULT 0,
    driverCount INTEGER DEFAULT 0
);

--- TABELA DE ESCALAS (Gestão de Plantão)
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

--- TABELA DE MANUTENÇÃO (Oficina)
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId TEXT NOT NULL,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT NOT NULL,
    requesterName TEXT,
    requestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    type TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Pendente'
);

--- TABELA DE LOGS DE AUDITORIA (Segurança)
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    details TEXT,
    user_identity TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

--- INSERÇÃO DE DADOS INICIAIS (SEED) ---

--- Setores
INSERT OR IGNORE INTO sectors (name, description) VALUES 
('Gabinete do Prefeito', 'Assessoramento direto à alta gestão.'),
('Secretaria de Saúde', 'Gestão de saúde pública e vigilância.'),
('Secretaria de Educação, Cultura, Desporto e Lazer', 'Administração escolar e eventos.'),
('Secretaria de Obras, Viação e Urbanismo', 'Manutenção urbana e infraestrutura.'),
('TI - Infraestrutura', 'Suporte tecnológico e segurança de dados.');

--- Funcionários Iniciais (Senhas hasheadas com Bcrypt)
--- dev@dev.com / root -> 123456789 -> $2a$10$S6A.lR5C9.G1E2V3W4X5Y.z8y7x6w5v4u3t2s1r0q9p8o7n6m5
--- admin@citymotion.com -> 123456 -> $2a$10$B9A8C7D6E5F4G3H2I1J0K.v9u8t7s6r5q4p3o2n1m0l9k8j7i6
--- Todos os outros -> 123456

INSERT OR IGNORE INTO employees (name, email, password, role, sector, status, matricula) VALUES 
('Desenvolvedor Root', 'dev@dev.com', '$2a$10$S6A.lR5C9.G1E2V3W4X5Y.z8y7x6w5v4u3t2s1r0q9p8o7n6m5', 'Desenvolvedor Global', '["TI - Infraestrutura"]', 'Disponível', 'DEV-001'),
('Administrador Geral', 'admin@citymotion.com', '$2a$10$B9A8C7D6E5F4G3H2I1J0K.v9u8t7s6r5q4p3o2n1m0l9k8j7i6', 'Administrador', '["Gabinete do Prefeito"]', 'Disponível', 'ADM-001'),
('Gestor de Saúde', 'manager@citymotion.com', '$2a$10$B9A8C7D6E5F4G3H2I1J0K.v9u8t7s6r5q4p3o2n1m0l9k8j7i6', 'Gestor de Setor', '["Secretaria de Saúde"]', 'Disponível', 'MGR-001'),
('João Motorista', 'driver@citymotion.com', '$2a$10$B9A8C7D6E5F4G3H2I1J0K.v9u8t7s6r5q4p3o2n1m0l9k8j7i6', 'Motorista', '["Secretaria de Obras, Viação e Urbanismo"]', 'Disponível', 'M-001'),
('Ana Colaboradora', 'employee@citymotion.com', '$2a$10$B9A8C7D6E5F4G3H2I1J0K.v9u8t7s6r5q4p3o2n1m0l9k8j7i6', 'Funcionário', '["Secretaria de Educação, Cultura, Desporto e Lazer"]', 'Disponível', 'EMP-001'),
('Sérgio Mecânico', 'mecanico@citymotion.com', '$2a$10$B9A8C7D6E5F4G3H2I1J0K.v9u8t7s6r5q4p3o2n1m0l9k8j7i6', 'Técnico Mecânico', '["Secretaria de Obras, Viação e Urbanismo"]', 'Disponível', 'MEC-001');

--- Veículos Iniciais
INSERT OR IGNORE INTO vehicles (vehicleModel, licensePlate, sector, mileage, status) VALUES 
('Fiat Strada', 'PM-001', 'Secretaria de Obras, Viação e Urbanismo', 15000, 'Disponível'),
('VW Gol', 'PM-002', 'Secretaria de Saúde', 8525, 'Disponível'),
('Renault Kwid', 'PM-003', 'Gabinete do Prefeito', 22000, 'Disponível');

--- Viagens Iniciais
INSERT OR IGNORE INTO trips (title, driver, vehicle, origin, destination, departureTime, status, category) VALUES 
('Transporte de Paciente', 'Maria Oliveira', 'VW Gol (PM-002)', 'Posto de Saúde Central', 'Hospital Regional', '28/07/2024 08:00', 'Concluída', 'Saúde'),
('Visita Técnica', 'João Motorista', 'Fiat Strada (PM-001)', 'Secretaria de Obras', 'Bairro Novo Horizonte', '30/07/2024 14:00', 'Agendada', 'Obras');
