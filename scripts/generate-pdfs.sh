#!/bin/bash
# =============================================================
# CityMotion - Gerar PDFs dos Documentos de Negócio
# =============================================================
# Requer: pandoc + wkhtmltopdf ou Google Chrome
#
# Uso: bash scripts/generate-pdfs.sh
# =============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$PROJECT_DIR/docs/presentation"

mkdir -p "$OUTPUT_DIR"

echo "=== Gerando PDFs dos Documentos de Negócio ==="

# Detectar engine PDF disponível
if which wkhtmltopdf &>/dev/null; then
  ENGINE="wkhtmltopdf"
elif which google-chrome-stable &>/dev/null; then
  ENGINE="chrome"
elif which chromium &>/dev/null; then
  ENGINE="chrome"
else
  echo "⚠️ Nenhum engine PDF encontrado. Instale wkhtmltopdf ou Chrome."
  echo "  sudo apt-get install -y wkhtmltopdf"
  echo "Ou abra os arquivos .html no navegador e use 'Imprimir > Salvar como PDF'"
  exit 1
fi

echo "Engine detectada: $ENGINE"

# Função para gerar PDF a partir de HTML
function generate_pdf() {
  local html_file="$1"
  local pdf_file="$2"
  
  if [ "$ENGINE" = "wkhtmltopdf" ]; then
    wkhtmltopdf --page-size A4 --margin-top 15mm --margin-bottom 15mm \
      --margin-left 15mm --margin-right 15mm \
      "$html_file" "$pdf_file" 2>&1 | tail -2
  elif [ "$ENGINE" = "chrome" ]; then
    CHROME=$(which google-chrome-stable 2>/dev/null || which chromium 2>/dev/null)
    "$CHROME" --headless --disable-gpu --no-sandbox --disable-dev-shm-usage \
      --print-to-pdf="$pdf_file" --no-margins "file://$html_file" 2>/dev/null
  fi
  
  if [ -f "$pdf_file" ]; then
    echo "✅ Gerado: $pdf_file"
  else
    echo "❌ Falha ao gerar: $pdf_file"
  fi
}

# Gerar HTML dos markdowns (se ainda não existirem)
if [ ! -f "$OUTPUT_DIR/plano-de-negocios.html" ]; then
  echo "Gerando HTML..."
  pandoc "$PROJECT_DIR/docs/business/03-plano-de-negocios.md" -o "$OUTPUT_DIR/plano-de-negocios.html"
  pandoc "$PROJECT_DIR/docs/business/02-apresentacao-cliente.md" -o "$OUTPUT_DIR/apresentacao-cliente.html"
fi

# Gerar PDFs
generate_pdf "$OUTPUT_DIR/plano-de-negocios.html" "$OUTPUT_DIR/plano-de-negocios.pdf"
generate_pdf "$OUTPUT_DIR/apresentacao-cliente.html" "$OUTPUT_DIR/apresentacao-cliente.pdf"

echo ""
echo "=== PDFs gerados em: $OUTPUT_DIR ==="
ls -la "$OUTPUT_DIR"/*.pdf 2>/dev/null
echo ""
echo "💡 Dica: Os arquivos .html podem ser abertos no navegador e impressos como PDF."
