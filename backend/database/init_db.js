
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const db = require('./db_manager');

const sqlScriptPath = path.resolve(__dirname, '../../src/data/database.sql');

async function initializeDatabase() {
    try {
        console.log('\x1b[36m[Kernel]:\x1b[0m Iniciando provisionamento Nexus-Dual...');
        
        if (!fs.existsSync(sqlScriptPath)) {
            console.error(`ERRO: Schema não encontrado em ${sqlScriptPath}`);
            process.exit(1);
        }

        const sqlScript = fs.readFileSync(sqlScriptPath, 'utf8');
        await db.runScript(sqlScript);
        
        await seedData();
        console.log('\x1b[32m[Sucesso]:\x1b[0m Sistema pronto para operação.');
    } catch (err) {
        console.error('Falha crítica na inicialização:', err.message);
        process.exit(1);
    }
}

async function seedData() {
    const hash = bcrypt.hashSync('123456', 10);
    const rootHash = bcrypt.hashSync('123456789', 10);
    const demoHash = bcrypt.hashSync('nexus2024', 10);
    
    const users = [
        ['Júlio César', 'admin@citymotion.com', hash, 'Administrador', '["Gabinete do Prefeito"]', 'GP-001', '5511999999999', 0],
        ['Desenvolvedor Root', 'dev@dev.com', rootHash, 'Desenvolvedor Global', '["TI - Infraestrutura"]', 'root', '000000000', 0],
        ['João da Silva', 'driver@citymotion.com', hash, 'Motorista', '["Secretaria de Obras"]', 'M-001', '5511777777777', 0],
        ['Avaliador Demo', 'demo@citymotion.com', demoHash, 'Administrador', '["Gabinete do Prefeito"]', 'DEMO-CORE', '5511000000000', 1]
    ];

    for (const u of users) {
        try {
            await db.execute(
                `INSERT INTO employees (name, email, password, role, sector, matricula, phone, is_demo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                u
            );
        } catch (e) {}
    }

    const sectors = [
        ['Gabinete do Prefeito', 'Gestão central'],
        ['Secretaria de Saúde', 'Operação de ambulâncias'],
        ['Secretaria de Obras', 'Logística pesada'],
        ['TI - Infraestrutura', 'Suporte NexusBridge']
    ];

    for (const s of sectors) {
        try {
            await db.execute('INSERT INTO sectors (name, description) VALUES ($1, $2)', s);
        } catch (e) {}
    }

    const vehicles = [
        ['Fiat Strada', 'PM-001', 'Secretaria de Obras', 15000],
        ['VW Gol', 'PM-002', 'Secretaria de Saúde', 8500],
        ['Toyota Hilux', 'PM-006', 'Gabinete do Prefeito', 32000]
    ];

    for (const v of vehicles) {
        try {
            await db.execute('INSERT INTO vehicles (vehicleModel, licensePlate, sector, mileage) VALUES ($1, $2, $3, $4)', v);
        } catch (e) {}
    }
}

if (require.main === module) {
    initializeDatabase();
}

module.exports = { initializeDatabase };
