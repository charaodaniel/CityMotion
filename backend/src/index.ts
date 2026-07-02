#!/usr/bin/env tsx
/**
 * CityMotion Backend — Fastify + Drizzle + Zod
 *
 * Modos de execução:
 *   desenvolvimento: node --watch src/index.ts (ou tsx src/index.ts)
 *   produção:        node dist/index.js (após build)
 *
 * Variáveis de ambiente (ver .env.example):
 *   DATABASE_URL  → vazio = SQLite, preenchido = PostgreSQL
 *   JWT_SECRET    → obrigatório
 *   PORT          → padrão 3001
 */
import 'dotenv/config';
import { startServer } from './app';

startServer();
