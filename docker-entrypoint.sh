#!/bin/sh
# =============================================================
# CityMotion - Docker Entrypoint
# =============================================================
# Inicializa o banco de dados e inicia os serviços.
# Suporta dois modos:
#   production  → Inicia frontend (Next.js) + backend (Express)
#   backend     → Apenas backend (usado no Render)
# =============================================================

set -e

MODE="${1:-production}"

echo "=== CityMotion - Iniciando NexusOS Ecosystem ==="
echo "Modo: $MODE"

# Inicializar banco de dados (SQLite ou PostgreSQL)
echo "[Nexus-Core] Inicializando banco de dados..."
cd /app/backend
node database/init_db.js
cd /app

if [ "$MODE" = "backend" ] || [ "$MODE" = "production" ]; then
    echo "[Backend] Iniciando servidor Express na porta ${PORT:-3001}..."
    node backend/server.js &
    BACKEND_PID=$!
fi

if [ "$MODE" = "production" ]; then
    echo "[Frontend] Iniciando Next.js na porta 9002..."
    npx next start -p 9002 &
    FRONTEND_PID=$!
fi

# Trap para shutdown gracioso
trap "echo 'Parando serviços...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGTERM SIGINT

# Aguardar qualquer processo
wait
