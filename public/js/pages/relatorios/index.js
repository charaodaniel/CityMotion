/**
 * CityMotion — Página: Relatórios (Inteligência & Analytics)
 * Orquestração: estado, render, Store subscriptions
 *
 * HTML puro extraído para modals.js
 */
import { renderHeader, renderStatsCards, renderCostChart, renderVolumeChart } from './modals.js';

export default function ReportsPage(container, Store, API) {
  // Dados de telemetria (fallback hardcoded se API falhar)
  const FALLBACK_DATA = [
    { month: 'Janeiro', cost: 12400, volume: 186 },
    { month: 'Fevereiro', cost: 15300, volume: 305 },
    { month: 'Março', cost: 11200, volume: 237 },
    { month: 'Abril', cost: 14500, volume: 273 },
    { month: 'Maio', cost: 13100, volume: 209 },
    { month: 'Junho', cost: 14800, volume: 214 },
  ];

  let telemetryData = FALLBACK_DATA;
  let maxCost = Math.max(...telemetryData.map(d => d.cost));
  let maxVolume = Math.max(...telemetryData.map(d => d.volume));

  // ── Render ───────────────────────────────────────────────
  function render() {
    const schedules = Store.get('schedules') || [];
    const totalTrips = schedules.filter(s => s.status === 'Concluída').length;
    const totalMileage = schedules.reduce((acc, s) => acc + ((s.endMileage || 0) - (s.startMileage || 0)), 0);

    container.innerHTML = `
      <div class="animate-fade-in space-y-8">
        ${renderHeader()}
        ${renderStatsCards(totalTrips, totalMileage)}

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          ${renderCostChart(telemetryData, maxCost)}
          ${renderVolumeChart(telemetryData, maxVolume)}
        </div>
      </div>`;
  }

  // ── Carregar telemetria da API ──────────────────────────
  async function loadTelemetry() {
    try {
      const data = await API.get('/api/analytics/telemetry');
      if (data && data.length > 0) {
        telemetryData = data;
        maxCost = Math.max(...data.map(d => d.cost));
        maxVolume = Math.max(...data.map(d => d.volume));
      }
    } catch (err) {
      console.warn('[Relatorios] API telemetry indisponível, usando dados estáticos:', err.message);
    }
    render();
  }

  // ── Init ─────────────────────────────────────────────────
  const unsub = Store.on('schedules', render);
  loadTelemetry();

  return () => { unsub(); };
}
