
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'citymotion.db');
const sqlScriptPath = path.resolve(__dirname, '../../src/data/database.sql');

console.log('\x1b[36m--- CityMotion DB Initialization ---\x1b[0m');

// Se o banco já existe, removemos para garantir que os hashes de senha sejam regerados corretamente na primeira instalação
if (fs.existsSync(dbPath)) {
    console.log('Removendo banco de dados antigo para atualização de segurança...');
    fs.unlinkSync(dbPath);
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error('Erro fatal ao abrir o banco de dados:', err.message);
    }
    console.log('Conectado ao novo arquivo SQLite.');
    initializeDatabase();
});

function initializeDatabase() {
    if (!fs.existsSync(sqlScriptPath)) {
        console.error(`ERRO CRÍTICO: Arquivo SQL não encontrado em: ${sqlScriptPath}`);
        db.close();
        return;
    }

    console.log('Criando tabelas...');
    const sqlScript = fs.readFileSync(sqlScriptPath, 'utf8');

    db.exec(sqlScript, (err) => {
        if (err) {
            console.error('ERRO ao criar tabelas:', err.message);
        } else {
            console.log('SUCESSO: Tabelas criadas.');
            seedPasswords();
        }
    });
}

function seedPasswords() {
    console.log('Criptografando senhas de demonstração...');
    
    // Lista de usuários padrão para garantir que o login funcione
    const users = [
        { email: 'admin@citymotion.com', pass: '123456', role: 'Administrador', name: 'Júlio César', matricula: 'GP-001', sector: '["Gabinete do Prefeito"]' },
        { email: 'dev@dev.com', pass: '123456789', role: 'Desenvolvedor Global', name: 'Desenvolvedor Root', matricula: 'root', sector: '["TI - Infraestrutura"]' },
        { email: 'manager@citymotion.com', pass: '123456', role: 'Gestor de Setor', name: 'Maria Oliveira', matricula: 'M-002', sector: '["Secretaria de Saúde"]' },
        { email: 'driver@citymotion.com', pass: '123456', role: 'Motorista', name: 'João da Silva', matricula: 'M-001', sector: '["Secretaria de Obras, Viação e Urbanismo"]', phone: '5511977777777' }
    ];

    const stmt = db.prepare(`INSERT OR REPLACE INTO employees (name, email, password, role, sector, status, matricula, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

    users.forEach(u => {
        const hash = bcrypt.hashSync(u.pass, 10);
        stmt.run(u.name, u.email, hash, u.role, u.sector, 'Disponível', u.matricula, u.phone || null);
    });

    stmt.finalize((err) => {
        if (err) console.error('Erro ao inserir usuários:', err.message);
        else console.log('\x1b[32mSUCESSO: Sistema pronto para login.\x1b[0m');
        
        db.close();
    });
}
