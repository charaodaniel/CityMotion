
require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Conexão com o Banco de Dados
const dbPath = path.resolve(__dirname, 'database', 'citymotion.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
    } else {
        console.log("Conexão com o banco de dados SQLite estabelecida.");
        
        // Garantir que a tabela de auditoria exista
        db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT NOT NULL,
            table_name TEXT NOT NULL,
            record_id TEXT,
            details TEXT,
            user_identity TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Middlewares
app.use(cors()); 
app.use(express.json());

// Rotas da API
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

app.use('/api', authRoutes(db));
app.use('/api', dataRoutes(db));

// Rota de teste
app.get('/', (req, res) => {
    res.send('Servidor do CityMotion está no ar! Camada de segurança JWT e Bcrypt ativa.');
});

// Inicialização do servidor com tratamento de erro EADDRINUSE
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CityMotion Backend] Rodando em http://0.0.0.0:${PORT}`);
    if (!process.env.JWT_SECRET) {
        console.warn('AVISO: JWT_SECRET não configurado no .env! Usando fallback inseguro.');
    }
});

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`\x1b[31m[ERRO CRÍTICO] A porta ${PORT} já está em uso.\x1b[0m`);
        console.error(`Certifique-se de que não há outra instância do backend rodando.`);
        console.error(`Dica: Se estiver no Linux/Mac, use 'npx kill-port ${PORT}' para liberar a porta.`);
        process.exit(1);
    } else {
        console.error("[Backend Error]:", e);
    }
});
