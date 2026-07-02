# =============================================================
# CityMotion - Dockerfile Multi-Estágio (Render + Local)
# =============================================================

# ---- Estágio 1: Dependências ----
FROM node:20-slim AS deps
WORKDIR /app

# Instalar dependências de build para módulos nativos
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY backend/package*.json ./backend/
RUN npm install
RUN cd backend && npm install

# ---- Estágio 2: Build ----
FROM node:20-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ---- Estágio 3: Produção ----
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Apenas runtime necessário (sem python/g++ em produção)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/src/data/database.sql ./src/data/database.sql
COPY --from=builder /app/.env.example ./.env.example

# Portas: Frontend (9002) e Backend (3001)
EXPOSE 9002 3001

# Script de entrada único (Render usa apenas o backend como entrypoint)
# O frontend Next.js será servido pelo backend em produção
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["production"]
