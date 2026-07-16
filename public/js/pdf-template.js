/**
 * CityMotion — Aplicador de Template de Relatórios
 *
 * Aplica as configurações salvas (logo, cores, cabeçalho, rodapé)
 * a qualquer documento jsPDF gerado no sistema.
 *
 * Uso:
 *   const doc = new jsPDF('portrait', 'mm', 'a4');
 *   const tmpl = await fetchReportTemplate();
 *   applyReportTemplate(doc, tmpl, { title: 'Relatório de Viagens', sector: 'Obras' });
 *   // ... conteúdo do relatório ...
 *   doc.save('relatorio.pdf');
 */

import { hexToRgb as sharedHexToRgb } from '/js/color-utils.js';

const REP_TEMPLATE_CACHE_KEY = 'citymotion_report_template';
let _templateCache = null;

/**
 * Busca o template salvo via API (com cache em memória).
 */
export async function fetchReportTemplate() {
  if (_templateCache) return _templateCache;

  try {
    const token = localStorage.getItem('citymotion_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/report-template', { headers });
    if (res.ok) {
      _templateCache = await res.json();
      return _templateCache;
    }
  } catch (e) {
    console.warn('[PDF Template] Erro ao buscar template:', e);
  }

  // Fallback: template padrão
  return getDefaultTemplate();
}

/**
 * Limpa o cache do template (útil após salvar novo template).
 */
export function clearTemplateCache() {
  _templateCache = null;
}

/**
 * Retorna o template padrão.
 */
function getDefaultTemplate() {
  return {
    headerTitle: 'CityMotion',
    headerSubtitle: 'Gestão Inteligente de Frotas',
    headerExtra: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e293b',
    accentColor: '#10b981',
    footerText: 'CityMotion — Mobilidade, transparência e eficiência.',
    footerExtra: '',
    sectorName: '',
    sectorDepartment: '',
    headerLogo: '',
    headerLogoSecondary: '',
  };
}

/**
 * Aplica o template a um documento jsPDF.
 *
 * @param {object} doc - Instância do jsPDF
 * @param {object} tmpl - Template salvo (ou padrão)
 * @param {object} opts - Opções:
 *   - title: Título do relatório (ex: "Relatório de Viagens")
 *   - subtitle: Subtítulo opcional
 *   - sector: Nome do setor para exibir
 *   - showFooter: Se deve mostrar rodapé (default: true)
 *   - showHeader: Se deve mostrar cabeçalho (default: true)
 *   - headerHeight: Altura do cabeçalho em mm (default: 40)
 *   - footerHeight: Altura do rodapé em mm (default: 15)
 */
export function applyReportTemplate(doc, tmpl = null, opts = {}) {
  const t = tmpl || getDefaultTemplate();
  const {
    title = '',
    subtitle = '',
    sector = '',
    showFooter = true,
    showHeader = true,
    headerHeight = 40,
    footerHeight = 15,
  } = opts;

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Converter cores hex para RGB
  const primary = hexToRgb(t.primaryColor || '#3b82f6');
  const secondary = hexToRgb(t.secondaryColor || '#1e293b');
  const accent = hexToRgb(t.accentColor || '#10b981');

  // ── Cabeçalho ────────────────────────────────────────────
  if (showHeader) {
    // Barra superior colorida
    doc.setFillColor(primary.r, primary.g, primary.b);
    doc.rect(0, 0, pageWidth, 3, 'F');

    // Fundo do cabeçalho
    doc.setFillColor(secondary.r, secondary.g, secondary.b);
    doc.rect(0, 3, pageWidth, headerHeight - 3, 'F');

    // Logo (se disponível)
    let logoX = margin;
    if (t.headerLogo) {
      try {
        const logoWidth = 30;
        const logoHeight = 12;
        doc.addImage(t.headerLogo, 'JPEG', logoX, 8, logoWidth, logoHeight);
        logoX += logoWidth + 6;
      } catch (e) {
        // Se falhar ao adicionar imagem, continua sem logo
        console.warn('[PDF] Erro ao adicionar logo:', e.message);
      }
    }

    // Título
    doc.setTextColor(primary.r, primary.g, primary.b);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(t.headerTitle || 'CityMotion', logoX, 14);

    // Subtítulo do template
    if (t.headerSubtitle) {
      doc.setTextColor(200, 200, 210);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(t.headerSubtitle, logoX, 20);
    }

    // Nome do setor (se fornecido)
    if (sector || t.sectorName) {
      const sectorName = sector || t.sectorName;
      doc.setTextColor(accent.r, accent.g, accent.b);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text(sectorName, pageWidth - margin, 14, { align: 'right' });
      if (t.sectorDepartment) {
        doc.setFontSize(6);
        doc.setTextColor(180, 180, 190);
        doc.text(t.sectorDepartment, pageWidth - margin, 19, { align: 'right' });
      }
    }

    // Título do relatório
    if (title) {
      doc.setTextColor(180, 180, 190);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(title, pageWidth - margin, headerHeight - 6, { align: 'right' });
    }
  }

  // ── Rodapé ───────────────────────────────────────────────
  if (showFooter) {
    // Linha separadora
    doc.setDrawColor(primary.r, primary.g, primary.b);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - footerHeight, pageWidth - margin, pageHeight - footerHeight);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(160, 160, 170);

    // Texto do rodapé
    let footerY = pageHeight - footerHeight + 4;
    if (t.footerText) {
      doc.text(t.footerText, margin, footerY);
      footerY += 4;
    }
    if (t.footerExtra) {
      doc.setFontSize(6);
      doc.setTextColor(150, 150, 160);
      const lines = t.footerExtra.split('\n');
      lines.forEach((line, i) => {
        doc.text(line.trim(), margin, footerY + (i * 3));
      });
    }

    // Paginação
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(6);
      doc.setTextColor(150, 150, 160);
      doc.text(
        `Página ${i} de ${pageCount}`,
        pageWidth - margin,
        pageHeight - 4,
        { align: 'right' }
      );
    }
  }
}

/**
 * Converte cor hex (#fff, #ffffff) para RGB.
 * Delega ao módulo compartilhado.
 */
function hexToRgb(hex) {
  return sharedHexToRgb(hex);
}
