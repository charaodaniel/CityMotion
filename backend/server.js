
require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./database/db_manager');
const { initializeDatabase } = require('./database/init_db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3001;

app.use(cors()); 
app.use(express.json());

// Injetar IO no request para uso nas rotas
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Logger Técnico NexusOS
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    const isTerminal = req.headers['x-nexus-terminal'] === 'true' ? '[TTY]' : '[WEB]';
    console.log(`\x1b[90m[${timestamp}]\x1b[0m \x1b[36mAPI:\x1b[0m ${isTerminal} ${req.method} ${req.url}`);
    next();
});

const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

app.use('/api', authRoutes(db));
app.use('/api', dataRoutes(db));

app.get('/api/health', async (req, res) => {
    res.json({ status: 'operational', kernel: 'Nexus-Dual', uptime: process.uptime() });
});

// WebSocket Events
io.on('connection', (socket) => {
    console.log('\x1b[35m[Socket]:\x1b[0m Nova conexão técnica estabelecida:', socket.id);
    
    socket.on('join-sector', (sector) => {
        socket.join(sector);
        console.log(`[Socket]: Cliente entrou no canal do setor: ${sector}`);
    });

    socket.on('disconnect', () => {
        console.log('[Socket]: Conexão encerrada.');
    });
});

// MOTOR DE RESET DIÁRIO (Demo-Cleaner)
let lastResetDate = new Date().toDateString();
setInterval(async () => {
    const currentDate = new Date().toDateString();
    if (currentDate !== lastResetDate) {
        console.log('\x1b[35m[Cron]:\x1b[0m Mudança de dia detectada. Executando limpeza de dados demo...');
        try {
            await initializeDatabase();
            lastResetDate = currentDate;
            console.log('\x1b[32m[Cron]:\x1b[0m Reset diário concluído com sucesso.');
        } catch (err) {
            console.error('[Cron Error]: Falha no reset diário:', err.message);
        }
    }
}, 3600000);

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\x1b[32m[CityMotion Backend]\x1b[0m Rodando em http://0.0.0.0:${PORT}`);
    console.log(`Conexão com o banco de dados SQLite estabelecida.`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Porta ${PORT} ocupada. Tente limpar os processos ou aguardar.`);
    }
    process.exit(1);
});
