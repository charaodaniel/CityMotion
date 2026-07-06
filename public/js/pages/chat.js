/**
 * CityMotion — Página: Chat (NexusTalk)
 * Contatos sidebar, mensagens em tempo real, envio de mensagens
 */
export default function ChatPage(container, Store, API) {
  let state = {
    selectedUserId: null,
    search: '',
    newMessage: '',
  };

  function upd(partial) { state = { ...state, ...partial }; }

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
    return employees.filter(e =>
      e.id !== user?.id &&
      e.status !== 'Desativado' &&
      e.name.toLowerCase().includes(q)
    );
  }

  function getActiveMessages() {
    const user = Store.get('user');
    const messages = Store.get('messages') || [];
    const selId = state.selectedUserId;
    if (!user || !selId) return [];
    return messages.filter(m =>
      (m.senderId === user.id && m.receiverId === selId) ||
      (m.senderId === selId && m.receiverId === user.id)
    );
  }

  function getSelectedUser() {
    const employees = Store.get('employees') || [];
    return employees.find(e => e.id === state.selectedUserId) || null;
  }

  function handleSend() {
    const user = Store.get('user');
    const msg = state.newMessage.trim();
    if (!msg || !state.selectedUserId || !user) return;

    const messages = [...(Store.get('messages') || [])];
    const newMsg = {
      id: 'MSG' + Date.now(),
      senderId: user.id,
      receiverId: state.selectedUserId,
      content: msg,
      timestamp: new Date().toISOString(),
      isRead: 0,
    };
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
              const isActive = e.id === state.selectedUserId;
              return `
              <button class="w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-left group ${isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-zinc-800/30 border border-transparent'}" data-user-id="${e.id}">
                <div class="relative shrink-0">
                  <div class="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400 border border-zinc-700/50">${(e.name || '?')[0]}</div>
                  <div class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-zinc-950 ${e.status === 'Disponível' ? 'bg-emerald-500' : 'bg-zinc-600'}"></div>
                </div>
                <div class="flex-1 overflow-hidden text-left">
                  <p class="text-xs font-bold truncate text-zinc-200">${e.name}</p>
                  <p class="text-[9px] text-zinc-500 uppercase tracking-widest truncate">${e.role}</p>
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
                    <span class="text-[9px] text-zinc-600 flex items-center gap-1">
                      <svg class="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                      NEX-256
                    </span>
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
        upd({ selectedUserId: btn.dataset.userId });
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
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      });
      input.addEventListener('input', e => {
        upd({ newMessage: e.target.value });
        // Re-enable/disable send button
        const btn = document.getElementById('btnSendMessage');
        if (btn) btn.disabled = !e.target.value.trim();
      });
    }
  }

  // ----------------------------------------------------------
  //  Subscriptions
  // ----------------------------------------------------------
  const unsubEmployees = Store.on('employees', render);
  const unsubMessages = Store.on('messages', () => {
    render();
    setTimeout(() => {
      const ca = document.getElementById('chatMessages');
      if (ca) ca.scrollTop = ca.scrollHeight;
    }, 50);
  });
  const unsubUser = Store.on('user', render);

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
  };
}
