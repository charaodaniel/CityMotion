
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

const sqlScriptPath = path.resolve(__dirname, '../../src/data/database.sql');

console.log('\x1b[36m--- CityMotion DB Initialization (PostgreSQL) ---\x1b[0m');

async function initializeDatabase() {
    try {
        if (!fs.existsSync(sqlScriptPath)) {
            console.error(`\x1b[31mERRO CRÍTICO:\x1b[0m Arquivo SQL não localizado em: ${sqlScriptPath}`);
            process.exit(1);
        }

        console.log('Executando schema SQL no PostgreSQL...');
        const sqlScript = fs.readFileSync(sqlScriptPath, 'utf8');

        await pool.query(sqlScript);
        console.log('SUCESSO: Estrutura de tabelas criada.');
        
        await seedData();
    } catch (err) {
        console.error('\x1b[31mERRO na inicialização:\x1b[0m', err.message);
        process.exit(1);
    }
}

async function seedData() {
    console.log('Gerando usuários iniciais...');
    
    const users = [
        { email: 'admin@citymotion.com', pass: '123456', role: 'Administrador', name: 'Júlio César', matricula: 'GP-001', sector: '["Gabinete do Prefeito"]', phone: '5511999999999' },
        { email: 'dev@dev.com', pass: '123456789', role: 'Desenvolvedor Global', name: 'Desenvolvedor Root', matricula: 'root', sector: '["TI - Infraestrutura"]', phone: '000000000' },
        { email: 'manager@citymotion.com', pass: '123456', role: 'Gestor de Setor', name: 'Maria Oliveira', matricula: 'M-002', sector: '["Secretaria de Saúde"]', phone: '5511888888888' },
        { email: 'driver@citymotion.com', pass: '123456', role: 'Motorista', name: 'João da Silva', matricula: 'M-001', sector: '["Secretaria de Obras, Viação e Urbanismo"]', phone: '5511777777777' }
    ];

    for (const u of users) {
        const hash = bcrypt.hashSync(u.pass, 10);
        const query = `
            INSERT INTO employees (name, email, password, role, sector, status, matricula, phone) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (email) DO NOTHING
        `;
        await pool.query(query, [u.name, u.email, hash, u.role, u.sector, 'Disponível', u.matricula, u.phone]);
    }

    const sectors = [
        ['Gabinete do Prefeito', 'Assessoramento direto.'],
        ['Secretaria de Saúde', 'Gestão de saúde pública.'],
        ['Secretaria de Obras, Viação e Urbanismo', 'Manutenção de vias.'],
        ['TI - Infraestrutura', 'Suporte técnico central.']
    ];

    for (const s of sectors) {
        await pool.query('INSERT INTO sectors (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING', [s[0], s[1]]);
    }

    console.log('\x1b[32mSUCESSO: Banco de dados populado e pronto.\x1b[0m');
    await pool.end();
}

initializeDatabase();
