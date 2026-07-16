import "dotenv/config";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { getDb, getSchema } from "./index.js";
import { isSupabaseEnabled } from "../config/env.js";
import { createSupabaseAdmin } from "../supabase/client.js";
const hash = bcrypt.hashSync("123456", 10);
const rootHash = bcrypt.hashSync("123456789", 10);
const demoHash = bcrypt.hashSync("nexus2024", 10);
async function createSupabaseUser(email, password, userData) {
  const admin = createSupabaseAdmin();
  if (!admin) return null;
  try {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: userData
    });
    if (error) {
      if (error.status === 409 || error.message?.includes("already exists")) {
        const { data: users } = await admin.auth.admin.listUsers();
        const found = users?.users?.find((u) => u.email === email);
        if (found) {
          console.log(`   \u{1F517} Usu\xE1rio j\xE1 existente no Supabase: ${email} (ID: ${found.id})`);
          return found.id;
        }
      }
      console.warn(`   \u26A0\uFE0F  Erro Supabase Auth para ${email}: ${error.message}`);
      return null;
    }
    return data?.user?.id || null;
  } catch (err) {
    console.warn(`   \u26A0\uFE0F  Erro ao criar usu\xE1rio Supabase ${email}: ${err.message}`);
    return null;
  }
}
async function initializeDatabase() {
  console.log("\x1B[36m[Nexus-Core]:\x1B[0m Iniciando provisionamento de banco de dados...");
  const db = getDb();
  const schema = getSchema();
  const useSupabase = isSupabaseEnabled();
  if (useSupabase) {
    console.log("\x1B[36m[Supabase]:\x1B[0m Supabase Auth ativo \u2014 usu\xE1rios seed ser\xE3o criados tamb\xE9m no Supabase Auth.");
  }
  let existingCount = 0;
  try {
    const existing = await db.select({ count: sql`COUNT(*)` }).from(schema.employees);
    existingCount = Number(existing[0]?.count || 0);
  } catch (e) {
  }
  if (existingCount > 0) {
    console.log(`\x1B[33m[Seed]:\x1B[0m Banco j\xE1 populado (${existingCount} registros encontrados). Pulando seed.`);
    return;
  }
  console.log("\x1B[36m[Seed]:\x1B[0m Banco vazio. Injetando dados vitais...");
  const users = [
    {
      name: "Desenvolvedor Root",
      email: "dev@dev.com",
      password: rootHash,
      role: "Desenvolvedor Global",
      sector: JSON.stringify(["TI - Infraestrutura"]),
      matricula: "root",
      phone: "000000000",
      is_demo: 0
    },
    {
      name: "J\xFAlio C\xE9sar",
      email: "admin@citymotion.com",
      password: hash,
      role: "Administrador",
      sector: JSON.stringify(["Gabinete do Prefeito"]),
      matricula: "GP-001",
      phone: "5511999999999",
      is_demo: 0
    },
    {
      name: "Jo\xE3o da Silva",
      email: "driver@citymotion.com",
      password: hash,
      role: "Motorista",
      sector: JSON.stringify(["Secretaria de Obras, Via\xE7\xE3o e Urbanismo"]),
      matricula: "M-001",
      phone: "5511777777777",
      is_demo: 0
    },
    {
      name: "Avaliador Demonstra\xE7\xE3o",
      email: "demo@citymotion.com",
      password: demoHash,
      role: "Gestor de Setor",
      sector: JSON.stringify(["Gabinete do Prefeito"]),
      matricula: "DEMO-ROOT",
      phone: "5511000000000",
      is_demo: 1
    }
  ];
  for (const u of users) {
    let supabaseUserId = null;
    if (useSupabase) {
      const plainPassword = u.email === "dev@dev.com" ? "123456789" : u.email === "demo@citymotion.com" ? "nexus2024" : "123456";
      supabaseUserId = await createSupabaseUser(u.email, plainPassword, {
        name: u.name,
        role: u.role
      });
    }
    let insertedId = null;
    try {
      const result = await db.insert(schema.employees).values({
        ...u,
        supabaseUserId
      }).returning();
      insertedId = result[0]?.id;
      if (supabaseUserId && insertedId) {
        const admin = createSupabaseAdmin();
        if (admin) {
          await admin.auth.admin.updateUserById(supabaseUserId, {
            user_metadata: {
              name: u.name,
              role: u.role,
              user_local_id: String(insertedId)
            }
          });
        }
      }
      if (supabaseUserId) {
        console.log(`   \u2705 ${u.name} <${u.email}> \u2192 vinculado ao Supabase (ID: ${supabaseUserId})`);
      }
    } catch (e) {
      console.warn(`[Seed] Aviso ao inserir usu\xE1rio ${u.email}:`, e.message);
    }
  }
  const orgs = [
    { id: "ORG001", name: "Prefeitura de CityMotion", slug: "citymotion-gov", status: "Ativa", plan: "Enterprise", adminEmail: "admin@citymotion.com", activeVehicles: 25, activeUsers: 120 },
    { id: "ORG002", name: "Log\xEDstica TransR\xE1pido", slug: "transrapido", status: "Ativa", plan: "Pro", adminEmail: "ceo@transrapido.com.br", activeVehicles: 12, activeUsers: 45 },
    { id: "ORG003", name: "Sa\xFAde em Movimento", slug: "saude-mov", status: "Demonstra\xE7\xE3o", plan: "Basic", adminEmail: "contato@saudemov.org", activeVehicles: 3, activeUsers: 8 }
  ];
  for (const o of orgs) {
    try {
      await db.insert(schema.organizations).values(o);
    } catch (e) {
      console.warn(`[Seed] Aviso ao inserir org ${o.name}:`, e.message);
    }
  }
  console.log("\x1B[32m[Sucesso]:\x1B[0m Dados vitais injetados no kernel.");
}
const isMainModule = process.argv[1] && process.argv[1].endsWith("seed.js");
if (isMainModule) {
  initializeDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}
export {
  initializeDatabase
};
