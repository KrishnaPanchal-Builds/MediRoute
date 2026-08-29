(function() {
  window.MediRoute = window.MediRoute || {};
  window.MediRoute.pages = window.MediRoute.pages || {};

  let currentHospital = null;
  let refreshInterval = null;
  let charts = {};
  let currentFilter = 'All';

  window.MediRoute.pages.dashboard = {
    render() {
      return `
        <div class="page page--dashboard">
          <div class="page__header flex flex-between">
            <div>
              <h1 class="section-title">🏥 Hospital Dashboard</h1>
              <p class="section-subtitle" id="dashboard-subtitle">Real-time resource management for ${currentHospital ? currentHospital.name : 'Hospital'}</p>
            </div>
            <div class="form-group" style="min-width: 250px; display: flex; align-items: center;">
              <select id="hospital-selector" class="form-select">
                <!-- Options populated dynamically -->
              </select>
              <button id="btn-register-hospital" class="btn btn--primary btn--sm" style="margin-left:12px;">➕ Register Hospital</button>
            </div>
          </div>

          <div class="grid grid--4 mb-2">
            <div class="stat-card stat-card--primary card--glass card--glow">
              <div class="stat-card__icon">🛏️</div>
              <div class="stat-card__content">
                <div class="stat-card__label">Available Beds</div>
                <div class="stat-card__value" id="stat-beds" data-animate="counter">0</div>
                <div class="stat-card__subtitle text-sm" id="stat-beds-total">Total: 0</div>
              </div>
            </div>
            <div class="stat-card stat-card--success card--glass card--glow">
              <div class="stat-card__icon">👨‍⚕️</div>
              <div class="stat-card__content">
                <div class="stat-card__label">Doctors On Duty</div>
                <div class="stat-card__value" id="stat-doctors" data-animate="counter">0</div>
              </div>
            </div>
            <div class="stat-card stat-card--warning card--glass card--glow">
              <div class="stat-card__icon">🚑</div>
              <div class="stat-card__content">
                <div class="stat-card__label">Ambulances Active</div>
                <div class="stat-card__value" id="stat-ambulances" data-animate="counter">0</div>
              </div>
            </div>
            <div class="stat-card stat-card--emergency card--glass card--glow">
              <div class="stat-card__icon">🚨</div>
              <div class="stat-card__content">
                <div class="stat-card__label">Emergency Queue</div>
                <div class="stat-card__value" id="stat-queue" data-animate="counter">0</div>
              </div>
            </div>
          </div>

          <div class="grid grid--2 mb-2">
            <div class="dashboard-left-col">
              <div class="card card--glass card--glow mb-2">
                <div class="card__header flex flex-between align-center mb-1">
                  <h2 class="card__title">Bed Occupancy Overview</h2>
                  <button id="btn-toggle-bed" class="btn btn--sm btn--primary">Toggle Bed (Simulate)</button>
                </div>
                <div class="grid grid--2 gap-2" id="bed-charts-container">
                  <div class="chart-wrapper text-center">
                    <div id="chart-icu" class="chart-container" style="height: 150px;"></div>
                    <div class="chart-label mt-1"><strong>ICU</strong></div>
                    <div class="chart-sublabel text-sm text-gray" id="label-icu"></div>
                  </div>
                  <div class="chart-wrapper text-center">
                    <div id="chart-general" class="chart-container" style="height: 150px;"></div>
                    <div class="chart-label mt-1"><strong>General</strong></div>
                    <div class="chart-sublabel text-sm text-gray" id="label-general"></div>
                  </div>
                  <div class="chart-wrapper text-center">
                    <div id="chart-emergency" class="chart-container" style="height: 150px;"></div>
                    <div class="chart-label mt-1"><strong>Emergency</strong></div>
                    <div class="chart-sublabel text-sm text-gray" id="label-emergency"></div>
                  </div>
                  <div class="chart-wrapper text-center">
                    <div id="chart-pediatric" class="chart-container" style="height: 150px;"></div>
                    <div class="chart-label mt-1"><strong>Pediatric</strong></div>
                    <div class="chart-sublabel text-sm text-gray" id="label-pediatric"></div>
                  </div>
                </div>
              </div>

              <div class="card card--glass mb-2">
                <h2 class="card__title mb-1">ICU Bed Map</h2>
                <div class="bed-grid" id="icu-bed-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(40px, 1fr)); gap: 8px; margin-bottom: 1rem;">
                  <!-- Beds generated here -->
                </div>
                <div class="bed-legend flex gap-2 text-sm justify-center flex-wrap">
                  <div class="flex align-center gap-1"><span class="status-dot" style="background: var(--color-success);"></span> Available</div>
                  <div class="flex align-center gap-1"><span class="status-dot" style="background: var(--color-danger);"></span> Occupied</div>
                  <div class="flex align-center gap-1"><span class="status-dot" style="background: var(--color-warning);"></span> Maintenance</div>
                  <div class="flex align-center gap-1"><span class="status-dot" style="background: var(--color-info);"></span> Reserved</div>
                </div>
              </div>
            </div>

            <div class="dashboard-right-col">
              <div class="card card--glass card--glow mb-2">
                <div class="card__header flex flex-between align-center mb-1">
                  <h2 class="card__title">Doctors On Duty <span class="badge badge--primary" id="doctors-count-badge">0</span></h2>
                </div>
                <div class="filter-tabs flex gap-1 mb-1 border-bottom pb-1" id="doctor-filters">
                  <button class="btn btn--sm btn--ghost active" data-filter="All">All</button>
                  <button class="btn btn--sm btn--ghost" data-filter="Available">Available</button>
                  <button class="btn btn--sm btn--ghost" data-filter="In Surgery">In Surgery</button>
                  <button class="btn btn--sm btn--ghost" data-filter="On Break">On Break</button>
                </div>
                <div class="doctors-list flex flex-col gap-1" id="doctors-list" style="max-height: 400px; overflow-y: auto;">
                  <!-- Doctors generated here -->
                </div>
                <div class="text-center mt-1">
                  <button id="btn-view-all-doctors" class="btn btn--ghost btn--sm w-100">View All Doctors</button>
                </div>
              </div>

              <div class="card card--glass mb-2">
                <h2 class="card__title mb-1">Facilities Status</h2>
                <div class="facilities-grid grid grid--2 gap-1" id="facilities-list">
                  <!-- Facilities generated here -->
                </div>
              </div>

              <!-- Live Status Update Panel -->
              <div class="card card--glass card--glow mb-2" style="border-left:4px solid var(--color-primary);">
                <div class="card__header flex flex-between align-center mb-1">
                  <h2 class="card__title">🔄 Live Status Update Panel</h2>
                  <span class="badge badge--success" style="animation:pulse 2s infinite;">LIVE</span>
                </div>
                <p class="text-sm text-muted mb-2">Update your hospital's real-time availability. Changes are immediately visible to patients searching for hospitals.</p>

                <h4 class="mb-1" style="color:var(--color-primary);">🛏️ Update Bed Availability</h4>
                <div class="grid grid--2 gap-2 mb-2" id="live-bed-updaters">
                  <!-- Generated dynamically -->
                </div>

                <h4 class="mb-1" style="color:var(--color-primary);">🚨 Emergency Department Status</h4>
                <div class="mb-2" style="display:flex;gap:12px;flex-wrap:wrap;" id="dept-status-toggles">
                  <!-- Generated dynamically -->
                </div>

                <h4 class="mb-1" style="color:var(--color-primary);">📝 Quick Announcements</h4>
                <div class="form-group mb-1">
                  <textarea class="form-input" id="hospital-announcement" rows="2" placeholder="e.g., Blood Bank shortage: O- blood needed urgently" style="resize:vertical;"></textarea>
                </div>
                <button id="btn-post-announcement" class="btn btn--warning btn--sm">📢 Post Announcement</button>
              </div>
            </div>
          </div>

          <div class="card card--glass card--glow">
             <h2 class="card__title mb-1">Weekly Admission Trend</h2>
             <div id="chart-admissions" class="chart-container" style="height: 250px;"></div>
          </div>
        </div>
      `;
    },
    
    mount() {
      const { store, components } = window.MediRoute;
      if (!store || !store.hospitals || store.hospitals.length === 0) return;
      
      // Init hospital
      currentHospital = store.hospitals[0];
      
      // Populate selector
      const selector = document.getElementById('hospital-selector');
      if (selector) {
        selector.innerHTML = store.hospitals.map(h => 
          `<option value="${h.id}" ${h.id === currentHospital.id ? 'selected' : ''}>${h.name}</option>`
        ).join('');
        
        selector.addEventListener('change', (e) => {
          currentHospital = store.getHospital(e.target.value);
          this.updateDashboard();
        });
      }
      
      const regBtn = document.getElementById('btn-register-hospital');
      if (regBtn) {
        regBtn.addEventListener('click', () => {
          const formHtml = `
            <form id="hospital-reg-form" style="display:flex;flex-direction:column;gap:16px;max-height:70vh;overflow-y:auto;padding-right:8px;">
              <h4 style="color:var(--color-primary);margin:0;">📋 Basic Information</h4>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div>
                  <label style="font-size:0.85rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Hospital Name *</label>
                  <input type="text" class="form-input" id="reg-name" placeholder="e.g., City General Hospital" required>
                </div>
                <div>
                  <label style="font-size:0.85rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Hospital Type *</label>
                  <select class="form-select" id="reg-type" required>
                    <option value="">Select Type</option>
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="Trust">Trust/NGO</option>
                    <option value="Military">Military</option>
                  </select>
                </div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div>
                  <label style="font-size:0.85rem;color:var(--text-secondary);display:block;margin-bottom:4px;">City *</label>
                  <input type="text" class="form-input" id="reg-city" placeholder="e.g., New Delhi" required>
                </div>
                <div>
                  <label style="font-size:0.85rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Area/Locality *</label>
                  <input type="text" class="form-input" id="reg-area" placeholder="e.g., Saket" required>
                </div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div>
                  <label style="font-size:0.85rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Phone Number *</label>
                  <input type="tel" class="form-input" id="reg-phone" placeholder="+91 XXXXXXXXXX" required>
                </div>
                <div>
                  <label style="font-size:0.85rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Email</label>
                  <input type="email" class="form-input" id="reg-email" placeholder="admin@hospital.com">
                </div>
              </div>

              <div>
                <label style="font-size:0.85rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Full Address *</label>
                <textarea class="form-input" id="reg-address" placeholder="Full street address" rows="2" required style="resize:vertical;"></textarea>
              </div>

              <hr style="border:none;border-top:1px solid var(--glass-border);">
              <h4 style="color:var(--color-primary);margin:0;">🛏️ Bed Capacity</h4>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;">
                <div>
                  <label style="font-size:0.85rem;color:var(--text-secondary);display:block;margin-bottom:4px;">ICU Beds</label>
                  <input type="number" class="form-input" id="reg-beds-icu" placeholder="0" min="0" value="10">
                </div>
                <div>
                  <label style="font-size:0.85rem;color:var(--text-secondary);display:block;margin-bottom:4px;">General Beds</label>
                  <input type="number" class="form-input" id="reg-beds-general" placeholder="0" min="0" value="50">
                </div>
                <div>
                  <label style="font-size:0.85rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Emergency Beds</label>
                  <input type="number" class="form-input" id="reg-beds-emergency" placeholder="0" min="0" value="15">
                </div>
                <div>
                  <label style="font-size:0.85rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Pediatric Beds</label>
                  <input type="number" class="form-input" id="reg-beds-pediatric" placeholder="0" min="0" value="8">
                </div>
              </div>

              <hr style="border:none;border-top:1px solid var(--glass-border);">
              <h4 style="color:var(--color-primary);margin:0;">🏥 Facilities & Specialties</h4>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
                ${['Emergency Room','Trauma Center','Cardiac Lab','Blood Bank','MRI','CT Scan','Pharmacy','Burn Unit','Neuro ICU','Dialysis','Operation Theater','Ventilators'].map(f => `
                  <label style="display:flex;align-items:center;gap:6px;font-size:0.85rem;padding:8px;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:8px;cursor:pointer;">
                    <input type="checkbox" class="reg-facility" value="${f}" style="accent-color:var(--color-primary);"> ${f}
                  </label>`
                ).join('')}
              </div>

              <hr style="border:none;border-top:1px solid var(--glass-border);">
              <h4 style="color:var(--color-primary);margin:0;">🩺 Emergency Types Handled</h4>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
                ${['Cardiac','Trauma','Burns','Stroke','Pediatric','General','Maternity','Orthopedic','Neuro'].map(t => `
                  <label style="display:flex;align-items:center;gap:6px;font-size:0.85rem;padding:8px;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:8px;cursor:pointer;">
                    <input type="checkbox" class="reg-type" value="${t}" style="accent-color:var(--color-primary);"> ${t}
                  </label>`
                ).join('')}
              </div>

              <hr style="border:none;border-top:1px solid var(--glass-border);">
              <h4 style="color:var(--color-primary);margin:0;">💰 Cost Information (per day)</h4>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;">
                <div>
                  <label style="font-size:0.85rem;color:var(--text-secondary);display:block;margin-bottom:4px;">ICU (₹)</label>
                  <input type="number" class="form-input" id="reg-cost-icu" placeholder="5000" min="0" value="5000">
                </div>
                <div>
                  <label style="font-size:0.85rem;color:var(--text-secondary);display:block;margin-bottom:4px;">General (₹)</label>
                  <input type="number" class="form-input" id="reg-cost-general" placeholder="2000" min="0" value="2000">
                </div>
                <div>
                  <label style="font-size:0.85rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Emergency (₹)</label>
                  <input type="number" class="form-input" id="reg-cost-emergency" placeholder="3000" min="0" value="3000">
                </div>
                <div>
                  <label style="font-size:0.85rem;color:var(--text-secondary);display:block;margin-bottom:4px;">Pediatric (₹)</label>
                  <input type="number" class="form-input" id="reg-cost-pediatric" placeholder="2500" min="0" value="2500">
                </div>
              </div>

              <hr style="border:none;border-top:1px solid var(--glass-border);">
              <h4 style="color:var(--color-primary);margin:0;">🛡️ Insurance Accepted</h4>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                ${['Ayushman Bharat (PMJAY)','Star Health','ICICI Lombard','Max Bupa','HDFC ERGO','New India Assurance','National Insurance','United India'].map(ins => `
                  <label style="display:flex;align-items:center;gap:6px;font-size:0.85rem;padding:8px;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:8px;cursor:pointer;">
                    <input type="checkbox" class="reg-insurance" value="${ins}" style="accent-color:var(--color-primary);"> ${ins}
                  </label>`
                ).join('')}
              </div>
            </form>
          `;

          window.MediRoute.components.createModal('🏥 Register New Hospital', formHtml, [
            { id: 'cancel', label: 'Cancel', class: 'btn--ghost', handler: () => {} },
            { id: 'register', label: '✅ Register Hospital', class: 'btn--primary', handler: () => {
              const name = document.getElementById('reg-name')?.value;
              const city = document.getElementById('reg-city')?.value;
              const area = document.getElementById('reg-area')?.value;
              const type = document.getElementById('reg-type')?.value;
              const phone = document.getElementById('reg-phone')?.value;

              if (!name || !city || !area || !type) {
                window.MediRoute.components.showToast('Please fill all required fields', 'error');
                return;
              }

              const facilities = [...document.querySelectorAll('.reg-facility:checked')].map(cb => cb.value);
              const emergencyTypes = [...document.querySelectorAll('.reg-type:checked')].map(cb => cb.value);
              const insurance = [...document.querySelectorAll('.reg-insurance:checked')].map(cb => cb.value);

              const newHospital = {
                id: 'h' + (window.MediRoute.store.hospitals.length + 1),
                name, city, area, type, phone,
                lat: 28.6 + (Math.random() - 0.5) * 0.1,
                lng: 77.2 + (Math.random() - 0.5) * 0.1,
                rating: 4.0,
                successRate: 90,
                facilities,
                emergencyTypes: emergencyTypes.length > 0 ? emergencyTypes : ['General'],
                insuranceAccepted: insurance,
                beds: {
                  icu: { total: parseInt(document.getElementById('reg-beds-icu')?.value || 10), available: parseInt(document.getElementById('reg-beds-icu')?.value || 10) },
                  general: { total: parseInt(document.getElementById('reg-beds-general')?.value || 50), available: parseInt(document.getElementById('reg-beds-general')?.value || 50) },
                  emergency: { total: parseInt(document.getElementById('reg-beds-emergency')?.value || 15), available: parseInt(document.getElementById('reg-beds-emergency')?.value || 15) },
                  pediatric: { total: parseInt(document.getElementById('reg-beds-pediatric')?.value || 8), available: parseInt(document.getElementById('reg-beds-pediatric')?.value || 8) }
                },
                costPerDay: {
                  icu: parseInt(document.getElementById('reg-cost-icu')?.value || 5000),
                  general: parseInt(document.getElementById('reg-cost-general')?.value || 2000),
                  emergency: parseInt(document.getElementById('reg-cost-emergency')?.value || 3000),
                  pediatric: parseInt(document.getElementById('reg-cost-pediatric')?.value || 2500)
                },
                doctors: [],
                ambulances: 0
              };

              window.MediRoute.store.hospitals.push(newHospital);
              window.MediRoute.components.showToast('🏥 ' + name + ' registered successfully!', 'success', 5000);
              window.MediRoute.components.closeModal();

              // Refresh selector
              const sel = document.getElementById('hospital-selector');
              if (sel) {
                sel.innerHTML += '<option value="' + newHospital.id + '">' + newHospital.name + '</option>';
              }
            }, closeOnAction: false }
          ]);
        });
      }
      
      // Filters
      const filters = document.getElementById('doctor-filters');
      if (filters) {
        filters.addEventListener('click', (e) => {
          if (e.target.tagName === 'BUTTON') {
            filters.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            this.renderDoctors();
          }
        });
      }

      // View All Doctors
      const btnViewAllDoctors = document.getElementById('btn-view-all-doctors');
      if (btnViewAllDoctors) {
        btnViewAllDoctors.addEventListener('click', () => {
          let docsHtml = currentHospital.doctors.map(doc => `
            <div class="doctor-row p-1 border rounded mb-1 flex-between align-center" style="background: rgba(255,255,255,0.05);">
              <div>
                <strong>${doc.name}</strong> <span class="text-sm text-gray">(${doc.specialty})</span>
              </div>
              <div class="flex gap-1">
                <button class="btn btn--sm ${doc._status === 'Available' ? 'btn--primary' : 'btn--ghost'}" onclick="updateDoctorStatus('${doc.name}', 'Available', this)">Available</button>
                <button class="btn btn--sm ${doc._status === 'In Surgery' ? 'btn--danger' : 'btn--ghost'}" onclick="updateDoctorStatus('${doc.name}', 'In Surgery', this)">In Surgery</button>
                <button class="btn btn--sm ${doc._status === 'On Break' ? 'btn--warning' : 'btn--ghost'}" onclick="updateDoctorStatus('${doc.name}', 'On Break', this)">On Break</button>
              </div>
            </div>
          `).join('');
          
          window.updateDoctorStatus = (docName, status, btn) => {
            const doc = currentHospital.doctors.find(d => d.name === docName);
            if (doc) doc._status = status;
            btn.parentElement.querySelectorAll('.btn').forEach(b => b.className = 'btn btn--sm btn--ghost');
            if (status === 'Available') btn.className = 'btn btn--sm btn--primary';
            else if (status === 'In Surgery') btn.className = 'btn btn--sm btn--danger';
            else btn.className = 'btn btn--sm btn--warning';
            this.renderDoctors();
            window.MediRoute.components.showToast('Doctor status updated to ' + status, 'success');
          };

          const modalHtml = `
            <div style="max-height: 60vh; overflow-y: auto;">
              <input type="text" id="doc-search" class="form-input mb-1" placeholder="Search doctors...">
              <div id="modal-doc-list">${docsHtml}</div>
            </div>
          `;
          window.MediRoute.components.createModal('👨‍⚕️ Doctor Roster', modalHtml, [
            { id: 'close', label: 'Close', class: 'btn--ghost', handler: () => {} }
          ]);
          
          document.getElementById('doc-search')?.addEventListener('input', (e) => {
             const val = e.target.value.toLowerCase();
             document.querySelectorAll('.doctor-row').forEach(row => {
               row.style.display = row.innerText.toLowerCase().includes(val) ? 'flex' : 'none';
             });
          });
        });
      }

      // Simulate Toggle
      const toggleBtn = document.getElementById('btn-toggle-bed');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
           if(currentHospital) {
              const beds = currentHospital.beds.icu;
              if (beds.available > 0) {
                 store.updateBed(currentHospital.id, 'icu', -1);
                 components.showToast('ICU Bed marked as occupied', 'warning');
              } else {
                 store.updateBed(currentHospital.id, 'icu', 1);
                 components.showToast('ICU Bed marked as available', 'success');
              }
              this.updateDashboard();
           }
        });
      }

      this.updateDashboard();
      
      if (sessionStorage.getItem('open_reg_modal') === 'true') {
        sessionStorage.removeItem('open_reg_modal');
        if (regBtn) regBtn.click();
      }
      
      // Admission trend chart (static/simulated)
      const trendData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Admissions',
          data: [45, 52, 38, 65, 48, 55, 40],
          color: 'var(--color-primary)'
        }]
      };
      const trendContainer = document.getElementById('chart-admissions');
      if (trendContainer && components.createChart) {
         components.createChart(trendContainer, 'line', trendData, { responsive: true });
      }

      // Live updates
      refreshInterval = setInterval(() => {
        const queueEl = document.getElementById('stat-queue');
        if (queueEl) {
          queueEl.innerText = Math.floor(Math.random() * 10) + 3;
        }
      }, 5000);
      
      this.handleDataUpdate = () => {
         this.updateDashboard();
      };
      window.addEventListener('mediroute:dataUpdate', this.handleDataUpdate);

      // Live Bed Updaters
      this.renderLiveUpdaters();

      const announcementBtn = document.getElementById('btn-post-announcement');
      if (announcementBtn) {
        announcementBtn.addEventListener('click', () => {
          const text = document.getElementById('hospital-announcement')?.value;
          if (text && text.trim()) {
            components.showToast('📢 Announcement posted: "' + text.substring(0, 50) + '..."', 'success', 5000);
            document.getElementById('hospital-announcement').value = '';
          } else {
            components.showToast('Please enter an announcement', 'warning');
          }
        });
      }
    },

    updateDashboard() {
       if (!currentHospital) return;
       const { components } = window.MediRoute;

       document.getElementById('dashboard-subtitle').innerText = `Real-time resource management for ${currentHospital.name}`;

       // Stats
       let totalAvailable = 0;
       let totalBeds = 0;
       for (const type in currentHospital.beds) {
         totalAvailable += currentHospital.beds[type].available;
         totalBeds += currentHospital.beds[type].total;
       }
       
       const bedsEl = document.getElementById('stat-beds');
       if (bedsEl && components.animateCounter) components.animateCounter(bedsEl, totalAvailable, 1000);
       document.getElementById('stat-beds-total').innerText = `Total: ${totalBeds}`;

       const doctorsEl = document.getElementById('stat-doctors');
       if (doctorsEl && components.animateCounter) components.animateCounter(doctorsEl, currentHospital.doctors ? currentHospital.doctors.length : 0, 1000);

       const ambEl = document.getElementById('stat-ambulances');
       if (ambEl && components.animateCounter) components.animateCounter(ambEl, currentHospital.ambulances || 0, 1000);
       
       const qEl = document.getElementById('stat-queue');
       if (qEl && qEl.innerText === '0') qEl.innerText = Math.floor(Math.random() * 10) + 3;

       this.renderBedCharts();
       this.renderBedGrid();
       this.renderDoctors();
       this.renderFacilities();
       this.renderLiveUpdaters();
    },

    renderBedCharts() {
       const { components } = window.MediRoute;
       const bedTypes = [
         { id: 'icu', color: 'var(--color-danger)' },
         { id: 'general', color: 'var(--color-primary)' },
         { id: 'emergency', color: 'var(--color-warning)' },
         { id: 'pediatric', color: '#9c27b0' } // purple
       ];

       bedTypes.forEach(type => {
          const bedData = currentHospital.beds[type.id];
          if (!bedData) return;
          const available = bedData.available;
          const occupied = bedData.total - available;
          
          document.getElementById(`label-${type.id}`).innerText = `${available} of ${bedData.total} available`;
          
          const container = document.getElementById(`chart-${type.id}`);
          if (container && components.createChart) {
             container.innerHTML = ''; // clear previous
             const data = {
               labels: ['Occupied', 'Available'],
               datasets: [{
                 data: [occupied, available],
                 colors: [type.color, 'var(--color-success)']
               }]
             };
             components.createChart(container, 'donut', data, { responsive: true, cutout: '70%' });
          }
       });
    },

    renderBedGrid() {
      const grid = document.getElementById('icu-bed-grid');
      if (!grid) return;
      
      const icuData = currentHospital.beds.icu;
      if (!icuData) return;

      let html = '';
      const total = icuData.total;
      const availableCount = icuData.available;
      
      // Generate some deterministic statuses based on total and available
      for (let i = 0; i < total; i++) {
         let statusColor = 'var(--color-danger)'; // Occupied
         if (i < availableCount) {
             statusColor = 'var(--color-success)';
         } else if (i === total - 1) {
             statusColor = 'var(--color-warning)'; // 1 maintenance
         } else if (i === total - 2) {
             statusColor = 'var(--color-info)'; // 1 reserved
         }

         html += `<div class="bed-cell" style="aspect-ratio: 1; border-radius: 4px; background: ${statusColor}; cursor: pointer;" title="Bed ${i+1}"></div>`;
      }
      grid.innerHTML = html;
      
      // interactive cells
      grid.querySelectorAll('.bed-cell').forEach(cell => {
         cell.addEventListener('click', (e) => {
            const bg = e.target.style.background;
            if (bg.includes('var(--color-success)')) {
               e.target.style.background = 'var(--color-danger)';
            } else if (bg.includes('var(--color-danger)')) {
               e.target.style.background = 'var(--color-success)';
            }
         });
      });
    },

    renderDoctors() {
      const container = document.getElementById('doctors-list');
      const badge = document.getElementById('doctors-count-badge');
      if (!container || !currentHospital.doctors) return;
      
      const { components } = window.MediRoute;
      let doctors = currentHospital.doctors;
      
      // Assign random statuses if not present for simulation
      const statuses = ['Available', 'In Surgery', 'On Break'];
      doctors = doctors.map((d, i) => {
         return { ...d, _status: d._status || (i % 3 === 0 ? 'In Surgery' : i % 5 === 0 ? 'On Break' : 'Available') };
      });

      if (currentFilter !== 'All') {
         doctors = doctors.filter(d => d._status === currentFilter);
      }
      
      badge.innerText = doctors.length;
      
      let html = '';
      doctors.slice(0, 10).forEach(doc => {
         let badgeType = 'success';
         if (doc._status === 'In Surgery') badgeType = 'danger';
         if (doc._status === 'On Break') badgeType = 'warning';

         html += `
           <div class="doctor-card p-1 border rounded flex align-center gap-1" style="background: rgba(255,255,255,0.05);">
             <div class="avatar" style="width:40px; height:40px; border-radius:50%; background: var(--color-primary); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:bold;">
               ${doc.name.split(' ').map(n => n[0]).join('').substring(0,2)}
             </div>
             <div class="flex-grow">
               <div class="font-bold">${doc.name}</div>
               <div class="text-sm text-gray">${doc.specialty} • ${doc.experience}</div>
             </div>
             <div>
               <span class="badge badge--${badgeType}">${doc._status}</span>
             </div>
           </div>
         `;
      });
      if (doctors.length === 0) {
         html = `<div class="text-center text-gray p-2">No doctors found for this filter.</div>`;
      }
      container.innerHTML = html;
    },

    renderFacilities() {
       const container = document.getElementById('facilities-list');
       if (!container || !currentHospital.facilities) return;
       
       let html = '';
       currentHospital.facilities.forEach((f, i) => {
          const isOn = i % 4 !== 0; // mostly on
          html += `
            <div class="facility-item flex flex-between align-center p-1 border rounded" style="background: rgba(255,255,255,0.02);">
               <div class="flex align-center gap-1">
                 <span>${f.includes('Trauma') ? '🚨' : f.includes('Blood') ? '🩸' : f.includes('Cardi') ? '🫀' : f.includes('Scan') || f.includes('MRI') ? '🩻' : '🔬'}</span>
                 <span class="text-sm font-bold">${f}</span>
               </div>
               <label class="toggle" style="display:flex; align-items:center; cursor:pointer;">
                 <input type="checkbox" class="facility-checkbox" data-facility="${f}" ${isOn ? 'checked' : ''} style="accent-color: var(--color-primary);">
               </label>
             </div>
          `;
       });
       container.innerHTML = html;

       container.querySelectorAll('.facility-checkbox').forEach(cb => {
         cb.addEventListener('change', (e) => {
           const f = e.target.dataset.facility;
           if (e.target.checked) {
             if (!currentHospital.facilities.includes(f)) currentHospital.facilities.push(f);
           } else {
             currentHospital.facilities = currentHospital.facilities.filter(fac => fac !== f);
           }
           window.MediRoute.components.showToast('Facility status updated', 'success');
         });
       });
    },

    renderLiveUpdaters() {
      const container = document.getElementById('live-bed-updaters');
      const deptContainer = document.getElementById('dept-status-toggles');
      if (!container || !currentHospital) return;
      const { store, components } = window.MediRoute;

      const bedTypes = [
        { key: 'icu', label: 'ICU Beds', icon: '🔴', color: 'var(--color-danger)' },
        { key: 'general', label: 'General Beds', icon: '🔵', color: 'var(--color-primary)' },
        { key: 'emergency', label: 'Emergency Beds', icon: '🟠', color: 'var(--color-warning)' },
        { key: 'pediatric', label: 'Pediatric Beds', icon: '🟣', color: '#9c27b0' }
      ];

      container.innerHTML = bedTypes.map(type => {
        const bed = currentHospital.beds[type.key];
        if (!bed) return '';
        return `
          <div style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:12px;padding:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <span style="font-weight:600;">${type.icon} ${type.label}</span>
              <span class="badge" style="background:${type.color};color:white;">${bed.available}/${bed.total}</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <button class="btn btn--sm btn--ghost live-bed-btn" data-bed-type="${type.key}" data-action="decrease" style="width:36px;height:36px;border-radius:50%;font-size:1.2rem;display:flex;align-items:center;justify-content:center;">➖</button>
              <div style="flex:1;text-align:center;">
                <div style="font-size:2rem;font-weight:800;color:${bed.available > 2 ? 'var(--color-success)' : bed.available > 0 ? 'var(--color-warning)' : 'var(--color-danger)'}" id="live-count-${type.key}">${bed.available}</div>
                <div style="font-size:0.75rem;color:var(--text-muted);">Available</div>
              </div>
              <button class="btn btn--sm btn--ghost live-bed-btn" data-bed-type="${type.key}" data-action="increase" style="width:36px;height:36px;border-radius:50%;font-size:1.2rem;display:flex;align-items:center;justify-content:center;">➕</button>
            </div>
            ${components.createProgressBar(bed.available, bed.total, bed.available > bed.total * 0.3 ? 'success' : bed.available > 0 ? 'warning' : 'danger')}
          </div>
        `;
      }).join('');

      // Bed update button handlers
      container.querySelectorAll('.live-bed-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const bedType = btn.dataset.bedType;
          const action = btn.dataset.action;
          const bed = currentHospital.beds[bedType];
          if (!bed) return;

          if (action === 'increase' && bed.available < bed.total) {
            bed.available++;
            components.showToast(bedType.toUpperCase() + ' bed marked available', 'success');
          } else if (action === 'decrease' && bed.available > 0) {
            bed.available--;
            components.showToast(bedType.toUpperCase() + ' bed marked occupied', 'warning');
          } else {
            components.showToast(action === 'increase' ? 'All beds already available' : 'No beds to mark as occupied', 'info');
            return;
          }

          // Update UI
          const countEl = document.getElementById('live-count-' + bedType);
          if (countEl) {
            countEl.textContent = bed.available;
            countEl.style.color = bed.available > 2 ? 'var(--color-success)' : bed.available > 0 ? 'var(--color-warning)' : 'var(--color-danger)';
          }

          this.updateDashboard();
        });
      });

      // Department status toggles
      if (deptContainer) {
        const departments = ['Emergency Room', 'Operation Theater', 'ICU', 'Outpatient', 'Lab Services', 'Radiology', 'Pharmacy'];
        deptContainer.innerHTML = departments.map((dept, i) => {
          const isOpen = i < 5;
          return `
            <div style="display:flex;align-items:center;gap:8px;padding:8px 16px;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:999px;">
              <span style="font-size:0.85rem;font-weight:500;">${dept}</span>
              <label style="display:flex;align-items:center;cursor:pointer;">
                <input type="checkbox" class="dept-toggle" data-dept="${dept}" ${isOpen ? 'checked' : ''} style="accent-color:var(--color-success);">
              </label>
              <span class="status-dot ${isOpen ? 'status-dot--online' : 'status-dot--offline'}" data-dept-dot="${dept}"></span>
            </div>
          `;
        }).join('');

        deptContainer.querySelectorAll('.dept-toggle').forEach(toggle => {
          toggle.addEventListener('change', (e) => {
            const dept = e.target.dataset.dept;
            const dot = deptContainer.querySelector('[data-dept-dot="' + dept + '"]');
            if (dot) {
              dot.className = 'status-dot ' + (e.target.checked ? 'status-dot--online' : 'status-dot--offline');
            }
            components.showToast(dept + (e.target.checked ? ' is now OPEN' : ' is now CLOSED'), e.target.checked ? 'success' : 'warning');
          });
        });
      }
    },
    
    unmount() {
      if (refreshInterval) clearInterval(refreshInterval);
      if (this.handleDataUpdate) {
         window.removeEventListener('mediroute:dataUpdate', this.handleDataUpdate);
      }
    }
  };
})();
