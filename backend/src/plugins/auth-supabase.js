import fp from "fastify-plugin";
import { verifyAuth } from "@supabase/server/core";
import { getEnv, isSupabaseEnabled } from "../config/env.js";
import { getDb, getSchema } from "../db/index.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
function toWebRequest(fastifyReq) {
  const url = `http://localhost${fastifyReq.url}`;
  const headers = new Headers();
  for (const [key, value] of Object.entries(fastifyReq.headers)) {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((v) => headers.append(key, v));
      } else {
        headers.set(key, value);
      }
    }
  }
  return new Request(url, {
    method: fastifyReq.method,
    headers
  });
}
async function supabaseAuthPlugin(fastify) {
  const useSupabase = isSupabaseEnabled();
  if (useSupabase) {
    console.log("\\x1b[36m[Supabase Auth]\\x1b[0m Usando autentica\xE7\xE3o via Supabase Auth.");
  } else {
    console.log("\\x1b[33m[Supabase Auth]\\x1b[0m SUPABASE_URL n\xE3o configurado. Usando fallback JWT manual.");
  }
  fastify.decorateRequest("user", void 0);
  fastify.decorateRequest("supabaseToken", void 0);
  fastify.decorate("authenticate", async (request, reply) => {
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return reply.status(401).send({ message: "Token de autentica\xE7\xE3o n\xE3o fornecido." });
    }
    try {
      if (useSupabase) {
        const webRequest = toWebRequest(request);
        const { data: authData, error: authError } = await verifyAuth(webRequest, { auth: "user" });
        if (authError || !authData) {
          return reply.status(403).send({
            message: "Sess\xE3o expirada ou token Supabase inv\xE1lido.",
            error: authError?.message
          });
        }
        const claims = authData.jwtClaims;
        const uc = authData.userClaims;
        const supabaseUserId = claims?.sub || uc?.id || "";
        const email = claims?.email || uc?.email || "";
        const db = getDb();
        const schema = getSchema();
        let employees;
        if (email) {
          employees = await db.select().from(schema.employees).where(eq(schema.employees.email, email)).limit(1);
        } else {
          employees = await db.select().from(schema.employees).where(eq(schema.employees.email, "")).limit(1);
        }
        const employee = employees?.[0];
        if (!employee) {
          return reply.status(403).send({
            message: "Usu\xE1rio autenticado no Supabase mas n\xE3o encontrado no sistema local."
          });
        }
        request.user = {
          id: employee.id,
          supabaseUserId,
          name: employee.name,
          email: employee.email,
          role: employee.role,
          sector: employee.sector,
          is_demo: employee.isDemo
        };
        request.supabaseToken = token;
      } else {
        const decoded = jwt.verify(token, getEnv().JWT_SECRET);
        request.user = {
          id: decoded.id,
          supabaseUserId: "",
          name: decoded.name,
          email: decoded.email || "",
          role: decoded.role,
          sector: decoded.sector,
          is_demo: decoded.is_demo
        };
      }
    } catch (err) {
      return reply.status(403).send({
        message: "Sess\xE3o expirada ou token inv\xE1lido.",
        error: err.message
      });
    }
  });
}
var stdin_default = fp(supabaseAuthPlugin, {
  name: "supabase-auth"
});
export {
  stdin_default as default
};
