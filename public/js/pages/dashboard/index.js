/**
 * CityMotion — Página: Dashboard
 * Orquestração: estado, render, Store subscriptions
 *
 * HTML puro extraído para modals.js
 */
import { renderMetricsCards, renderRecentTrips } from './modals.js';

export default function DashboardPage(container, Store) {
  // ── Render ───────────────────────────────────────────────
  function render() {
    const state = Store.getState();
    const metricsGrid = document.getElementById('metricsCards');
    const content = document.getElementById('dashboardContent');

    if (metricsGrid) {
      metricsGrid.innerHTML = renderMetricsCards(
        state.schedules || [],
        state.vehicles || [],
        state.employees || [],
        state.maintenanceRequests || []
      );
    }
    if (content) {
      content.innerHTML = renderRecentTrips(state.schedules || []);
    }
  }

  // ── Init ─────────────────────────────────────────────────
  container.innerHTML = `
    <div class="animate-fade-in space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black tracking-tighter">Painel de Controle</h1>
          <p class="text-zinc-400 text-sm mt-1">Visão geral da frota e operações.</p>
        </div>
        <button onclick="Store.loadAll()" class="btn btn-outline btn-sm">
          <svg class="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Atualizar
        </button>
      </div>

      <!-- Cards de métricas -->
      <div id="metricsCards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="text-center py-8"><div class="spinner mx-auto"></div></div>
      </div>

      <!-- Conteúdo principal -->
      <div id="dashboardContent" class="text-center py-12 text-zinc-500">
        <div class="spinner mx-auto mb-4"></div>
        <p class="text-xs uppercase tracking-widest">Carregando dados...</p>
      </div>
    </div>
  `;

  const unsub1 = Store.on('schedules', render);
  const unsub2 = Store.on('vehicles', render);
  const unsub3 = Store.on('employees', render);
  const unsub4 = Store.on('maintenanceRequests', render);

  render();

  return () => {
    unsub1(); unsub2(); unsub3(); unsub4();
  };
}
