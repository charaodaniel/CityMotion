import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq, or } from 'drizzle-orm';
import { getDb, getSchema } from '../db';
import { getEnv } from '../config/env';
import { loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas';
import { sendPasswordResetEmail } from '../../services/emailService.js';

export async function authRoutes(fastify: FastifyInstance) {
  const db = getDb();
  const schema = getSchema();

  // POST /api/login
  fastify.post('/api/login', {
    schema: {
      description: 'Autenticação de usuário',
      tags: ['Auth'],
      body: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
        },
        required: ['email', 'password'],
      },
    },
  }, async (request, reply) => {
    const { email, password } = loginSchema.parse(request.body);
    const isTerminalRequest = request.headers['x-nexus-terminal'] === 'true';

    const users = await (db as any)
      .select()
      .from(schema.employees)
      .where(
        or(
          eq(schema.employees.email, email),
          eq(schema.employees.matricula, email),
          eq(schema.employees.phone, email)
        )
      )
      .limit(1);

    const user = users[0];

    if (!user) {
      return reply.status(404).send({ message: 'Usuário não encontrado no sistema.' });
    }

    if (user.isDemo === 1 && !isTerminalRequest) {
      return reply.status(403).send({
        message: 'ACESSO NEGADO: Este perfil de demonstração só pode ser acessado via Terminal NexusOS.',
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return reply.status(401).send({ message: 'Senha incorreta para o identificador fornecido.' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role, sector: user.sector, is_demo: user.isDemo },
      getEnv().JWT_SECRET,
      { expiresIn: '8h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    console.log(`[Auth] Login OK: ${user.name} ${user.isDemo ? '(DEMO MODE)' : ''}`);

    return { token, user: userWithoutPassword };
  });

  // POST /api/forgot-password
  fastify.post('/api/forgot-password', {
    schema: {
      description: 'Solicitar recuperação de senha',
      tags: ['Auth'],
      body: {
        type: 'object',
        properties: { email: { type: 'string' } },
        required: ['email'],
      },
    },
  }, async (request, reply) => {
    const { email } = forgotPasswordSchema.parse(request.body);

    const users = await (db as any)
      .select()
      .from(schema.employees)
      .where(eq(schema.employees.email, email))
      .limit(1);

    const user = users[0];
    if (!user) {
      return reply.status(200).send({ message: 'Se o email existir, você receberá um código de recuperação.' });
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    await (db as any)
      .update(schema.employees)
      .set({ resetToken: code })
      .where(eq(schema.employees.id, user.id));

    await sendPasswordResetEmail(email, user.name, code);

    return { message: 'Se o email existir, você receberá um código de recuperação.' };
  });

  // POST /api/reset-password
  fastify.post('/api/reset-password', {
    schema: {
      description: 'Redefinir senha com token',
      tags: ['Auth'],
    },
  }, async (request, reply) => {
    const { token, password } = resetPasswordSchema.parse(request.body);

    const users = await (db as any)
      .select()
      .from(schema.employees)
      .where(eq(schema.employees.resetToken, token))
      .limit(1);

    const user = users[0];
    if (!user) {
      return reply.status(400).send({ message: 'Token inválido ou expirado.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await (db as any)
      .update(schema.employees)
      .set({ password: hashedPassword, resetToken: null })
      .where(eq(schema.employees.id, user.id));

    return { message: 'Senha redefinida com sucesso.' };
  });
}
