
--- TABELA DE FUNCIONÁRIOS (Lotação e Segurança)
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT '123456',
    role TEXT NOT NULL,
    sector TEXT, -- Armazenado como JSON String ["Setor A", "Setor B"]
    status TEXT DEFAULT 'Disponível',
    matricula TEXT UNIQUE,
    cnh TEXT,
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
    passengers TEXT, -- JSON Array
    startChecklist TEXT, -- JSON Array
    endChecklist TEXT, -- JSON Array
    startNotes TEXT,
    endNotes TEXT
);

--- TABELA DE SOLICITAÇÕES DE VEÍCULOS
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

--- TABELA DE MANUTENÇÃO
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId INTEGER NOT NULL,
    vehicleModel TEXT,
    licensePlate TEXT,
    type TEXT,
    description TEXT,
    requesterName TEXT,
    requestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'Pendente',
    FOREIGN KEY (vehicleId) REFERENCES vehicles(id)
);

--- TABELA DE SETORES
CREATE TABLE IF NOT EXISTS sectors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

--- TABELA DE ESCALAS (Work Schedules)
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

--- TABELA DE LOGS DE AUDITORIA (Histórico de Alterações)
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL, -- INSERT, UPDATE, DELETE, SOFT_DELETE
    table_name TEXT NOT NULL,
    record_id TEXT,
    details TEXT,
    user_identity TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

--- DADOS INICIAIS (SETORES)
INSERT OR IGNORE INTO sectors (name, description) VALUES 
('Gabinete do Prefeito', 'Assessoramento direto ao Prefeito e Vice-Prefeito.'),
('Secretaria de Administração e Planejamento', 'Gestão de pessoal e recursos.'),
('Secretaria de Saúde', 'Gestão de saúde pública.'),
('Secretaria de Educação, Cultura, Desporto e Lazer', 'Administração escolar e esportiva.'),
('Secretaria de Obras, Viação e Urbanismo', 'Manutenção urbana.'),
('TI - Infraestrutura', 'Suporte tecnológico central.');

--- DADOS INICIAIS (FUNCIONÁRIOS)
INSERT OR IGNORE INTO employees (id, name, email, password, role, sector, status, matricula) VALUES 
(0, 'Desenvolvedor Root', 'dev@dev.com', '123456789', 'Desenvolvedor Global', '["TI - Infraestrutura"]', 'Disponível', 'DEV-001'),
(11, 'Júlio César', 'admin@citymotion.com', '123456', 'Administrador', '["Gabinete do Prefeito"]', 'Em Serviço', 'GP-001'),
(12, 'Marcos Silva', 'manager@citymotion.com', '123456', 'Gestor de Setor', '["Secretaria de Obras, Viação e Urbanismo"]', 'Disponível', 'M-012');

--- DADOS INICIAIS (VEÍCULOS)
INSERT OR IGNORE INTO vehicles (vehicleModel, licensePlate, sector, mileage, status) VALUES 
('Fiat Strada', 'PM-001', 'Secretaria de Obras, Viação e Urbanismo', 15000, 'Disponível'),
('VW Gol', 'PM-002', 'Secretaria de Saúde', 8500, 'Disponível'),
('Renault Kwid', 'PM-003', 'Administração', 22000, 'Disponível');
