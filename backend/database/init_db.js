
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'citymotion.db');
const sqlScriptPath = path.resolve(__dirname, '../../src/data/database.sql');

console.log('--- CityMotion DB Initialization ---');
console.log('Database Path:', dbPath);
console.log('SQL Script Path:', sqlScriptPath);

// Para pendrive persistente, só criamos o banco se ele não existir
// ou se o usuário passar um comando de reset (opcional no futuro)
if (fs.existsSync(dbPath)) {
    console.log('Aviso: Banco de dados já existe. Pulando remoção para preservar persistência.');
    // Se quiser forçar o reset, o usuário deve usar o comando específico no terminal ou apagar o arquivo .db manualmente
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error('Erro fatal ao abrir o banco de dados:', err.message);
    }
    console.log('Conectado ao arquivo SQLite.');
    initializeDatabase();
});

function initializeDatabase() {
    if (!fs.existsSync(sqlScriptPath)) {
        console.error(`ERRO CRÍTICO: Arquivo SQL não encontrado em: ${sqlScriptPath}`);
        db.close();
        return;
    }

    console.log('Executando script SQL (CREATE TABLE IF NOT EXISTS)...');
    const sqlScript = fs.readFileSync(sqlScriptPath, 'utf8');

    // O script SQL já deve conter CREATE TABLE IF NOT EXISTS para ser resiliente
    db.exec(sqlScript, (err) => {
        if (err) {
            console.error('ERRO ao executar o script SQL:', err.message);
        } else {
            console.log('SUCESSO: Tabelas verificadas/criadas.');
        }

        db.close((err) => {
            if (err) {
                console.error('Erro ao fechar o banco:', err.message);
            } else {
                console.log('Inicialização concluída.');
            }
        });
    });
}
