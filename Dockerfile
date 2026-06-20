# Usando uma imagem Node.js leve e estável
FROM node:20-slim

# Instala dependências de sistema necessárias para o SQLite3 e compilação de módulos nativos
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de definição de dependências primeiro (otimização de cache)
COPY package*.json ./
COPY backend/package*.json ./backend/

# Instala as dependências do root (frontend) e do backend
RUN npm install
RUN cd backend && npm install

# Copia o restante do código fonte
COPY . .

# Garante que o banco de dados seja inicializado no build ou na primeira execução
# Nota: O banco SQLite será persistido dentro do container ou via volume
RUN cd backend && npm run db:init

# Expõe as portas do Frontend (9002) e do Backend (3001)
EXPOSE 9002
EXPOSE 3001

# Define variáveis de ambiente padrão
ENV NODE_ENV=development
ENV JWT_SECRET=citymotion_secret_key_dev_123

# Comando para iniciar o ecossistema completo (Frontend + Backend)
# Utiliza o script 'dev' já configurado com concurrently no package.json
CMD ["npm", "run", "dev"]
