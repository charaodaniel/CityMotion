# Estágio Único para Desenvolvimento e Testes
FROM node:18-slim

# Instala dependências do sistema necessárias para compilar módulos nativos (sqlite3)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia arquivos de definição de pacotes
COPY package*.json ./
COPY backend/package*.json ./backend/

# Instala dependências (Frontend e Backend)
RUN npm install
RUN cd backend && npm install

# Copia o restante do código
COPY . .

# Expõe as portas do Frontend (9002) e Backend (3001)
EXPOSE 9002
EXPOSE 3001

# Variáveis de Ambiente padrão
ENV JWT_SECRET=citymotion-dev-secret-token-2024
ENV NODE_ENV=development

# Script de inicialização: inicializa o banco e sobe os dois serviços
CMD ["sh", "-c", "cd backend && npm run db:init && cd .. && npm run dev"]
