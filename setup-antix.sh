#!/bin/bash

# --- CityMotion antiX Automation Script ---
# Este script instala o Docker, configura permissões e cria um atalho de desktop.

# Cores para o terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== CityMotion: Iniciando Configuração para antiX ===${NC}"

# 1. Verificar se é root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Por favor, execute como root (use sudo ./setup-antix.sh)${NC}"
  exit
fi

# 2. Atualizar repositórios e instalar dependências básicas
echo -e "${BLUE}[1/6] Atualizando pacotes e instalando dependências...${NC}"
apt-get update
apt-get install -y ca-certificates curl gnupg lsb-release

# 3. Adicionar chave GPG oficial do Docker e Repositório
echo -e "${BLUE}[2/6] Configurando repositório Docker...${NC}"
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. Instalar Docker
echo -e "${BLUE}[3/6] Instalando Docker Engine...${NC}"
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 5. Configurar usuário (permitir rodar docker sem sudo)
echo -e "${BLUE}[4/6] Configurando permissões do usuário...${NC}"
USER_NAME=$(logname)
usermod -aG docker $USER_NAME
echo -e "${GREEN}Usuário $USER_NAME adicionado ao grupo docker.${NC}"

# 6. Preparar o container do CityMotion
echo -e "${BLUE}[5/6] Construindo imagem Docker do CityMotion (isso pode demorar)...${NC}"
# Assume que o script está na raiz do projeto
PROJECT_DIR=$(pwd)
docker build -t citymotion-app .

# 7. Criar Atalho na Área de Trabalho
echo -e "${BLUE}[6/6] Criando atalho na área de trabalho...${NC}"
DESKTOP_DIR="/home/$USER_NAME/Desktop"
LAUNCHER_PATH="/home/$USER_NAME/.citymotion-launcher.sh"

# Criar script oculto de inicialização
cat <<EOF > $LAUNCHER_PATH
#!/bin/bash
# Script para rodar o container e abrir o navegador
docker stop citymotion-instance 2>/dev/null
docker rm citymotion-instance 2>/dev/null
docker run -d --name citymotion-instance -p 9002:9002 -p 3001:3001 citymotion-app
echo "Aguardando inicialização..."
sleep 5
xdg-open http://localhost:9002
EOF

chmod +x $LAUNCHER_PATH
chown $USER_NAME:$USER_NAME $LAUNCHER_PATH

# Criar o arquivo .desktop
cat <<EOF > "$DESKTOP_DIR/CityMotion.desktop"
[Desktop Entry]
Version=1.0
Type=Application
Name=CityMotion Test
Comment=Rodar testes do CityMotion no Docker
Exec=$LAUNCHER_PATH
Icon=view-refresh
Terminal=true
Categories=Development;
EOF

chmod +x "$DESKTOP_DIR/CityMotion.desktop"
chown $USER_NAME:$USER_NAME "$DESKTOP_DIR/CityMotion.desktop"

echo -e "${GREEN}=== CONFIGURAÇÃO CONCLUÍDA! ===${NC}"
echo -e "${BLUE}1. Reinicie o sistema ou faça logout para as permissões do Docker entrarem em vigor.${NC}"
echo -e "${BLUE}2. Clique no ícone 'CityMotion' na sua área de trabalho para rodar o sistema.${NC}"
