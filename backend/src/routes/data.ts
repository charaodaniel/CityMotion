import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import { eq, desc, or, and, sql } from 'drizzle-orm';
import { getDb, getSchema } from '../db';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  createVehicleSchema,
  updateVehicleSchema,
  sendMessageSchema,
  createRefuelingSchema,
  createRequestSchema,
} from '../schemas';
import { getIO } from '../plugins/websocket';

/** Helpers para broadcast WebSocket */
function broadcastAll(event: string, data: any) {
  const io = getIO();
  if (io) io.emit(event, data);
}

function broadcastToSector(event: string, sectors: string[], data: any) {
  const io = getIO();
  if (io && sectors?.length) {
    sectors.forEach(s => io.to(s).emit(event, data));
  } else if (io) {
    io.emit(event, data);
  }
}

function sanitizeSector(sector: any): string[] {
  if (!sector) return [];
  if (Array.isArray(sector)) return sector;
  try {
    const parsed = JSON.parse(sector);
    return Array.isArray(parsed) ? parsed : [sector];
  } catch {
    return [sector];
  }
}

export async function dataRoutes(fastify: FastifyInstance) {
  const db = getDb();
  const schema = getSchema();

  // Apply auth middleware to all routes
  fastify.addHook('preHandler', async (request, reply) => {
    if (request.url.startsWith('/api/data') ||
        request.url.startsWith('/api/requests') ||
        request.url.startsWith('/api/analytics') ||
        request.url.startsWith('/api/employees') ||
        request.url.startsWith('/api/vehicles') ||
        request.url.startsWith('/api/refuelings') ||
        request.url.startsWith('/api/messages')) {
      await fastify.authenticate(request, reply);
    }
  });

  // =============================================================
  // GET /api/data - Sync Global
  // =============================================================
  fastify.get('/api/data', {
    schema: { description: 'Sincronização global do ecossistema', tags: ['Data'] },
  }, async (request, reply) => {
    try {
      const results: Record<string, any[]> = {};

      const queries: Record<string, any> = {
        trips: (db as any).select().from(schema.trips).orderBy(desc(schema.trips.id)),
        vehicles: (db as any).select().from(schema.vehicles).orderBy(schema.vehicles.id),
        employees: (db as any).select().from(schema.employees).orderBy(schema.employees.name),
        sectors: (db as any).select().from(schema.sectors).orderBy(schema.sectors.name),
        maintenanceRequests: (db as any).select().from(schema.maintenanceRequests).orderBy(desc(schema.maintenanceRequests.id)),
        refuelings: (db as any).select().from(schema.refuelings).orderBy(desc(schema.refuelings.date)).limit(100),
        workSchedules: (db as any).select().from(schema.workSchedules).orderBy(desc(schema.workSchedules.id)),
        organizations: (db as any).select().from(schema.organizations).orderBy(schema.organizations.name),
        vehicleRequests: (db as any).select().from(schema.vehicleRequests).orderBy(desc(schema.vehicleRequests.id)),
      };

      // Employee messages filtered by user
      const userId = (request.user as any)?.id;

      for (const [key, query] of Object.entries(queries)) {
        try {
          results[key] = await query;
        } catch (e: any) {
          console.warn(`[Sync Warning] Failed to fetch ${key}:`, e.message);
          results[key] = [];
        }
      }

      // Messages filtered for the current user
      try {
        if (userId) {
          results.messages = await (db as any)
            .select()
            .from(schema.messages)
            .where(
              or(
                eq(schema.messages.senderId, String(userId)),
                eq(schema.messages.receiverId, String(userId))
              )
            )
            .orderBy(schema.messages.timestamp);
        } else {
          results.messages = [];
        }
      } catch {
        results.messages = [];
      }

      // Sanitize: remove passwords from employees, parse sector JSON
      results.employees = results.employees?.map((emp: any) => {
        const { password, ...rest } = emp;
        return { ...rest, sector: sanitizeSector(emp.sector) };
      }) || [];

      return results;
    } catch (err: any) {
      console.error('[Sync Error]:', err.message);
      return reply.status(500).send({ error: 'Erro ao carregar ecossistema de dados.' });
    }
  });

  // =============================================================
  // Employees CRUD
  // =============================================================
  fastify.get('/api/employees', {
    schema: { description: 'Listar funcionários', tags: ['Employees'] },
  }, async () => {
    const rows = await (db as any)
      .select()
      .from(schema.employees)
      .orderBy(schema.employees.name);

    return rows.map((emp: any) => {
      const { password, ...rest } = emp;
      return { ...rest, sector: sanitizeSector(emp.sector) };
    });
  });

  fastify.post('/api/employees', {
    schema: { description: 'Criar funcionário', tags: ['Employees'] },
  }, async (request, reply) => {
    const data = createEmployeeSchema.parse(request.body);
    const hashedPassword = bcrypt.hashSync(data.password || '123456', 10);

    const result = await (db as any)
      .insert(schema.employees)
      .values({ ...data, password: hashedPassword })
      .returning();

    const { password, ...employee } = result[0];
    const sanitized = { ...employee, sector: sanitizeSector(employee.sector) };
    broadcastAll('entity-update', { entity: 'employees', action: 'create', data: sanitized });

    return sanitized;
  });

  fastify.put('/api/employees/:id', {
    schema: { description: 'Atualizar funcionário', tags: ['Employees'] },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = updateEmployeeSchema.parse(request.body);

    if (data.password) {
      data.password = bcrypt.hashSync(data.password, 10);
    }

    const result = await (db as any)
      .update(schema.employees)
      .set(data)
      .where(eq(schema.employees.id, Number(id)))
      .returning();

    if (!result.length) {
      return reply.status(404).send({ message: 'Funcionário não encontrado.' });
    }

    const { password, ...employee } = result[0];
    broadcastAll('entity-update', { entity: 'employees', action: 'update', data: { ...employee, sector: sanitizeSector(employee.sector) } });

    return employee;
  });

  fastify.delete('/api/employees/:id', {
    schema: { description: 'Deletar funcionário (soft-delete ou hard se ROOT)', tags: ['Employees'] },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = request.user as any;

    if (user?.role === 'Desenvolvedor Global' || user?.role === 'root') {
      await (db as any)
        .delete(schema.employees)
        .where(eq(schema.employees.id, Number(id)));
      broadcastAll('entity-update', { entity: 'employees', action: 'delete', data: { id: Number(id) } });
    } else {
      await (db as any)
        .update(schema.employees)
        .set({ status: 'Desativado' })
        .where(eq(schema.employees.id, Number(id)));
      broadcastAll('entity-update', { entity: 'employees', action: 'update', data: { id: Number(id), status: 'Desativado' } });
    }

    return { success: true };
  });

  // =============================================================
  // Vehicles
  // =============================================================
  fastify.get('/api/vehicles', {
    schema: { description: 'Listar veículos', tags: ['Vehicles'] },
  }, async () => {
    return (db as any).select().from(schema.vehicles).orderBy(schema.vehicles.id);
  });

  fastify.post('/api/vehicles', {
    schema: { description: 'Criar veículo', tags: ['Vehicles'] },
  }, async (request, reply) => {
    const data = createVehicleSchema.parse(request.body);
    const result = await (db as any)
      .insert(schema.vehicles)
      .values(data)
      .returning();
    broadcastAll('entity-update', { entity: 'vehicles', action: 'create', data: result[0] });
    return result[0];
  });

  fastify.put('/api/vehicles/:id', {
    schema: { description: 'Atualizar veículo', tags: ['Vehicles'] },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = updateVehicleSchema.parse(request.body);

    const result = await (db as any)
      .update(schema.vehicles)
      .set(data)
      .where(eq(schema.vehicles.id, Number(id)))
      .returning();

    if (!result.length) {
      return reply.status(404).send({ message: 'Veículo não encontrado.' });
    }

    broadcastAll('entity-update', { entity: 'vehicles', action: 'update', data: result[0] });
    return result[0];
  });

  // =============================================================
  // Refuelings
  // =============================================================
  fastify.get('/api/refuelings', {
    schema: { description: 'Listar abastecimentos', tags: ['Refuelings'] },
  }, async () => {
    return (db as any)
      .select()
      .from(schema.refuelings)
      .orderBy(desc(schema.refuelings.date))
      .limit(100);
  });

  fastify.post('/api/refuelings', {
    schema: { description: 'Registrar abastecimento', tags: ['Refuelings'] },
  }, async (request, reply) => {
    const data = createRefuelingSchema.parse(request.body);
    const result = await (db as any)
      .insert(schema.refuelings)
      .values(data)
      .returning();
    broadcastAll('entity-update', { entity: 'refuelings', action: 'create', data: result[0] });
    return result[0];
  });

  // =============================================================
  // Messages (Chat)
  // =============================================================
  fastify.get('/api/messages', {
    schema: { description: 'Listar mensagens do usuário', tags: ['Messages'] },
  }, async (request) => {
    const user = request.user as any;
    return (db as any)
      .select()
      .from(schema.messages)
      .where(
        or(
          eq(schema.messages.senderId, String(user.id)),
          eq(schema.messages.receiverId, String(user.id))
        )
      )
      .orderBy(schema.messages.timestamp);
  });

  fastify.post('/api/messages', {
    schema: { description: 'Enviar mensagem', tags: ['Messages'] },
  }, async (request, reply) => {
    const user = request.user as any;
    const { receiverId, content } = sendMessageSchema.parse(request.body);

    const result = await (db as any)
      .insert(schema.messages)
      .values({ senderId: String(user.id), receiverId, content })
      .returning();

    // Notificar destinatário via WebSocket
    broadcastAll('entity-update', { entity: 'messages', action: 'create', data: result[0] });
    broadcastAll('notification', {
      id: 'notif-' + Date.now(),
      type: 'message',
      title: 'Nova Mensagem',
      message: `${user.name} enviou: "${content.substring(0, 60)}${content.length > 60 ? '...' : ''}"`,
      timestamp: new Date().toISOString(),
      read: false,
      link: '/chat',
    });

    return result[0];
  });

  // =============================================================
  // Vehicle Requests
  // =============================================================
  fastify.post('/api/requests', {
    schema: { description: 'Criar solicitação de veículo', tags: ['Requests'] },
  }, async (request, reply) => {
    const user = request.user as any;
    const data = createRequestSchema.parse(request.body);

    const result = await (db as any)
      .insert(schema.vehicleRequests)
      .values({ ...data, requester: user.name })
      .returning();

    // Notificar via WebSocket com notificação de alerta
    const sectorList = data.sector ? (Array.isArray(data.sector) ? data.sector : [data.sector]) : [];
    const notifPayload = {
      id: 'notif-' + Date.now(),
      type: 'request',
      title: 'Nova Solicitação de Viagem',
      message: `${user.name} solicitou "${data.title}"`,
      priority: data.priority || 'Média',
      timestamp: new Date().toISOString(),
      read: false,
      link: '/viagens',
    };
    const entityPayload = { entity: 'vehicleRequests', action: 'create', data: result[0] };

    if (sectorList.length > 0) {
      broadcastToSector('notification', sectorList, notifPayload);
      broadcastToSector('entity-update', sectorList, entityPayload);
    } else {
      broadcastAll('notification', notifPayload);
      broadcastAll('entity-update', entityPayload);
    }

    return { success: true, id: result[0].id };
  });

  // =============================================================
  // Analytics
  // =============================================================
  fastify.get('/api/analytics/telemetry', {
    schema: { description: 'Dados de telemetria para gráficos', tags: ['Analytics'] },
  }, async () => {
    try {
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

      const refuelingStats = await (db as any)
        .select({
          month: sql`strftime('%m', date)`.as('month_num'),
          totalSpent: sql`SUM(total_value)`.as('total_spent'),
          count: sql`COUNT(*)`.as('count'),
        })
        .from(schema.refuelings)
        .groupBy(sql`month_num`)
        .orderBy(sql`month_num ASC`);

      if (!refuelingStats || refuelingStats.length === 0) {
        return [];
      }

      return refuelingStats.map((r: any) => ({
        month: months[parseInt(r.month) - 1] || '???',
        cost: Number(r.totalSpent) || 0,
        volume: Number(r.count) || 0,
      }));
    } catch (err: any) {
      console.warn('[Analytics Fallback]', err.message);
      return [];
    }
  });
}
