
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const db = require('./db_manager');

const sqlScriptPath = path.resolve(__dirname, '../../src/data/database.sql');

async function initializeDatabase() {
    try {
        console.log('\x1b[36m[Nexus-Core]:\x1b[0m Iniciando provisionamento de banco de dados unificado...');
        
        // 1. Criar pastas se não existirem
        const dbDir = path.resolve(__dirname, '../../backend/database');
        if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

        // 2. Executar Schema
        if (!fs.existsSync(sqlScriptPath)) {
            throw new Error(`Schema não encontrado em ${sqlScriptPath}. Por favor, crie o arquivo SQL.`);
        }

        const sqlScript = fs.readFileSync(sqlScriptPath, 'utf8');
        // Adaptar SERIAL para Postgres se necessário (o db_manager lida com dialetos nas queries, mas o DDL precisa de ajuste)
        const finalSql = db.pgEnabled 
            ? sqlScript.replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, 'SERIAL PRIMARY KEY')
            : sqlScript;

        console.log('\x1b[90m[Nexus-Core]:\x1b[0m Executando estrutura de tabelas...');
        await db.runScript(finalSql);
        
        // 3. Popular dados iniciais (Seed)
        await seedData();
        
        console.log('\x1b[32m[Sucesso]:\x1b[0m Ecossistema Nexus-Dual pronto para operação.');
    } catch (err) {
        console.error('\x1b[31m[Falha Crítica]:\x1b[0m', err.message);
    }
}

async function seedData() {
    const hash = bcrypt.hashSync('123456', 10);
    const rootHash = bcrypt.hashSync('123456789', 10);
    const demoHash = bcrypt.hashSync('nexus2024', 10);
    
    // Limpa tabelas antes de seed para evitar duplicidade
    await db.execute('DELETE FROM employees');

    const users = [
        ['Júlio César', 'admin@citymotion.com', hash, 'Administrador', '["Gabinete do Prefeito"]', 'GP-001', '5511999999999', 0],
        ['Desenvolvedor Root', 'dev@dev.com', rootHash, 'Desenvolvedor Global', '["TI - Infraestrutura"]', 'root', '000000000', 0],
        ['João da Silva', 'driver@citymotion.com', hash, 'Motorista', '["Secretaria de Obras"]', 'M-001', '5511777777777', 0],
        ['Avaliador Demonstração', 'demo@citymotion.com', demoHash, 'Administrador', '["Gabinete do Prefeito"]', 'DEMO-ROOT', '5511000000000', 1]
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
