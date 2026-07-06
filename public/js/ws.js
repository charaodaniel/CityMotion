/**
 * CityMotion WebSocket Manager
 * Conexão Socket.IO para notificações e sincronização em tempo real
 * Carrega socket.io client dinamicamente via CDN
 */
const WS = {
  _io: null,
  _connected: false,
  _reconnectTimer: null,
  _loaded: false,
  _readyCallbacks: [],
  _notificationCleanup: null,

  /** Inicializar: carregar socket.io CDN e conectar */
  async init() {
    if (this._loaded) return;
    this._loaded = true;

    // Carregar socket.io client do CDN (com fallback)
    return new Promise((resolve) => {
      const CDNS = [
        'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.8.1/socket.io.min.js',
        'https://cdn.socket.io/4.8.1/socket.io.min.js',
        'https://cdn.jsdelivr.net/npm/socket.io-client@4.8.1/dist/socket.io.min.js',
      ];
      let attempt = 0;
      const tryLoad = () => {
        if (attempt >= CDNS.length) {
          console.warn('[WS] Todas as CDNs falharam, notificações desabilitadas');
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = CDNS[attempt];
        script.crossOrigin = 'anonymous';
        script.onload = () => {
          console.log('[WS] Socket.IO client loaded from', CDNS[attempt]);
          this._connect();
          resolve();
        };
        script.onerror = () => {
          attempt++;
          tryLoad();
        };
        document.head.appendChild(script);
      }
      tryLoad();
    });
  },

  /** Conectar ao servidor Socket.IO */
  _connect() {
    if (typeof io === 'undefined') {
      console.warn('[WS] Socket.IO not available');
      return;
    }

    const token = API.getToken();
    if (!token) return;

    try {
      this._io = io('', {
        transports: ['websocket', 'polling'],
        auth: { token },
      });

      this._io.on('connect', () => {
        this._connected = true;
        Store.set('wsStatus', true);
        console.log('[WS] Conectado:', this._io.id);

        // Entrar no setor do usuário
        const user = Store.get('user');
        if (user?.sector) {
          const sectors = Array.isArray(user.sector) ? user.sector : [user.sector];
          sectors.forEach(s => this._io.emit('join-sector', s));
        }

        this._readyCallbacks.forEach(cb => cb());
        this._readyCallbacks = [];
      });

      // ==================== EVENT LISTENERS ====================

      // Notificações de alerta (solicitações, etc.)
      this._io.on('notification', (data) => {
        console.log('[WS] Notification:', data);
        const notifs = Store.get('notifications') || [];
        Store.set('notifications', [data, ...notifs]);
      });

      // Atualizações de entidades (dados sincronizados)
      this._io.on('entity-update', ({ entity, action, data }) => {
        console.log(`[WS] Entity update: ${entity}/${action}`, data);

        const current = Store.get(entity);
        if (!current) return;

        let updated;
        switch (action) {
          case 'create':
            updated = [data, ...current];
            break;
          case 'update':
            updated = current.map(item =>
              item.id === data.id ? { ...item, ...data } : item
            );
            break;
          case 'delete':
            updated = current.filter(item => item.id !== data.id);
            break;
          default:
            updated = current;
        }

        Store.set(entity, updated);
      });

      this._io.on('disconnect', () => {
        this._connected = false;
        Store.set('wsStatus', false);
        console.log('[WS] Desconectado');
      });

      this._io.on('connect_error', (err) => {
        console.warn('[WS] Erro de conexão:', err.message);
      });

    } catch (err) {
      console.warn('[WS] Erro ao conectar:', err.message);
    }
  },

  /** Verificar se está conectado */
  isConnected() {
    return this._connected;
  },

  /** Aguardar conexão */
  onReady(callback) {
    if (this._connected) {
      callback();
    } else {
      this._readyCallbacks.push(callback);
    }
  },

  /** Notificações não lidas */
  getUnreadCount() {
    const notifs = Store.get('notifications') || [];
    return notifs.filter(n => !n.read).length;
  },

  /** Marcar todas como lidas */
  markAllRead() {
    const notifs = Store.get('notifications') || [];
    Store.set('notifications', notifs.map(n => ({ ...n, read: true })));
  },

  /** Limpar notificações */
  clearNotifications() {
    Store.set('notifications', []);
  },

  /** Desconectar e limpar */
  disconnect() {
    if (this._io) {
      this._io.disconnect();
      this._io = null;
    }
    this._connected = false;
  },
};
