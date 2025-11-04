-- SQLite schema for the CityMotion application

-- Set pragmas for foreign key support
PRAGMA foreign_keys = ON;

-- Table for Sectors (Departments)
CREATE TABLE IF NOT EXISTS sectors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- Table for Employees (including drivers)
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    cnh TEXT,
    sector_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Disponível', 'Em Viagem', 'Afastado', 'Em Serviço')),
    matricula TEXT UNIQUE,
    id_photo_path TEXT,
    cnh_photo_path TEXT,
    FOREIGN KEY (sector_id) REFERENCES sectors (id)
);

-- Table for Vehicles
CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    model TEXT NOT NULL,
    license_plate TEXT NOT NULL UNIQUE,
    mileage INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Disponível', 'Em Serviço', 'Em Viagem', 'Manutenção')),
    sector_id TEXT NOT NULL,
    registration_doc_path TEXT,
    inspection_doc_path TEXT,
    FOREIGN KEY (sector_id) REFERENCES sectors (id)
);

-- Table for Vehicle Requests made by employees
CREATE TABLE IF NOT EXISTS vehicle_requests (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    details TEXT,
    requester_id TEXT NOT NULL,
    sector_id TEXT NOT NULL,
    priority TEXT CHECK(priority IN ('Baixa', 'Média', 'Alta')) DEFAULT 'Baixa',
    status TEXT NOT NULL CHECK(status IN ('Pendente', 'Aprovada', 'Rejeitada')),
    request_date TEXT NOT NULL,
    FOREIGN KEY (requester_id) REFERENCES employees (id),
    FOREIGN KEY (sector_id) REFERENCES sectors (id)
);

-- Table for Trips (scheduled journeys)
CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    driver_id TEXT NOT NULL,
    vehicle_id TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_time TEXT NOT NULL,
    arrival_time TEXT,
    status TEXT NOT NULL CHECK(status IN ('Agendada', 'Em Andamento', 'Concluída', 'Cancelada')),
    notes TEXT,
    FOREIGN KEY (driver_id) REFERENCES employees (id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
);

-- Junction table for passengers in a trip
CREATE TABLE IF NOT EXISTS trip_passengers (
    trip_id TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    PRIMARY KEY (trip_id, employee_id),
    FOREIGN KEY (trip_id) REFERENCES trips (id),
    FOREIGN KEY (employee_id) REFERENCES employees (id)
);

-- Table for Checklists (pre and post trip)
CREATE TABLE IF NOT EXISTS checklists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('pre-trip', 'post-trip')),
    mileage INTEGER NOT NULL,
    notes TEXT,
    checklist_data TEXT, -- JSON object with checked items
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips (id)
);

-- Table for Work Schedules (shifts, on-call duties, etc.)
CREATE TABLE IF NOT EXISTS work_schedules (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('Jornada Regular', 'Plantão', 'Sobreaviso', 'Folga', 'Férias')),
    status TEXT NOT NULL CHECK(status IN ('Agendada', 'Em Andamento', 'Concluída')),
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    description TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees (id)
);

-- Table for Maintenance Requests
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id TEXT PRIMARY KEY,
    vehicle_id TEXT NOT NULL,
    requester_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('Manutenção Corretiva', 'Revisão Preventiva')),
    description TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Pendente', 'Em Andamento', 'Concluída')),
    request_date TEXT NOT NULL,
    completion_date TEXT,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id),
    FOREIGN KEY (requester_id) REFERENCES employees (id)
);

-- Insert initial data for sectors
INSERT INTO sectors (id, name, description) VALUES
('SEC01', 'Gabinete do Prefeito', 'Assessoramento direto ao Prefeito e Vice-Prefeito.'),
('SEC02', 'Secretaria de Administração e Planejamento', 'Gestão de pessoal, patrimônio, planejamento e modernização administrativa.'),
('SEC03', 'Secretaria da Fazenda', 'Responsável pela gestão financeira, tributária e contábil do município.'),
('SEC04', 'Secretaria de Educação, Cultura, Desporto e Lazer', 'Administração de escolas, creches, transporte escolar e fomento à cultura e esporte.'),
('SEC05', 'Secretaria de Saúde', 'Gestão de saúde pública, hospitais, postos de saúde e vigilância sanitária.'),
('SEC06', 'Secretaria de Obras, Viação e Urbanismo', 'Manutenção de vias, construções, infraestrutura urbana e serviços urbanos.'),
('SEC07', 'Secretaria de Assistência Social', 'Políticas de assistência social, proteção a famílias, crianças, adolescentes e idosos.'),
('SEC08', 'Secretaria de Agricultura e Meio Ambiente', 'Apoio ao produtor rural, desenvolvimento agrário e políticas ambientais.'),
('SEC09', 'Secretaria de Turismo e Desenvolvimento Econômico', 'Fomento ao turismo, desenvolvimento econômico, indústria e comércio.');

-- Insert initial data for test users
-- The password for all test users is '123456'
INSERT INTO employees (id, name, email, password, role, cnh, sector_id, status, matricula) VALUES
('11', 'Júlio César', 'admin@citymotion.com', '123456', 'Administrador', null, 'SEC01', 'Disponível', 'GP-001'),
('12', 'Ricardo Nunes', 'manager@citymotion.com', '123456', 'Gestor de Setor', '444555666', 'SEC06', 'Disponível', 'OBR-012'),
('2', 'Maria Oliveira', 'driver@citymotion.com', '123456', 'Motorista', '987654321', 'SEC05', 'Disponível', 'M-002'),
('4', 'Ana Souza', 'employee@citymotion.com', '123456', 'Professor(a)', null, 'SEC04', 'Disponível', 'EDU-004'),
('1', 'João da Silva', 'joao.silva@citymotion.com', '123456', 'Motorista', '123456789', 'SEC06', 'Em Serviço', 'M-001'),
('3', 'Pedro Santos', 'pedro.santos@citymotion.com', '123456', 'Assessor de Comunicação', null, 'SEC01', 'Disponível', 'ADM-003');

