/**
 * CityMotion — Meus Relatórios: Modais e Renderizadores HTML
 * Funções puras de renderização. Não acessam Store ou API diretamente.
 */

export function renderStatsCards(totalTrips, concluidas, kmTotal, emAndamento) {
  return `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="glass-card rounded-xl p-4 bg-zinc-900/40 border-zinc-700/50">
        <p class="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Total Viagens</p>
        <p class="text-2xl font-black text-blue-300 mt-1">${totalTrips}</p>
      </div>
      <div class="glass-card rounded-xl p-4 bg-zinc-900/40 border-zinc-700/50">
        <p class="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Concluídas</p>
        <p class="text-2xl font-black text-emerald-400 mt-1">${concluidas}</p>
      </div>
      <div class="glass-card rounded-xl p-4 bg-zinc-900/40 border-zinc-700/50">
        <p class="text-[9px] font-bold uppercase tracking-widest text-zinc-500">KM Total</p>
        <p class="text-2xl font-black text-primary mt-1">${kmTotal} km</p>
      </div>
      <div class="glass-card rounded-xl p-4 bg-zinc-900/40 border-zinc-700/50">
        <p class="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Em Andamento</p>
        <p class="text-2xl font-black text-amber-400 mt-1">${emAndamento}</p>
      </div>
    </div>`;
}

export function renderFilters(state) {
  return `
    <div class="flex flex-wrap gap-3 items-end p-4 rounded-xl border border-zinc-700/50 bg-zinc-900/30">
      <div>
        <label class="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">De</label>
        <input type="date" id="filterDateFrom" value="${state.dateFrom}"
          onchange="document.getElementById('meusRelatoriosOverlay').dispatchEvent(new CustomEvent('filterChange'))"
          class="px-3 py-1.5 bg-black/40 border border-zinc-700/50 rounded-lg text-xs focus:outline-none focus:border-primary/50 w-36" />
      </div>
      <div>
        <label class="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Até</label>
        <input type="date" id="filterDateTo" value="${state.dateTo}"
          onchange="document.getElementById('meusRelatoriosOverlay').dispatchEvent(new CustomEvent('filterChange'))"
          class="px-3 py-1.5 bg-black/40 border border-zinc-700/50 rounded-lg text-xs focus:outline-none focus:border-primary/50 w-36" />
      </div>
      <div>
        <label class="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Status</label>
        <select id="filterStatus"
          onchange="document.getElementById('meusRelatoriosOverlay').dispatchEvent(new CustomEvent('filterChange'))"
          class="px-3 py-1.5 bg-black/40 border border-zinc-700/50 rounded-lg text-xs focus:outline-none focus:border-primary/50">
          <option value="all" ${state.statusFilter === 'all' ? 'selected' : ''}>Todos</option>
          <option value="Concluída" ${state.statusFilter === 'Concluída' ? 'selected' : ''}>Concluídas</option>
          <option value="Em Andamento" ${state.statusFilter === 'Em Andamento' ? 'selected' : ''}>Em Andamento</option>
          <option value="Agendada" ${state.statusFilter === 'Agendada' ? 'selected' : ''}>Agendadas</option>
          <option value="Cancelada" ${state.statusFilter === 'Cancelada' ? 'selected' : ''}>Canceladas</option>
        </select>
      </div>
      <button onclick="document.getElementById('meusRelatoriosOverlay').dispatchEvent(new CustomEvent('clearFilters'))"
        class="btn btn-ghost btn-sm text-[10px]">Limpar Filtros</button>
    </div>`;
}

export function renderTabs(tab, tripCount, refuelingCount) {
  return `
    <div class="flex gap-1 p-1 bg-zinc-900/60 border border-zinc-800/50 rounded-lg w-fit">
      <button onclick="document.getElementById('meusRelatoriosOverlay').dispatchEvent(new CustomEvent('setTab',{detail:'trips'}))"
        class="text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-md transition-colors ${tab === 'trips' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-zinc-500 hover:text-zinc-300'}">
        <svg class="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
        Viagens (${tripCount})
      </button>
      <button onclick="document.getElementById('meusRelatoriosOverlay').dispatchEvent(new CustomEvent('setTab',{detail:'refuelings'}))"
        class="text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-md transition-colors ${tab === 'refuelings' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-zinc-500 hover:text-zinc-300'}">
        <svg class="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        Abastecimentos (${refuelingCount})
      </button>
    </div>`;
}

export function renderTripsTable(trips, formatDate) {
  if (trips.length === 0) {
    return `<div class="text-center py-12 border-2 border-dashed border-zinc-800 rounded-xl">
      <p class="text-zinc-500">Nenhuma viagem encontrada no período.</p>
      <p class="text-xs text-zinc-600 mt-1">Ajuste os filtros ou comece uma nova viagem.</p>
    </div>`;
  }

  const kmTotal = trips.reduce((a, s) => a + ((s.endMileage || 0) - (s.startMileage || 0)), 0);

  return `
    <div class="overflow-x-auto rounded-xl border border-zinc-700/50">
      <table class="w-full text-xs">
        <thead>
          <tr class="bg-zinc-900/60 text-zinc-400 uppercase tracking-widest text-[9px] font-bold">
            <th class="text-left p-3">Título</th>
            <th class="text-left p-3">Data</th>
            <th class="text-left p-3">Origem</th>
            <th class="text-left p-3">Destino</th>
            <th class="text-left p-3">Veículo</th>
            <th class="text-right p-3">KM</th>
            <th class="text-center p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          ${trips.map(s => `
            <tr class="border-t border-zinc-800/30 hover:bg-zinc-900/30 transition-colors">
              <td class="p-3 font-medium">${s.title || 'Sem título'}</td>
              <td class="p-3 text-zinc-400">${formatDate(s.departureTime)}</td>
              <td class="p-3 text-zinc-400">${s.origin || '-'}</td>
              <td class="p-3 text-zinc-400">${s.destination || '-'}</td>
              <td class="p-3 text-zinc-400">${s.vehicle || '-'}</td>
              <td class="p-3 text-right font-mono">${((s.endMileage || 0) - (s.startMileage || 0)) || '-'}</td>
              <td class="p-3 text-center">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold
                  ${s.status === 'Concluída' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                  ${s.status === 'Em Andamento' ? 'bg-blue-500/10 text-blue-400' : ''}
                  ${s.status === 'Agendada' ? 'bg-zinc-500/10 text-zinc-400' : ''}
                  ${s.status === 'Cancelada' ? 'bg-red-500/10 text-red-400' : ''}">
                  ${s.status}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <p class="text-[10px] text-zinc-600 text-right">${trips.length} viagem(ns) · Total KM: ${kmTotal} km</p>`;
}

export function renderRefuelingsTable(refuelings, formatDate, formatCurrency) {
  if (refuelings.length === 0) {
    return `<div class="text-center py-12 border-2 border-dashed border-zinc-800 rounded-xl">
      <p class="text-zinc-500">Nenhum abastecimento encontrado.</p>
    </div>`;
  }

  const total = refuelings.reduce((a, r) => a + (r.totalValue || 0), 0);

  return `
    <div class="overflow-x-auto rounded-xl border border-zinc-700/50">
      <table class="w-full text-xs">
        <thead>
          <tr class="bg-zinc-900/60 text-zinc-400 uppercase tracking-widest text-[9px] font-bold">
            <th class="text-left p-3">Data</th>
            <th class="text-left p-3">Veículo</th>
            <th class="text-right p-3">Litros</th>
            <th class="text-left p-3">Combustível</th>
            <th class="text-right p-3">Valor/L</th>
            <th class="text-right p-3">Total</th>
            <th class="text-left p-3">Posto</th>
          </tr>
        </thead>
        <tbody>
          ${refuelings.map(r => `
            <tr class="border-t border-zinc-800/30 hover:bg-zinc-900/30 transition-colors">
              <td class="p-3">${formatDate(r.date)}</td>
              <td class="p-3 text-zinc-400">${r.vehicleModel || r.licensePlate || '-'}</td>
              <td class="p-3 text-right font-mono">${r.liters ? r.liters.toFixed(1) : '-'}</td>
              <td class="p-3 text-zinc-400">${r.fuelType || '-'}</td>
              <td class="p-3 text-right font-mono">${r.price ? formatCurrency(r.price) : '-'}</td>
              <td class="p-3 text-right font-mono font-bold">${r.totalValue ? formatCurrency(r.totalValue) : '-'}</td>
              <td class="p-3 text-zinc-400">${r.gasStation || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <p class="text-[10px] text-zinc-600 text-right">${refuelings.length} abastecimento(s) · Total: ${formatCurrency(total)}</p>`;
}
