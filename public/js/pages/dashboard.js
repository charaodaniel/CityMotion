/**
 * CityMotion — Página: Dashboard
 * Visão geral da frota e operações
 */
export default function DashboardPage(container, Store) {
  // Renderizar o HTML base
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

      <!-- Loading para o resto -->
      <div id="dashboardContent" class="text-center py-12 text-zinc-500">
        <div class="spinner mx-auto mb-4"></div>
        <p class="text-xs uppercase tracking-widest">Carregando dados...</p>
      </div>
    </div>
  `;

  // Função para atualizar os cards com os dados do store
  function updateMetrics(schedules, vehicles, employees, maintenanceRequests) {
    const totalVehicles = vehicles.length;
    const activeTrips = schedules.filter(s => s.status === 'Em Andamento').length;
    const availableVehicles = vehicles.filter(v => v.status === 'Disponível' || v.status === 'Em Serviço').length;
    const pendingMaintenance = maintenanceRequests.filter(m => m.status === 'Pendente').length;

    const metricsGrid = document.getElementById('metricsCards');
    if (!metricsGrid) return;

    metricsGrid.innerHTML = `
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

  // Função para atualizar o conteúdo principal
  function updateContent(schedules) {
    const content = document.getElementById('dashboardContent');
    if (!content) return;

    const recentTrips = schedules
      .filter(s => s.status === 'Em Andamento' || s.status === 'Agendada')
      .slice(0, 5);

    if (recentTrips.length === 0) {
      content.innerHTML = `
        <div class="text-center py-12 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl">
          <p class="text-lg">Bem-vindo(a) ao CityMotion.</p>
          <p class="text-sm mt-2 text-zinc-600">Nenhuma viagem ativa no momento.</p>
        </div>
      `;
      return;
    }

    content.innerHTML = `
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

  // Carregar dados iniciais e atualizar
  function refresh() {
    const state = Store.getState();
    updateMetrics(state.schedules, state.vehicles, state.employees, state.maintenanceRequests);
    updateContent(state.schedules);
  }

  // Escutar mudanças no store (apenas eventos específicos)
  const unsub1 = Store.on('schedules', () => refresh());
  const unsub2 = Store.on('vehicles', () => refresh());
  const unsub3 = Store.on('employees', () => refresh());
  const unsub4 = Store.on('maintenanceRequests', () => refresh());

  // Renderizar com dados atuais
  refresh();

  // Cleanup
  return () => {
    unsub1(); unsub2(); unsub3(); unsub4();
  };
}
