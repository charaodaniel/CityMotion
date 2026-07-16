# =============================================================
# CityMotion - Dockerfile Multi-Estágio (Render + Local)
# =============================================================
# Arquitetura:
#   Frontend: SPA HTML/JS/CSS em /public (servido pelo backend)
#   Backend:  Fastify + Drizzle ORM + Socket.IO
#   Banco:    SQLite (padrão) ou PostgreSQL externo
# =============================================================

# ---- Estágio 1: Dependências ----
FROM node:20-slim AS deps
WORKDIR /app

# Instalar dependências de build para módulos nativos (better-sqlite3, bcryptjs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ curl \
    && rm -rf /var/lib/apt/lists/*

# Dependências do backend
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Dependências da raiz
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=optional

# ---- Estágio 2: Produção ----
FROM node:20-slim AS runner
WORKDIR /app

# Runtime mínimo
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copiar backend (código + node_modules)
COPY --from=deps /app/backend /app/backend

# Copiar frontend SPA (HTML/JS/CSS estático servido pelo Fastify)
COPY public /app/public

# Copiar node_modules da raiz
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/package.json /app/package.json

# Configuração de ambiente
COPY .env.example /app/.env.example

# Diretório para SQLite (persistente via volume)
RUN mkdir -p /app/database

# Porta do backend (serve API + SPA frontend)
EXPOSE 3001

# Script de entrada
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["production"]
