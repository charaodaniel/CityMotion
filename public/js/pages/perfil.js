/**
 * CityMotion — Página: Perfil
 * Informações do usuário, dados LGPD e histórico de solicitações
 */
export default function ProfilePage(container, Store, API) {
  let state = {};

  function upd(partial) { state = { ...state, ...partial }; }

  // ----------------------------------------------------------
  //  Helpers
  // ----------------------------------------------------------
  function getInitials(name) {
    return (name || '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  function getStatusVariant(status) {
    switch (status) {
      case 'Pendente': return 'secondary';
      case 'Aprovada': return 'default';
      case 'Rejeitada': return 'destructive';
      default: return 'outline';
    }
  }

  function getBadgeClass(variant) {
    const map = {
      secondary: 'border-zinc-600/30 bg-zinc-800/50 text-zinc-300',
      default: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      destructive: 'border-red-500/30 bg-red-500/10 text-red-400',
      outline: 'border-zinc-700/30 text-zinc-400',
    };
    return map[variant] || map.outline;
  }

  // ----------------------------------------------------------
  //  Render
  // ----------------------------------------------------------
  function render() {
    const user = Store.get('user');
    const vehicleRequests = Store.get('vehicleRequests') || [];
    const loading = Store.get('loading');

    if (loading) {
      container.innerHTML = `
        <div class="animate-fade-in space-y-8">
          <div class="h-8 w-48 bg-zinc-800/50 rounded animate-pulse"></div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-1">
              <div class="glass-card rounded-xl p-6 space-y-4">
                <div class="flex flex-col items-center space-y-3">
                  <div class="w-24 h-24 rounded-full bg-zinc-800/50 animate-pulse"></div>
                  <div class="h-6 w-32 bg-zinc-800/50 rounded animate-pulse"></div>
                  <div class="h-4 w-20 bg-zinc-800/50 rounded animate-pulse"></div>
                </div>
                <div class="space-y-3">
                  ${[1,2,3,4].map(() => '<div class="h-4 w-full bg-zinc-800/50 rounded animate-pulse"></div>').join('')}
                </div>
              </div>
            </div>
            <div class="md:col-span-2">
              <div class="glass-card rounded-xl p-6">
                <div class="h-6 w-48 bg-zinc-800/50 rounded animate-pulse mb-6"></div>
                ${[1,2,3,4].map(() => '<div class="h-10 w-full bg-zinc-800/50 rounded animate-pulse mb-2"></div>').join('')}
              </div>
            </div>
          </div>
        </div>`;
      return;
    }

    if (!user) {
      container.innerHTML = `
        <div class="animate-fade-in flex items-center justify-center py-20">
          <div class="glass-card rounded-xl p-8 text-center max-w-md">
            <svg class="w-12 h-12 text-zinc-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <h2 class="text-xl font-bold mb-2">Nenhum usuário logado</h2>
            <p class="text-sm text-zinc-500 mb-4">Por favor, acesse a página de login para selecionar um perfil.</p>
            <a href="/index.html" class="btn btn-primary btn-sm text-[10px]">Ir para Login</a>
          </div>
        </div>`;
      return;
    }

    const userRequests = vehicleRequests.filter(req => req.requester === user.name);
    const sectorStr = Array.isArray(user.sector) ? user.sector.join(', ') : (user.sector || 'Não definido');

    container.innerHTML = `
      <div class="animate-fade-in space-y-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 class="text-3xl sm:text-4xl font-black tracking-tighter flex items-center gap-3">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Meu Perfil
            </h1>
            <p class="text-zinc-400 text-sm mt-1 font-medium">Suas informações funcionais e histórico de atividades.</p>
          </div>
          <a href="/privacy" class="btn btn-outline btn-sm text-[10px]">
            <svg class="w-3.5 h-3.5 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Sua Privacidade (LGPD)
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- User Info Card -->
          <div class="md:col-span-1 space-y-6">
            <div class="glass-card rounded-xl p-6">
              <div class="flex flex-col items-center text-center mb-6">
                <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/30 flex items-center justify-center text-3xl font-black text-primary mb-4">
                  ${getInitials(user.name)}
                </div>
                <h2 class="text-2xl font-black tracking-tight">${user.name}</h2>
                <p class="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-bold">${user.role}</p>
              </div>
              <div class="space-y-4 text-sm border-t border-zinc-800/30 pt-4">
                <div class="flex items-center gap-3">
                  <svg class="w-4 h-4 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span class="truncate">${user.email || 'Não disponível'}</span>
                </div>
                <div class="flex items-center gap-3">
                  <svg class="w-4 h-4 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  <span>Setor: <strong>${sectorStr}</strong></span>
                </div>
                <div class="flex items-center gap-3">
                  <svg class="w-4 h-4 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span>Cargo: <strong>${user.role}</strong></span>
                </div>
                ${user.cnh ? `
                <div class="flex items-center gap-3">
                  <svg class="w-4 h-4 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                  <span>CNH: ${user.cnh}</span>
                </div>` : ''}
              </div>
            </div>

            <div class="glass-card rounded-xl p-5 bg-zinc-900/40">
              <h3 class="text-xs font-bold flex items-center gap-2 mb-3 uppercase tracking-widest text-zinc-400">
                <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Dados e LGPD
              </h3>
              <p class="text-[11px] text-zinc-600 leading-tight">
                Seus dados pessoais são processados apenas para finalidades legítimas de gestão de frota.
                <a href="/privacy" class="text-primary underline ml-1">Leia nossa política completa.</a>
              </p>
            </div>
          </div>

          <!-- Activity History Card -->
          <div class="md:col-span-2">
            <div class="glass-card rounded-xl overflow-hidden">
              <div class="p-6 border-b border-zinc-800/30">
                <h2 class="text-lg font-bold tracking-tight">Histórico de Solicitações</h2>
                <p class="text-xs text-zinc-500 mt-1">
                  ${userRequests.length > 0
                    ? 'Suas solicitações de viagem mais recentes.'
                    : 'Você ainda não fez nenhuma solicitação de viagem.'}
                </p>
              </div>
              ${userRequests.length > 0 ? `
              <div class="overflow-x-auto">
                <table class="w-full text-xs">
                  <thead>
                    <tr class="bg-zinc-900/50 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                      <th class="text-left px-6 py-3">Motivo</th>
                      <th class="text-left px-6 py-3">Data</th>
                      <th class="text-left px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-zinc-800/30">
                    ${userRequests.map(req => `
                      <tr class="hover:bg-zinc-800/20 transition-colors">
                        <td class="px-6 py-3 font-medium">${req.title}</td>
                        <td class="px-6 py-3 text-zinc-400 font-mono">${new Date(req.requestDate).toLocaleDateString('pt-BR')}</td>
                        <td class="px-6 py-3">
                          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold ${getBadgeClass(getStatusVariant(req.status))}">
                            ${req.status}
                          </span>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>` : `
              <div class="text-center py-12">
                <svg class="w-10 h-10 text-zinc-600 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p class="text-sm text-zinc-600">Nenhum histórico para exibir.</p>
              </div>`}
            </div>
          </div>
        </div>
      </div>`;
  }

  const unsubUser = Store.on('user', render);
  const unsubReqs = Store.on('vehicleRequests', render);
  const unsubLoad = Store.on('loading', render);
  render();
  return () => { unsubUser(); unsubReqs(); unsubLoad(); };
}
