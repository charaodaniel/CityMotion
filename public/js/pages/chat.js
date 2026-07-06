/**
 * CityMotion — Página: Chat (NexusTalk)
 * Contatos sidebar, mensagens em tempo real, envio de mensagens
 */
export default function ChatPage(container, Store, API) {
  let state = {
    selectedUserId: null,
    search: '',
    newMessage: '',
    unreadMap: {}, // { userId: count }
    typingUsers: {}, // { userId: true } - quem está digitando
  };
  let _typingTimer = null; // debounce timer
  let _typingExpireTimers = {}; // auto-expire per user

  function upd(partial) { state = { ...state, ...partial }; }

  // Emitir 'typing' via WebSocket com debounce
  function emitTyping(receiverId) {
    if (!WS._io || !WS._connected) return;
    const user = Store.get('user');
    if (!user) return;
    if (_typingTimer) return; // já emitiu nos últimos 2s
    WS._io.emit('typing', { from: String(user.id), to: receiverId });
    _typingTimer = setTimeout(() => {
      _typingTimer = null;
    }, 2000);
  }

  // Emitir 'stop-typing'
  function emitStopTyping(receiverId) {
    if (!WS._io || !WS._connected) return;
    const user = Store.get('user');
    if (!user) return;
    if (_typingTimer) {
      clearTimeout(_typingTimer);
      _typingTimer = null;
    }
    WS._io.emit('stop-typing', { from: String(user.id), to: receiverId });
  }

  // Sincronizar typingUsers do Store
  function syncTypingUsers() {
    const typingUsers = Store.get('typingUsers') || {};
    upd({ typingUsers });
    // Auto-expire após 3s sem atualização
    for (const uid of Object.keys(typingUsers)) {
      if (typingUsers[uid]) {
        if (_typingExpireTimers[uid]) clearTimeout(_typingExpireTimers[uid]);
        _typingExpireTimers[uid] = setTimeout(() => {
          const tu = { ...state.typingUsers };
          delete tu[uid];
          upd({ typingUsers: tu });
          render();
          delete _typingExpireTimers[uid];
        }, 3000);
      }
    }
  }

  // Calcular mensagens não lidas por contato
  function computeUnread() {
    const user = Store.get('user');
    const messages = Store.get('messages') || [];
    if (!user) return {};
    const userIdStr = String(user.id);
    const unread = {};
    for (const m of messages) {
      // Mensagens de OUTROS para MIM, não lidas
      if (String(m.receiverId) === userIdStr && !m.isRead) {
        const sender = String(m.senderId);
        unread[sender] = (unread[sender] || 0) + 1;
      }
    }
    return unread;
  }

  function getRoleBadge(role) {
    const r = (role || '').toLowerCase();
    if (r.includes('admin') || r.includes('dev')) return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    if (r.includes('motorista')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (r.includes('gestor')) return 'bg-primary/10 text-primary border-primary/20';
    return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
  }

  function getFilteredEmployees() {
    const user = Store.get('user');
    const employees = Store.get('employees') || [];
    const q = state.search.toLowerCase();
    const userIdStr = String(user?.id || '');
    return employees.filter(e =>
      String(e.id) !== userIdStr &&
      e.status !== 'Desativado' &&
      e.name.toLowerCase().includes(q)
    );
  }

  function getActiveMessages() {
    const user = Store.get('user');
    const messages = Store.get('messages') || [];
    const selId = state.selectedUserId;
    if (!user || !selId) return [];
    const userIdStr = String(user.id);
    return messages.filter(m =>
      (String(m.senderId) === userIdStr && String(m.receiverId) === selId) ||
      (String(m.senderId) === selId && String(m.receiverId) === userIdStr)
    );
  }

  function getSelectedUser() {
    const employees = Store.get('employees') || [];
    return employees.find(e => String(e.id) === state.selectedUserId) || null;
  }

  async function handleSend() {
    const user = Store.get('user');
    const msg = state.newMessage.trim();
    if (!msg || !state.selectedUserId || !user) return;

    const messages = [...(Store.get('messages') || [])];
    const newMsg = {
      id: 'MSG' + Date.now(),
      senderId: String(user.id),
      receiverId: state.selectedUserId,
      content: msg,
      timestamp: new Date().toISOString(),
      isRead: 0,
    };

    try {
      await API.post('/api/messages', {
        receiverId: state.selectedUserId,
        content: msg,
      });
    } catch (e) {
      // Fallback: salvar localmente se API falhar
    }

    Store.set('messages', [...messages, newMsg]);
    upd({ newMessage: '' });
    render();
    setTimeout(() => {
      const chatArea = document.getElementById('chatMessages');
      if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;
    }, 50);
  }

  // ----------------------------------------------------------
  //  Render
  // ----------------------------------------------------------
  function render() {
    const user = Store.get('user');
    const filtered = getFilteredEmployees();
    const activeMessages = getActiveMessages();
    const selectedUser = getSelectedUser();

    container.innerHTML = `
      <div class="flex h-[calc(100vh-4rem)] overflow-hidden" style="margin: -2rem">
        <!-- Sidebar - Contatos -->
        <div class="w-72 lg:w-80 border-r border-zinc-800/50 bg-zinc-900/30 flex flex-col shrink-0">
          <div class="p-4 sm:p-5 border-b border-zinc-800/50 space-y-3">
            <h1 class="text-lg font-black tracking-tighter flex items-center gap-2">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              NexusTalk
            </h1>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" id="chatSearch" value="${state.search}" placeholder="Buscar contato..." class="w-full pl-8 pr-3 py-1.5 bg-black/30 border border-zinc-700/50 rounded-lg text-xs focus:outline-none focus:border-primary/50" />
            </div>
          </div>
          <div class="flex-1 overflow-y-auto p-2 space-y-0.5" id="contactList">
            ${filtered.length > 0 ? filtered.map(e => {
              const eid = String(e.id);
              const isActive = eid === state.selectedUserId;
              const unreadCount = state.unreadMap[eid] || 0;
              return `
              <button class="w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-left group ${isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-zinc-800/30 border border-transparent'}" data-user-id="${e.id}">
                <div class="relative shrink-0">
                  <div class="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400 border border-zinc-700/50">${(e.name || '?')[0]}</div>
                  ${unreadCount > 0 && !isActive ? `<div class="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-white text-[8px] font-bold flex items-center justify-center shadow-lg shadow-primary/30">${unreadCount > 9 ? '9+' : unreadCount}</div>` : ''}
                  <div class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-zinc-950 ${e.status === 'Disponível' ? 'bg-emerald-500' : 'bg-zinc-600'}"></div>
                </div>
                <div class="flex-1 overflow-hidden text-left">
                  <p class="text-xs font-bold truncate text-zinc-200">${e.name}</p>
                  <p class="text-[9px] text-zinc-500 uppercase tracking-widest truncate">${e.role}</p>
                  ${unreadCount > 0 && !isActive ? `<p class="text-[8px] text-primary font-bold mt-0.5">${unreadCount} mensagem(ns) nova(s)</p>` : ''}
                </div>
              </button>`;
            }).join('') : `
            <div class="text-center py-8 text-xs text-zinc-600 italic">Nenhum contato disponível.</div>`}
          </div>
        </div>

        <!-- Main - Mensagens -->
        <div class="flex-1 flex flex-col relative bg-black/10">
          ${selectedUser ? `
            <!-- Header -->
            <div class="h-16 border-b border-zinc-800/50 px-4 sm:px-6 flex items-center justify-between bg-zinc-900/20 backdrop-blur-md shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-base font-bold text-zinc-400 border-2 border-primary/20 shrink-0">${(selectedUser.name || '?')[0]}</div>
                <div>
                  <h3 class="font-bold text-sm leading-tight text-zinc-200">${selectedUser.name}</h3>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${getRoleBadge(selectedUser.role)}">${selectedUser.role}</span>
                    ${state.typingUsers[String(selectedUser.id)] ? `
                      <span class="inline-flex items-center text-[9px] text-primary font-bold gap-1">
                        <span class="typing-dots flex gap-0.5">
                          <span class="w-1 h-1 rounded-full bg-primary animate-bounce" style="animation-delay:0ms"></span>
                          <span class="w-1 h-1 rounded-full bg-primary animate-bounce" style="animation-delay:200ms"></span>
                          <span class="w-1 h-1 rounded-full bg-primary animate-bounce" style="animation-delay:400ms"></span>
                        </span>
                        digitando...
                      </span>
                    ` : `<span class="text-[9px] text-zinc-600 flex items-center gap-1">
                      <svg class="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                      NEX-256
                    </span>`}
                  </div>
                </div>
              </div>
            </div>

            <!-- Messages -->
            <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" id="chatMessages">
              ${activeMessages.length > 0 ? activeMessages.map(m => {
                const isMe = m.senderId === user?.id;
                return `
                <div class="flex ${isMe ? 'justify-end' : 'justify-start'}">
                  <div class="max-w-[80%]">
                    <div class="p-3 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-primary/20 text-zinc-200 rounded-tr-none border border-primary/30' : 'bg-zinc-900/80 text-zinc-300 rounded-tl-none border border-zinc-800/50'}">${m.content}</div>
                    <div class="flex items-center gap-1 mt-1 px-1 ${isMe ? 'justify-end' : 'justify-start'}">
                      <span class="text-[9px] font-mono text-zinc-600">${m.timestamp ? new Date(m.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                      ${isMe ? '<svg class="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' : ''}
                    </div>
                  </div>
                </div>`;
              }).join('') : `
              <div class="flex flex-col items-center justify-center h-full text-center opacity-30 select-none">
                <svg class="w-10 h-10 mb-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                <p class="text-xs font-bold uppercase tracking-widest">Inicie um protocolo de comunicação</p>
                <p class="text-[10px] text-zinc-600">Segurança técnica ativa para este terminal.</p>
              </div>`}
              <div id="chatScrollAnchor"></div>
            </div>

            <!-- Input -->
            <div class="p-3 sm:p-4 bg-black/30 backdrop-blur-md border-t border-zinc-800/30 shrink-0">
              <div class="flex gap-2">
                <div class="flex-1 relative">
                  <input type="text" id="chatInput" value="${state.newMessage}" placeholder="Digite sua mensagem técnica..." class="w-full h-10 px-3 bg-black/40 border border-zinc-700/50 rounded-lg text-xs focus:outline-none focus:border-primary/50 pr-20" />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-mono text-primary/30 font-bold">CM-MSG-SYS</span>
                </div>
                <button id="btnSendMessage" class="h-10 w-10 bg-primary hover:bg-primary/90 rounded-lg flex items-center justify-center transition-transform active:scale-95 shadow-lg shadow-primary/20 shrink-0" ${!state.newMessage.trim() ? 'disabled' : ''}>
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19V5m0 0l-7 7m7-7l7 7"/></svg>
                </button>
              </div>
            </div>
          ` : `
            <!-- Empty state -->
            <div class="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div class="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10 mb-5">
                <svg class="w-8 h-8 text-primary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              </div>
              <h2 class="text-xl font-black tracking-tighter mb-2">Central de Comunicação</h2>
              <p class="text-xs text-zinc-500 max-w-xs">Selecione um colaborador no terminal lateral para iniciar a transmissão de dados e orientações operacionais.</p>
            </div>`}
        </div>
      </div>`;
    setupEventListeners();
    // Scroll to bottom
    setTimeout(() => {
      const ca = document.getElementById('chatMessages');
      if (ca) ca.scrollTop = ca.scrollHeight;
    }, 50);
  }

  function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('chatSearch');
    if (searchInput) {
      searchInput.addEventListener('input', e => { upd({ search: e.target.value }); render(); });
    }

    // Contact list clicks (delegated)
    container.addEventListener('click', e => {
      const btn = e.target.closest('[data-user-id]');
      if (btn) {
        const userId = btn.dataset.userId;
        // Limpar não-lidas para este contato
        const unreadMap = { ...state.unreadMap };
        delete unreadMap[userId];
        upd({ selectedUserId: userId, unreadMap });
        render();
        setTimeout(() => {
          const ca = document.getElementById('chatMessages');
          if (ca) ca.scrollTop = ca.scrollHeight;
        }, 50);
      }
    });

    // Send via button
    const sendBtn = document.getElementById('btnSendMessage');
    if (sendBtn) sendBtn.addEventListener('click', handleSend);

    // Send via Enter
    const input = document.getElementById('chatInput');
    if (input) {
      // Enviar stop-typing ao pressionar Enter
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (state.selectedUserId) emitStopTyping(state.selectedUserId);
          handleSend();
        }
      });
      input.addEventListener('input', e => {
        const val = e.target.value;
        upd({ newMessage: val });
        // Emitir 'typing' via WebSocket (com debounce)
        if (state.selectedUserId) {
          if (val.trim()) {
            emitTyping(state.selectedUserId);
          } else {
            emitStopTyping(state.selectedUserId);
          }
        }
        // Re-enable/disable send button
        const btn = document.getElementById('btnSendMessage');
        if (btn) btn.disabled = !val.trim();
      });

      // Stop typing ao perder foco
      input.addEventListener('blur', () => {
        if (state.selectedUserId) emitStopTyping(state.selectedUserId);
      });
    }
  }

  // ----------------------------------------------------------
  //  Subscriptions
  // ----------------------------------------------------------
  const unsubEmployees = Store.on('employees', () => { upd({ unreadMap: computeUnread() }); render(); });
  const unsubMessages = Store.on('messages', () => {
    upd({ unreadMap: computeUnread() });
    // Limpar typing ao receber mensagem
    const selId = state.selectedUserId;
    if (selId) {
      const tu = { ...state.typingUsers };
      delete tu[selId];
      upd({ typingUsers: tu });
    }
    render();
    setTimeout(() => {
      const ca = document.getElementById('chatMessages');
      if (ca) ca.scrollTop = ca.scrollHeight;
    }, 50);
  });
  const unsubUser = Store.on('user', () => { upd({ unreadMap: computeUnread() }); render(); });
  const unsubTyping = Store.on('typingUsers', () => {
    syncTypingUsers();
    render();
  });

  // ----------------------------------------------------------
  //  Render inicial
  // ----------------------------------------------------------
  render();

  // ----------------------------------------------------------
  //  Cleanup
  // ----------------------------------------------------------
  return () => {
    unsubEmployees();
    unsubMessages();
    unsubUser();
    unsubTyping();
    // Limpar timers
    if (_typingTimer) { clearTimeout(_typingTimer); _typingTimer = null; }
    for (const key of Object.keys(_typingExpireTimers)) {
      clearTimeout(_typingExpireTimers[key]);
    }
  };
}
