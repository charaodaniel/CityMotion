const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3001;

// Conexão com o Banco de Dados
const dbPath = path.resolve(__dirname, 'database', 'citymotion.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
    } else {
        console.log("Conexão com o banco de dados SQLite estabelecida.");
    }
});

// Middlewares
app.use(cors()); // Permite requisições de outras origens (seu front-end)
app.use(express.json()); // Permite que o servidor entenda JSON

// Rotas da API
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

app.use('/api', authRoutes(db));
app.use('/api', dataRoutes(db));

// Rota de teste
app.get('/', (req, res) => {
    res.send('Servidor do CityMotion está no ar!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
