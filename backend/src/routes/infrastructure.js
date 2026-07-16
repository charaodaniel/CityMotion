import fs from "fs";
import path from "path";
import { getDb, getSchema } from "../db/index.js";
import { testDbSchema, saveConfigSchema, testSmtpSchema } from "../schemas/index.js";
import { sql, desc } from "drizzle-orm";
import { getEnv } from "../config/env.js";
import { esmDirname } from "../utils/path.js";
const __dirname = esmDirname(import.meta.url);
const CONFIG_PATH = path.resolve(__dirname, "../../../.env");
const NEXUS_CONFIG_PATH = path.resolve(__dirname, "../../../src/nexusbridge/config/nexus-settings.json");
function readEnvConfig() {
  try {
    const envContent = fs.readFileSync(CONFIG_PATH, "utf8");
    const config = {};
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) return;
      config[trimmed.substring(0, eqIndex).trim()] = trimmed.substring(eqIndex + 1).trim();
    });
    return config;
  } catch {
    return {};
  }
}
function writeEnvConfig(updates) {
  try {
    let envContent = "";
    try {
      envContent = fs.readFileSync(CONFIG_PATH, "utf8");
    } catch {
      envContent = "";
    }
    const lines = envContent.split("\n");
    const updatedKeys = /* @__PURE__ */ new Set();
    const newLines = lines.map((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return line;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) return line;
      const key = trimmed.substring(0, eqIndex).trim();
      if (key in updates) {
        updatedKeys.add(key);
        return `${key}=${updates[key]}`;
      }
      return line;
    });
    for (const [key, value] of Object.entries(updates)) {
      if (!updatedKeys.has(key)) {
        newLines.push(`${key}=${value}`);
      }
    }
    fs.writeFileSync(CONFIG_PATH, newLines.join("\n"), "utf8");
    return true;
  } catch (e) {
    console.error("[Infrastructure] Erro ao salvar .env:", e.message);
    return false;
  }
}
function hasInfraAccess(user) {
  if (!user) return false;
  const r = (user.role || "").toLowerCase();
  return r.includes("desenvolvedor") || r.includes("dev") || r.includes("root") || r.includes("ti") || r.includes("infra") || r === "administrador";
}
async function infrastructureRoutes(fastify) {
  const db = getDb();
  const schema = getSchema();
  fastify.addHook("preHandler", async (request, reply) => {
    if (request.url.startsWith("/api/infrastructure") || request.url.startsWith("/api/system") || request.url.startsWith("/api/maintenance")) {
      await fastify.authenticate(request, reply);
    }
  });
  fastify.get("/api/infrastructure/config", {
    schema: { description: "Configura\xE7\xE3o atual do sistema", tags: ["Infrastructure"] }
  }, async (request, reply) => {
    if (!hasInfraAccess(request.user)) {
      return reply.status(403).send({ message: "Acesso restrito a perfis de infraestrutura." });
    }
    const config = readEnvConfig();
    const mask = (val) => val ? val.substring(0, 3) + "\u2022".repeat(Math.max(0, val.length - 3)) : "";
    return {
      database: {
        type: config.DATABASE_URL ? "postgresql" : "sqlite",
        url: mask(config.DATABASE_URL || "")
      },
      proxy: {
        enabled: !!config.CORS_ORIGIN,
        allowedOrigins: config.CORS_ORIGIN || "http://localhost:9002"
      },
      smtp: {
        host: config.SMTP_HOST || "",
        port: config.SMTP_PORT || "587",
        user: config.SMTP_USER || "",
        pass: mask(config.SMTP_PASS || ""),
        secure: config.SMTP_SECURE === "true"
      },
      server: {
        port: config.PORT || "3001",
        demoMode: config.DEMO_MODE === "true"
      },
      security: {
        jwtConfigured: !!config.JWT_SECRET,
        corsOrigin: config.CORS_ORIGIN || ""
      }
    };
  });
  fastify.post("/api/infrastructure/test-db", {
    schema: { description: "Testar conex\xE3o com banco de dados", tags: ["Infrastructure"] }
  }, async (request, reply) => {
    const { type, url } = testDbSchema.parse(request.body);
    try {
      if (type === "postgresql" && url) {
        const { Pool } = await import("pg");
        const pool = new Pool({
          connectionString: url,
          ssl: { rejectUnauthorized: false },
          connectionTimeoutMillis: 5e3
        });
        const client = await pool.connect();
        const result = await client.query("SELECT NOW() as time, current_database() as db");
        client.release();
        await pool.end();
        return {
          success: true,
          message: "Conex\xE3o PostgreSQL estabelecida com sucesso.",
          details: { serverTime: result.rows[0].time, database: result.rows[0].db }
        };
      }
      if (type === "sqlite") {
        const Database = await import("better-sqlite3").then((m) => m.default);
        const dbPath = url || path.resolve(__dirname, "../../database/citymotion.db");
        const testDb = new Database(dbPath);
        const row = testDb.prepare("SELECT datetime('now') as time").get();
        testDb.close();
        return {
          success: true,
          message: "Conex\xE3o SQLite estabelecida com sucesso.",
          details: { serverTime: row?.time, path: dbPath }
        };
      }
      if (type === "mongodb") {
        const urlPattern = /^mongodb(\+srv)?:\/\/.+$/;
        if (!url || !urlPattern.test(url)) {
          return { success: false, message: "Formato de URL MongoDB inv\xE1lido." };
        }
        return {
          success: true,
          message: "Formato de URL MongoDB v\xE1lido.",
          details: { hint: "npm install mongoose" }
        };
      }
      if (type === "supabase" && url) {
        const { Pool } = await import("pg");
        const pool = new Pool({
          connectionString: url,
          ssl: { rejectUnauthorized: false },
          connectionTimeoutMillis: 5e3
        });
        const client = await pool.connect();
        const result = await client.query("SELECT NOW() as time, current_database() as db");
        client.release();
        await pool.end();
        return {
          success: true,
          message: "Conex\xE3o Supabase estabelecida com sucesso.",
          details: { serverTime: result.rows[0].time, database: result.rows[0].db }
        };
      }
      return { success: false, message: `Tipo de banco n\xE3o suportado: ${type}` };
    } catch (err) {
      return { success: false, message: `Falha na conex\xE3o: ${err.message}` };
    }
  });
  fastify.post("/api/infrastructure/save", {
    schema: { description: "Salvar configura\xE7\xF5es no .env", tags: ["Infrastructure"] }
  }, async (request, reply) => {
    const { section, config } = saveConfigSchema.parse(request.body);
    let updates = {};
    switch (section) {
      case "database":
        if (config.type === "sqlite") {
          updates.DATABASE_URL = "";
        } else if (config.url) {
          updates.DATABASE_URL = config.url;
        }
        break;
      case "proxy":
        updates.CORS_ORIGIN = config.allowedOrigins || "http://localhost:9002";
        break;
      case "smtp":
        if (config.host !== void 0) updates.SMTP_HOST = config.host;
        if (config.port !== void 0) updates.SMTP_PORT = String(config.port);
        if (config.user !== void 0) updates.SMTP_USER = config.user;
        if (config.pass !== void 0 && !config.pass.includes("\u2022")) updates.SMTP_PASS = config.pass;
        if (config.secure !== void 0) updates.SMTP_SECURE = String(config.secure);
        break;
      case "server":
        if (config.port !== void 0) updates.PORT = String(config.port);
        if (config.demoMode !== void 0) updates.DEMO_MODE = String(config.demoMode);
        break;
    }
    const success = writeEnvConfig(updates);
    if (success) {
      return { success: true, message: `Configura\xE7\xF5es da se\xE7\xE3o "${section}" salvas. Reinicie o servidor para aplicar.` };
    }
    return reply.status(500).send({ success: false, message: "Erro ao salvar configura\xE7\xF5es." });
  });
  fastify.post("/api/infrastructure/test-smtp", {
    schema: { description: "Testar conex\xE3o SMTP", tags: ["Infrastructure"] }
  }, async (request, reply) => {
    const { host, port, user, pass, secure } = testSmtpSchema.parse(request.body);
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.default.createTransport({
        host: host || "smtp.gmail.com",
        port: port || 587,
        secure: secure === true,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 5e3
      });
      await transporter.verify();
      return { success: true, message: "Conex\xE3o SMTP verificada com sucesso." };
    } catch (err) {
      return { success: false, message: `Falha SMTP: ${err.message}` };
    }
  });
  fastify.get("/api/infrastructure/nexus-config", {
    schema: { description: "Configura\xE7\xE3o do NexusBridge", tags: ["Infrastructure"] }
  }, async () => {
    try {
      if (fs.existsSync(NEXUS_CONFIG_PATH)) {
        return JSON.parse(fs.readFileSync(NEXUS_CONFIG_PATH, "utf8"));
      }
      return { backends: {}, routes: [] };
    } catch {
      return { backends: {}, routes: [] };
    }
  });
  fastify.post("/api/infrastructure/nexus-config", {
    schema: { description: "Atualizar configura\xE7\xE3o do NexusBridge", tags: ["Infrastructure"] }
  }, async (request, reply) => {
    try {
      const dir = path.dirname(NEXUS_CONFIG_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(NEXUS_CONFIG_PATH, JSON.stringify(request.body, null, 2), "utf8");
      return { success: true, message: "Configura\xE7\xE3o do NexusBridge atualizada." };
    } catch (e) {
      return reply.status(500).send({ message: "Erro ao salvar configura\xE7\xE3o do NexusBridge." });
    }
  });
  fastify.get("/api/system/db-info", {
    schema: { description: "Informa\xE7\xF5es do banco de dados", tags: ["System"] }
  }, async () => {
    const tables = [
      "employees",
      "vehicles",
      "trips",
      "organizations",
      "messages",
      "refuelings",
      "audit_logs",
      "maintenance_requests",
      "work_schedules",
      "vehicle_requests",
      "sectors"
    ];
    const stats = {};
    for (const table of tables) {
      try {
        const result = await db.select({
          count: sql`COUNT(*)`
        }).from(schema[table]);
        stats[table] = Number(result[0]?.count || 0);
      } catch {
        stats[table] = 0;
      }
    }
    return {
      engine: getEnv().DATABASE_URL ? "PostgreSQL" : "SQLite",
      tables: stats,
      total: Object.values(stats).reduce((a, b) => a + b, 0)
    };
  });
  fastify.get("/api/system/audit-logs", {
    schema: { description: "\xDAltimos logs de auditoria", tags: ["System"] }
  }, async () => {
    try {
      return db.select().from(schema.auditLogs).orderBy(desc(schema.auditLogs.timestamp)).limit(100);
    } catch {
      return [];
    }
  });
  fastify.post("/api/maintenance/reset", {
    schema: { description: "Reset completo do banco (requer ROOT)", tags: ["System"] }
  }, async (request, reply) => {
    const user = request.user;
    if (!user || user.role !== "Desenvolvedor Global" && user.role !== "root") {
      return reply.status(403).send({ message: "Apenas usu\xE1rios ROOT podem executar esta opera\xE7\xE3o." });
    }
    try {
      const { initializeDatabase } = await import("../db/seed");
      await initializeDatabase();
      return { message: "Banco de dados reinicializado com sucesso." };
    } catch (err) {
      return reply.status(500).send({ message: `Erro ao resetar banco: ${err.message}` });
    }
  });
}
export {
  infrastructureRoutes
};
