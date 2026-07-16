/**
 * CityMotion — Página: Viagens (Missões)
 * Kanban + Mapa Leaflet + Exportação PDF + Checklist + Sinistros
 *
 * Módulos:
 *   ./data.js   → Constants e loadScript/loadStylesheet
 *   ./modals.js → Renderizadores de modais (HTML puro)
 *   ./kanban.js → Renderizadores Kanban e Mapa (HTML puro)
 */
import { TRIP_CATEGORIES_BY_SECTOR, loadScript, loadStylesheet } from './data.js';
import { renderDetailsModal, renderChecklistModal, renderIncidentModal, renderScheduleFormModal } from './modals.js';
import { renderKanban, renderMapContent } from './kanban.js';
import { formatDate, formatDateTime } from '/js/format-utils.js';

export default function ViagensPage(container, Store, API) {
  // ============================================================
  //  Estado local
  // ============================================================
  let state = {
    activeModal: null, // null | 'details' | 'start-checklist' | 'finish' | 'form' | 'incident'
    selectedSchedule: null,
    activeTab: 'general',
    startMileage: '',
    finalMileage: '',
    checkedItems: [],
    notes: '',
    driverLocations: [],
    isTracking: false,
    isExporting: false,
    formData: {
      title: '', sector: '', category: '', driver: '', vehicle: '',
      origin: '', destination: '', departureDate: '', departureTime: '',
      description: '', passengers: [],
    },
    incidentData: {
      description: '', location: '',
      incidentDate: new Date().toISOString().slice(0, 16),
      photos: null,
    },
  };

  let geoIntervalRef = null;
  let geoWatchIdRef = null;
  let mapInstance = null;
  let mapMarkers = [];
  let _kanbanDelegate = null; // ref para event delegation do kanban

  function upd(partial) { state = { ...state, ...partial }; }

  // ============================================================
  //  Helpers
  // ============================================================
  function getStatusLabel(status) {
    const map = { Agendada: 'secondary', 'Em Andamento': 'default', Concluída: 'outline', Cancelada: 'destructive' };
    return map[status] || 'outline';
  }

  function getFilteredSchedules() {
    const user = Store.get('user');
    const schedules = Store.get('schedules') || [];
    const userRole = Store.mapRole(user?.role);
    if (userRole === 'employee' && user?.name) {
      return schedules.filter((s) => s.driver === user.name);
    }
    return schedules;
  }

  function getActiveTrips() {
    return (Store.get('schedules') || []).filter((s) => s.status === 'Em Andamento');
  }

  // ============================================================
  //  Geo Location
  // ============================================================
  async function reverseGeocode(lat, lng) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=pt`,
        { headers: { 'User-Agent': 'CityMotion/1.0' } }
      );
      if (!res.ok) return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      const data = await res.json();
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  }

  async function captureLocation() {
    if (!navigator.geolocation) return;
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true, timeout: 10000, maximumAge: 60000,
        });
      });

      const { latitude, longitude, speed } = position.coords;
      const activeTrips = getActiveTrips();
      const user = Store.get('user');
      const address = await reverseGeocode(latitude, longitude);

      const newLocations = activeTrips.map((trip) => ({
        driverId: user?.id || 'unknown',
        driverName: user?.name || trip.driver,
        vehicleId: trip.vehicle,
        vehiclePlate: trip.vehicle,
        latitude, longitude, address,
        timestamp: new Date().toISOString(),
        tripId: trip.id,
        speed: speed || undefined,
      }));

      const prev = state.driverLocations;
      const updated = [...prev];
      for (const loc of newLocations) {
        const idx = updated.findIndex((l) => l.driverId === loc.driverId && l.tripId === loc.tripId);
        if (idx >= 0) updated[idx] = loc;
        else updated.push(loc);
      }
      upd({ driverLocations: updated.slice(-100) });
      renderMapTab();
    } catch (err) {
      console.warn('[Geo] Erro ao capturar localização:', err);
    }
  }

  function startGeoTracking() {
    if (!navigator.geolocation) { console.warn('[Geo] Geolocalização não disponível'); return; }
    upd({ isTracking: true });
    captureLocation();
    geoIntervalRef = setInterval(captureLocation, 30 * 60 * 1000);
    geoWatchIdRef = navigator.geolocation.watchPosition(
      (pos) => { upd({ currentPosition: { latitude: pos.coords.latitude, longitude: pos.coords.longitude } }); },
      (err) => console.warn('[Geo] Watch error:', err),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 120000 }
    );
  }

  function stopGeoTracking() {
    upd({ isTracking: false });
    if (geoIntervalRef) { clearInterval(geoIntervalRef); geoIntervalRef = null; }
    if (geoWatchIdRef !== null) { navigator.geolocation.clearWatch(geoWatchIdRef); geoWatchIdRef = null; }
  }

  // ============================================================
  //  Status Management
  // ============================================================
  function updateScheduleStatus(scheduleId, newStatus, details) {
    const schedules = [...(Store.get('schedules') || [])];
    const employees = [...(Store.get('employees') || [])];
    const vehicles = [...(Store.get('vehicles') || [])];

    const schedule = schedules.find((s) => s.id === scheduleId);
    if (!schedule) return;

    const driver = employees.find((d) => d.name === schedule.driver);
    const vehicle = vehicles.find((v) => schedule.vehicle?.includes(v.licensePlate));

    if (newStatus === 'Em Andamento' && driver && vehicle) {
      Store.set('employees', employees.map((d) => d.id === driver.id ? { ...d, status: 'Em Viagem' } : d));
      Store.set('vehicles', vehicles.map((v) => v.id === vehicle.id ? { ...v, status: 'Em Viagem' } : v));
    } else if (newStatus === 'Concluída' && driver && vehicle && details?.endMileage) {
      Store.set('employees', employees.map((d) => d.id === driver.id ? { ...d, status: 'Disponível' } : d));
      Store.set('vehicles', vehicles.map((v) =>
        v.id === vehicle.id ? { ...v, status: 'Disponível', mileage: details.endMileage } : v
      ));
    }

    const updatedSchedules = schedules.map((s) => {
      if (s.id !== scheduleId) return s;
      const base = { ...s, status: newStatus };
      if (newStatus === 'Em Andamento') {
        base.startMileage = details?.startMileage;
        base.startNotes = details?.startNotes;
        base.startChecklist = details?.startChecklist;
      }
      if (newStatus === 'Concluída') {
        base.endMileage = details?.endMileage;
        base.endNotes = details?.endNotes;
        base.endChecklist = details?.endChecklist;
        base.arrivalTime = new Date().toLocaleString('pt-BR');
      }
      return base;
    });

    Store.set('schedules', updatedSchedules);
  }

  // ============================================================
  //  Export PDF
  // ============================================================
  async function exportTripReport() {
    if (state.isExporting) return;
    upd({ isExporting: true });
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.3/jspdf.plugin.autotable.min.js');

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const schedules = getFilteredSchedules().filter((s) => s.status !== 'Cancelada');

      doc.setFillColor(9, 9, 11);
      doc.rect(0, 0, pageWidth, 35, 'F');
      doc.setTextColor(147, 197, 253);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('CityMotion', 14, 18);
      doc.setTextColor(200, 200, 210);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Relatório de Viagens — ${formatDate(new Date())}`, 14, 28);
      doc.text(formatDateTime(new Date()), pageWidth - 14, 28, { align: 'right' });

      const agendadas = schedules.filter((s) => s.status === 'Agendada').length;
      const andamento = schedules.filter((s) => s.status === 'Em Andamento').length;
      const concluidas = schedules.filter((s) => s.status === 'Concluída').length;
      const kmTotal = schedules.reduce((acc, s) => acc + ((s.endMileage || 0) - (s.startMileage || 0)), 0);

      doc.setTextColor(100, 100, 120);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('RESUMO', 14, 45);
      doc.setFillColor(240, 240, 245);
      doc.rect(14, 48, pageWidth - 28, 18, 'F');
      doc.setTextColor(50, 50, 60);
      doc.setFontSize(9);
      doc.text(`Total: ${schedules.length}`, 18, 57);
      doc.text(`Agendadas: ${agendadas}`, 70, 57);
      doc.text(`Em Andamento: ${andamento}`, 120, 57);
      doc.text(`Concluídas: ${concluidas}`, 175, 57);
      doc.text(`KM Total: ${kmTotal} km`, 230, 57);

      doc.setTextColor(100, 100, 120);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('VIAGENS', 14, 76);

      const tableData = schedules.map((s) => [
        s.title, s.departureTime, s.origin, s.destination, s.vehicle,
        s.startMileage?.toString() || '-', s.endMileage?.toString() || '-', s.status,
      ]);

      doc.autoTable({
        startY: 80,
        head: [['Título', 'Data/Hora', 'Origem', 'Destino', 'Veículo', 'KM Inicial', 'KM Final', 'Status']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [9, 9, 11], textColor: [147, 197, 253], fontStyle: 'bold', fontSize: 8, halign: 'center' },
        bodyStyles: { fontSize: 8, textColor: [50, 50, 60] },
        alternateRowStyles: { fillColor: [245, 245, 250] },
        columnStyles: { 0: { cellWidth: 40 }, 2: { cellWidth: 35 }, 3: { cellWidth: 35 }, 7: { cellWidth: 20, halign: 'center' } },
        margin: { left: 14, right: 14 },
      });

      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setTextColor(180, 180, 190);
        doc.setFontSize(7);
        doc.text(
          `CityMotion — Gerado em ${new Date().toLocaleString('pt-BR')} | Página ${i} de ${pageCount}`,
          pageWidth / 2, doc.internal.pageSize.getHeight() - 8, { align: 'center' }
        );
      }

      doc.save(`relatorio-viagens-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('[Export] Erro:', err);
      Toast.show('Erro ao gerar PDF: ' + err.message, 'error');
    } finally {
      setTimeout(() => upd({ isExporting: false }), 1000);
    }
  }

  // ============================================================
  //  Modal
  // ============================================================
  function openModal(type, schedule) {
    upd({
      activeModal: type,
      selectedSchedule: schedule,
      startMileage: schedule ? schedule.startMileage || '' : '',
      finalMileage: schedule ? schedule.startMileage || '' : '',
      checkedItems: [],
      notes: '',
      incidentData: { ...state.incidentData, incidentDate: new Date().toISOString().slice(0, 16) },
    });
    renderModal();
  }

  function closeModal() {
    upd({
      activeModal: null, selectedSchedule: null,
      startMileage: '', finalMileage: '', checkedItems: [], notes: '',
      formData: {
        title: '', sector: '', category: '', driver: '', vehicle: '',
        origin: '', destination: '', departureDate: '', departureTime: '',
        description: '', passengers: [],
      },
      incidentData: { description: '', location: '', incidentDate: new Date().toISOString().slice(0, 16), photos: null },
    });
    renderModal();
  }

  function renderModal() {
    const overlay = document.getElementById('viagensModalOverlay');
    const content = document.getElementById('viagensModalContent');
    if (!overlay || !content) return;

    if (!state.activeModal) { overlay.classList.add('hidden'); return; }
    overlay.classList.remove('hidden');

    const s = state.selectedSchedule;

    switch (state.activeModal) {
      case 'details':
        content.innerHTML = renderDetailsModal(s, getStatusLabel);
        break;
      case 'start-checklist':
        content.innerHTML = renderChecklistModal(s, 'start', state.startMileage, state.notes);
        break;
      case 'finish':
        content.innerHTML = renderChecklistModal(s, 'end', state.finalMileage, state.notes);
        break;
      case 'incident':
        content.innerHTML = renderIncidentModal(s, state.incidentData);
        break;
      case 'form':
        content.innerHTML = renderScheduleFormModal(
          state.formData,
          Store.get('employees') || [],
          Store.get('vehicles') || [],
          Store.get('sectors') || []
        );
        break;
    }
  }

  // ============================================================
  //  Mapa Leaflet
  // ============================================================
  async function initMap() {
    if (mapInstance) return;

    await loadStylesheet('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
    await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');

    const mapDiv = document.getElementById('leafletMap');
    if (!mapDiv || mapInstance) return;

    const L = window.L;
    mapInstance = L.map(mapDiv, {
      center: [-15.7801, -47.9292],
      zoom: 5,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | CityMotion',
      maxZoom: 19,
    }).addTo(mapInstance);

    const style = document.createElement('style');
    style.id = 'leaflet-custom-style';
    style.textContent = `
      .marker-moving .leaflet-marker-icon { filter: hue-rotate(200deg) saturate(2); }
      .leaflet-popup-content-wrapper { border-radius: 8px !important; background: #1a1a2e !important; color: #e0e0e0 !important; border: 1px solid rgba(59, 130, 246, 0.3) !important; }
      .leaflet-popup-tip { background: #1a1a2e !important; border: 1px solid rgba(59, 130, 246, 0.3) !important; }
    `;
    document.head.appendChild(style);

    updateMapMarkers();
  }

  function updateMapMarkers() {
    if (!mapInstance) return;
    const L = window.L;

    mapMarkers.forEach((m) => m.remove());
    mapMarkers = [];

    const locations = state.driverLocations;
    if (locations.length === 0) return;

    const bounds = L.latLngBounds([]);

    locations.forEach((loc) => {
      const isMoving = loc.speed && loc.speed > 0;
      const icon = L.icon({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
        className: isMoving ? 'marker-moving' : '',
      });

      const speedText = loc.speed ? `Velocidade: ${(loc.speed * 3.6).toFixed(1)} km/h<br/>` : '';

      const marker = L.marker([loc.latitude, loc.longitude], { icon });
      marker.bindPopup(`
        <div style="font-family: monospace; font-size: 12px; min-width: 180px;">
          <strong style="color: #3b82f6; font-size: 14px;">${loc.driverName}</strong><br/>
          ${loc.vehiclePlate ? `🚗 ${loc.vehiclePlate}<br/>` : ''}
          ${speedText}
          📍 ${loc.address || `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`}<br/>
          <span style="color: #888; font-size: 10px;">${new Date(loc.timestamp).toLocaleString('pt-BR')}</span>
        </div>
      `);

      marker.addTo(mapInstance);
      mapMarkers.push(marker);
      bounds.extend([loc.latitude, loc.longitude]);
    });

    if (locations.length > 0) {
      mapInstance.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }

  function destroyMap() {
    if (mapInstance) {
      mapMarkers.forEach((m) => m.remove());
      mapMarkers = [];
      mapInstance.remove();
      mapInstance = null;
    }
    const style = document.getElementById('leaflet-custom-style');
    if (style) style.remove();
  }

  function renderMapTab() {
    const tabMap = document.getElementById('tabMap');
    if (tabMap && state.activeTab === 'map') {
      const activeTrips = getActiveTrips();
      tabMap.innerHTML = renderMapContent(activeTrips, state.driverLocations, state.isTracking);
      setTimeout(() => initMap(), 100);
    }
  }

  // ============================================================
  //  Renderização Principal
  // ============================================================
  function render() {
    const schedules = getFilteredSchedules();
    const allTrips = schedules.filter((s) => s.status !== 'Cancelada');
    const schoolTrips = allTrips.filter((s) => (s.category || '').toLowerCase().includes('escolar'));
    const generalTrips = allTrips.filter((s) => !(s.category || '').toLowerCase().includes('escolar'));
    const activeTrips = getActiveTrips();

    container.innerHTML = `
      <div class="animate-fade-in space-y-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 class="text-3xl sm:text-4xl font-black tracking-tighter flex items-center gap-3">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Missões
            </h1>
            <p class="text-zinc-400 text-sm mt-1 font-medium">Monitoramento de tráfego e logística operacional.</p>
          </div>
          <div class="flex items-center gap-3">
            <button id="btnExportPDF" class="btn btn-ghost btn-sm text-[10px]">
              <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              ${state.isExporting ? 'Exportando...' : 'Exportar PDF'}
            </button>
            <button onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('openForm'))" class="btn btn-primary btn-sm text-[10px]">
              <svg class="w-3.5 h-3.5 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Agendar Viagem
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs">
          <button class="tab ${state.activeTab === 'general' ? 'active' : ''}" data-tab="general">Gerais (${generalTrips.length})</button>
          <button class="tab ${state.activeTab === 'school' ? 'active' : ''}" data-tab="school">Escolares (${schoolTrips.length})</button>
          <button class="tab ${state.activeTab === 'map' ? 'active' : ''}" data-tab="map">
            <svg class="w-3.5 h-3.5 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
            Mapa ao Vivo
            ${activeTrips.length > 0 ? `<span class="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-400 rounded-full">${activeTrips.length}</span>` : ''}
          </button>
        </div>

        <div id="tabGeneral" class="tab-content ${state.activeTab === 'general' ? 'block' : 'hidden'}">
          ${renderKanban(generalTrips)}
        </div>

        <div id="tabSchool" class="tab-content ${state.activeTab === 'school' ? 'block' : 'hidden'}">
          ${renderKanban(schoolTrips)}
        </div>

        <div id="tabMap" class="tab-content ${state.activeTab === 'map' ? 'block' : 'hidden'}">
          ${renderMapContent(activeTrips, state.driverLocations, state.isTracking)}
        </div>
      </div>

      <!-- Modal Overlay -->
      <div id="viagensModalOverlay" class="fixed inset-0 z-50 flex items-center justify-center hidden" style="background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);">
        <div id="viagensModalContent" class="bg-[#0f0f13] border border-zinc-700/50 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
          <!-- Dynamic content goes here -->
        </div>
      </div>
    `;

    setupEventListeners();

    if (state.activeTab === 'map') {
      setTimeout(() => initMap(), 100);
    } else {
      destroyMap();
    }
  }

  // ============================================================
  //  Event Listeners
  // ============================================================
  function setupEventListeners() {
    // ── Tabs ───────────────────────────────────────────────
    container.querySelectorAll('.tab[data-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (tab === state.activeTab) return;
        upd({ activeTab: tab });
        render();
      });
    });

    // ── Export PDF ─────────────────────────────────────────
    const btnExport = document.getElementById('btnExportPDF');
    if (btnExport) {
      btnExport.addEventListener('click', exportTripReport);
    }

    // ── Tracking ───────────────────────────────────────────
    const btnStart = document.getElementById('btnStartTracking');
    if (btnStart) btnStart.addEventListener('click', startGeoTracking);

    const btnStop = document.getElementById('btnStopTracking');
    if (btnStop) btnStop.addEventListener('click', stopGeoTracking);

    // ── Delegacia de eventos nos cards Kanban (única) ────
    if (!_kanbanDelegate) {
      _kanbanDelegate = (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.dataset.action;
        const scheduleId = target.dataset.scheduleId;
        const schedule = (Store.get('schedules') || []).find((s) => String(s.id) === String(scheduleId));
        if (!schedule && action !== 'openForm') return;

        switch (action) {
          case 'open-details':
            openModal('details', schedule);
            break;
          case 'start-checklist':
            openModal('start-checklist', schedule);
            break;
          case 'finish-trip':
            openModal('finish', schedule);
            break;
          case 'openForm':
            openModal('form', null);
            break;
        }
      };
      container.addEventListener('click', _kanbanDelegate);
    }

    // ── Modal Events (dispatched via CustomEvent) ──────────
    const overlay = document.getElementById('viagensModalOverlay');

    if (overlay) {
      overlay.addEventListener('closeModal', closeModal);

      overlay.addEventListener('openChecklist', (e) => {
        const s = (Store.get('schedules') || []).find((sch) => String(sch.id) === String(e.detail));
        openModal('start-checklist', s);
      });

      overlay.addEventListener('openIncident', (e) => {
        const s = (Store.get('schedules') || []).find((sch) => String(sch.id) === String(e.detail));
        openModal('incident', s);
      });

      overlay.addEventListener('openForm', () => openModal('form', null));

      overlay.addEventListener('confirmChecklist', (e) => {
        const type = e.detail;
        const mileage = document.getElementById('checklistMileage')?.value || '';
        const checkedItems = [];
        document.querySelectorAll('#checklistItems input[type="checkbox"]:checked').forEach((cb) => {
          checkedItems.push(parseInt(cb.dataset.index));
        });
        const notes = document.getElementById('checklistNotes')?.value || '';

        if (type === 'start') {
          updateScheduleStatus(state.selectedSchedule.id, 'Em Andamento', {
            startMileage: mileage, startNotes: notes, startChecklist: checkedItems,
          });
        } else {
          updateScheduleStatus(state.selectedSchedule.id, 'Concluída', {
            endMileage: mileage, endNotes: notes, endChecklist: checkedItems,
          });
        }

        closeModal();
        render();
      });

      overlay.addEventListener('submitIncident', () => {
        const incidentData = {
          date: document.getElementById('incidentDate')?.value || '',
          location: document.getElementById('incidentLocation')?.value || '',
          description: document.getElementById('incidentDescription')?.value || '',
        };
        const photos = document.getElementById('incidentPhotos');
        console.log('[Incident] Report submitted:', incidentData, photos?.files?.length || 0, 'photo(s)');
        Toast.show('✅ Relatório de sinistro registrado.', 'success');
        closeModal();
      });

      overlay.addEventListener('submitScheduleForm', async () => {
        const form = document.getElementById('scheduleTripForm');
        if (!form) return;
        const formData = new FormData(form);
        const data = {
          title: formData.get('title'),
          sector: formData.get('sector'),
          category: formData.get('category'),
          driver: formData.get('driver'),
          vehicle: formData.get('vehicle'),
          origin: formData.get('origin'),
          destination: formData.get('destination'),
          departureTime: `${formData.get('departureDate')} ${formData.get('departureTime')}`,
          description: formData.get('description'),
        };

        if (!data.title || !data.driver || !data.vehicle || !data.origin || !data.destination) {
          Toast.show('⚠️ Preencha todos os campos obrigatórios.', 'warning');
          return;
        }

        try {
          const schedules = Store.get('schedules') || [];
          const newSchedule = { ...data, id: Date.now(), status: 'Agendada' };
          Store.set('schedules', [...schedules, newSchedule]);
          Toast.show('✅ Viagem agendada com sucesso!', 'success');
          closeModal();
          render();
        } catch (err) {
          Toast.show('Erro ao agendar: ' + err.message, 'error');
        }
      });

      overlay.addEventListener('sectorChange', (e) => {
        const sector = e.detail;
        const categories = TRIP_CATEGORIES_BY_SECTOR[sector] || [];
        const catSelect = document.getElementById('formCategory');
        if (catSelect) {
          catSelect.innerHTML = `<option value="">Selecione a categoria</option>
            ${categories.map((c) => `<option value="${c}">${c}</option>`).join('')}`;
        }
        upd({ formData: { ...state.formData, sector, category: '' } });
      });

      overlay.addEventListener('addPassenger', () => {
        const passengers = [...state.formData.passengers, { name: '', document: '' }];
        upd({ formData: { ...state.formData, passengers } });
        renderModal();
      });

      overlay.addEventListener('removePassenger', (e) => {
        const passengers = state.formData.passengers.filter((_, i) => i !== e.detail);
        upd({ formData: { ...state.formData, passengers } });
        renderModal();
      });
    }
  }

  // ============================================================
  //  Init & Cleanup
  // ============================================================
  const unsubSchedules = Store.on('schedules', () => render());
  const unsubVehicles = Store.on('vehicles', () => render());
  const unsubEmployees = Store.on('employees', () => render());

  render();

  return () => {
    stopGeoTracking();
    destroyMap();
    unsubSchedules();
    unsubVehicles();
    unsubEmployees();
  };
}
