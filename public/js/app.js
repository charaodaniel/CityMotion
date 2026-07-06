/**
 * CityMotion App Router
 * Roteamento SPA baseado em hash + carregamento de páginas
 */
const App = {
  _currentRoute: '',
  _pageCleanup: null,

  routes: {
    '/dashboard': { title: 'Painel de Controle', roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
    '/viagens': { title: 'Missões', roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
    '/veiculos': { title: 'Frota', roles: ['dev', 'ti', 'admin', 'manager'] },
    '/funcionarios': { title: 'Funcionários', roles: ['dev', 'ti', 'admin', 'manager'] },
    '/setores': { title: 'Setores', roles: ['dev', 'ti', 'admin'] },
    '/abastecimento': { title: 'Abastecimento', roles: ['dev', 'ti', 'admin', 'manager'] },
    '/manutencao': { title: 'Manutenção', roles: ['dev', 'ti', 'admin', 'manager'] },
    '/escalas': { title: 'Escalas', roles: ['dev', 'ti', 'admin', 'manager'] },
    '/chat': { title: 'Chat', roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
    '/relatorios': { title: 'Relatórios', roles: ['dev', 'ti', 'admin', 'manager'] },
    '/perfil': { title: 'Perfil', roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
    '/settings': { title: 'Configurações', roles: ['dev', 'ti', 'admin'] },
  },

  /** Inicializar o app */
  async init() {
    // Verificar autenticação
    if (!API.getToken()) {
      window.location.href = '/index.html';
      return;
    }

    // Inicializar store
    await Store.init();

    // Inicializar WebSocket (notificações em tempo real)
    WS.init().catch(() => {});

    // Escutar mudanças de hash
    window.addEventListener('hashchange', () => this.navigate());

    // Navegar para a rota inicial
    this.navigate();
  },

  /** Navegar para uma rota */
  async navigate() {
    const hash = window.location.hash.slice(1) || '/dashboard';
    
    // Verificar se está logado
    if (!API.getToken()) {
      window.location.href = '/index.html';
      return;
    }

    const route = this.routes[hash];
    if (!route) {
      window.location.hash = '/dashboard';
      return;
    }

    // Verificar permissão
    const user = Store.get('user');
    const userRole = Store.mapRole(user?.role);
    if (!route.roles.includes(userRole)) {
      window.location.hash = '/dashboard';
      return;
    }

    this._currentRoute = hash;

    // Atualizar sidebar
    this.updateSidebar(hash);
    
    // Atualizar título
    document.getElementById('pageTitle').textContent = `CityMotion — ${route.title}`;
    document.getElementById('pageDescription').textContent = this.getDescription(hash);

    // Carregar página
    await this.loadPage(hash);
  },

  /** Carregar uma página dentro do container */
  async loadPage(route) {
    const container = document.getElementById('pageContent');
    if (!container) return;

    // Cleanup da página anterior
    if (this._pageCleanup) {
      try { this._pageCleanup(); } catch {}
      this._pageCleanup = null;
    }

    // Animação de loading
    container.innerHTML = `
      <div class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="spinner mx-auto mb-4"></div>
          <p class="text-xs text-zinc-500 uppercase tracking-widest">Carregando...</p>
        </div>
      </div>
    `;

    try {
      const pageName = route.slice(1); // remove '/'
      const module = await import(`/js/pages/${pageName}.js`);
      
      container.innerHTML = '';
      const cleanup = module.default(container, Store, API);
      if (typeof cleanup === 'function') {
        this._pageCleanup = cleanup;
      }
    } catch (err) {
      console.error('[App] Erro ao carregar página:', err);
      container.innerHTML = `
        <div class="text-center py-20 text-zinc-500">
          <p class="text-lg">Erro ao carregar página</p>
          <p class="text-xs mt-2">${err.message}</p>
        </div>
      `;
    }
  },

  /** Atualizar sidebar com a rota ativa */
  updateSidebar(activeRoute) {
    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.classList.toggle('active', link.dataset.route === activeRoute);
    });
  },

  /** Descrição para cada rota */
  getDescription(route) {
    const descs = {
      '/dashboard': 'Visão geral da frota e operações.',
      '/viagens': 'Monitoramento de tráfego e logística operacional.',
      '/veiculos': 'Gestão da frota e telemetria dos ativos.',
      '/funcionarios': 'Controle de acesso e identificação NexusOS.',
      '/setores': 'Departamentos e alocação de recursos.',
      '/abastecimento': 'Histórico de consumo e abastecimentos.',
      '/manutencao': 'Gestão técnica e operacional de reparos.',
      '/escalas': 'Agenda de trabalho e plantões da equipe.',
      '/chat': 'Comunicação interna entre colaboradores.',
      '/relatorios': 'Exportação de dados operacionais.',
      '/perfil': 'Suas informações e histórico.',
      '/settings': 'Configurações do sistema.',
    };
    return descs[route] || '';
  },
};

// Iniciar app quando a página carregar
document.addEventListener('DOMContentLoaded', () => App.init());
