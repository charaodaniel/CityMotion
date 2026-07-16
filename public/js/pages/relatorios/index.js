/**
 * CityMotion — Página: Relatórios (Inteligência & Analytics)
 * Orquestração: estado, render, Store subscriptions
 *
 * HTML puro extraído para modals.js
 */
import { renderHeader, renderStatsCards, renderCostChart, renderVolumeChart } from './modals.js';

export default function ReportsPage(container, Store) {
  // Dados de telemetria estáticos (mesmo do charts.json)
  const telemetryData = [
    { month: 'Janeiro', cost: 12400, volume: 186 },
    { month: 'Fevereiro', cost: 15300, volume: 305 },
    { month: 'Março', cost: 11200, volume: 237 },
    { month: 'Abril', cost: 14500, volume: 273 },
    { month: 'Maio', cost: 13100, volume: 209 },
    { month: 'Junho', cost: 14800, volume: 214 },
  ];
  const maxCost = Math.max(...telemetryData.map(d => d.cost));
  const maxVolume = Math.max(...telemetryData.map(d => d.volume));

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

  // ── Init ─────────────────────────────────────────────────
  const unsub = Store.on('schedules', render);
  render();

  return () => { unsub(); };
}
