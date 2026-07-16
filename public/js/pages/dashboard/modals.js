/**
 * CityMotion — Dashboard: Modais e Renderizadores HTML
 * Funções puras de renderização. Não acessam Store ou API diretamente.
 */

export function renderMetricsCards(schedules, vehicles, employees, maintenanceRequests) {
  const totalVehicles = vehicles.length;
  const activeTrips = schedules.filter(s => s.status === 'Em Andamento').length;
  const availableVehicles = vehicles.filter(v => v.status === 'Disponível' || v.status === 'Em Serviço').length;
  const pendingMaintenance = maintenanceRequests.filter(m => m.status === 'Pendente').length;

  return `
    <div class="glass-card rounded-xl p-5 scanlines relative overflow-hidden">
      <div class="relative z-10">
        <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Frota Total</p>
        <p class="text-4xl font-black text-blue-300 mt-2">${totalVehicles}</p>
        <p class="text-xs text-zinc-600 mt-1">veículos cadastrados</p>
      </div>
    </div>
    <div class="glass-card rounded-xl p-5 scanlines relative overflow-hidden">
      <div class="relative z-10">
        <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Em Viagem</p>
        <p class="text-4xl font-black text-emerald-400 mt-2">${activeTrips}</p>
        <p class="text-xs text-zinc-600 mt-1">viagens ativas agora</p>
      </div>
    </div>
    <div class="glass-card rounded-xl p-5 scanlines relative overflow-hidden">
      <div class="relative z-10">
        <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Disponíveis</p>
        <p class="text-4xl font-black text-blue-300 mt-2">${availableVehicles}</p>
        <p class="text-xs text-zinc-600 mt-1">veículos prontos para uso</p>
      </div>
    </div>
    <div class="glass-card rounded-xl p-5 scanlines relative overflow-hidden">
      <div class="relative z-10">
        <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Manutenção</p>
        <p class="text-4xl font-black text-red-400 mt-2">${pendingMaintenance}</p>
        <p class="text-xs text-zinc-600 mt-1">chamados pendentes</p>
      </div>
    </div>
  `;
}

export function renderRecentTrips(schedules) {
  const recentTrips = schedules
    .filter(s => s.status === 'Em Andamento' || s.status === 'Agendada')
    .slice(0, 5);

  if (recentTrips.length === 0) {
    return `
      <div class="text-center py-12 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl">
        <p class="text-lg">Bem-vindo(a) ao CityMotion.</p>
        <p class="text-sm mt-2 text-zinc-600">Nenhuma viagem ativa no momento.</p>
      </div>
    `;
  }

  return `
    <div>
      <h3 class="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">Próximas Viagens</h3>
      <div class="space-y-3">
        ${recentTrips.map(trip => `
          <div class="nexus-card p-4">
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm">${trip.title}</span>
              <span class="badge ${trip.status === 'Em Andamento' ? 'badge-default' : 'badge-secondary'}">${trip.status}</span>
            </div>
            <div class="flex items-center gap-4 mt-2 text-xs text-zinc-500">
              <span>🚗 ${trip.driver}</span>
              <span>🏁 ${trip.destination}</span>
              <span>🕐 ${trip.departureTime}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
