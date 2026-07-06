/**
 * CityMotion API Client
 * Fetch wrapper com autenticação JWT e tratamento de erros
 */
const API = {
  BASE: '',

  /** Pega o token JWT do localStorage */
  getToken() {
    return localStorage.getItem('citymotion_token');
  },

  /** Pega o usuário logado do localStorage */
  getUser() {
    try {
      const raw = localStorage.getItem('citymotion_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /** Salva o usuário no localStorage */
  setUser(user) {
    localStorage.setItem('citymotion_user', JSON.stringify(user));
  },

  /** Headers padrão com autenticação */
  headers(extra = {}) {
    const h = { 'Content-Type': 'application/json', ...extra };
    const token = this.getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  },

  /** Logout: limpa token e redireciona */
  logout() {
    localStorage.removeItem('citymotion_token');
    localStorage.removeItem('citymotion_user');
    window.location.href = '/index.html';
  },

  /** Requisição GET */
  async get(path) {
    const res = await fetch(this.BASE + path, { headers: this.headers() });
    if (res.status === 401 || res.status === 403) { this.logout(); throw new Error('Sessão expirada'); }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || `Erro ${res.status}`);
    }
    return res.json();
  },

  /** Requisição POST */
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

  /** Requisição PUT */
  async put(path, body) {
    const res = await fetch(this.BASE + path, {
      method: 'PUT',
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

  /** Requisição DELETE */
  async del(path, body) {
    const res = await fetch(this.BASE + path, {
      method: 'DELETE',
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

  /** Sincronizar todos os dados */
  async syncAll() {
    return this.get('/api/sync-all');
  },

  /** Login */
  async login(email, password) {
    return this.post('/api/login', { email, password });
  },
};
