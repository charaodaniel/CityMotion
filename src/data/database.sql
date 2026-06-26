
-- SCHEMA PARA POSTGRESQL (CityMotion Cloud)

CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    sector TEXT, -- Armazenado como JSON string ["Setor A"]
    status TEXT DEFAULT 'Disponível',
    matricula TEXT UNIQUE,
    phone TEXT,
    cnh TEXT,
    reset_token TEXT,
    reset_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sectors (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_model TEXT NOT NULL,
    license_plate TEXT UNIQUE NOT NULL,
    sector TEXT NOT NULL,
    mileage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Disponível',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
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

CREATE TABLE IF NOT EXISTS vehicle_requests (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    sector TEXT NOT NULL,
    details TEXT,
    priority TEXT DEFAULT 'Média',
    status TEXT DEFAULT 'Pendente',
    requester TEXT,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maintenance_requests (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER,
    vehicle_model TEXT,
    license_plate TEXT,
    requester_name TEXT,
    type TEXT,
    description TEXT,
    status TEXT DEFAULT 'Pendente',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refuelings (
    id SERIAL PRIMARY KEY,
    vehicle_id TEXT,
    vehicle_model TEXT,
    license_plate TEXT,
    trip_id INTEGER,
    mileage INTEGER,
    liters DECIMAL,
    price DECIMAL,
    total_value DECIMAL,
    fuel_type TEXT,
    gas_station TEXT,
    driver_name TEXT,
    notes TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    details TEXT,
    user_identity TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
