
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const db = require('./db_manager');

const sqlScriptPath = path.resolve(__dirname, '../../src/data/database.sql');

console.log('\x1b[36m--- CityMotion Hybrid DB Initialization (Dual Mode) ---\x1b[0m');

async function initializeDatabase() {
    try {
        if (!fs.existsSync(sqlScriptPath)) {
            console.error(`\x1b[31mERRO CRÍTICO:\x1b[0m Arquivo SQL não localizado em: ${sqlScriptPath}`);
            process.exit(1);
        }

        console.log('Executando schema SQL sincronizado...');
        const sqlScript = fs.readFileSync(sqlScriptPath, 'utf8');

        // O db.runScript executa em Postgres e SQLite
        await db.runScript(sqlScript);
        console.log('SUCESSO: Estrutura de tabelas replicada.');
        
        await seedData();
    } catch (err) {
        console.error('\x1b[31mERRO na inicialização:\x1b[0m', err.message);
        process.exit(1);
    }
}

async function seedData() {
    console.log('Gerando usuários e setores sincronizados...');
    
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
        `;
        // Usamos execute para replicar em ambos
        try {
            await db.execute(query, [u.name, u.email, hash, u.role, u.sector, 'Disponível', u.matricula, u.phone]);
        } catch (e) {
            // Ignora duplicados no seed
        }
    }

    const sectors = [
        ['Gabinete do Prefeito', 'Assessoramento direto.'],
        ['Secretaria de Saúde', 'Gestão de saúde pública.'],
        ['Secretaria de Obras, Viação e Urbanismo', 'Manutenção de vias.'],
        ['TI - Infraestrutura', 'Suporte técnico central.']
    ];

    for (const s of sectors) {
        try {
            await db.execute('INSERT INTO sectors (name, description) VALUES ($1, $2)', [s[0], s[1]]);
        } catch (e) {}
    }

    console.log('\x1b[32mSUCESSO: Bancos de dados inicializados e sincronizados.\x1b[0m');
    process.exit(0);
}

initializeDatabase();
