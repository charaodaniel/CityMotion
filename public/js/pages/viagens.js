/**
 * CityMotion — Página: Viagens (Missões)
 *
 * Refatorado em módulos dentro de ./viagens/:
 *   index.js   → Página principal (estado, geo, status, pdf, mapa, eventos)
 *   data.js    → Constantes (checklists, categorias) + loadScript/loadStylesheet
 *   modals.js  → Renderizadores de modais (HTML puro)
 *   kanban.js  → Renderizadores Kanban e Mapa (HTML puro)
 */
export { default } from './viagens/index.js';
