import bcrypt from "bcryptjs";
import { eq, desc, or, sql } from "drizzle-orm";
import { getDb, getSchema } from "../db/index.js";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  createVehicleSchema,
  updateVehicleSchema,
  sendMessageSchema,
  createRefuelingSchema,
  createRequestSchema
} from "../schemas/index.js";
import { getIO } from "../plugins/websocket.js";
import { getRlsClient } from "../supabase/rls-helper.js";
import { createSupabaseAuthUser, isSupabaseEnabled } from "../supabase/client.js";
function broadcastAll(event, data) {
  const io = getIO();
  if (io) io.emit(event, data);
}
function broadcastToSector(event, sectors, data) {
  const io = getIO();
  if (io && sectors?.length) {
    sectors.forEach((s) => io.to(s).emit(event, data));
  } else if (io) {
    io.emit(event, data);
  }
}
function sanitizeSector(sector) {
  if (!sector) return [];
  if (Array.isArray(sector)) return sector;
  try {
    const parsed = JSON.parse(sector);
    return Array.isArray(parsed) ? parsed : [sector];
  } catch {
    return [sector];
  }
}
async function dataRoutes(fastify) {
  const db = getDb();
  const schema = getSchema();
  fastify.addHook("preHandler", async (request, reply) => {
    if (request.url.startsWith("/api/data") || request.url.startsWith("/api/requests") || request.url.startsWith("/api/analytics") || request.url.startsWith("/api/employees") || request.url.startsWith("/api/vehicles") || request.url.startsWith("/api/refuelings") || request.url.startsWith("/api/messages")) {
      await fastify.authenticate(request, reply);
    }
  });
  fastify.get("/api/data", {
    schema: { description: "Sincroniza\xE7\xE3o global do ecossistema", tags: ["Data"] }
  }, async (request, reply) => {
    try {
      const results = {};
      const queries = {
        trips: db.select().from(schema.trips).orderBy(desc(schema.trips.id)),
        vehicles: db.select().from(schema.vehicles).orderBy(schema.vehicles.id),
        employees: db.select().from(schema.employees).orderBy(schema.employees.name),
        sectors: db.select().from(schema.sectors).orderBy(schema.sectors.name),
        maintenanceRequests: db.select().from(schema.maintenanceRequests).orderBy(desc(schema.maintenanceRequests.id)),
        refuelings: db.select().from(schema.refuelings).orderBy(desc(schema.refuelings.date)).limit(100),
        workSchedules: db.select().from(schema.workSchedules).orderBy(desc(schema.workSchedules.id)),
        organizations: db.select().from(schema.organizations).orderBy(schema.organizations.name),
        vehicleRequests: db.select().from(schema.vehicleRequests).orderBy(desc(schema.vehicleRequests.id))
      };
      const userId = request.user?.id;
      for (const [key, query] of Object.entries(queries)) {
        try {
          results[key] = await query;
        } catch (e) {
          console.warn(`[Sync Warning] Failed to fetch ${key}:`, e.message);
          results[key] = [];
        }
      }
      try {
        if (userId) {
          results.messages = await db.select().from(schema.messages).where(
            or(
              eq(schema.messages.senderId, String(userId)),
              eq(schema.messages.receiverId, String(userId))
            )
          ).orderBy(schema.messages.timestamp);
        } else {
          results.messages = [];
        }
      } catch {
        results.messages = [];
      }
      results.employees = results.employees?.map((emp) => {
        const { password, ...rest } = emp;
        return { ...rest, sector: sanitizeSector(emp.sector) };
      }) || [];
      return results;
    } catch (err) {
      console.error("[Sync Error]:", err.message);
      return reply.status(500).send({ error: "Erro ao carregar ecossistema de dados." });
    }
  });
  fastify.get("/api/employees", {
    schema: { description: "Listar funcion\xE1rios (RLS: pr\xF3prio perfil ou admin)", tags: ["Employees"] }
  }, async (request) => {
    const supabase = getRlsClient(request);
    if (supabase) {
      const { data, error } = await supabase.from("employees").select("*").order("name", { ascending: true });
      if (!error && data) {
        return data.map((emp) => {
          const { password, ...rest } = emp;
          return { ...rest, sector: sanitizeSector(emp.sector) };
        });
      }
      console.warn("[RLS] employees select falhou, fallback Drizzle:", error?.message);
    }
    const rows = await db.select().from(schema.employees).orderBy(schema.employees.name);
    return rows.map((emp) => {
      const { password, ...rest } = emp;
      return { ...rest, sector: sanitizeSector(emp.sector) };
    });
  });
  fastify.post("/api/employees", {
    schema: { description: "Criar funcion\xE1rio (com v\xEDnculo Supabase Auth)", tags: ["Employees"] }
  }, async (request, reply) => {
    const data = createEmployeeSchema.parse(request.body);
    const plainPassword = data.password || "123456";
    const hashedPassword = bcrypt.hashSync(plainPassword, 10);

    // Inserir no banco local primeiro
    const result = await db.insert(schema.employees).values({ ...data, password: hashedPassword }).returning();
    const { password, ...employee } = result[0];

    // Criar no Supabase Auth se estiver configurado
    let supabaseUserId = null;
    if (isSupabaseEnabled()) {
      try {
        const supabaseUser = await createSupabaseAuthUser(employee.email, plainPassword, {
          name: employee.name,
          role: employee.role,
          sector: data.sector || ""
        });
        if (supabaseUser?.id) {
          supabaseUserId = supabaseUser.id;
          // Atualizar o registro local com o supabase_user_id
          await db.update(schema.employees)
            .set({ supabaseUserId })
            .where(eq(schema.employees.id, employee.id));
          employee.supabaseUserId = supabaseUserId;
          console.log(`[Employees] Supabase Auth user created: ${employee.email} (ID: ${supabaseUserId})`);
        }
      } catch (err) {
        // Se o email já existir no Supabase, não é um erro crítico
        if (err.status === 409 || err.message?.includes("already exists")) {
          console.warn(`[Employees] Supabase user already exists: ${employee.email}`);
        } else {
          console.error(`[Employees] Erro ao criar usu\xE1rio Supabase para ${employee.email}:`, err.message);
        }
      }
    }

    const sanitized = { ...employee, sector: sanitizeSector(employee.sector) };
    broadcastAll("entity-update", { entity: "employees", action: "create", data: sanitized });
    return sanitized;
  });
  fastify.put("/api/employees/:id", {
    schema: { description: "Atualizar funcion\xE1rio", tags: ["Employees"] }
  }, async (request, reply) => {
    const { id } = request.params;
    const data = updateEmployeeSchema.parse(request.body);
    if (data.password) {
      data.password = bcrypt.hashSync(data.password, 10);
    }
    const result = await db.update(schema.employees).set(data).where(eq(schema.employees.id, Number(id))).returning();
    if (!result.length) {
      return reply.status(404).send({ message: "Funcion\xE1rio n\xE3o encontrado." });
    }
    const { password, ...employee } = result[0];
    broadcastAll("entity-update", { entity: "employees", action: "update", data: { ...employee, sector: sanitizeSector(employee.sector) } });
    return employee;
  });
  fastify.delete("/api/employees/:id", {
    schema: { description: "Deletar funcion\xE1rio (soft-delete ou hard se ROOT)", tags: ["Employees"] }
  }, async (request, reply) => {
    const { id } = request.params;
    const user = request.user;
    if (user?.role === "Desenvolvedor Global" || user?.role === "root") {
      await db.delete(schema.employees).where(eq(schema.employees.id, Number(id)));
      broadcastAll("entity-update", { entity: "employees", action: "delete", data: { id: Number(id) } });
    } else {
      await db.update(schema.employees).set({ status: "Desativado" }).where(eq(schema.employees.id, Number(id)));
      broadcastAll("entity-update", { entity: "employees", action: "update", data: { id: Number(id), status: "Desativado" } });
    }
    return { success: true };
  });
  fastify.get("/api/vehicles", {
    schema: { description: "Listar ve\xEDculos", tags: ["Vehicles"] }
  }, async () => {
    return db.select().from(schema.vehicles).orderBy(schema.vehicles.id);
  });
  fastify.post("/api/vehicles", {
    schema: { description: "Criar ve\xEDculo", tags: ["Vehicles"] }
  }, async (request, reply) => {
    const data = createVehicleSchema.parse(request.body);
    const result = await db.insert(schema.vehicles).values(data).returning();
    broadcastAll("entity-update", { entity: "vehicles", action: "create", data: result[0] });
    return result[0];
  });
  fastify.put("/api/vehicles/:id", {
    schema: { description: "Atualizar ve\xEDculo", tags: ["Vehicles"] }
  }, async (request, reply) => {
    const { id } = request.params;
    const data = updateVehicleSchema.parse(request.body);
    const result = await db.update(schema.vehicles).set(data).where(eq(schema.vehicles.id, Number(id))).returning();
    if (!result.length) {
      return reply.status(404).send({ message: "Ve\xEDculo n\xE3o encontrado." });
    }
    broadcastAll("entity-update", { entity: "vehicles", action: "update", data: result[0] });
    return result[0];
  });
  fastify.get("/api/refuelings", {
    schema: { description: "Listar abastecimentos", tags: ["Refuelings"] }
  }, async () => {
    return db.select().from(schema.refuelings).orderBy(desc(schema.refuelings.date)).limit(100);
  });
  fastify.post("/api/refuelings", {
    schema: { description: "Registrar abastecimento", tags: ["Refuelings"] }
  }, async (request, reply) => {
    const data = createRefuelingSchema.parse(request.body);
    const result = await db.insert(schema.refuelings).values(data).returning();
    broadcastAll("entity-update", { entity: "refuelings", action: "create", data: result[0] });
    return result[0];
  });
  fastify.get("/api/messages", {
    schema: { description: "Listar mensagens do usu\xE1rio (RLS: pr\xF3prio)", tags: ["Messages"] }
  }, async (request) => {
    const user = request.user;
    const supabase = getRlsClient(request);
    if (supabase) {
      const { data, error } = await supabase.from("messages").select("*").order("timestamp", { ascending: true });
      if (!error && data) {
        return data;
      }
      console.warn("[RLS] messages select falhou, fallback Drizzle:", error?.message);
    }
    return db.select().from(schema.messages).where(
      or(
        eq(schema.messages.senderId, String(user.id)),
        eq(schema.messages.receiverId, String(user.id))
      )
    ).orderBy(schema.messages.timestamp);
  });
  fastify.post("/api/messages", {
    schema: { description: "Enviar mensagem (RLS: sender_id = auth.uid)", tags: ["Messages"] }
  }, async (request, reply) => {
    const user = request.user;
    const { receiverId, content } = sendMessageSchema.parse(request.body);
    const supabase = getRlsClient(request);
    if (supabase) {
      const { data, error } = await supabase.from("messages").insert({
        sender_id: user.supabaseUserId || String(user.id),
        receiver_id: receiverId,
        content
      }).select().single();
      if (!error && data) {
        broadcastAll("entity-update", { entity: "messages", action: "create", data });
        broadcastAll("notification", {
          id: "notif-" + Date.now(),
          type: "message",
          title: "Nova Mensagem",
          message: `${user.name} enviou: "${content.substring(0, 60)}${content.length > 60 ? "..." : ""}"`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          read: false,
          link: "/chat"
        });
        return data;
      }
      console.warn("[RLS] messages insert falhou, fallback Drizzle:", error?.message);
    }
    const result = await db.insert(schema.messages).values({ senderId: String(user.id), receiverId, content }).returning();
    broadcastAll("entity-update", { entity: "messages", action: "create", data: result[0] });
    broadcastAll("notification", {
      id: "notif-" + Date.now(),
      type: "message",
      title: "Nova Mensagem",
      message: `${user.name} enviou: "${content.substring(0, 60)}${content.length > 60 ? "..." : ""}"`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      read: false,
      link: "/chat"
    });
    return result[0];
  });
  fastify.post("/api/requests", {
    schema: { description: "Criar solicita\xE7\xE3o de ve\xEDculo", tags: ["Requests"] }
  }, async (request, reply) => {
    const user = request.user;
    const data = createRequestSchema.parse(request.body);
    const result = await db.insert(schema.vehicleRequests).values({ ...data, requester: user.name }).returning();
    const sectorList = data.sector ? Array.isArray(data.sector) ? data.sector : [data.sector] : [];
    const notifPayload = {
      id: "notif-" + Date.now(),
      type: "request",
      title: "Nova Solicita\xE7\xE3o de Viagem",
      message: `${user.name} solicitou "${data.title}"`,
      priority: data.priority || "M\xE9dia",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      read: false,
      link: "/viagens"
    };
    const entityPayload = { entity: "vehicleRequests", action: "create", data: result[0] };
    if (sectorList.length > 0) {
      broadcastToSector("notification", sectorList, notifPayload);
      broadcastToSector("entity-update", sectorList, entityPayload);
    } else {
      broadcastAll("notification", notifPayload);
      broadcastAll("entity-update", entityPayload);
    }
    return { success: true, id: result[0].id };
  });
  fastify.get("/api/analytics/telemetry", {
    schema: { description: "Dados de telemetria para gr\xE1ficos", tags: ["Analytics"] }
  }, async () => {
    try {
      const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      const refuelingStats = await db.select({
        month: sql`strftime('%m', date)`.as("month_num"),
        totalSpent: sql`SUM(total_value)`.as("total_spent"),
        count: sql`COUNT(*)`.as("count")
      }).from(schema.refuelings).groupBy(sql`month_num`).orderBy(sql`month_num ASC`);
      if (!refuelingStats || refuelingStats.length === 0) {
        return [];
      }
      return refuelingStats.map((r) => ({
        month: months[parseInt(r.month) - 1] || "???",
        cost: Number(r.totalSpent) || 0,
        volume: Number(r.count) || 0
      }));
    } catch (err) {
      console.warn("[Analytics Fallback]", err.message);
      return [];
    }
  });
}
export {
  dataRoutes
};
