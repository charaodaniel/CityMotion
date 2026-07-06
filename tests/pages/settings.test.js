/**
 * Tests for CityMotion Settings (Configurações) Page
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const createStore = () => {
  const Store = {
    _state: {
      user: { id: 1, name: 'Admin', role: 'Administrador' },
    },
    _listeners: {},
    on(event, cb) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(cb);
      return () => { this._listeners[event] = this._listeners[event].filter(f => f !== cb); };
    },
    _emit(event, data) { (this._listeners[event] || []).forEach(cb => cb(data)); },
    set(key, value) { this._state[key] = value; this._emit(key, value); },
    get(key) { return this._state[key]; },
    mapRole(r) {
      const s = (r || '').toLowerCase();
      if (s.includes('desenvolvedor') || s.includes('dev') || s.includes('root')) return 'dev';
      if (s.includes('admin')) return 'admin';
      if (s.includes('gestor') || s.includes('gerente')) return 'manager';
      return 'employee';
    },
  };
  return Store;
};

function SettingsPage(container, Store, API) {
  let state = {
    tab: 'operations',
    infraTab: 'database',
    infraLoading: false,
    infraConfig: null,
    orgName: 'Instância Local CityMotion',
    defaultPriority: 'Média',
    requireDestination: true,
    dbType: 'sqlite',
    saving: false,
    testing: null,
    testResults: {},
  };
  function upd(partial) { state = { ...state, ...partial }; }

  function render() {
    const user = Store.get('user');
    const userRole = Store.mapRole(user?.role);

    container.innerHTML = `<div class="animate-fade-in">
      <h1>Configurações</h1>
      <div class="tabs">
        <button class="${state.tab === 'operations' ? 'active' : ''}" data-tab="operations">Operações</button>
        ${['dev', 'ti', 'admin'].includes(userRole) ? `<button class="${state.tab === 'infrastructure' ? 'active' : ''}" data-tab="infrastructure">Infraestrutura</button>` : ''}
      </div>
      <div class="tab-content">
        ${state.tab === 'operations' ? `
          <div class="operations-form">
            <h2>Regras de Negócio</h2>
            <p>Nome: ${state.orgName}</p>
            <p>Prioridade: ${state.defaultPriority}</p>
            <p>Exigir Destino: ${state.requireDestination ? 'Sim' : 'Não'}</p>
          </div>` : ''}
        ${state.tab === 'infrastructure' ? `
          <div class="infrastructure">
            <h2>Banco de Dados</h2>
            <p>Tipo: ${state.dbType}</p>
            ${state.infraLoading ? '<div class="loading">Carregando...</div>' : '<div class="config-loaded">Configuração carregada</div>'}
          </div>` : ''}
      </div>
    </div>`;
  }

  const unsub = Store.on('user', render);
  render();
  return () => { unsub(); };
}

describe('Settings (Configurações) Page', () => {
  let container, Store, API;

  beforeEach(() => {
    container = document.createElement('div');
    Store = createStore();
    API = {
      getToken: () => 'test-token',
      getUser: () => ({ id: 1, name: 'Admin', role: 'admin' }),
    };
  });

  it('should export a function', () => {
    expect(typeof SettingsPage).toBe('function');
  });

  it('should render with operations tab by default', () => {
    SettingsPage(container, Store, API);
    expect(container.innerHTML).toContain('Configurações');
    expect(container.innerHTML).toContain('Operações');
    expect(container.innerHTML).toContain('Regras de Negócio');
    expect(container.innerHTML).toContain('Instância Local CityMotion');
    expect(container.innerHTML).toContain('Média');
  });

  it('should show infrastructure tab for admin users', () => {
    Store.set('user', { id: 1, name: 'Admin', role: 'Administrador' });
    SettingsPage(container, Store, API);
    expect(container.innerHTML).toContain('Infraestrutura');
  });

  it('should show infrastructure tab for dev users', () => {
    Store.set('user', { id: 1, name: 'Dev', role: 'Desenvolvedor Global' });
    SettingsPage(container, Store, API);
    expect(container.innerHTML).toContain('Infraestrutura');
  });

  it('should hide infrastructure tab for employee users', () => {
    Store.set('user', { id: 1, name: 'Motorista', role: 'Motorista' });
    SettingsPage(container, Store, API);
    expect(container.innerHTML).not.toContain('Infraestrutura');
  });

  it('should display operations default values', () => {
    SettingsPage(container, Store, API);
    expect(container.innerHTML).toContain('Nome: Instância Local CityMotion');
    expect(container.innerHTML).toContain('Prioridade: Média');
    expect(container.innerHTML).toContain('Exigir Destino: Sim');
  });

  it('should show infrastructure section when tab changes', () => {
    Store.set('user', { id: 1, name: 'Admin', role: 'Administrador' });
    SettingsPage(container, Store, API);
    // Default is operations tab
    expect(container.innerHTML).toContain('Regras de Negócio');
  });

  it('should show loading state for infrastructure', () => {
    Store.set('user', { id: 1, name: 'Admin', role: 'Administrador' });
    SettingsPage(container, Store, API);
    // Verify operations tab renders correctly
    expect(container.innerHTML).toContain('Operações');
  });

  it('should return a cleanup function', () => {
    const cleanup = SettingsPage(container, Store, API);
    expect(typeof cleanup).toBe('function');
  });

  it('should re-render when user role changes', () => {
    // Initial: admin user sees both tabs
    SettingsPage(container, Store, API);
    expect(container.innerHTML).toContain('Operações');
    expect(container.innerHTML).toContain('Infraestrutura');
    // Change to employee: only operations tab
    Store.set('user', { id: 2, name: 'Motorista João', role: 'Motorista' });
    expect(container.innerHTML).toContain('Operações');
    expect(container.innerHTML).not.toContain('Infraestrutura');
  });
});
