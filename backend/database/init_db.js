
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'citymotion.db');
const sqlScriptPath = path.resolve(__dirname, '../../src/data/database.sql');

console.log('\x1b[36m--- CityMotion DB Initialization ---\x1b[0m');

if (fs.existsSync(dbPath)) {
    console.log('Removendo banco de dados antigo para reconstrução...');
    fs.unlinkSync(dbPath);
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('\x1b[31mErro fatal ao criar o arquivo SQLite:\x1b[0m', err.message);
        process.exit(1);
    }
    console.log('Arquivo SQLite criado com sucesso.');
    initializeDatabase();
});

function initializeDatabase() {
    if (!fs.existsSync(sqlScriptPath)) {
        console.error(`\x1b[31mERRO CRÍTICO:\x1b[0m Arquivo SQL não localizado em: ${sqlScriptPath}`);
        db.close();
        process.exit(1);
    }

    console.log('Executando schema SQL...');
    const sqlScript = fs.readFileSync(sqlScriptPath, 'utf8');

    db.exec(sqlScript, (err) => {
        if (err) {
            console.error('\x1b[31mERRO na execução do SQL:\x1b[0m', err.message);
            db.close();
            process.exit(1);
        } else {
            console.log('SUCESSO: Estrutura de tabelas criada.');
            seedPasswords();
        }
    });
}

function seedPasswords() {
    console.log('Gerando usuários e criptografando credenciais...');
    
    const users = [
        { email: 'admin@citymotion.com', pass: '123456', role: 'Administrador', name: 'Júlio César', matricula: 'GP-001', sector: '["Gabinete do Prefeito"]' },
        { email: 'dev@dev.com', pass: '123456789', role: 'Desenvolvedor Global', name: 'Desenvolvedor Root', matricula: 'root', sector: '["TI - Infraestrutura"]' },
        { email: 'manager@citymotion.com', pass: '123456', role: 'Gestor de Setor', name: 'Maria Oliveira', matricula: 'M-002', sector: '["Secretaria de Saúde"]' },
        { email: 'driver@citymotion.com', pass: '123456', role: 'Motorista', name: 'João da Silva', matricula: 'M-001', sector: '["Secretaria de Obras, Viação e Urbanismo"]' }
    ];

    const stmt = db.prepare(`INSERT INTO employees (name, email, password, role, sector, status, matricula) VALUES (?, ?, ?, ?, ?, ?, ?)`);

    users.forEach(u => {
        const hash = bcrypt.hashSync(u.pass, 10);
        stmt.run(u.name, u.email, hash, u.role, u.sector, 'Disponível', u.matricula);
    });

    stmt.finalize((err) => {
        if (err) {
            console.error('\x1b[31mErro ao inserir usuários de teste:\x1b[0m', err.message);
        } else {
            console.log('\x1b[32mSUCESSO: Banco de dados inicializado e pronto para uso.\x1b[0m');
        }
        db.close();
    });
}
