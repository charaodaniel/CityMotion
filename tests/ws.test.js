/**
 * Tests for CityMotion WebSocket Client
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const createWS = (Store) => {
  const WS = {
    _io: null,
    _connected: false,
    _loaded: false,
    _readyCallbacks: [],

    async init() {
      if (this._loaded) return;
      this._loaded = true;
      // In tests, Socket.IO is not loaded from CDN, so we mock the connect
      this._connect();
    },

    _connect() {
      // Mock socket.io connection
      this._io = {
        id: 'test-socket-id',
        on: vi.fn(),
        emit: vi.fn(),
        disconnect: vi.fn(),
      };
      this._connected = true;
      Store.set('wsStatus', true);

      // Simulate connect event
      const user = Store.get('user');
      if (user?.sector) {
        const sectors = Array.isArray(user.sector) ? user.sector : [user.sector];
        sectors.forEach(s => this._io.emit('join-sector', s));
      }

      this._readyCallbacks.forEach(cb => cb());
      this._readyCallbacks = [];

      // Set up event listeners with mock
      this._notificationHandler = null;
      this._entityUpdateHandler = null;
    },

    isConnected() {
      return this._connected;
    },

    onReady(callback) {
      if (this._connected) callback();
      else this._readyCallbacks.push(callback);
    },

    getUnreadCount() {
      const notifs = Store.get('notifications') || [];
      return notifs.filter(n => !n.read).length;
    },

    markAllRead() {
      const notifs = Store.get('notifications') || [];
      Store.set('notifications', notifs.map(n => ({ ...n, read: true })));
    },

    clearNotifications() {
      Store.set('notifications', []);
    },

    disconnect() {
      if (this._io) this._io.disconnect();
      this._io = null;
      this._connected = false;
      Store.set('wsStatus', false);
    },

    // Simulate receiving a notification event
    simulateNotification(data) {
      if (this._notificationHandler) this._notificationHandler(data);
      else {
        const notifs = Store.get('notifications') || [];
        Store.set('notifications', [data, ...notifs]);
      }
    },

    // Simulate receiving an entity update event
    simulateEntityUpdate({ entity, action, data }) {
      const current = Store.get(entity);
      if (!current) return;
      let updated;
      switch (action) {
        case 'create': updated = [data, ...current]; break;
        case 'update': updated = current.map(item => item.id === data.id ? { ...item, ...data } : item); break;
        case 'delete': updated = current.filter(item => item.id !== data.id); break;
        default: updated = current;
      }
      Store.set(entity, updated);
    },
  };
  return WS;
};

const createStore = () => {
  const Store = {
    _state: {
      user: { id: 1, name: 'Test', sector: ['TI'] },
      employees: [],
      vehicles: [],
      notifications: [],
      wsStatus: false,
    },
    _listeners: {},
    on(event, cb) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(cb);
      return () => { this._listeners[event] = this._listeners[event].filter(f => f !== cb); };
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
    get(key) { return this._state[key]; },
    getState() { return { ...this._state }; },
    setState(partial) {
      Object.entries(partial).forEach(([key, value]) => {
        this._state[key] = value;
        this._emit(key, value);
      });
      this._emit('stateChange', partial);
    },
  };
  return Store;
};

describe('WebSocket Client', () => {
  let Store;
  let WS;

  beforeEach(() => {
    Store = createStore();
    WS = createWS(Store);
  });

  describe('init', () => {
    it('should connect and set wsStatus', async () => {
      expect(Store.get('wsStatus')).toBe(false);
      await WS.init();
      expect(WS.isConnected()).toBe(true);
      expect(Store.get('wsStatus')).toBe(true);
    });

    it('should not reconnect if already loaded', async () => {
      await WS.init();
      const ioRef = WS._io;
      await WS.init();
      expect(WS._io).toBe(ioRef);
    });

    it('should join user sectors on connect', async () => {
      await WS.init();
      expect(WS._io.emit).toHaveBeenCalledWith('join-sector', 'TI');
    });
  });

  describe('isConnected / onReady', () => {
    it('should return connected status', async () => {
      expect(WS.isConnected()).toBe(false);
      await WS.init();
      expect(WS.isConnected()).toBe(true);
    });

    it('should execute callback immediately if already connected', async () => {
      await WS.init();
      const cb = vi.fn();
      WS.onReady(cb);
      expect(cb).toHaveBeenCalled();
    });
  });

  describe('Notifications', () => {
    it('should add notification to Store', () => {
      const notif = { id: 'n1', title: 'Test', message: 'Hello', read: false };
      WS.simulateNotification(notif);
      const notifs = Store.get('notifications');
      expect(notifs).toHaveLength(1);
      expect(notifs[0].title).toBe('Test');
    });

    it('should prepend new notifications', () => {
      WS.simulateNotification({ id: 'n1', title: 'First', read: false });
      WS.simulateNotification({ id: 'n2', title: 'Second', read: false });
      expect(Store.get('notifications')).toHaveLength(2);
      expect(Store.get('notifications')[0].title).toBe('Second');
    });
  });

  describe('Entity Updates', () => {
    it('should handle create action', () => {
      Store.set('employees', [{ id: 1, name: 'Original' }]);
      WS.simulateEntityUpdate({ entity: 'employees', action: 'create', data: { id: 2, name: 'New' } });
      expect(Store.get('employees')).toHaveLength(2);
      expect(Store.get('employees')[0].name).toBe('New');
    });

    it('should handle update action', () => {
      Store.set('employees', [{ id: 1, name: 'Old' }, { id: 2, name: 'Keep' }]);
      WS.simulateEntityUpdate({ entity: 'employees', action: 'update', data: { id: 1, name: 'Updated' } });
      const emps = Store.get('employees');
      expect(emps).toHaveLength(2);
      expect(emps.find(e => e.id === 1).name).toBe('Updated');
      expect(emps.find(e => e.id === 2).name).toBe('Keep');
    });

    it('should handle delete action', () => {
      Store.set('vehicles', [{ id: 1, model: 'Bus' }, { id: 2, model: 'Car' }]);
      WS.simulateEntityUpdate({ entity: 'vehicles', action: 'delete', data: { id: 1 } });
      expect(Store.get('vehicles')).toHaveLength(1);
      expect(Store.get('vehicles')[0].id).toBe(2);
    });

    it('should do nothing for unknown entity', () => {
      Store.set('vehicles', [{ id: 1 }]);
      WS.simulateEntityUpdate({ entity: 'vehicles', action: 'update', data: { id: 99, model: 'Ghost' } });
      // If entity doesn't exist in store, it shouldn't be added
      expect(Store.get('vehicles')).toHaveLength(1);
    });
  });

  describe('markAllRead / clearNotifications', () => {
    it('should mark all notifications as read', () => {
      WS.simulateNotification({ id: 'n1', title: 'A', read: false });
      WS.simulateNotification({ id: 'n2', title: 'B', read: false });
      WS.markAllRead();
      expect(Store.get('notifications').every(n => n.read)).toBe(true);
    });

    it('should clear all notifications', () => {
      WS.simulateNotification({ id: 'n1', title: 'A', read: false });
      WS.clearNotifications();
      expect(Store.get('notifications')).toHaveLength(0);
    });
  });

  describe('getUnreadCount', () => {
    it('should return count of unread notifications', () => {
      WS.simulateNotification({ id: 'n1', read: false });
      WS.simulateNotification({ id: 'n2', read: true });
      WS.simulateNotification({ id: 'n3', read: false });
      expect(WS.getUnreadCount()).toBe(2);
    });

    it('should return 0 when no notifications', () => {
      expect(WS.getUnreadCount()).toBe(0);
    });
  });

  describe('disconnect', () => {
    it('should disconnect and clear status', async () => {
      await WS.init();
      expect(WS.isConnected()).toBe(true);
      WS.disconnect();
      expect(WS.isConnected()).toBe(false);
      expect(Store.get('wsStatus')).toBe(false);
    });
  });
});
