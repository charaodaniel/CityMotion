/**
 * CityMotion — Viagens: Renderizadores Kanban e Mapa (HTML puro)
 *
 * Funções puras que recebem dados e retornam HTML string.
 */

/**
 * Renderiza o quadro Kanban de viagens
 */
export function renderKanban(trips) {
  const columns = [
    { title: 'Agendadas', status: 'Agendada' },
    { title: 'Em Andamento', status: 'Em Andamento' },
    { title: 'Concluídas', status: 'Concluída' },
  ];

  return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${columns.map((col) => {
        const colTrips = trips.filter((s) => s.status === col.status);
        return `
          <div class="flex flex-col gap-3">
            <h2 class="text-[10px] font-bold uppercase tracking-widest text-primary/60 px-2">${col.title} (${colTrips.length})</h2>
            <div class="bg-zinc-900/30 rounded-xl p-3 space-y-3 min-h-[250px] border border-zinc-800/50 scanlines">
              ${colTrips.length > 0
                ? colTrips.map((s) => `
                  <div class="nexus-card p-0 overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-300 group" data-schedule-id="${s.id}" data-action="open-details">
                    <div class="p-4 pb-2" data-schedule-id="${s.id}" data-action="open-details">
                      <div class="mb-3">
                        <h3 class="text-sm font-bold tracking-tight">${s.title}</h3>
                        <p class="flex items-center text-[9px] font-mono font-bold uppercase tracking-widest text-primary/50 mt-1">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                          ${s.departureTime}
                        </p>
                      </div>
                      <div class="space-y-1.5">
                        <div class="flex items-center text-[10px] text-zinc-500">
                          <svg class="w-3 h-3 mr-1.5 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                          <span class="truncate">${s.driver}</span>
                        </div>
                        <div class="flex items-center text-[10px] text-zinc-500">
                          <svg class="w-3 h-3 mr-1.5 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                          <span class="truncate">${s.vehicle}</span>
                        </div>
                      </div>
                    </div>
                    <div class="border-t border-zinc-800/10 mt-2 bg-black/20">
                      ${s.status === 'Agendada'
                        ? `<button class="w-full py-2 text-[9px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-colors" data-schedule-id="${s.id}" data-action="start-checklist">
                            <svg class="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>
                            Iniciar Missão
                          </button>`
                        : s.status === 'Em Andamento'
                          ? `<button class="w-full py-2 text-[9px] font-bold uppercase tracking-widest text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors" data-schedule-id="${s.id}" data-action="finish-trip">
                              <svg class="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                              Finalizar
                            </button>`
                          : ''
                      }
                    </div>
                  </div>
                `).join('')
                : '<div class="flex items-center justify-center h-full text-[9px] uppercase tracking-widest text-zinc-600 opacity-30 italic">Sem registros</div>'
              }
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/**
 * Renderiza o conteúdo da aba Mapa ao Vivo
 */
export function renderMapContent(activeTrips, driverLocations, isTracking) {
  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-bold uppercase tracking-widest text-primary">🚗 Rastreamento ao Vivo</h3>
          <p class="text-[10px] text-zinc-500 mt-1">
            ${activeTrips.length > 0
              ? `${activeTrips.length} viagem(ns) em andamento — ${driverLocations.length} localização(ões) capturada(s)`
              : 'Nenhuma viagem em andamento no momento.'}
          </p>
        </div>
        <div class="flex items-center gap-2">
          ${isTracking
            ? `<button id="btnStopTracking" class="btn btn-ghost btn-sm text-[10px] border-red-500/30 text-red-400 hover:bg-red-500/10">
                <span class="h-2 w-2 rounded-full bg-red-500 animate-pulse mr-2 inline-block"></span>
                Parar Rastreio
              </button>`
            : `<button id="btnStartTracking" class="btn btn-ghost btn-sm text-[10px] border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" ${activeTrips.length === 0 ? 'disabled' : ''}>
                <svg class="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                Iniciar Rastreio
              </button>`
          }
        </div>
      </div>
      ${activeTrips.length > 0
        ? `<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div class="lg:col-span-2">
              <div id="leafletMap" class="h-[400px] lg:h-[500px] rounded-xl border border-zinc-700/50 overflow-hidden"></div>
            </div>
            <div class="bg-zinc-900/40 border border-zinc-700/50 rounded-xl p-4 space-y-3 max-h-[500px] overflow-y-auto">
              <h4 class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Localizações</h4>
              ${driverLocations.length > 0
                ? driverLocations.slice().reverse().slice(0, 20).map((loc) => `
                  <div class="p-2.5 rounded-lg bg-black/20 border border-zinc-800/30 text-[10px]">
                    <p class="font-bold text-primary">${loc.driverName}</p>
                    <p class="text-zinc-500 mt-0.5">${loc.address || `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`}</p>
                    <p class="text-zinc-600 mt-0.5">${new Date(loc.timestamp).toLocaleString('pt-BR')}</p>
                    ${loc.speed ? `<p class="text-emerald-400 font-mono mt-0.5">${(loc.speed * 3.6).toFixed(1)} km/h</p>` : ''}
                  </div>
                `).join('')
                : '<p class="text-zinc-600 text-xs italic text-center py-4">Aguardando primeira localização...</p>'
              }
            </div>
          </div>`
        : `<div class="text-center py-16 border-2 border-dashed border-zinc-800 rounded-xl">
            <p class="text-zinc-500">Nenhuma viagem em andamento.</p>
            <p class="text-xs text-zinc-600 mt-1">Inicie uma missão no Kanban para ativar o rastreamento.</p>
          </div>`
      }
    </div>
  `;
}
