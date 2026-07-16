/**
 * CityMotion — Página: Funcionários
 *
 * Módulos:
 *   ./modals.js → Renderizadores de modais (HTML puro)
 */
import { renderDetailsModal, renderFormModal } from './modals.js';

const EMPLOYEE_ROLES = [
  'CEO', 'Coordenador de Setor', 'Diretor', 'Enfermeiro(a)',
  'Engenheiro(a)', 'Estagiário', 'Gerente Geral', 'Motorista',
  'Motorista de Ambulância', 'Motorista Escolar', 'Médico(a)',
  'Operador de Máquinas', 'Professor(a)', 'Secretário(a)',
  'Supervisor', 'Técnico Administrativo', 'Técnico de TI',
];

export default function EmployeesPage(container, Store, API) {
  // ============================================================
  //  Estado local
  // ============================================================
  let state = {
    activeModal: null, // null | 'register' | 'details' | 'edit'
    selectedEmployee: null,
    formData: {
      name: '', matricula: '', email: '', password: '',
      role: '', cnh: '', sector: [], lgpdConsent: false,
    },
  };

  function upd(partial) { state = { ...state, ...partial }; }

  // ============================================================
  //  Helpers
  // ============================================================
  function getStatusLabel(status) {
    const map = {
      Disponível: 'secondary', 'Em Serviço': 'default', 'Em Viagem': 'default',
      Afastado: 'destructive', Desativado: 'destructive',
    };
    return map[status] || 'outline';
  }

  function getVisibleEmployees() {
    const user = Store.get('user');
    const userRole = Store.mapRole(user?.role);
    const employees = Store.get('employees') || [];
    if (userRole === 'dev') return employees;
    return employees.filter((e) => e.status !== 'Desativado');
  }

  // ============================================================
  //  CRUD
  // ============================================================
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
        Store.set('employees', [...employees, { id: 'E' + Date.now(), ...data, sector: data.sector || [], status: 'Disponível' }]);
      }
    }
    closeModal();
  }

  function handleDelete(id) {
    const user = Store.get('user');
    const userRole = Store.mapRole(user?.role);
    const employees = [...(Store.get('employees') || [])];
    if (userRole === 'dev') {
      Store.set('employees', employees.filter((e) => e.id !== id));
    } else {
      Store.set('employees', employees.map((e) => e.id === id ? { ...e, status: 'Desativado' } : e));
    }
    closeModal();
  }

  // ============================================================
  //  Modal
  // ============================================================
  function openModal(type, employee) {
    const data = employee
      ? {
          name: employee.name || '', matricula: employee.matricula || '',
          email: employee.email || '', password: '',
          role: employee.role || '', cnh: employee.cnh || '',
          sector: Array.isArray(employee.sector) ? [...employee.sector] : employee.sector ? [employee.sector] : [],
          lgpdConsent: true,
        }
      : { name: '', matricula: '', email: '', password: '', role: '', cnh: '', sector: [], lgpdConsent: false };
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
    if (!state.activeModal) { overlay.classList.add('hidden'); return; }
    overlay.classList.remove('hidden');

    const user = Store.get('user');
    const userRole = Store.mapRole(user?.role);

    switch (state.activeModal) {
      case 'details':
        content.innerHTML = renderDetailsModal(state.selectedEmployee, getStatusLabel, userRole);
        break;
      case 'register':
      case 'edit':
        content.innerHTML = renderFormModal(state.activeModal === 'edit', state.formData, EMPLOYEE_ROLES, Store.get('sectors') || []);
        break;
    }
  }

  // ============================================================
  //  Render
  // ============================================================
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
            </div>
          `).join('')}
        </div>
        ` : `
        <div class="text-center py-16 border-2 border-dashed border-zinc-800 rounded-xl">
          <p class="text-zinc-500">Nenhum funcionário encontrado.</p>
          <p class="text-xs text-zinc-600 mt-1">Cadastre o primeiro colaborador para começar.</p>
        </div>
        `}
      </div>

      <div id="funcModalOverlay" class="fixed inset-0 z-50 flex items-center justify-center hidden" style="background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);">
        <div id="funcModalContent" class="bg-[#0f0f13] border border-zinc-700/50 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden"></div>
      </div>
    `;

    setupEventListeners();
  }

  // ============================================================
  //  Event Listeners
  // ============================================================
  let _cardDelegate = null;

  function setupEventListeners() {
    const overlay = document.getElementById('funcModalOverlay');
    if (!overlay) return;

    // Delegacia de eventos nos cards (única vez)
    if (!_cardDelegate) {
      _cardDelegate = (e) => {
        const card = e.target.closest('[data-employee-id]');
        if (!card) return;
        const eid = card.dataset.employeeId;
        const employees = Store.get('employees') || [];
        const emp = employees.find((x) => x.id === eid);
        if (emp) openModal('details', emp);
      };
      container.addEventListener('click', _cardDelegate);
    }

    // Modal events (overlay recriado a cada render)
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
    overlay.addEventListener('deleteEmployee', () => {
      if (state.selectedEmployee) handleDelete(state.selectedEmployee.id);
    });
    overlay.addEventListener('submitEmployeeForm', () => {
      const form = document.getElementById('employeeForm');
      if (!form) return;
      const data = new FormData(form);
      const name = (data.get('name') || '').trim();
      const matricula = (data.get('matricula') || '').trim();
      const email = (data.get('email') || '').trim();
      const password = (data.get('password') || '').trim();
      const role = (data.get('role') || '').trim();
      const cnh = (data.get('cnh') || '').trim();
      const sectors = Array.from(document.querySelectorAll('#sectorCheckboxes input[type="checkbox"]:checked'))
        .map((cb) => cb.value);
      const lgpdConsent = document.getElementById('lgpdConsent')?.checked || false;

      if (!name || name.length < 2) { Toast.show('Nome é obrigatório.', 'warning'); return; }
      if (!matricula) { Toast.show('Matrícula é obrigatória.', 'warning'); return; }
      if (!email) { Toast.show('Email é obrigatório.', 'warning'); return; }
      if (!role) { Toast.show('Selecione um cargo.', 'warning'); return; }
      if (!lgpdConsent) { Toast.show('É necessário aceitar a LGPD para cadastrar.', 'warning'); return; }

      handleFormSubmit({ name, matricula, email, password, role, cnh, sector: sectors, lgpdConsent });
    });
  }

  // ============================================================
  //  Subscriptions & Init
  // ============================================================
  const unsubEmployees = Store.on('employees', render);
  render();

  // ============================================================
  //  Cleanup
  // ============================================================
  return () => {
    unsubEmployees();
  };
}
