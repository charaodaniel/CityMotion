
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
            seedData();
        }
    });
}

function seedData() {
    console.log('Gerando usuários e dados iniciais...');
    
    const users = [
        { email: 'admin@citymotion.com', pass: '123456', role: 'Administrador', name: 'Júlio César', matricula: 'GP-001', sector: '["Gabinete do Prefeito"]', phone: '5511999999999' },
        { email: 'dev@dev.com', pass: '123456789', role: 'Desenvolvedor Global', name: 'Desenvolvedor Root', matricula: 'root', sector: '["TI - Infraestrutura"]', phone: '000000000' },
        { email: 'manager@citymotion.com', pass: '123456', role: 'Gestor de Setor', name: 'Maria Oliveira', matricula: 'M-002', sector: '["Secretaria de Saúde"]', phone: '5511888888888' },
        { email: 'driver@citymotion.com', pass: '123456', role: 'Motorista', name: 'João da Silva', matricula: 'M-001', sector: '["Secretaria de Obras, Viação e Urbanismo"]', phone: '5511777777777' }
    ];

    const stmt = db.prepare(`INSERT INTO employees (name, email, password, role, sector, status, matricula, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

    users.forEach(u => {
        const hash = bcrypt.hashSync(u.pass, 10);
        stmt.run(u.name, u.email, hash, u.role, u.sector, 'Disponível', u.matricula, u.phone);
    });

    stmt.finalize((err) => {
        if (err) {
            console.error('\x1b[31mErro ao inserir usuários de teste:\x1b[0m', err.message);
        } else {
            // Seed de Setores
            const sectors = [
                ['Gabinete do Prefeito', 'Assessoramento direto.'],
                ['Secretaria de Saúde', 'Gestão de saúde pública.'],
                ['Secretaria de Obras, Viação e Urbanismo', 'Manutenção de vias.'],
                ['TI - Infraestrutura', 'Suporte técnico central.']
            ];
            const sectorStmt = db.prepare(`INSERT INTO sectors (name, description) VALUES (?, ?)`);
            sectors.forEach(s => sectorStmt.run(s[0], s[1]));
            sectorStmt.finalize();

            console.log('\x1b[32mSUCESSO: Banco de dados inicializado e pronto para uso.\x1b[0m');
        }
        db.close();
    });
}
