/**
 * CityMotion — Format Utilities
 * Funções compartilhadas de formatação de data e moeda
 */

/**
 * Formata uma data para o padrão brasileiro (dd/mm/aaaa)
 * @param {string|Date} date - Data a ser formatada
 * @param {object} options - Opções adicionais do toLocaleDateString
 * @returns {string} Data formatada ou '-' se inválida
 */
export function formatDate(date, options = {}) {
  if (!date) return '-';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('pt-BR', options);
  } catch {
    return '-';
  }
}

/**
 * Formata um valor monetário para BRL (R$ 1.234,56)
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado ou 'R$ 0,00' se inválido
 */
export function formatCurrency(value) {
  const num = Number(value) || 0;
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Formata um número com 2 casas decimais (sem símbolo de moeda)
 * @param {number} value - Valor a ser formatado
 * @returns {string} Número formatado ou '0,00' se inválido
 */
export function formatNumber(value) {
  const num = Number(value) || 0;
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

/**
 * Formata data + hora no padrão brasileiro
 * @param {string|Date} date - Data a ser formatada
 * @returns {string} Data e hora formatada ou '-' se inválida
 */
export function formatDateTime(date) {
  if (!date) return '-';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleString('pt-BR');
  } catch {
    return '-';
  }
}
