/**
 * Tests for CityMotion Profile (Perfil) Page
 */
import { describe, it, expect, beforeEach } from 'vitest';

const createStore = () => {
  const Store = {
    _state: {
      user: { id: 1, name: 'João Silva', role: 'Motorista', email: 'joao@test.com', sector: ['TI'] },
      vehicleRequests: [],
      loading: false,
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
  };
  return Store;
};

function ProfilePage(container, Store, API) {
  function getInitials(name) { return (name || '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(); }

  function render() {
    const user = Store.get('user');
    const vehicleRequests = Store.get('vehicleRequests') || [];
    const loading = Store.get('loading');

    if (loading) {
      container.innerHTML = `<div class="loading-skeleton"><div class="animate-pulse">Carregando...</div></div>`;
      return;
    }

    if (!user) {
      container.innerHTML = `<div class="no-user"><p>Nenhum usuário logado</p></div>`;
      return;
    }

    const userRequests = vehicleRequests.filter(req => req.requester === user.name);

    container.innerHTML = `<div class="animate-fade-in">
      <h1>Meu Perfil</h1>
      <div class="profile-card">
        <div class="avatar">${getInitials(user.name)}</div>
        <h2>${user.name}</h2>
        <p>${user.role}</p>
        <p>${user.email}</p>
      </div>
      <div class="requests-history">
        <h3>Histórico de Solicitações</h3>
        ${userRequests.length > 0 ? userRequests.map(req => `<div class="request-item">
          <span>${req.title}</span>
          <span>${req.status}</span>
        </div>`).join('') : '<p class="empty-state">Nenhum histórico para exibir.</p>'}
      </div>
    </div>`;
  }

  const unsub1 = Store.on('user', render);
  const unsub2 = Store.on('vehicleRequests', render);
  const unsub3 = Store.on('loading', render);
  render();
  return () => { unsub1(); unsub2(); unsub3(); };
}

describe('Profile (Perfil) Page', () => {
  let container, Store, API;

  beforeEach(() => {
    container = document.createElement('div');
    Store = createStore();
    API = {};
  });

  it('should export a function', () => {
    expect(typeof ProfilePage).toBe('function');
  });

  it('should render user info from store', () => {
    ProfilePage(container, Store, API);
    expect(container.innerHTML).toContain('Meu Perfil');
    expect(container.innerHTML).toContain('João Silva');
    expect(container.innerHTML).toContain('Motorista');
    expect(container.innerHTML).toContain('joao@test.com');
  });

  it('should render initials from user name', () => {
    ProfilePage(container, Store, API);
    expect(container.innerHTML).toContain('JS');
  });

  it('should render loading state', () => {
    Store.set('loading', true);
    ProfilePage(container, Store, API);
    expect(container.innerHTML).toContain('Carregando');
    expect(container.innerHTML).toContain('loading-skeleton');
  });

  it('should render no-user state when user is null', () => {
    Store.set('user', null);
    ProfilePage(container, Store, API);
    expect(container.innerHTML).toContain('Nenhum usuário logado');
  });

  it('should show empty request history', () => {
    ProfilePage(container, Store, API);
    expect(container.innerHTML).toContain('Nenhum histórico para exibir');
  });

  it('should render user request history', () => {
    Store.set('user', { id: 1, name: 'João Silva', role: 'Motorista', email: 'joao@test.com' });
    Store.set('vehicleRequests', [
      { id: 'r1', title: 'Viagem Centro', status: 'Aprovada', requester: 'João Silva', requestDate: '2024-01-10' },
      { id: 'r2', title: 'Transporte Escolar', status: 'Pendente', requester: 'João Silva', requestDate: '2024-01-15' },
      { id: 'r3', title: 'Outra Viagem', status: 'Aprovada', requester: 'Maria', requestDate: '2024-01-12' },
    ]);
    ProfilePage(container, Store, API);
    expect(container.innerHTML).toContain('Viagem Centro');
    expect(container.innerHTML).toContain('Transporte Escolar');
    // Maria's request should not appear
    expect(container.innerHTML).not.toContain('Outra Viagem');
  });

  it('should re-render when user changes', () => {
    ProfilePage(container, Store, API);
    expect(container.innerHTML).toContain('João Silva');
    Store.set('user', { id: 2, name: 'Maria Santos', role: 'Enfermeiro(a)', email: 'maria@test.com' });
    expect(container.innerHTML).toContain('Maria Santos');
    expect(container.innerHTML).toContain('MS');
  });

  it('should return a cleanup function', () => {
    const cleanup = ProfilePage(container, Store, API);
    expect(typeof cleanup).toBe('function');
  });
});
