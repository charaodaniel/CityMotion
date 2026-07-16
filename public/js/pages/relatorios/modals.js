/**
 * CityMotion — Relatórios: Modais e Renderizadores HTML
 * Funções puras de renderização. Não acessam Store ou API diretamente.
 */

export function renderHeader() {
  return `
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div>
        <h1 class="text-3xl sm:text-4xl font-black tracking-tighter">Inteligência & Analytics</h1>
        <p class="text-zinc-400 text-sm mt-1 font-medium">Análise de telemetria e KPIs da frota industrial.</p>
      </div>
      <button onclick="Toast.show('Exportação PDF será integrada em breve.', 'info')" class="btn btn-primary btn-sm text-[10px]">
        <svg class="w-3.5 h-3.5 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        Exportar PDF Consolidado
      </button>
    </div>
  `;
}

export function renderStatsCards(totalTrips, totalMileage) {
  return `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="glass-card rounded-xl p-5 scanlines">
        <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
          Missões Concluídas
        </p>
        <p class="text-4xl sm:text-5xl font-black tracking-tighter text-primary mt-2">${totalTrips}</p>
        <p class="text-[10px] font-mono text-emerald-500 font-bold mt-1 uppercase">Sincronizado via Kernel</p>
      </div>
      <div class="glass-card rounded-xl p-5">
        <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          Distância Acumulada
        </p>
        <p class="text-4xl sm:text-5xl font-black tracking-tighter mt-2">${totalMileage.toLocaleString()} <span class="text-lg text-zinc-500">KM</span></p>
        <p class="text-[10px] font-mono text-zinc-600 mt-1 uppercase">Dados de telemetria real</p>
      </div>
      <div class="glass-card rounded-xl p-5">
        <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <svg class="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
          Eficiência Média
        </p>
        <p class="text-4xl sm:text-5xl font-black tracking-tighter text-emerald-500 mt-2">94.2%</p>
        <p class="text-[10px] font-mono text-emerald-500/70 font-bold mt-1 uppercase">Performance do Ecossistema</p>
      </div>
    </div>
  `;
}

export function renderCostChart(telemetryData, maxCost) {
  return `
    <div class="glass-card rounded-xl overflow-hidden">
      <div class="p-4 border-b border-zinc-800/30 bg-zinc-900/20">
        <h3 class="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <svg class="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          Histórico de Investimento em Combustível
        </h3>
      </div>
      <div class="p-5">
        <div class="flex items-end justify-between h-48 gap-2 relative" style="padding: 0 10px 25px 10px;">
          <div class="absolute bottom-[25px] left-[10px] right-[10px] h-px bg-zinc-800/50"></div>
          <div class="absolute bottom-[25px] left-[10px] right-[10px] h-full flex flex-col justify-between pointer-events-none">
            <div class="border-t border-zinc-800/20"></div>
            <div class="border-t border-zinc-800/20"></div>
            <div class="border-t border-zinc-800/20"></div>
            <div class="border-t border-zinc-800/20"></div>
          </div>
          ${telemetryData.map(d => {
            const pct = (d.cost / maxCost) * 100;
            return `
              <div class="flex-1 flex flex-col items-center justify-end h-full relative z-10">
                <div class="w-full mx-1 rounded-t-sm relative group cursor-pointer" style="height: ${pct}%; background: linear-gradient(to top, rgba(59,130,246,0.6), rgba(59,130,246,0.15)); border-top: 2px solid rgba(59,130,246,0.6); min-height: 4px;">
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-zinc-200 text-[9px] px-2 py-1 rounded whitespace-nowrap border border-zinc-700">R$ ${d.cost.toLocaleString()}</div>
                </div>
                <span class="text-[8px] text-zinc-600 mt-1.5">${d.month.slice(0, 3)}</span>
              </div>`;
          }).join('')}
          <div class="absolute inset-0 pointer-events-none opacity-20">
            <svg class="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
              <path d="${telemetryData.map((d, i) => `${i === 0 ? 'M' : 'L'}${(i / (telemetryData.length - 1)) * 600} ${200 - (d.cost / maxCost) * 170}`).join(' ')}" fill="none" stroke="#3b82f6" stroke-width="2" />
            </svg>
          </div>
        </div>
        <div class="flex justify-between text-[8px] text-zinc-600 mt-1 px-[10px]">
          ${telemetryData.map(d => `<span>${d.month}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
}

export function renderVolumeChart(telemetryData, maxVolume) {
  return `
    <div class="glass-card rounded-xl overflow-hidden">
      <div class="p-4 border-b border-zinc-800/30 bg-zinc-900/20">
        <h3 class="text-xs font-bold uppercase tracking-widest">Volume de Abastecimentos</h3>
      </div>
      <div class="p-5">
        <div class="flex items-end justify-between h-48 gap-2 relative" style="padding: 0 10px 25px 10px;">
          <div class="absolute bottom-[25px] left-[10px] right-[10px] h-full flex flex-col justify-between pointer-events-none">
            <div class="border-t border-zinc-800/20"></div>
            <div class="border-t border-zinc-800/20"></div>
            <div class="border-t border-zinc-800/20"></div>
            <div class="border-t border-zinc-800/20"></div>
            <div class="border-t border-zinc-800/20"></div>
          </div>
          ${telemetryData.map(d => {
            const pct = (d.volume / maxVolume) * 100;
            return `
              <div class="flex-1 flex flex-col items-center justify-end h-full relative z-10">
                <div class="w-full mx-1 rounded-t-sm relative group cursor-pointer" style="height: ${pct}%; background: linear-gradient(to top, rgba(59,130,246,0.7), rgba(59,130,246,0.3)); border-top: 2px solid rgba(59,130,246,0.7); border-radius: 3px 3px 0 0; min-height: 4px;">
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-zinc-200 text-[9px] px-2 py-1 rounded whitespace-nowrap border border-zinc-700">${d.volume}L</div>
                </div>
                <span class="text-[8px] text-zinc-600 mt-1.5">${d.month.slice(0, 3)}</span>
              </div>`;
          }).join('')}
        </div>
        <div class="flex justify-between text-[8px] text-zinc-600 mt-1 px-[10px]">
          ${telemetryData.map(d => `<span>${d.month}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
}
