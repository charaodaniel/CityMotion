# Estágio de Dependências
FROM node:18-slim AS deps
WORKDIR /app
COPY package*.json ./
COPY backend/package*.json ./backend/
RUN npm install && cd backend && npm install

# Estágio de Build
FROM node:18-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Estágio de Produção (Pendrive Optimized)
FROM node:18-slim AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Instalar dependências para o SQLite3 nativo
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/src/data/database.sql ./src/data/database.sql

# Script de inicialização dupla
RUN echo "#!/bin/sh\n\
echo '--- Iniciando NexusOS Ecosystem ---'\n\
cd /app/backend && node server.js &\n\
cd /app && npx next start -p 9002\n\
" > /app/entrypoint.sh && chmod +x /app/entrypoint.sh

EXPOSE 9002
EXPOSE 3001

CMD ["/app/entrypoint.sh"]
