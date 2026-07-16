import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq, or } from "drizzle-orm";
import { getDb, getSchema } from "../db/index.js";
import { getEnv, isSupabaseEnabled } from "../config/env.js";
import { createSupabaseClient } from "../supabase/client.js";
import { loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../schemas/index.js";
import { sendPasswordResetEmail } from "../../services/emailService.js";
import { sanitizeSector } from "../utils/sector.js";
async function authRoutes(fastify) {
  const db = getDb();
  const schema = getSchema();
  const useSupabase = isSupabaseEnabled();
  fastify.post("/api/login", {
    schema: {
      description: "Autentica\xE7\xE3o de usu\xE1rio (Supabase Auth + fallback JWT manual)",
      tags: ["Auth"],
      body: {
        type: "object",
        properties: {
          email: { type: "string" },
          password: { type: "string" }
        },
        required: ["email", "password"]
      }
    }
  }, async (request, reply) => {
    const { email, password } = loginSchema.parse(request.body);
    const isTerminalRequest = request.headers["x-nexus-terminal"] === "true";
    if (useSupabase) {
      try {
        const supabase = createSupabaseClient();
        if (!supabase) {
          throw new Error("Supabase client n\xE3o dispon\xEDvel.");
        }
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (authError) {
          return reply.status(401).send({
            message: "Credenciais inv\xE1lidas no Supabase Auth.",
            error: authError.message
          });
        }
        if (!authData?.user) {
          return reply.status(401).send({ message: "Falha na autentica\xE7\xE3o com Supabase." });
        }
        let employees = await db.select().from(schema.employees).where(eq(schema.employees.email, authData.user.email)).limit(1);
        let employee = employees?.[0];
        if (!employee) {
          const meta = authData.user.user_metadata || {};
          const result = await db.insert(schema.employees).values({
            name: meta.name || authData.user.email?.split("@")[0] || "Usu\xE1rio Supabase",
            email: authData.user.email,
            password: "",
            // Senha gerenciada pelo Supabase
            role: meta.role || "Motorista",
            sector: JSON.stringify(meta.sector ? [meta.sector] : ["N\xE3o alocado"]),
            status: "Dispon\xEDvel",
            supabaseUserId: authData.user.id
          }).returning();
          employee = result[0];
          console.log(`[Auth] Novo funcion\xE1rio criado via Supabase: ${authData.user.email} (ID: ${authData.user.id})`);
        } else if (!employee.supabaseUserId) {
          await db.update(schema.employees).set({ supabaseUserId: authData.user.id }).where(eq(schema.employees.id, employee.id));
          employee.supabaseUserId = authData.user.id;
          console.log(`[Auth] V\xEDnculo Supabase atualizado: ${employee.email} \u2192 ${authData.user.id}`);
        }
        if (employee.isDemo === 1 && !isTerminalRequest) {
          return reply.status(403).send({
            message: "ACESSO NEGADO: Este perfil de demonstra\xE7\xE3o s\xF3 pode ser acessado via Terminal NexusOS."
          });
        }
        const { password: _2, ...userWithoutPassword2 } = employee;
        console.log(`[Auth] Login OK (Supabase): ${employee.name}`);
        return {
          token: authData.session?.access_token,
          refreshToken: authData.session?.refresh_token,
          user: {
            ...userWithoutPassword2,
            sector: sanitizeSector(employee.sector)
          }
        };
      } catch (err) {
        console.error("[Auth Supabase Error]:", err.message);
        return reply.status(500).send({ message: `Erro na autentica\xE7\xE3o Supabase: ${err.message}` });
      }
    }
    const users = await db.select().from(schema.employees).where(
      or(
        eq(schema.employees.email, email),
        eq(schema.employees.matricula, email),
        eq(schema.employees.phone, email)
      )
    ).limit(1);
    const user = users[0];
    if (!user) {
      return reply.status(404).send({ message: "Usu\xE1rio n\xE3o encontrado no sistema." });
    }
    if (user.isDemo === 1 && !isTerminalRequest) {
      return reply.status(403).send({
        message: "ACESSO NEGADO: Este perfil de demonstra\xE7\xE3o s\xF3 pode ser acessado via Terminal NexusOS."
      });
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return reply.status(401).send({ message: "Senha incorreta para o identificador fornecido." });
    }
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        role: user.role,
        sector: user.sector,
        is_demo: user.isDemo
      },
      getEnv().JWT_SECRET,
      { expiresIn: "8h" }
    );
    const { password: _, ...userWithoutPassword } = user;
    console.log(`[Auth] Login OK (JWT Manual): ${user.name} ${user.isDemo ? "(DEMO MODE)" : ""}`);
    return { token, user: { ...userWithoutPassword, sector: sanitizeSector(user.sector) } };
  });
  fastify.post("/api/forgot-password", {
    schema: {
      description: "Solicitar recupera\xE7\xE3o de senha",
      tags: ["Auth"],
      body: {
        type: "object",
        properties: { email: { type: "string" } },
        required: ["email"]
      }
    }
  }, async (request, reply) => {
    const { email } = forgotPasswordSchema.parse(request.body);
    if (useSupabase) {
      try {
        const supabase = createSupabaseClient();
        if (supabase) {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${getEnv().CORS_ORIGIN || "http://localhost:9002"}/reset-password`
          });
          if (error) {
            console.warn("[Auth] Erro Supabase resetPasswordForEmail:", error.message);
          }
        }
      } catch (err) {
        console.warn("[Auth] Supabase reset email fallback:", err.message);
      }
      return { message: "Se o email existir, voc\xEA receber\xE1 um link de recupera\xE7\xE3o." };
    }
    const users = await db.select().from(schema.employees).where(eq(schema.employees.email, email)).limit(1);
    const user = users[0];
    if (!user) {
      return reply.status(200).send({ message: "Se o email existir, voc\xEA receber\xE1 um c\xF3digo de recupera\xE7\xE3o." });
    }
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    await db.update(schema.employees).set({ resetToken: code }).where(eq(schema.employees.id, user.id));
    await sendPasswordResetEmail(email, user.name, code);
    return { message: "Se o email existir, voc\xEA receber\xE1 um c\xF3digo de recupera\xE7\xE3o." };
  });
  fastify.post("/api/reset-password", {
    schema: {
      description: "Redefinir senha com token",
      tags: ["Auth"]
    }
  }, async (request, reply) => {
    const { token, password } = resetPasswordSchema.parse(request.body);
    if (useSupabase) {
      return reply.status(400).send({
        message: "Com Supabase Auth, use o link de recupera\xE7\xE3o enviado por email para redefinir sua senha."
      });
    }
    const users = await db.select().from(schema.employees).where(eq(schema.employees.resetToken, token)).limit(1);
    const user = users[0];
    if (!user) {
      return reply.status(400).send({ message: "Token inv\xE1lido ou expirado." });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    await db.update(schema.employees).set({ password: hashedPassword, resetToken: null }).where(eq(schema.employees.id, user.id));
    return { message: "Senha redefinida com sucesso." };
  });
}
export {
  authRoutes
};
