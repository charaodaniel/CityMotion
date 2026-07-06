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
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Carrega .env da raiz do projeto
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { startServer } from './app';

startServer();
