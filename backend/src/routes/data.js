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
import { getRlsClient, withRlsFallback } from "../supabase/rls-helper.js";
import { createSupabaseAuthUser, isSupabaseEnabled } from "../supabase/client.js";
import { sanitizeSector } from "../utils/sector.js";
import { stripPassword } from "../utils/employee.js";
import { hasRole } from "../utils/role.js";

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
      const userId = request.user?.id;

      // Montar lista de queries com suas chaves
      const queryEntries = [
        { key: "trips", query: db.select().from(schema.trips).orderBy(desc(schema.trips.id)) },
        { key: "vehicles", query: db.select().from(schema.vehicles).orderBy(schema.vehicles.id) },
        { key: "employees", query: db.select().from(schema.employees).orderBy(schema.employees.name) },
        { key: "sectors", query: db.select().from(schema.sectors).orderBy(schema.sectors.name) },
        { key: "maintenanceRequests", query: db.select().from(schema.maintenanceRequests).orderBy(desc(schema.maintenanceRequests.id)) },
        { key: "refuelings", query: db.select().from(schema.refuelings).orderBy(desc(schema.refuelings.date)).limit(100) },
        { key: "workSchedules", query: db.select().from(schema.workSchedules).orderBy(desc(schema.workSchedules.id)) },
        { key: "organizations", query: db.select().from(schema.organizations).orderBy(schema.organizations.name) },
        { key: "vehicleRequests", query: db.select().from(schema.vehicleRequests).orderBy(desc(schema.vehicleRequests.id)) }
      ];

      // Incluir messages condicionalmente (só do usuário logado)
      if (userId) {
        queryEntries.push({
          key: "messages",
          query: db.select().from(schema.messages).where(
            or(
              eq(schema.messages.senderId, String(userId)),
              eq(schema.messages.receiverId, String(userId))
            )
          ).orderBy(schema.messages.timestamp)
        });
      }

      // Executar TODAS as queries em PARALELO via Promise.allSettled
      // Tempo total ≈ o tempo da query mais lenta (não a soma de todas)
      const settledResults = await Promise.allSettled(
        queryEntries.map((entry) => entry.query)
      );

      // Mapear resultados de volta para o objeto results
      queryEntries.forEach((entry, index) => {
        const settled = settledResults[index];
        if (settled.status === "fulfilled") {
          results[entry.key] = settled.value;
        } else {
          console.warn(`[Sync Warning] Failed to fetch ${entry.key}:`, settled.reason?.message || settled.reason);
          results[entry.key] = [];
        }
      });

      // Garantir que messages sempre exista no resultado
      if (!results.messages) {
        results.messages = [];
      }
      results.employees = results.employees?.map((emp) => ({
        ...stripPassword(emp),
        sector: sanitizeSector(emp.sector)
      })) || [];
      return results;
    } catch (err) {
      console.error("[Sync Error]:", err.message);
      return reply.status(500).send({ error: "Erro ao carregar ecossistema de dados." });
    }
  });
  fastify.get("/api/employees", {
    schema: { description: "Listar funcion\xE1rios (RLS: pr\xF3prio perfil ou admin)", tags: ["Employees"] }
  }, async (request) => {
    return withRlsFallback(
      request,
      async (supabase) => {
        const { data, error } = await supabase.from("employees").select("*").order("name", { ascending: true });
        if (error) throw error;
        return data.map((emp) => ({
          ...stripPassword(emp),
          sector: sanitizeSector(emp.sector)
        }));
      },
      async () => {
        const rows = await db.select().from(schema.employees).orderBy(schema.employees.name);
        return rows.map((emp) => ({
          ...stripPassword(emp),
          sector: sanitizeSector(emp.sector)
        }));
      }
    );
  });
  fastify.post("/api/employees", {
    schema: { description: "Criar funcion\xE1rio (com v\xEDnculo Supabase Auth)", tags: ["Employees"] }
  }, async (request, reply) => {
    const data = createEmployeeSchema.parse(request.body);
    const plainPassword = data.password || "123456";
    const hashedPassword = bcrypt.hashSync(plainPassword, 10);

    // Inserir no banco local primeiro
    const result = await db.insert(schema.employees).values({ ...data, password: hashedPassword }).returning();
    const employee = stripPassword(result[0]);

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
    const employee = stripPassword(result[0]);
    broadcastAll("entity-update", { entity: "employees", action: "update", data: { ...employee, sector: sanitizeSector(employee.sector) } });
    return employee;
  });
  fastify.delete("/api/employees/:id", {
    schema: { description: "Deletar funcion\xE1rio (soft-delete ou hard se ROOT)", tags: ["Employees"] }
  }, async (request, reply) => {
    const { id } = request.params;
    const user = request.user;
    if (hasRole(user, ['desenvolvedor', 'root'])) {
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
    return withRlsFallback(
      request,
      async (supabase) => {
        const { data, error } = await supabase.from("messages").select("*").order("timestamp", { ascending: true });
        if (error) throw error;
        return data;
      },
      async () => {
        return db.select().from(schema.messages).where(
          or(
            eq(schema.messages.senderId, String(user.id)),
            eq(schema.messages.receiverId, String(user.id))
          )
        ).orderBy(schema.messages.timestamp);
      }
    );
  });
  // Helper para criar payload de notificação de mensagem
  function buildMessageNotification(user, content) {
    return {
      id: "notif-" + Date.now(),
      type: "message",
      title: "Nova Mensagem",
      message: `${user.name} enviou: "${content.substring(0, 60)}${content.length > 60 ? "..." : ""}"`,
      timestamp: new Date().toISOString(),
      read: false,
      link: "/chat"
    };
  }

  fastify.post("/api/messages", {
    schema: { description: "Enviar mensagem (RLS: sender_id = auth.uid)", tags: ["Messages"] }
  }, async (request, reply) => {
    const user = request.user;
    const { receiverId, content } = sendMessageSchema.parse(request.body);

    const notification = buildMessageNotification(user, content);
    let result;

    // Tentar via RLS (Supabase) primeiro, fallback para Drizzle
    const supabaseClient = getRlsClient(request);
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from("messages").insert({
          sender_id: user.supabaseUserId || String(user.id),
          receiver_id: receiverId,
          content
        }).select().single();
        if (!error && data) {
          result = data;
        } else {
          console.warn("[RLS] messages insert falhou, fallback Drizzle:", error?.message);
        }
      } catch (err) {
        console.warn("[RLS] messages insert exception, fallback Drizzle:", err.message);
      }
    }

    if (!result) {
      const drizzleResult = await db.insert(schema.messages).values({ senderId: String(user.id), receiverId, content }).returning();
      result = drizzleResult[0];
    }

    broadcastAll("entity-update", { entity: "messages", action: "create", data: result });
    broadcastAll("notification", notification);
    return result;
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
