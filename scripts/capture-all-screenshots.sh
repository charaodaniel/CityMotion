#!/bin/bash
# Capture screenshots of all 12 CityMotion pages
set -e

PROJECT_DIR="/home/daniel/Documents/CityMotion"
SCREENSHOTS_DIR="$PROJECT_DIR/screenshots"
PUBLIC_DIR="$PROJECT_DIR/public"
CHROME="google-chrome"

# Kill any existing server on port 9002
fuser -k 9002/tcp 2>/dev/null || true
sleep 1

# Create screenshots directory
mkdir -p "$SCREENSHOTS_DIR"

# Start static server in background
cd "$PUBLIC_DIR"
python3 -m http.server 9002 &
SERVER_PID=$!
sleep 2

# Verify server is running
if ! curl -s -o /dev/null -w '%{http_code}' http://localhost:9002/index.html 2>/dev/null | grep -q 200; then
  echo "ERROR: Server not running!"
  exit 1
fi

echo "=== Server OK, starting screenshots ==="

# Array of routes to capture
declare -A PAGES
PAGES=(
  ["01-login"]="/index.html"
  ["02-dashboard"]="/screenshot-bypass.html#/dashboard"
  ["03-viagens"]="/screenshot-bypass.html#/viagens"
  ["04-veiculos"]="/screenshot-bypass.html#/veiculos"
  ["05-funcionarios"]="/screenshot-bypass.html#/funcionarios"
  ["06-setores"]="/screenshot-bypass.html#/setores"
  ["07-abastecimento"]="/screenshot-bypass.html#/abastecimento"
  ["08-manutencao"]="/screenshot-bypass.html#/manutencao"
  ["09-escalas"]="/screenshot-bypass.html#/escalas"
  ["10-chat"]="/screenshot-bypass.html#/chat"
  ["11-relatorios"]="/screenshot-bypass.html#/relatorios"
  ["12-perfil"]="/screenshot-bypass.html#/perfil"
  ["13-settings"]="/screenshot-bypass.html#/settings"
)

# Capture each page
for name in "${!PAGES[@]}"; do
  url="http://localhost:9002${PAGES[$name]}"
  output="$SCREENSHOTS_DIR/${name}.png"
  
  echo "Capturing $name... ($url)"
  
  $CHROME --headless=new --no-sandbox --disable-gpu \
    --window-size=1440,900 \
    --screenshot="$output" \
    "$url" 2>/dev/null || echo "  WARN: Chrome exit code $?"
  
  # Verify file was created
  if [ -f "$output" ]; then
    size=$(stat -c%s "$output" 2>/dev/null || stat -f%z "$output" 2>/dev/null)
    echo "  OK: $(echo $size | numfmt --to=iec 2>/dev/null || echo $size bytes)"
  else
    echo "  FAIL: Screenshot not created"
  fi
  
  # Small delay between captures
  sleep 1
done

# Cleanup
kill $SERVER_PID 2>/dev/null || true
fuser -k 9002/tcp 2>/dev/null || true

echo ""
echo "=== All screenshots captured ==="
echo "Location: $SCREENSHOTS_DIR"
ls -lh "$SCREENSHOTS_DIR"/*.png 2>/dev/null | awk '{print NR". "$5" - "$9}'
echo ""
echo "Total: $(ls -1 "$SCREENSHOTS_DIR"/*.png 2>/dev/null | wc -l) screenshots"
