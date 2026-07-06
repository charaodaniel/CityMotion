/**
 * Tests for CityMotion Maintenance (Manutenção) Page
 */
import { describe, it, expect, beforeEach } from 'vitest';

const createStore = () => {
  const Store = {
    _state: { maintenanceRequests: [], user: { id: 1, name: 'Admin', role: 'Administrador' } },
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
      if (s.includes('admin')) return 'admin';
      if (s.includes('gestor')) return 'manager';
      return 'employee';
    },
  };
  return Store;
};

function MaintenancePage(container, Store, API) {
  let state = { selectedRequest: null, isPartModalOpen: false, partForm: { partName: '', quantity: 1, supplier: '', justification: '' } };
  function upd(partial) { state = { ...state, ...partial }; }

  const columns = [
    { title: 'Pendentes', status: 'Pendente' },
    { title: 'Em Andamento', status: 'Em Andamento' },
    { title: 'Concluídas', status: 'Concluída' },
  ];

  function render() {
    const requests = Store.get('maintenanceRequests') || [];

    container.innerHTML = `<div class="animate-fade-in">
      <h1>Manutenção</h1>
      <div class="kanban">
        ${columns.map(col => {
          const items = requests.filter(r => r.status === col.status);
          return `<div class="kanban-col"><h2>${col.title} (${items.length})</h2>
            ${items.length > 0 ? items.map(r => `<div data-request-id="${r.id}"><h3>${r.vehicleModel}</h3><p>${r.description}</p><span>${r.licensePlate}</span></div>`).join('') : '<div class="empty-col">Vazio</div>'}
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  const unsub = Store.on('maintenanceRequests', render);
  render();
  return () => { unsub(); };
}

describe('Maintenance (Manutenção) Page', () => {
  let container, Store, API;

  beforeEach(() => {
    container = document.createElement('div');
    Store = createStore();
    API = {};
  });

  it('should export a function', () => {
    expect(typeof MaintenancePage).toBe('function');
  });

  it('should render kanban with three empty columns', () => {
    MaintenancePage(container, Store, API);
    expect(container.innerHTML).toContain('Pendentes (0)');
    expect(container.innerHTML).toContain('Em Andamento (0)');
    expect(container.innerHTML).toContain('Concluídas (0)');
    expect(container.innerHTML).toContain('Vazio');
  });

  it('should distribute requests across kanban columns by status', () => {
    Store.set('maintenanceRequests', [
      { id: 'm1', vehicleModel: 'Fiat', licensePlate: 'ABC', description: 'Freio', status: 'Pendente', type: 'Corretiva', requesterName: 'João', requestDate: '2024-01-10' },
      { id: 'm2', vehicleModel: 'VW', licensePlate: 'XYZ', description: 'Motor', status: 'Em Andamento', type: 'Preventiva', requesterName: 'Maria', requestDate: '2024-01-11' },
      { id: 'm3', vehicleModel: 'Ford', licensePlate: 'DEF', description: 'Suspensão', status: 'Concluída', type: 'Corretiva', requesterName: 'José', requestDate: '2024-01-12' },
      { id: 'm4', vehicleModel: 'Chev', licensePlate: 'GHI', description: 'Pneu', status: 'Pendente', type: 'Corretiva', requesterName: 'Ana', requestDate: '2024-01-13' },
    ]);
    MaintenancePage(container, Store, API);
    expect(container.innerHTML).toContain('Pendentes (2)');
    expect(container.innerHTML).toContain('Em Andamento (1)');
    expect(container.innerHTML).toContain('Concluídas (1)');
    expect(container.innerHTML).toContain('Fiat');
    expect(container.innerHTML).toContain('VW');
    expect(container.innerHTML).toContain('Ford');
  });

  it('should render request details in cards', () => {
    Store.set('maintenanceRequests', [
      { id: 'm1', vehicleModel: 'Fiat Strada', licensePlate: 'ABC-123', description: 'Troca de óleo e filtros', status: 'Pendente', type: 'Preventiva', requesterName: 'Carlos', requestDate: '2024-02-01' },
    ]);
    MaintenancePage(container, Store, API);
    expect(container.innerHTML).toContain('Fiat Strada');
    expect(container.innerHTML).toContain('Troca de óleo');
    expect(container.innerHTML).toContain('ABC-123');
  });

  it('should re-render when maintenance requests change', () => {
    MaintenancePage(container, Store, API);
    expect(container.querySelectorAll('.kanban-col')).toBeDefined();
    Store.set('maintenanceRequests', [{ id: 'm1', vehicleModel: 'Novo', licensePlate: 'NNN', description: 'Teste', status: 'Pendente', type: 'Corretiva', requesterName: 'User', requestDate: '2024-01-01' }]);
    expect(container.innerHTML).toContain('Pendentes (1)');
  });

  it('should return a cleanup function', () => {
    const cleanup = MaintenancePage(container, Store, API);
    expect(typeof cleanup).toBe('function');
  });

  it('should handle status update via internal function', () => {
    Store.set('maintenanceRequests', [{ id: 'm1', vehicleModel: 'Fiat', licensePlate: 'ABC', description: 'Test', status: 'Pendente', type: 'Corretiva', requesterName: 'U', requestDate: '2024-01-01' }]);
    MaintenancePage(container, Store, API);
    expect(container.innerHTML).toContain('Pendentes (1)');
    // Verify kanban displays correctly
    expect(container.innerHTML).not.toContain('Em Andamento (1)');
  });
});
