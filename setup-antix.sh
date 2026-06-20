
#!/bin/bash

# --- CityMotion antiX Automation Script (Persistent Version) ---
# Este script instala o Docker e configura a persistência de dados.

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=== CityMotion: Iniciando Configuração para antiX (Persistente) ===${NC}"

if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Por favor, execute como root (use sudo ./setup-antix.sh)${NC}"
  exit
fi

# 1. Atualizar e Instalar Docker
echo -e "${BLUE}[1/5] Instalando Docker Engine...${NC}"
apt-get update
apt-get install -y ca-certificates curl gnupg lsb-release
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 2. Permissões de Usuário
echo -e "${BLUE}[2/5] Configurando permissões do usuário...${NC}"
USER_NAME=$(logname)
usermod -aG docker $USER_NAME

# 3. Garantir diretório de banco de dados no host
PROJECT_DIR=$(pwd)
mkdir -p "$PROJECT_DIR/backend/database"
chown -R $USER_NAME:$USER_NAME "$PROJECT_DIR/backend/database"

# 4. Construir imagem
echo -e "${BLUE}[3/5] Construindo imagem Docker...${NC}"
docker build -t citymotion-app .

# 5. Criar Atalho de Desktop com Mapeamento de Volume (Persistência)
echo -e "${BLUE}[4/5] Criando atalho na área de trabalho...${NC}"
DESKTOP_DIR="/home/$USER_NAME/Desktop"
LAUNCHER_PATH="/home/$USER_NAME/.citymotion-launcher.sh"

cat <<EOF > $LAUNCHER_PATH
#!/bin/bash
# Script para rodar o container com persistência de banco de dados
echo "Iniciando CityMotion com montagem de volume para persistência..."
docker stop citymotion-instance 2>/dev/null
docker rm citymotion-instance 2>/dev/null

# O segredo da persistência está no parâmetro -v (volume)
docker run -d \\
  --name citymotion-instance \\
  -p 9002:9002 -p 3001:3001 \\
  -v "$PROJECT_DIR/backend/database:/app/backend/database" \\
  citymotion-app

echo "Aguardando 8 segundos para inicialização do Kernel..."
sleep 8
xdg-open http://localhost:9002
EOF

chmod +x $LAUNCHER_PATH
chown $USER_NAME:$USER_NAME $LAUNCHER_PATH

cat <<EOF > "$DESKTOP_DIR/CityMotion.desktop"
[Desktop Entry]
Version=1.0
Type=Application
Name=CityMotion Persistent
Comment=Rodar sistema com persistência no Pendrive
Exec=$LAUNCHER_PATH
Icon=drive-removable-media
Terminal=true
Categories=Development;
EOF

chmod +x "$DESKTOP_DIR/CityMotion.desktop"
chown $USER_NAME:$USER_NAME "$DESKTOP_DIR/CityMotion.desktop"

echo -e "${GREEN}=== CONFIGURAÇÃO CONCLUÍDA! ===${NC}"
echo -e "${BLUE}1. Reinicie o antiX para ativar as permissões do Docker.${NC}"
echo -e "${BLUE}2. O banco de dados SQLite será salvo em: $PROJECT_DIR/backend/database/${NC}"
