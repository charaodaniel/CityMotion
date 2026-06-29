
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const sqlScriptPath = path.resolve(__dirname, '../../src/data/database.sql');

async function initializeDatabase() {
    try {
        console.log('\x1b[36m[Nexus-Core]:\x1b[0m Iniciando provisionamento de banco de dados unificado...');
        
        const db = require('./db_manager');
        
        const dbDir = path.resolve(__dirname, '../../backend/database');
        if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

        if (!fs.existsSync(sqlScriptPath)) {
            console.error(`[FALHA]: Schema não encontrado em ${sqlScriptPath}`);
            return;
        }

        const sqlScript = fs.readFileSync(sqlScriptPath, 'utf8');
        
        const finalSql = db.pgEnabled 
            ? sqlScript.replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, 'SERIAL PRIMARY KEY')
            : sqlScript;

        console.log('\x1b[90m[Nexus-Core]:\x1b[0m Executando estrutura de tabelas...');
        await db.runScript(finalSql);
        
        await seedData();
        
        console.log('\x1b[32m[Sucesso]:\x1b[0m Ecossistema Nexus-Dual pronto para operação.');
    } catch (err) {
        console.error('\x1b[31m[Falha Crítica]:\x1b[0m', err.message);
    }
}

async function seedData() {
    const db = require('./db_manager');
    const hash = bcrypt.hashSync('123456', 10);
    const rootHash = bcrypt.hashSync('123456789', 10);
    const demoHash = bcrypt.hashSync('nexus2024', 10);
    
    try { 
        await db.execute('DELETE FROM employees'); 
        await db.execute('DELETE FROM organizations');
    } catch (e) {}

    const users = [
        ['Desenvolvedor Root', 'dev@dev.com', rootHash, 'Desenvolvedor Global', '["TI - Infraestrutura"]', 'root', '000000000', 0],
        ['Júlio César', 'admin@citymotion.com', hash, 'Administrador', '["Gabinete do Prefeito"]', 'GP-001', '5511999999999', 0],
        ['João da Silva', 'driver@citymotion.com', hash, 'Motorista', '["Secretaria de Obras, Viação e Urbanismo"]', 'M-001', '5511777777777', 0],
        ['Avaliador Demonstração', 'demo@citymotion.com', demoHash, 'Gestor de Setor', '["Gabinete do Prefeito"]', 'DEMO-ROOT', '5511000000000', 1]
    ];

    for (const u of users) {
        try {
            await db.execute(
                `INSERT INTO employees (name, email, password, role, sector, matricula, phone, is_demo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                u
            );
        } catch (e) {
            console.warn(`[Seed] Aviso ao inserir usuário ${u[1]}:`, e.message);
        }
    }

    const orgs = [
        ['ORG001', 'Prefeitura de CityMotion', 'citymotion-gov', 'Ativa', 'Enterprise', 'admin@citymotion.com', 25, 120],
        ['ORG002', 'Logística TransRápido', 'transrapido', 'Ativa', 'Pro', 'ceo@transrapido.com.br', 12, 45],
        ['ORG003', 'Saúde em Movimento', 'saude-mov', 'Demonstração', 'Basic', 'contato@saudemov.org', 3, 8]
    ];

    for (const o of orgs) {
        try {
            await db.execute(
                `INSERT INTO organizations (id, name, slug, status, plan, adminEmail, activeVehicles, activeUsers) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                o
            );
        } catch (e) {
            console.warn(`[Seed] Aviso ao inserir org ${o[1]}:`, e.message);
        }
    }

    console.log(`[Seed] Dados vitais injetados no kernel dual.`);
}

if (require.main === module) {
    initializeDatabase();
}

module.exports = { initializeDatabase };
