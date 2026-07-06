/**
 * CityMotion — Página: Funcionários
 * Grid de cards, busca, modais de detalhes/registro/edição, exclusão
 */
export default function EmployeesPage(container, Store, API) {
  // ----------------------------------------------------------
  //  Estado local
  // ----------------------------------------------------------
  let state = {
    activeModal: null, // null | 'register' | 'details' | 'edit'
    selectedEmployee: null,
    formData: {
      name: '',
      matricula: '',
      email: '',
      password: '',
      role: '',
      cnh: '',
      sector: [],
      lgpdConsent: false,
    },
  };

  function upd(partial) {
    state = { ...state, ...partial };
  }

  // ----------------------------------------------------------
  //  Helpers
  // ----------------------------------------------------------
  function getStatusLabel(status) {
    const map = {
      Disponível: 'secondary',
      'Em Serviço': 'default',
      'Em Viagem': 'default',
      Afastado: 'destructive',
      Desativado: 'destructive',
    };
    return map[status] || 'outline';
  }

  function getVisibleEmployees() {
    const user = Store.get('user');
    const userRole = Store.mapRole(user?.role);
    const employees = Store.get('employees') || [];

    // Dev vê todos
    if (userRole === 'dev') return employees;
    // Outros: apenas ativos
    return employees.filter((e) => e.status !== 'Desativado');
  }

  const EMPLOYEE_ROLES = [
    'CEO', 'Coordenador de Setor', 'Diretor', 'Enfermeiro(a)',
    'Engenheiro(a)', 'Estagiário', 'Gerente Geral', 'Motorista',
    'Motorista de Ambulância', 'Motorista Escolar', 'Médico(a)',
    'Operador de Máquinas', 'Professor(a)', 'Secretário(a)',
    'Supervisor', 'Técnico Administrativo', 'Técnico de TI',
  ];

  // ----------------------------------------------------------
  //  CRUD
  // ----------------------------------------------------------
  async function handleFormSubmit(data) {
    const employees = [...(Store.get('employees') || [])];
    if (state.activeModal === 'edit' && state.selectedEmployee) {
      try {
        const result = await API.put('/api/employees/' + state.selectedEmployee.id, data);
        Store.set('employees', employees.map((e) => e.id === state.selectedEmployee.id ? { ...e, ...result, sector: data.sector } : e));
      } catch (e) {
        Store.set('employees', employees.map((e) => e.id === state.selectedEmployee.id ? { ...e, ...data, sector: data.sector } : e));
      }
    } else {
      try {
        const payload = { ...data, password: data.password || '123456', sector: Array.isArray(data.sector) ? JSON.stringify(data.sector) : data.sector };
        const result = await API.post('/api/employees', payload);
        Store.set('employees', [...employees, { ...data, ...result, sector: data.sector, status: 'Disponível' }]);
      } catch (e) {
        const newEmployee = { id: 'E' + Date.now(), ...data, sector: data.sector || [], status: 'Disponível' };
        Store.set('employees', [...employees, newEmployee]);
      }
    }
    closeModal();
  }

  function handleDelete(id) {
    const user = Store.get('user');
    const userRole = Store.mapRole(user?.role);
    const employees = [...(Store.get('employees') || [])];

    if (userRole === 'dev') {
      // Remove permanentemente
      Store.set('employees', employees.filter((e) => e.id !== id));
    } else {
      // Marca como desativado
      Store.set(
        'employees',
        employees.map((e) =>
          e.id === id ? { ...e, status: 'Desativado' } : e
        )
      );
    }
    closeModal();
  }

  // ----------------------------------------------------------
  //  Modal
  // ----------------------------------------------------------
  function openModal(type, employee) {
    const data = employee
      ? {
          name: employee.name || '',
          matricula: employee.matricula || '',
          email: employee.email || '',
          password: '',
          role: employee.role || '',
          cnh: employee.cnh || '',
          sector: Array.isArray(employee.sector) ? [...employee.sector] : employee.sector ? [employee.sector] : [],
          lgpdConsent: true,
        }
      : {
          name: '', matricula: '', email: '', password: '',
          role: '', cnh: '', sector: [], lgpdConsent: false,
        };
    upd({ activeModal: type, selectedEmployee: employee, formData: data });
    renderModal();
  }

  function closeModal() {
    upd({ activeModal: null, selectedEmployee: null });
    renderModal();
  }

  function renderModal() {
    const overlay = document.getElementById('funcModalOverlay');
    const content = document.getElementById('funcModalContent');
    if (!overlay || !content) return;
    if (!state.activeModal) {
      overlay.classList.add('hidden');
      return;
    }
    overlay.classList.remove('hidden');

    switch (state.activeModal) {
      case 'details':
        renderDetailsModal(content);
        break;
      case 'register':
      case 'edit':
        renderFormModal(content);
        break;
    }
  }

  function renderDetailsModal(el) {
    const e = state.selectedEmployee;
    if (!e) return;
    const user = Store.get('user');
    const userRole = Store.mapRole(user?.role);

    el.innerHTML = `
      <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <button onclick="document.getElementById('funcModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="text-center mb-6">
          <div class="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center text-3xl font-bold text-zinc-400 border-2 border-primary/20 mx-auto mb-4">${(e.name || 'U').charAt(0)}</div>
          <h2 class="text-2xl font-bold tracking-tight">${e.name}</h2>
          <p class="text-[10px] uppercase tracking-widest font-mono text-primary/70 mt-1">${e.role} • ${Array.isArray(e.sector) ? e.sector.join(', ') : e.sector}</p>
        </div>
        <div class="scanlines rounded-lg border border-zinc-700/50 p-6 bg-zinc-900/30 space-y-4">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nome Completo</span>
            <p class="text-base font-bold mt-1">${e.name}</p>
          </div>
          <div class="border-t border-zinc-800/30"></div>
          ${e.email ? `
            <div>
              <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Email de Acesso</span>
              <p class="text-sm font-mono mt-1 text-primary">${e.email}</p>
            </div>
            <div class="border-t border-zinc-800/30"></div>
          ` : ''}
          ${e.matricula ? `
            <div>
              <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Matrícula</span>
              <p class="text-base font-mono font-bold mt-1 text-primary">${e.matricula}</p>
            </div>
            <div class="border-t border-zinc-800/30"></div>
          ` : ''}
          <div>
            <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</span>
            <div class="mt-1">
              <span class="badge badge-${getStatusLabel(e.status)} text-[10px] font-bold uppercase tracking-tight">${e.status}</span>
            </div>
          </div>
          ${e.cnh ? `
            <div class="border-t border-zinc-800/30"></div>
            <div class="flex items-center gap-2 text-emerald-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              <span class="text-xs font-bold font-mono">CNH OK • ${e.cnh}</span>
            </div>
          ` : ''}
          <div class="border-t border-zinc-800/30"></div>
          <div class="flex justify-between items-center pt-4">
            <button onclick="document.getElementById('funcModalOverlay').dispatchEvent(new CustomEvent('deleteEmployee'))" class="btn btn-ghost btn-sm text-[10px] text-red-400 hover:bg-red-500/10">
              <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              ${userRole === 'dev' ? 'Remover Definitivo' : 'Desativar Registro'}
            </button>
            <button onclick="document.getElementById('funcModalOverlay').dispatchEvent(new CustomEvent('openEdit', {detail: '${e.id}'}))" class="btn btn-outline btn-sm text-[10px]">
              <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              Editar Registro
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderFormModal(el) {
    const isEdit = state.activeModal === 'edit';
    const fd = state.formData;
    const sectors = Store.get('sectors') || [];

    el.innerHTML = `
      <div class="h-1.5 w-full bg-[#93c5fd]"></div>
      <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-black tracking-tight">${isEdit ? 'Editar Funcionário' : 'Cadastro de Funcionário'}</h2>
            <p class="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1">${isEdit ? 'Altere as informações do funcionário' : 'Preencha para cadastrar um novo funcionário'}</p>
          </div>
          <button onclick="document.getElementById('funcModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="scanlines rounded-lg border border-zinc-700/50 p-6 bg-zinc-900/30">
          <form id="employeeForm" class="space-y-6">
            <!-- Credenciais -->
            <div>
              <h3 class="text-sm font-bold mb-4 text-zinc-300">Credenciais de Acesso</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Email Corporativo</label>
                  <input type="email" name="email" value="${fd.email}" placeholder="email@acesso.com" required class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Senha</label>
                  <input type="password" name="password" value="${fd.password}" placeholder="${isEdit ? 'Deixe em branco para não alterar' : 'Senha de 6+ dígitos'}" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
                </div>
              </div>
            </div>
            <div class="border-t border-zinc-800/30"></div>
            <!-- Dados Pessoais -->
            <div>
              <h3 class="text-sm font-bold mb-4 text-zinc-300 flex items-center gap-2">
                <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                Informações Pessoais e Funcionais (LGPD)
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nome Completo</label>
                  <input type="text" name="name" value="${fd.name}" placeholder="Nome do colaborador" required minlength="2" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Matrícula / ID Interno</label>
                  <input type="text" name="matricula" value="${fd.matricula}" placeholder="Número da matrícula" required class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Cargo</label>
                  <select name="role" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50">
                    <option value="">Selecione o cargo</option>
                    ${EMPLOYEE_ROLES.sort().map(r => `<option value="${r}" ${fd.role === r ? 'selected' : ''}>${r}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nº da CNH (apenas motoristas)</label>
                  <input type="text" name="cnh" value="${fd.cnh}" placeholder="0123456789" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
                </div>
              </div>
              <!-- Setores (checkboxes) -->
              <div class="mt-6">
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-3">Setor(es) de Lotação</label>
                ${sectors.length === 0 ? '<p class="text-xs text-zinc-600 italic">Nenhum setor cadastrado.</p>' : `
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3" id="sectorCheckboxes">
                  ${sectors.map(s => `
                    <label class="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/30 cursor-pointer">
                      <input type="checkbox" name="sector" value="${s.name}" ${fd.sector.includes(s.name) ? 'checked' : ''} class="h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-primary focus:ring-primary/30" />
                      <span class="text-xs text-zinc-400">${s.name}</span>
                    </label>
                  `).join('')}
                </div>
                `}
              </div>
            </div>
            <div class="border-t border-zinc-800/30"></div>
            <!-- Documentação -->
            <div>
              <h3 class="text-sm font-bold mb-4 text-zinc-300">Documentação</h3>
              <p class="text-xs text-zinc-600 mb-4">${isEdit ? 'Para alterar um documento, faça um novo upload.' : 'O upload é criptografado e de acesso restrito.'}</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Foto Funcional (3x4)</label>
                  <input type="file" accept="image/*" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30" />
                </div>
                <div>
                  <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Foto da CNH (se condutor)</label>
                  <input type="file" accept="image/*,application/pdf" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30" />
                </div>
              </div>
            </div>
            <div class="border-t border-zinc-800/30"></div>
            <!-- LGPD Consent -->
            <label class="flex items-start gap-3 p-4 rounded-lg border border-zinc-700/50 bg-zinc-900/50 cursor-pointer">
              <input type="checkbox" id="lgpdConsent" ${fd.lgpdConsent ? 'checked' : ''} class="mt-0.5 h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-primary focus:ring-primary/30" />
              <div class="space-y-1 leading-none">
                <span class="text-xs font-bold">Declaro que li e aceito a <a href="#" class="text-primary underline">Política de Privacidade</a></span>
                <p class="text-[10px] text-zinc-600">Autorizo o processamento dos dados pela organização para fins de gestão operacional da frota, conforme a LGPD.</p>
              </div>
            </label>
            <div class="flex justify-end pt-2">
              <button type="button" onclick="document.getElementById('funcModalOverlay').dispatchEvent(new CustomEvent('submitEmployeeForm'))" class="btn btn-primary h-11 px-10 text-[10px] font-black uppercase tracking-[0.2em]">
                ${isEdit ? 'Salvar Alterações' : 'Cadastrar Colaborador'}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // ----------------------------------------------------------
  //  Render
  // ----------------------------------------------------------
  function render() {
    const employees = getVisibleEmployees();
    const user = Store.get('user');
    const userRole = Store.mapRole(user?.role);

    container.innerHTML = `
      <div class="animate-fade-in space-y-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 class="text-3xl sm:text-4xl font-black tracking-tighter flex items-center gap-3">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
              </svg>
              Funcionários
            </h1>
            <p class="text-zinc-400 text-sm mt-1 font-medium">Controle de acesso e identificação NexusOS.</p>
          </div>
          <button onclick="document.getElementById('funcModalOverlay').dispatchEvent(new CustomEvent('openRegister'))" class="btn btn-primary btn-sm text-[10px]">
            <svg class="w-3.5 h-3.5 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Novo Colaborador
          </button>
        </div>

        <!-- Grid -->
        ${employees.length > 0 ? `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          ${employees.map((e) => `
            <div class="nexus-card p-0 overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-300 group ${e.status === 'Desativado' ? 'opacity-60 grayscale' : ''}" data-employee-id="${e.id}">
              <div class="p-5">
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-lg font-bold text-zinc-400 border-2 border-primary/20 flex-shrink-0">${(e.name || 'U').charAt(0)}</div>
                  <div class="overflow-hidden">
                    <h3 class="text-sm font-bold truncate leading-tight text-zinc-200">${e.name}</h3>
                    <p class="text-[10px] uppercase tracking-widest font-mono text-primary/70 truncate">${e.role}</p>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="badge badge-${getStatusLabel(e.status)} text-[9px] font-bold uppercase tracking-tight">${e.status}</span>
                  ${e.cnh ? '<span class="flex items-center text-[9px] font-mono font-bold text-emerald-500/70"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>CNH_OK</span>' : ''}
                </div>
              </div>
              <div class="border-t border-zinc-800/10 bg-black/20">
                <button class="w-full py-2 text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-primary hover:bg-primary/10 transition-colors" data-action="virtual-badge" data-employee-id="${e.id}">
                  <svg class="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/></svg>
                  Ver Crachá Virtual
                </button>
              </div>
            </div>
          `).join('')}
        </div>
        ` : `
        <div class="text-center py-16 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
          <p class="text-lg italic text-zinc-500">Nenhum funcionário cadastrado no momento.</p>
          <button onclick="document.getElementById('funcModalOverlay').dispatchEvent(new CustomEvent('openRegister'))" class="mt-3 text-primary font-bold uppercase tracking-widest text-xs hover:underline">Cadastrar agora</button>
        </div>
        `}
      </div>

      <!-- Modal Overlay -->
      <div id="funcModalOverlay" class="fixed inset-0 z-50 flex items-center justify-center hidden" style="background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);">
        <div id="funcModalContent" class="bg-[#0f0f13] border border-zinc-700/50 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden"></div>
      </div>
    `;

    setupEventListeners();
  }

  // ----------------------------------------------------------
  //  Event Listeners
  // ----------------------------------------------------------
  function setupEventListeners() {
    const overlay = document.getElementById('funcModalOverlay');
    if (!overlay) return;

    // Click nos cards
    container.addEventListener('click', (e) => {
      const card = e.target.closest('[data-employee-id]');
      if (card && !e.target.closest('button')) {
        const eid = card.dataset.employeeId;
        const employees = Store.get('employees') || [];
        const emp = employees.find((x) => x.id === eid);
        if (emp) openModal('details', emp);
      }
    });

    // Botão virtual badge
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="virtual-badge"]');
      if (!btn) return;
      const eid = btn.dataset.employeeId;
      window.open(`/cracha/${eid}`, '_blank');
    });

    // Modal events
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
    overlay.addEventListener('closeModal', () => closeModal());
    overlay.addEventListener('openRegister', () => openModal('register'));
    overlay.addEventListener('openEdit', (e) => {
      const employees = Store.get('employees') || [];
      const emp = employees.find((x) => x.id === e.detail);
      if (emp) openModal('edit', emp);
    });

    // Delete
    overlay.addEventListener('deleteEmployee', () => {
      const emp = state.selectedEmployee;
      if (!emp) return;
      const user = Store.get('user');
      const userRole = Store.mapRole(user?.role);
      const msg = userRole === 'dev'
        ? 'Tem certeza? Esta ação removerá permanentemente o funcionário. Não pode ser desfeita.'
        : 'O funcionário será marcado como "Desativado" e não aparecerá mais nas listagens.';
      if (confirm(`⚠️ ${msg}`)) {
        handleDelete(emp.id);
      }
    });

    // Submit form
    overlay.addEventListener('submitEmployeeForm', () => {
      const form = document.getElementById('employeeForm');
      if (!form) return;
      const data = new FormData(form);
      const name = (data.get('name') || '').trim();
      const matricula = (data.get('matricula') || '').trim();
      const email = (data.get('email') || '').trim();
      const password = data.get('password') || '';
      const role = data.get('role') || '';
      const cnh = (data.get('cnh') || '').trim();
      const lgpdConsent = document.getElementById('lgpdConsent')?.checked || false;

      // Validação
      if (!name || name.length < 2) { Toast.show('O nome completo é obrigatório.', 'warning'); return; }
      if (!matricula) { Toast.show('A matrícula é obrigatória.', 'warning'); return; }
      if (!email || !email.includes('@')) { Toast.show('Informe um email válido.', 'warning'); return; }
      if (!role) { Toast.show('Selecione um cargo.', 'warning'); return; }
      if (state.activeModal !== 'edit' && password && password.length < 6) { Toast.show('A senha deve ter pelo menos 6 caracteres.', 'warning'); return; }
      if (!lgpdConsent && state.activeModal !== 'edit') { Toast.show('É necessário aceitar os termos LGPD.', 'warning'); return; }

      // Coletar setores
      const sectorCheckboxes = form.querySelectorAll('input[name="sector"]:checked');
      const sector = Array.from(sectorCheckboxes).map((cb) => cb.value);

      const submitData = { name, matricula, email, role, cnh, sector };
      if (password && password.length >= 6) submitData.password = password;

      handleFormSubmit(submitData);
    });
  }

  // ----------------------------------------------------------
  //  Subscriptions
  // ----------------------------------------------------------
  const unsubEmployees = Store.on('employees', render);
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
    unsubUser();
  };
}
