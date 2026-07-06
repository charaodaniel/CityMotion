/**
 * CityMotion — Toast Notification System
 * Substitui alert() nativo por notificações elegantes no estilo NexusOS
 *
 * Uso:
 *   Toast.show('Mensagem')                          // info (padrão)
 *   Toast.show('Mensagem', 'success')                // sucesso verde
 *   Toast.show('Mensagem', 'error')                  // erro vermelho
 *   Toast.show('Mensagem', 'warning')                // aviso amarelo
 *   Toast.show('Mensagem', 'info')                   // info azul
 *   Toast.show({ title: 'Título', message: 'Msg', type: 'success', duration: 5000 })
 */
const Toast = (() => {
  const DEFAULT_DURATION = 4000;
  let counter = 0;

  // Mapa de cores por tipo
  const COLORS = {
    success: { border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', icon: 'text-emerald-400', glow: 'rgba(52,211,153,0.15)', bar: 'bg-emerald-500' },
    error:   { border: 'border-red-500/40', bg: 'bg-red-500/10', icon: 'text-red-400', glow: 'rgba(239,68,68,0.15)', bar: 'bg-red-500' },
    warning: { border: 'border-amber-500/40', bg: 'bg-amber-500/10', icon: 'text-amber-400', glow: 'rgba(251,191,36,0.15)', bar: 'bg-amber-500' },
    info:    { border: 'border-primary/40', bg: 'bg-primary/10', icon: 'text-primary', glow: 'rgba(147,197,253,0.15)', bar: 'bg-primary' },
  };

  // Ícones SVG por tipo
  const ICONS = {
    success: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    error:   '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    warning: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>',
    info:    '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  };

  /**
   * Inicializa o container de toasts no body
   */
  function ensureContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:0.625rem;pointer-events:none;max-width:24rem;width:100%';
      document.body.appendChild(container);
    }
    return container;
  }

  /**
   * Mostra uma notificação toast
   * @param {string|Object} message - Mensagem ou objeto { title, message, type, duration }
   * @param {string} type - 'success' | 'error' | 'warning' | 'info' (usado se message for string)
   * @param {number} duration - ms (padrão 4000)
   */
  function show(message, type = 'info', duration = DEFAULT_DURATION) {
    // Suporta chamada como objeto
    if (typeof message === 'object' && message !== null) {
      const opts = message;
      return show(opts.message || opts.title, opts.type || 'info', opts.duration || DEFAULT_DURATION);
    }

    const container = ensureContainer();
    const id = 'toast-' + (++counter);
    const colors = COLORS[type] || COLORS.info;
    const icon = ICONS[type] || ICONS.info;

    const el = document.createElement('div');
    el.id = id;
    el.style.cssText = `pointer-events:auto;transform:translateX(120%);opacity:0;transition:all 0.35s cubic-bezier(0.22,1,0.36,1)`;

    el.innerHTML = `
      <div class="relative overflow-hidden rounded-xl border ${colors.border} ${colors.bg} shadow-2xl backdrop-blur-md" style="background:rgba(15,15,19,0.92);box-shadow:0 8px 32px ${colors.glow},0 1px 3px rgba(0,0,0,0.5)">
        <!-- Barra superior colorida -->
        <div class="${colors.bar} h-1 w-full"></div>
        <div class="flex items-start gap-3 p-4 pr-10">
          <div class="shrink-0 mt-0.5 ${colors.icon}">${icon}</div>
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm font-bold text-zinc-100 leading-snug">${escapeHtml(message)}</p>
          </div>
          <button onclick="document.getElementById('${id}')?.remove()" class="absolute top-3 right-3 text-zinc-600 hover:text-zinc-300 transition-colors" aria-label="Fechar">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>`;

    container.appendChild(el);

    // Animação de entrada
    requestAnimationFrame(() => {
      el.style.transform = 'translateX(0)';
      el.style.opacity = '1';
    });

    // Auto-remover após duration
    const timeoutId = setTimeout(() => {
      dismiss(id);
    }, duration);

    // Armazenar timeout para cancelar se clicar
    el._timeoutId = timeoutId;

    return id;
  }

  /**
   * Remove um toast com animação
   */
  function dismiss(id) {
    const el = document.getElementById(id);
    if (!el) return;
    clearTimeout(el._timeoutId);
    el.style.transform = 'translateX(120%)';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 350);
  }

  /**
   * Remove todos os toasts
   */
  function dismissAll() {
    document.querySelectorAll('[id^="toast-"]').forEach(el => {
      clearTimeout(el._timeoutId);
      el.style.transform = 'translateX(120%)';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 350);
    });
  }

  /**
   * Escape HTML básico para evitar XSS
   */
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  return { show, dismiss, dismissAll };
})();
