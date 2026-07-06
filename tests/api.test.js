/**
 * Tests for CityMotion API Client
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const createAPI = () => {
  const API = {
    BASE: '',

    getToken() {
      return localStorage.getItem('citymotion_token');
    },

    getUser() {
      try {
        const raw = localStorage.getItem('citymotion_user');
        return raw ? JSON.parse(raw) : null;
      } catch { return null; }
    },

    setUser(user) {
      localStorage.setItem('citymotion_user', JSON.stringify(user));
    },

    headers(extra = {}) {
      const h = { 'Content-Type': 'application/json', ...extra };
      const token = this.getToken();
      if (token) h['Authorization'] = `Bearer ${token}`;
      return h;
    },

    logout() {
      localStorage.removeItem('citymotion_token');
      localStorage.removeItem('citymotion_user');
    },

    async get(path) {
      const res = await fetch(this.BASE + path, { headers: this.headers() });
      if (res.status === 401 || res.status === 403) { this.logout(); throw new Error('Sessão expirada'); }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Erro ${res.status}`);
      }
      return res.json();
    },

    async post(path, body) {
      const res = await fetch(this.BASE + path, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify(body),
      });
      if (res.status === 401 || res.status === 403) { this.logout(); throw new Error('Sessão expirada'); }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Erro ${res.status}`);
      }
      return res.json();
    },

    async syncAll() {
      return this.get('/api/sync-all');
    },

    async login(email, password) {
      return this.post('/api/login', { email, password });
    },
  };
  return API;
};

describe('API Client', () => {
  let API;

  beforeEach(() => {
    localStorage.clear();
    API = createAPI();
  });

  describe('Auth - getToken / getUser / setUser', () => {
    it('should return null when no token is set', () => {
      expect(API.getToken()).toBeNull();
    });

    it('should return stored token', () => {
      localStorage.setItem('citymotion_token', 'test-token');
      expect(API.getToken()).toBe('test-token');
    });

    it('should store and retrieve user', () => {
      const user = { id: 1, name: 'Test', role: 'dev' };
      API.setUser(user);
      expect(API.getUser()).toEqual(user);
    });

    it('should return null for invalid JSON in getUser', () => {
      localStorage.setItem('citymotion_user', 'not-json');
      expect(API.getUser()).toBeNull();
    });
  });

  describe('headers', () => {
    it('should include Content-Type by default', () => {
      const h = API.headers();
      expect(h['Content-Type']).toBe('application/json');
    });

    it('should include Authorization header when token exists', () => {
      localStorage.setItem('citymotion_token', 'my-jwt-token');
      const h = API.headers();
      expect(h['Authorization']).toBe('Bearer my-jwt-token');
    });

    it('should not include Authorization when no token', () => {
      const h = API.headers();
      expect(h['Authorization']).toBeUndefined();
    });

    it('should merge extra headers', () => {
      const h = API.headers({ 'X-Custom': 'value' });
      expect(h['X-Custom']).toBe('value');
      expect(h['Content-Type']).toBe('application/json');
    });
  });

  describe('logout', () => {
    it('should clear token and user from localStorage', () => {
      localStorage.setItem('citymotion_token', 'token');
      localStorage.setItem('citymotion_user', '{"name":"test"}');
      API.logout();
      expect(localStorage.getItem('citymotion_token')).toBeNull();
      expect(localStorage.getItem('citymotion_user')).toBeNull();
    });
  });

  describe('get', () => {
    it('should make a GET request and return JSON', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true, status: 200,
        json: async () => ({ data: 'test' }),
        headers: new Map(),
      });
      const result = await API.get('/api/data');
      expect(result).toEqual({ data: 'test' });
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/data', expect.any(Object));
    });

    it('should throw on 401 and logout', async () => {
      localStorage.setItem('citymotion_token', 'expired');
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false, status: 401,
        json: async () => ({}),
        headers: new Map(),
      });
      await expect(API.get('/api/data')).rejects.toThrow('Sessão expirada');
      expect(localStorage.getItem('citymotion_token')).toBeNull();
    });

    it('should throw on 403 and logout', async () => {
      localStorage.setItem('citymotion_token', 'forbidden');
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false, status: 403,
        json: async () => ({}),
        headers: new Map(),
      });
      await expect(API.get('/api/data')).rejects.toThrow('Sessão expirada');
    });

    it('should throw with server error message', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false, status: 400,
        json: async () => ({ message: 'Dados inválidos' }),
        headers: new Map(),
      });
      await expect(API.get('/api/data')).rejects.toThrow('Dados inválidos');
    });

    it('should throw generic error when no message in response', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false, status: 500,
        json: async () => ({}),
        headers: new Map(),
      });
      await expect(API.get('/api/data')).rejects.toThrow('Erro 500');
    });
  });

  describe('post', () => {
    it('should make a POST request with JSON body', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true, status: 200,
        json: async () => ({ id: 1 }),
        headers: new Map(),
      });
      const result = await API.post('/api/login', { email: 'test@test.com', password: '123' });
      expect(result).toEqual({ id: 1 });
      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/login',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  describe('syncAll', () => {
    it('should call get with /api/sync-all', async () => {
      const spy = vi.spyOn(API, 'get').mockResolvedValue({});
      await API.syncAll();
      expect(spy).toHaveBeenCalledWith('/api/sync-all');
    });
  });

  describe('login', () => {
    it('should call post with email and password', async () => {
      const spy = vi.spyOn(API, 'post').mockResolvedValue({ token: 'abc' });
      const result = await API.login('user@test.com', 'pass');
      expect(spy).toHaveBeenCalledWith('/api/login', { email: 'user@test.com', password: 'pass' });
      expect(result).toEqual({ token: 'abc' });
    });
  });
});
