import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';
import { getEnv } from '../config/env';

export interface JwtPayload {
  id: number;
  name: string;
  role: string;
  sector: string;
  is_demo: number;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

/**
 * Plugin de autenticação JWT para Fastify
 * Verifica o token Bearer no header Authorization
 */
async function authPlugin(fastify: FastifyInstance) {
  fastify.decorateRequest('user', undefined);

  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return reply.status(401).send({ message: 'Token de autenticação não fornecido.' });
    }

    try {
      const decoded = jwt.verify(token, getEnv().JWT_SECRET) as JwtPayload;
      request.user = decoded;
    } catch (err) {
      return reply.status(403).send({ message: 'Sessão expirada ou token inválido.' });
    }
  });
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default fp(authPlugin, {
  name: 'auth',
});
