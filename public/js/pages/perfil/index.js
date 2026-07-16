/**
 * CityMotion — Página: Perfil
 * Orquestração: estado, render, Store subscriptions
 *
 * HTML puro extraído para modals.js
 */
import { formatDate } from '/js/format-utils.js';
import {
  renderLoading, renderNoUser, renderProfileCard, renderHistoryTable,
  getBadgeClass, getStatusVariant,
} from './modals.js';

export default function ProfilePage(container, Store) {
  let state = {};
  function upd(partial) { state = { ...state, ...partial }; }

  // ── Render ───────────────────────────────────────────────
  function render() {
    const user = Store.get('user');
    const vehicleRequests = Store.get('vehicleRequests') || [];
    const loading = Store.get('loading');

    if (loading) {
      container.innerHTML = renderLoading();
      return;
    }

    if (!user) {
      container.innerHTML = renderNoUser();
      return;
    }

    const userRequests = vehicleRequests.filter(req => req.requester === user.name);
    const sectorStr = Array.isArray(user.sector)
      ? user.sector.join(', ')
      : (user.sector || 'Não definido');

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
          ${renderProfileCard(user, sectorStr)}
          <div class="md:col-span-2">
            ${renderHistoryTable(userRequests, formatDate, getBadgeClass, getStatusVariant)}
          </div>
        </div>
      </div>`;
  }

  // ── Init ─────────────────────────────────────────────────
  const unsubUser = Store.on('user', render);
  const unsubReqs = Store.on('vehicleRequests', render);
  const unsubLoad = Store.on('loading', render);

  render();

  return () => { unsubUser(); unsubReqs(); unsubLoad(); };
}
