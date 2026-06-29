
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
    
    // Limpar funcionários existentes para evitar duplicatas no seed
    try { await db.execute('DELETE FROM employees'); } catch (e) {}

    const users = [
        ['Júlio César', 'admin@citymotion.com', hash, 'Administrador', '["Gabinete do Prefeito"]', 'GP-001', '5511999999999', 0],
        ['Desenvolvedor Root', 'dev@dev.com', rootHash, 'Desenvolvedor Global', '["TI - Infraestrutura"]', 'root', '000000000', 0],
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

    console.log(`[Seed] ${users.length} usuários injetados no kernel dual.`);
}

if (require.main === module) {
    initializeDatabase();
}

module.exports = { initializeDatabase };
