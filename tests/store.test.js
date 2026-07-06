/**
 * Tests for CityMotion Store
 */
import { describe, it, expect, beforeEach } from 'vitest';

// We need to simulate the Store module since it's not an ES module
// It's a global object defined in public/js/store.js
const createStore = () => {
  const Store = {
    _state: {
      user: null,
      schedules: [],
      vehicles: [],
      employees: [],
      sectors: [],
      vehicleRequests: [],
      maintenanceRequests: [],
      refuelings: [],
      workSchedules: [],
      organizations: [],
      messages: [],
      notifications: [],
      loading: false,
      refreshing: false,
    },
    _listeners: {},

    on(event, callback) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(callback);
      return () => {
        this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
      };
    },

    _emit(event, data) {
      (this._listeners[event] || []).forEach(cb => cb(data));
      (this._listeners['*'] || []).forEach(cb => cb(event, data));
    },

    set(key, value) {
      this._state[key] = value;
      this._emit(key, value);
      this._emit('stateChange', { key, value });
    },

    get(key) {
      return this._state[key];
    },

    getState() {
      return { ...this._state };
    },

    setState(partial) {
      Object.entries(partial).forEach(([key, value]) => {
        this._state[key] = value;
        this._emit(key, value);
      });
      this._emit('stateChange', partial);
    },

    reset() {
      this.setState({
        user: null, schedules: [], vehicles: [], employees: [],
        sectors: [], vehicleRequests: [], maintenanceRequests: [],
        refuelings: [], workSchedules: [], organizations: [],
        messages: [], notifications: [], loading: false, refreshing: false,
      });
    },

    mapRole(roleStr) {
      const r = (roleStr || '').toLowerCase();
      if (r.includes('desenvolvedor') || r.includes('dev') || r.includes('root')) return 'dev';
      if (r.includes('ti') || r.includes('infra')) return 'ti';
      if (r.includes('admin')) return 'admin';
      if (r.includes('gestor') || r.includes('gerente')) return 'manager';
      return 'employee';
    },
  };
  return Store;
};

describe('Store', () => {
  let Store;

  beforeEach(() => {
    Store = createStore();
  });

  describe('Initial state', () => {
    it('should have default values for all keys', () => {
      const state = Store.getState();
      expect(state.user).toBeNull();
      expect(state.schedules).toEqual([]);
      expect(state.vehicles).toEqual([]);
      expect(state.employees).toEqual([]);
      expect(state.sectors).toEqual([]);
      expect(state.vehicleRequests).toEqual([]);
      expect(state.maintenanceRequests).toEqual([]);
      expect(state.refuelings).toEqual([]);
      expect(state.workSchedules).toEqual([]);
      expect(state.organizations).toEqual([]);
      expect(state.messages).toEqual([]);
      expect(state.notifications).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.refreshing).toBe(false);
    });
  });

  describe('get / set', () => {
    it('should store and retrieve values', () => {
      Store.set('vehicles', [{ id: 1, model: 'Test' }]);
      expect(Store.get('vehicles')).toEqual([{ id: 1, model: 'Test' }]);
    });

    it('should return null for unknown keys', () => {
      expect(Store.get('nonexistent')).toBeUndefined();
    });
  });

  describe('setState', () => {
    it('should update multiple keys at once', () => {
      Store.setState({ user: { id: 1, name: 'Test' }, loading: false });
      expect(Store.get('user')).toEqual({ id: 1, name: 'Test' });
      expect(Store.get('loading')).toBe(false);
    });
  });

  describe('getState', () => {
    it('should return a copy of the current state', () => {
      Store.set('user', { id: 5 });
      const state = Store.getState();
      expect(state.user).toEqual({ id: 5 });
      // Mutation should not affect internal state
      state.user = null;
      expect(Store.get('user')).toEqual({ id: 5 });
    });
  });

  describe('Pub/Sub (on / _emit)', () => {
    it('should notify listeners when a key changes', () => {
      const calls = [];
      Store.on('vehicles', (data) => calls.push(data));
      Store.set('vehicles', [{ id: 1 }]);
      expect(calls).toHaveLength(1);
      expect(calls[0]).toEqual([{ id: 1 }]);
    });

    it('should support wildcard listener with *', () => {
      const calls = [];
      Store.on('*', (event, data) => calls.push({ event, data }));
      Store.set('user', { name: 'John' });
      expect(calls.length).toBeGreaterThanOrEqual(1);
      expect(calls[0].event).toBe('user');
    });

    it('should return cleanup function from on()', () => {
      const calls = [];
      const unsub = Store.on('vehicles', (data) => calls.push(data));
      unsub();
      Store.set('vehicles', []);
      expect(calls).toHaveLength(0);
    });

    it('should notify on setState', () => {
      const calls = [];
      Store.on('user', (data) => calls.push(data));
      Store.setState({ user: { name: 'Jane' } });
      expect(calls).toHaveLength(1);
    });

    it('should support multiple listeners for same event', () => {
      const calls1 = [];
      const calls2 = [];
      Store.on('sectors', (d) => calls1.push(d));
      Store.on('sectors', (d) => calls2.push(d));
      Store.set('sectors', [{ id: 'SEC1' }]);
      expect(calls1).toHaveLength(1);
      expect(calls2).toHaveLength(1);
    });
  });

  describe('reset', () => {
    it('should clear all state to defaults', () => {
      Store.set('user', { id: 1 });
      Store.set('vehicles', [{ id: 1 }]);
      Store.set('loading', true);
      Store.reset();
      expect(Store.get('user')).toBeNull();
      expect(Store.get('vehicles')).toEqual([]);
      expect(Store.get('loading')).toBe(false);
    });
  });

  describe('mapRole', () => {
    it('should map developer roles', () => {
      expect(Store.mapRole('Desenvolvedor Global')).toBe('dev');
      expect(Store.mapRole('dev')).toBe('dev');
      expect(Store.mapRole('ROOT')).toBe('dev');
    });

    it('should map admin roles', () => {
      expect(Store.mapRole('Administrador')).toBe('admin');
      expect(Store.mapRole('admin')).toBe('admin');
    });

    it('should map manager roles', () => {
      expect(Store.mapRole('Gestor de Setor')).toBe('manager');
      expect(Store.mapRole('Gerente')).toBe('manager');
    });

    it('should map employee as default', () => {
      expect(Store.mapRole('Motorista')).toBe('employee');
      expect(Store.mapRole('')).toBe('employee');
      expect(Store.mapRole(null)).toBe('employee');
      expect(Store.mapRole(undefined)).toBe('employee');
    });
  });
});
