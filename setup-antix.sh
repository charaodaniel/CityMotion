#!/bin/bash

# --- CityMotion antiX Automation Script (8GB Flash Drive Optimized) ---

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=== CityMotion: Configurando para Pendrive 8GB ===${NC}"

if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Por favor, execute como root (sudo ./setup-antix.sh)${NC}"
  exit
fi

# 1. Instalar Docker se não existir
if ! command -v docker &> /dev/null; then
    echo -e "${BLUE}[1/5] Instalando Docker Engine...${NC}"
    apt-get update
    apt-get install -y ca-certificates curl gnupg lsb-release
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
else
    echo -e "${GREEN}[OK] Docker já instalado.${NC}"
fi

# 2. Configurar Usuário
USER_NAME=$(logname)
usermod -aG docker $USER_NAME

# 3. Preparar Pastas de Persistência
PROJECT_DIR=$(pwd)
mkdir -p "$PROJECT_DIR/backend/database"
chown -R $USER_NAME:$USER_NAME "$PROJECT_DIR/backend/database"

# 4. Construção Otimizada
echo -e "${BLUE}[3/5] Construindo Imagem CityMotion...${NC}"
docker compose build

# 5. Criar Lançador no Desktop
DESKTOP_DIR="/home/$USER_NAME/Desktop"
LAUNCHER_PATH="/home/$USER_NAME/.citymotion-launcher.sh"

cat <<EOF > $LAUNCHER_PATH
#!/bin/bash
cd "$PROJECT_DIR"
echo "Limpando instâncias anteriores..."
docker compose down
echo "Iniciando CityMotion (Front + Back)..."
docker compose up -d
echo "Aguardando Kernel carregar..."
sleep 10
xdg-open http://localhost:9002
EOF

chmod +x $LAUNCHER_PATH
chown $USER_NAME:$USER_NAME $LAUNCHER_PATH

cat <<EOF > "$DESKTOP_DIR/CityMotion.desktop"
[Desktop Entry]
Version=1.0
Type=Application
Name=CityMotion
Comment=Gestão de Frota (Persistente)
Exec=$LAUNCHER_PATH
Icon=drive-removable-media
Terminal=true
Categories=Development;
EOF

chmod +x "$DESKTOP_DIR/CityMotion.desktop"
chown $USER_NAME:$USER_NAME "$DESKTOP_DIR/CityMotion.desktop"

echo -e "${GREEN}=== CONFIGURAÇÃO CONCLUÍDA! ===${NC}"
echo -e "${BLUE}Dica: Reinicie o antiX para aplicar as permissões do Docker.${NC}"
