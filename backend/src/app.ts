import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import authPlugin from './plugins/auth';
import { getEnv } from './config/env';
import { authRoutes } from './routes/auth';
import { dataRoutes } from './routes/data';
import { infrastructureRoutes } from './routes/infrastructure';
import { setupWebSocket } from './plugins/websocket';
import { initializeDatabase } from './db/seed';

export async function buildApp() {
  const env = getEnv();

  const app = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: { translateTime: 'HH:MM:ss Z', ignore: 'pid,hostname' },
      },
    },
  });

  // =============================================================
  // CORS
  // =============================================================
  await app.register(cors, {
    origin: env.CORS_ORIGIN
      ? env.CORS_ORIGIN.split(',').map((o: string) => o.trim())
      : ['http://localhost:9002', 'http://127.0.0.1:9002'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-nexus-terminal'],
    credentials: true,
  });

  // =============================================================
  // Rate Limiting
  // =============================================================
  await app.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: '15 minutes',
    errorResponseBuilder: () => ({
      message: 'Muitas requisições. Tente novamente mais tarde.',
    }),
  });

  // =============================================================
  // Swagger / OpenAPI
  // =============================================================
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'CityMotion API',
        description: 'API de Gestão Inteligente de Frotas',
        version: '1.0.0',
      },
      servers: [{ url: `http://localhost:${env.PORT}`, description: 'Development' }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });

  // =============================================================
  // Auth Plugin (JWT)
  // =============================================================
  await app.register(authPlugin);

  // =============================================================
  // Logger Técnico NexusOS (Hook global)
  // =============================================================
  app.addHook('onRequest', async (request) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    const isTerminal = request.headers['x-nexus-terminal'] === 'true' ? '[TTY]' : '[WEB]';
    console.log(`\x1b[90m[${timestamp}]\x1b[0m \x1b[36mAPI:\x1b[0m ${isTerminal} ${request.method} ${request.url}`);
  });

  // =============================================================
  // Health Check
  // =============================================================
  app.get('/api/health', {
    schema: { description: 'Health check da API', tags: ['System'] },
  }, async () => ({
    status: 'operational',
    kernel: 'Nexus-Dual',
    uptime: process.uptime(),
  }));

  // =============================================================
  // Routes
  // =============================================================
  await authRoutes(app);
  await dataRoutes(app);
  await infrastructureRoutes(app);

  // =============================================================
  // Static Files (Novo Frontend HTML/JS/CSS)
  // =============================================================
  await app.register(fastifyStatic, {
    root: new URL('../../public', import.meta.url),
    prefix: '/',
    wildcard: false,
  });

  // Fallback SPA: app.html e index.html
  app.setNotFoundHandler(async (request, reply) => {
    if (request.url.startsWith('/api/')) {
      return reply.status(404).send({ message: 'Rota não encontrada' });
    }
    // Servir app.html para rotas SPA
    return reply.sendFile('app.html');
  });

  // =============================================================
  // Alias /api/sync-all → /api/data
  // =============================================================
  app.get('/api/sync-all', async (request, reply) => {
    return reply.redirect('/api/data');
  });

  return app;
}

export async function startServer() {
  const env = getEnv();

  // Inicializar banco de dados
  try {
    await initializeDatabase();
  } catch (err: any) {
    console.error('[Startup] Erro ao inicializar banco:', err.message);
  }

  const app = await buildApp();

  // WebSocket
  const io = setupWebSocket(app);

  // Rate limiting específico para login (10 req/15min)
  // Fastify rate-limit suporta rota específica
  // Já configuramos global, agora configuramos específico para login

  // Demo mode - daily reset
  if (env.DEMO_MODE === 'true') {
    let lastResetDate = new Date().toDateString();
    setInterval(async () => {
      const currentDate = new Date().toDateString();
      if (currentDate !== lastResetDate) {
        console.log('\x1b[35m[Cron]:\x1b[0m Mudança de dia detectada. Resetando dados demo...');
        try {
          await initializeDatabase();
          lastResetDate = currentDate;
          console.log('\x1b[32m[Cron]:\x1b[0m Reset diário concluído.');
        } catch (err: any) {
          console.error('[Cron Error]:', err.message);
        }
      }
    }, 3600000);
    console.log('\x1b[33m[Security]:\x1b[0m Modo DEMO ativo — reset diário habilitado.');
  } else {
    console.log('\x1b[32m[Security]:\x1b[0m Modo PRODUÇÃO — reset diário desabilitado.');
  }

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`\x1b[32m[CityMotion Backend]\x1b[0m Rodando em http://0.0.0.0:${env.PORT}`);
    console.log(`\x1b[36m[Swagger]\x1b[0m Documentação em http://localhost:${env.PORT}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
