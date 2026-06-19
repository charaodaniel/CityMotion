
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'citymotion.db');
const sqlScriptPath = path.resolve(__dirname, '../../src/data/database.sql');

console.log('--- CityMotion DB Initialization ---');
console.log('Database Path:', dbPath);
console.log('SQL Script Path:', sqlScriptPath);

// Apaga o banco de dados antigo, se existir, para garantir um fresh start
if (fs.existsSync(dbPath)) {
    try {
        fs.unlinkSync(dbPath);
        console.log('Banco de dados antigo removido com sucesso.');
    } catch (e) {
        console.error('Erro ao remover banco antigo:', e.message);
    }
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
        console.log('Certifique-se de que o arquivo src/data/database.sql foi criado.');
        db.close();
        return;
    }

    console.log('Lendo script SQL...');
    const sqlScript = fs.readFileSync(sqlScriptPath, 'utf8');

    // Executa o script SQL. O exec pode rodar múltiplas instruções separadas por ;
    db.exec(sqlScript, (err) => {
        if (err) {
            console.error('ERRO ao executar o script SQL:', err.message);
        } else {
            console.log('SUCESSO: Tabelas criadas e dados iniciais inseridos.');
        }

        db.close((err) => {
            if (err) {
                console.error('Erro ao fechar o banco:', err.message);
            } else {
                console.log('Inicialização concluída. Conexão fechada.');
                console.log('Agora você pode rodar "npm run dev" na pasta backend.');
            }
        });
    });
}
