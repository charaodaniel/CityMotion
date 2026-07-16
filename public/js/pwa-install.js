/**
 * CityMotion PWA Installer
 * Gerencia: install banner, SW update, status online/offline
 */
const PWA = (() => {
  let deferredPrompt = null;
  let state = {
    installable: false,
    installing: false,
    updating: false,
    registration: null,
    online: navigator.onLine,
  };

  // Callbacks
  const listeners = new Set();

  function notify() {
    listeners.forEach(fn => fn(state));
  }

  function onStateChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  /** Mostrar/esconder banner de instalação */
  function renderInstallBanner(show) {
    let banner = document.getElementById('pwaInstallBanner');
    if (!show) {
      if (banner) banner.classList.add('hidden');
      return;
    }
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'pwaInstallBanner';
      banner.className = 'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-6 md:w-96 z-50 bg-[#0f0f13] border border-zinc-700/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden transition-all duration-300 translate-y-0 opacity-100';
      banner.innerHTML = `
        <div class="p-4 flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-zinc-100">Instalar CityMotion</p>
            <p class="text-xs text-zinc-400 mt-0.5">Adicione à tela inicial para acesso rápido offline.</p>
          </div>
          <button onclick="PWA.install()" class="flex-shrink-0 px-4 py-2 bg-blue-400 hover:bg-blue-300 text-zinc-900 font-bold text-xs uppercase tracking-widest rounded-lg transition-all duration-200">
            Instalar
          </button>
          <button onclick="PWA.dismiss()" class="flex-shrink-0 text-zinc-600 hover:text-zinc-400 transition-colors p-1" title="Fechar">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      `;
      document.body.appendChild(banner);
    }
    banner.classList.remove('hidden');
  }

  /** Mostrar/esconder toast de atualização disponível */
  function renderUpdateToast(show) {
    let toast = document.getElementById('pwaUpdateToast');
    if (!show) {
      if (toast) toast.classList.add('hidden');
      return;
    }
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'pwaUpdateToast';
      toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#0f0f13] border border-zinc-700/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden transition-all duration-300';
      toast.innerHTML = `
        <div class="flex items-center gap-3 px-4 py-3">
          <div class="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-xs font-bold text-zinc-100">Nova versão disponível</p>
            <p class="text-[10px] text-zinc-400 mt-0.5">Atualize para a versão mais recente.</p>
          </div>
          <button onclick="PWA.update()" class="px-3 py-1.5 bg-blue-400 hover:bg-blue-300 text-zinc-900 font-bold text-[10px] uppercase tracking-widest rounded-lg transition-all">
            Atualizar
          </button>
        </div>
      `;
      document.body.appendChild(toast);
    }
    toast.classList.remove('hidden');
  }

  /** Indicador de status offline na sidebar/header */
  function renderOfflineIndicator(online) {
    let indicator = document.getElementById('pwaOfflineIndicator');
    if (online) {
      if (indicator) indicator.classList.add('hidden');
      return;
    }
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'pwaOfflineIndicator';
      indicator.className = 'fixed bottom-0 left-0 right-0 z-50 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest text-center py-1.5';
      indicator.textContent = 'Você está offline — alguns dados podem não estar disponíveis';
      document.body.appendChild(indicator);
    }
    indicator.classList.remove('hidden');
  }

  return {
    get state() { return { ...state }; },
    onStateChange,

    /** Inicializar o gerenciador PWA */
    async init() {
      // Detectar se já está instalado (standalone mode)
      if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
        state.installable = false;
        return;
      }

      // Escutar beforeinstallprompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        state.installable = true;
        renderInstallBanner(true);
        notify();
      });

      // Escutar install bem-sucedido
      window.addEventListener('appinstalled', () => {
        state.installing = false;
        state.installable = false;
        deferredPrompt = null;
        renderInstallBanner(false);
        notify();
      });

      // Monitorar online/offline
      window.addEventListener('online', () => {
        state.online = true;
        renderOfflineIndicator(true);
        notify();
      });

      window.addEventListener('offline', () => {
        state.online = false;
        renderOfflineIndicator(false);
        notify();
      });

      // Estado inicial de conectividade
      renderOfflineIndicator(state.online);

      // Registrar e monitorar Service Worker
      if ('serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.register('/sw.js');
          state.registration = reg;
          notify();

          // Verificar se há atualização pendente
          if (reg.waiting) {
            state.updating = true;
            renderUpdateToast(true);
            notify();
          }

          // Detectar nova atualização
          reg.addEventListener('updatefound', () => {
            const newSW = reg.installing;
            if (!newSW) return;

            newSW.addEventListener('statechange', () => {
              if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                state.updating = true;
                renderUpdateToast(true);
                notify();
              }
            });
          });

          // Verificar atualizações a cada 30 minutos
          setInterval(() => { reg.update(); }, 30 * 60 * 1000);

          // Escutar mensagens do SW
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data?.type === 'SW_UPDATED') {
              state.updating = true;
              renderUpdateToast(true);
              notify();
            }
          });
        } catch (err) {
          console.warn('[PWA] Erro ao registrar Service Worker:', err);
        }
      }
    },

    /** Instalar o PWA */
    async install() {
      if (!deferredPrompt) return;
      state.installing = true;
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      deferredPrompt = null;
      state.installable = false;
      state.installing = false;
      renderInstallBanner(false);
      notify();
    },

    /** Dispensar o banner de instalação */
    dismiss() {
      state.installable = false;
      deferredPrompt = null;
      renderInstallBanner(false);
      notify();
    },

    /** Aplicar atualização do Service Worker */
    async update() {
      if (state.registration?.waiting) {
        state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      state.updating = false;
      renderUpdateToast(false);
      // Recarregar depois que o novo SW assumir (once para evitar reloads duplicados)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      }, { once: true });
    },
  };
})();

// Inicializar automaticamente após o DOM
document.addEventListener('DOMContentLoaded', () => PWA.init());
