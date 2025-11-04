const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'citymotion.db');
const sqlScriptPath = path.resolve(__dirname, '../../src/data/database.sql');

// Apaga o banco de dados antigo, se existir
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Banco de dados antigo removido.');
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error('Erro ao abrir o banco de dados', err.message);
    }
    console.log('Conectado ao banco de dados SQLite para inicialização.');
    initializeDatabase();
});

function initializeDatabase() {
    console.log('Lendo script SQL...');
    
    if (!fs.existsSync(sqlScriptPath)) {
        console.error(`Erro: Arquivo SQL não encontrado em ${sqlScriptPath}`);
        db.close();
        return;
    }

    const sqlScript = fs.readFileSync(sqlScriptPath, 'utf8');

    db.exec(sqlScript, (err) => {
        if (err) {
            console.error('Erro ao executar o script SQL:', err.message);
        } else {
            console.log('Banco de dados e tabelas criados com sucesso.');
            console.log('Dados iniciais populados a partir do script SQL.');
        }

        db.close((err) => {
            if (err) {
                console.error('Erro ao fechar o banco de dados', err.message);
            } else {
                console.log('Inicialização do banco de dados concluída. Conexão fechada.');
            }
        });
    });
}
