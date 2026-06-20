
# Estágio de construção e execução otimizado para economia de espaço
FROM node:20-slim AS builder

# Instala dependências de compilação necessárias para o SQLite3 no Linux
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia apenas os arquivos de dependências primeiro
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/

# Instala dependências (incluindo as de build para o sqlite)
RUN npm install
RUN cd backend && npm install

# Copia o restante do código
COPY . .

# Gera o build do Next.js
RUN npm run build

# Remove dependências de desenvolvimento para economizar espaço
RUN npm prune --production

EXPOSE 9002
EXPOSE 3001

# Script de inicialização para rodar ambos os serviços
CMD ["sh", "-c", "cd backend && npm start & npm start"]
