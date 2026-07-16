/**
 * Utilitários para manipulação de setores (sector)
 * O setor pode ser: string, array, JSON string, ou null/undefined
 * Esta função normaliza para array sempre.
 *
 * Uso:
 *   sanitizeSector("Setor A")          → ["Setor A"]
 *   sanitizeSector(["Setor A"])        → ["Setor A"]
 *   sanitizeSector('["Setor A"]')      → ["Setor A"]
 *   sanitizeSector(null)                → []
 *   sanitizeSector(undefined)           → []
 */
function sanitizeSector(sector) {
  if (!sector) return [];
  if (Array.isArray(sector)) return sector;
  try {
    const parsed = JSON.parse(sector);
    return Array.isArray(parsed) ? parsed : [sector];
  } catch {
    return [sector];
  }
}

export {
  sanitizeSector
};
