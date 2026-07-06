#!/bin/sh
# =============================================================
# CityMotion - Docker Entrypoint
# =============================================================
# Inicializa o banco de dados e inicia o servidor Fastify.
# Suporta dois modos:
#   production  → Inicia o servidor completo (API + SPA + WebSocket)
#   backend     → Apenas o servidor (compatível com Render)
# =============================================================

set -e

MODE="${1:-production}"

echo "=============================================="
echo "  CityMotion - NexusOS Ecosystem"
echo "  Modo: $MODE"
echo "=============================================="

# Verificar se .env existe, caso contrário copiar do exemplo
if [ ! -f /app/.env ]; then
    echo "[Setup] .env não encontrado. Copiando de .env.example..."
    cp /app/.env.example /app/.env
    # Gerar JWT_SECRET padrão para Docker local
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    echo "JWT_SECRET=$JWT_SECRET" >> /app/.env
    echo "[Setup] .env criado com JWT_SECRET gerado."
fi

# Exportar variáveis do .env para o ambiente (dotenv no seed.ts depende do cwd)
export $(grep -v '^\s*#' /app/.env | grep -v '^\s*$' | xargs) 2>/dev/null || true

# Garantir que JWT_SECRET esteja disponível (o seed.ts precisa dele via getEnv)
# Copiar .env para o diretório do backend como fallback para dotenv/config
cp /app/.env /app/backend/.env 2>/dev/null || true

# Inicializar banco de dados (seed)
echo "[Nexus-Core] Inicializando banco de dados..."
cd /app/backend
npx tsx src/db/seed.ts 2>&1 || echo "[Seed] Aviso: seed já pode ter sido executado."

# Iniciar servidor Fastify
echo "[Backend] Iniciando servidor Fastify na porta ${PORT:-3001}..."
exec npx tsx src/index.ts
