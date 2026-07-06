require('dotenv').config({ path: '../.env', override: true });
const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');
const db = require('./database/db_manager');
const { initializeDatabase } = require('./database/init_db');

const app = express();
const server = http.createServer(app);

// CORS configurável via variável de ambiente
// Em produção, defina CORS_ORIGIN=https://seudominio.com (ou * se mesmo domínio)
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:9002', 'http://127.0.0.1:9002'];

const corsOptions = {
    origin: function (origin, callback) {
        // Permite requisições sem origin (ex: ferramentas internas, curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.warn(`[Security] CORS bloqueado para origem: ${origin}`);
        return callback(new Error('Origem não permitida pelo CORS.'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-nexus-terminal'],
    credentials: true,
};

const io = new Server(server, {
    cors: corsOptions
});

const PORT = process.env.PORT || 3001;

app.use(cors(corsOptions));
app.use(express.json());

// Rate Limiter global: máximo 100 requisições por IP a cada 15 minutos
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Muitas requisições. Tente novamente mais tarde.' },
});

// Rate Limiter para login: máximo 10 tentativas por IP a cada 15 minutos
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Muitas tentativas de login. Tente novamente mais tarde.' },
    skipSuccessfulRequests: true,
});

app.use(globalLimiter);

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
const infrastructureRoutes = require('./routes/infrastructure');

app.use('/api', authRoutes(db, loginLimiter));
app.use('/api', dataRoutes(db));
app.use('/api', infrastructureRoutes(db));

app.get('/api/health', async (req, res) => {
    res.json({ status: 'operational', kernel: 'Nexus-Dual', uptime: process.uptime() });
});

// =============================================================
// Servir Frontend Next.js em Produção (Render / Docker)
// =============================================================
// Em produção, o Express serve os arquivos estáticos do Next.js
// e deleita rotas não-API para o handler do Next.js.
// O servidor HTTP só começa a aceitar conexões DEPOIS que o
// Next.js estiver pronto, evitando race conditions.
// =============================================================

function startServer() {
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`\x1b[32m[CityMotion Backend]\x1b[0m Rodando em http://0.0.0.0:${PORT}`);
        console.log(`Conexão com o banco de dados SQLite estabelecida.`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Porta ${PORT} ocupada. Tente limpar os processos ou aguardar.`);
        }
        process.exit(1);
    });
}

if (process.env.NODE_ENV === 'production') {
    const next = require('next');
    const nextApp = next({ dev: false, dir: path.resolve(__dirname, '..') });
    const handle = nextApp.getRequestHandler();

    nextApp.prepare().then(() => {
        // Servir arquivos estáticos do Next.js
        app.use('/_next', express.static(path.resolve(__dirname, '../.next')));

        // Rotas não-API vão para o Next.js
        app.get('*', (req, res) => {
            return handle(req, res);
        });

        console.log('\x1b[32m[Next.js]\x1b[0m Frontend pronto para servir em produção.');
        startServer();
    }).catch((err) => {
        console.error('\x1b[31m[Next.js]\x1b[0m Erro ao preparar frontend:', err.message);
        startServer();
    });
} else {
    startServer();
}

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

// MOTOR DE RESET DIÁRIO — SOMENTE EM MODO DEMONSTRAÇÃO
if (process.env.DEMO_MODE === 'true') {
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
    console.log('\x1b[33m[Security]:\x1b[0m Modo DEMO ativo — reset diário habilitado.');
} else {
    console.log('\x1b[32m[Security]:\x1b[0m Modo PRODUÇÃO — reset diário desabilitado.');
}
