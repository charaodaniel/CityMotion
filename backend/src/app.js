import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import supabaseAuthPlugin from "./plugins/auth-supabase.js";
import { getEnv } from "./config/env.js";
import { authRoutes } from "./routes/auth.js";
import { dataRoutes } from "./routes/data.js";
import { infrastructureRoutes } from "./routes/infrastructure.js";
import { reportTemplateRoutes } from "./routes/report-templates.js";
import { setupWebSocket } from "./plugins/websocket.js";
import { initializeDatabase } from "./db/seed.js";
async function buildApp() {
  const env = getEnv();
  const app = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
        options: { translateTime: "HH:MM:ss Z", ignore: "pid,hostname" }
      }
    }
  });
  await app.register(cors, {
    origin: env.CORS_ORIGIN ? env.CORS_ORIGIN.split(",").map((o) => o.trim()) : ["http://localhost:9002", "http://127.0.0.1:9002"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-nexus-terminal"],
    credentials: true
  });
  await app.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: "15 minutes",
    errorResponseBuilder: () => ({
      message: "Muitas requisi\xE7\xF5es. Tente novamente mais tarde."
    })
  });
  await app.register(swagger, {
    openapi: {
      info: {
        title: "CityMotion API",
        description: "API de Gest\xE3o Inteligente de Frotas",
        version: "1.0.0"
      },
      servers: [{ url: `http://localhost:${env.PORT}`, description: "Development" }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      }
    }
  });
  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true
    }
  });
  await app.register(supabaseAuthPlugin);
  app.addHook("onRequest", async (request) => {
    const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR");
    const isTerminal = request.headers["x-nexus-terminal"] === "true" ? "[TTY]" : "[WEB]";
    console.log(`\x1B[90m[${timestamp}]\x1B[0m \x1B[36mAPI:\x1B[0m ${isTerminal} ${request.method} ${request.url}`);
  });
  app.get("/api/health", {
    schema: { description: "Health check da API", tags: ["System"] }
  }, async () => ({
    status: "operational",
    kernel: "Nexus-Dual",
    uptime: process.uptime()
  }));
  await authRoutes(app);
  await dataRoutes(app);
  await infrastructureRoutes(app);
  await reportTemplateRoutes(app);
  await app.register(fastifyStatic, {
    root: new URL("../../public", import.meta.url),
    prefix: "/",
    wildcard: false
  });
  app.setNotFoundHandler(async (request, reply) => {
    if (request.url.startsWith("/api/")) {
      return reply.status(404).send({ message: "Rota n\xE3o encontrada" });
    }
    return reply.sendFile("app.html");
  });
  app.get("/api/sync-all", async (request, reply) => {
    return reply.redirect("/api/data");
  });
  return app;
}
async function startServer() {
  const env = getEnv();
  try {
    await initializeDatabase();
  } catch (err) {
    console.error("[Startup] Erro ao inicializar banco:", err.message);
  }
  const app = await buildApp();
  const io = setupWebSocket(app);
  if (env.DEMO_MODE === "true") {
    let lastResetDate = (/* @__PURE__ */ new Date()).toDateString();
    setInterval(async () => {
      const currentDate = (/* @__PURE__ */ new Date()).toDateString();
      if (currentDate !== lastResetDate) {
        console.log("\x1B[35m[Cron]:\x1B[0m Mudan\xE7a de dia detectada. Resetando dados demo...");
        try {
          await initializeDatabase();
          lastResetDate = currentDate;
          console.log("\x1B[32m[Cron]:\x1B[0m Reset di\xE1rio conclu\xEDdo.");
        } catch (err) {
          console.error("[Cron Error]:", err.message);
        }
      }
    }, 36e5);
    console.log("\x1B[33m[Security]:\x1B[0m Modo DEMO ativo \u2014 reset di\xE1rio habilitado.");
  } else {
    console.log("\x1B[32m[Security]:\x1B[0m Modo PRODU\xC7\xC3O \u2014 reset di\xE1rio desabilitado.");
  }
  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    console.log(`\x1B[32m[CityMotion Backend]\x1B[0m Rodando em http://0.0.0.0:${env.PORT}`);
    console.log(`\x1B[36m[Swagger]\x1B[0m Documenta\xE7\xE3o em http://localhost:${env.PORT}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
export {
  buildApp,
  startServer
};
