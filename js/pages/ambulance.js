(function() {
  window.MediRoute = window.MediRoute || {};
  window.MediRoute.pages = window.MediRoute.pages || {};

  window.MediRoute.pages.ambulance = {
    updateInterval: null,
    map: null,
    markers: {},
    currentFilter: 'All',

    render() {
      // Provide fallback stats if store is missing
      const stats = (window.MediRoute.store && window.MediRoute.store.stats && window.MediRoute.store.stats.ambulances) || {
        total: 120,
        available: 45,
        enRoute: 65,
        atScene: 10
      };
      
      return `
        <div class="page page--ambulance animate-fade-in">
          <header class="page__header flex-between mb-2">
            <div>
              <h1 class="section-title text-gradient">🚑 Ambulance Command Center</h1>
              <p class="section-subtitle">Real-time fleet tracking and dispatch management</p>
            </div>
            <div class="header-stats flex gap-2">
               <span class="badge badge--info">Total: ${stats.total}</span>
               <span class="badge badge--success">Available: ${stats.available}</span>
               <span class="badge badge--warning">En Route: ${stats.enRoute}</span>
            </div>
          </header>

          <div class="grid grid--4 mb-2">
            <div class="stat-card stat-card--primary card card--glass card--glow">
              <div class="stat-card__icon">🚑</div>
              <div class="stat-card__content">
                <div class="stat-card__label">Total Fleet</div>
                <div class="stat-card__value" data-animate="counter">${stats.total}</div>
              </div>
            </div>
            <div class="stat-card stat-card--success card card--glass card--glow">
              <div class="stat-card__icon">✅</div>
              <div class="stat-card__content">
                <div class="stat-card__label">Available</div>
                <div class="stat-card__value" data-animate="counter">${stats.available}</div>
              </div>
            </div>
            <div class="stat-card stat-card--warning card card--glass card--glow">
              <div class="stat-card__icon">🔄</div>
              <div class="stat-card__content">
                <div class="stat-card__label">En Route</div>
                <div class="stat-card__value" data-animate="counter">${stats.enRoute}</div>
              </div>
            </div>
            <div class="stat-card stat-card--emergency card card--glass card--glow">
              <div class="stat-card__icon">🚨</div>
              <div class="stat-card__content">
                <div class="stat-card__label">At Scene</div>
                <div class="stat-card__value" data-animate="counter">${stats.atScene}</div>
              </div>
            </div>
          </div>

          <div class="grid" style="grid-template-columns: 60% 40%; gap: 1rem; margin-bottom: 2rem;">
            <div class="card card--glass map-container--full" style="height: 600px; padding: 0;">
              <div id="ambulance-map" class="map-container" style="height: 100%; border-radius: 16px;"></div>
            </div>
            <div class="card card--glass ambulance-panel flex flex-col gap-1" style="height: 600px; overflow-y: auto;">
              <div class="filter-pills flex gap-1 mb-1" style="flex-wrap: wrap;">
                <button class="btn btn--sm btn--primary filter-btn active" data-filter="All">All</button>
                <button class="btn btn--sm btn--ghost filter-btn" data-filter="Available">Available</button>
                <button class="btn btn--sm btn--ghost filter-btn" data-filter="En Route">En Route</button>
                <button class="btn btn--sm btn--ghost filter-btn" data-filter="At Scene">At Scene</button>
                <button class="btn btn--sm btn--ghost filter-btn" data-filter="Returning">Returning</button>
              </div>
              <div id="ambulance-list" class="flex flex-col gap-1">
                <!-- Ambulances will be rendered here -->
              </div>
            </div>
          </div>

          <div class="card card--glass mb-2">
            <h2 class="section-title mb-1">Recent Dispatches</h2>
            <div class="table-container">
              <table class="data-table w-100">
                <thead>
                  <tr>
                    <th>Ambulance ID</th>
                    <th>Patient Pickup</th>
                    <th>Destination Hospital</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody id="trip-history">
                  <!-- History rows will be populated -->
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    },

    renderAmbulanceList() {
      const container = document.getElementById('ambulance-list');
      if (!container) return;

      const ambulances = (window.MediRoute.store && window.MediRoute.store.ambulances) || [];
      const filtered = this.currentFilter === 'All' 
        ? ambulances 
        : ambulances.filter(a => a.status === this.currentFilter);

      if (filtered.length === 0) {
        container.innerHTML = '<div class="text-center p-2 text-muted">No ambulances found for this filter.</div>';
        return;
      }

      container.innerHTML = filtered.map(amb => `
        <div class="card card--hover ambulance-card p-1">
          <div class="flex-between mb-1">
            <div>
              <strong class="text-lg">${amb.id}</strong>
              <span class="text-sm text-muted block">${amb.type || 'Advanced Life Support'}</span>
            </div>
            ${window.MediRoute.components && window.MediRoute.components.getStatusBadge ? window.MediRoute.components.getStatusBadge(amb.status) : `<span class="badge">${amb.status}</span>`}
          </div>
          <div class="grid grid--2 gap-1 mb-1 text-sm">
            <div><strong>👨‍⚕️ Driver:</strong> ${amb.driver || 'Raj Kumar'}</div>
            <div><strong>📞 Phone:</strong> ${amb.phone || '+91-9876543210'}</div>
            <div style="grid-column: span 2;"><strong>🏥 Hospital:</strong> ${(window.MediRoute.store && window.MediRoute.store.getHospital && window.MediRoute.store.getHospital(amb.hospitalId)?.name) || 'Central Hospital'}</div>
          </div>
          <div class="flex gap-1 mb-1 flex-wrap">
            ${(amb.equipment || ['Defibrillator', 'Ventilator', 'Oxygen']).map(eq => `<span class="badge badge--info" style="font-size: 0.7rem;">${eq}</span>`).join('')}
          </div>
          ${amb.status === 'En Route' ? `
            <div class="mb-1 p-1" style="background: rgba(0,0,0,0.2); border-radius: 8px;">
              <div class="flex-between text-sm mb-0-5">
                <span>ETA to Scene</span>
                <strong>${window.MediRoute.components && window.MediRoute.components.formatTime ? window.MediRoute.components.formatTime(amb.eta || 15) : (amb.eta || 15) + ' min'}</strong>
              </div>
              ${window.MediRoute.components && window.MediRoute.components.createProgressBar ? window.MediRoute.components.createProgressBar(15 - (amb.eta || 15), 15, 'warning') : `<div style="height:4px;background:orange;width:50%"></div>`}
            </div>
          ` : ''}
          <div class="flex gap-1 mt-1">
            ${amb.status === 'Available' ? 
              `<button class="btn btn--sm btn--primary flex-1 btn-dispatch" data-id="${amb.id}">Dispatch</button>` : 
              amb.status === 'En Route' ?
              `<button class="btn btn--sm btn--warning flex-1 btn-track" data-id="${amb.id}">Track</button>` :
              `<button class="btn btn--sm btn--ghost flex-1" disabled>Busy</button>`
            }
            <button class="btn btn--sm btn--ghost btn-details" data-id="${amb.id}">Details</button>
          </div>
        </div>
      `).join('');

      // Attach dispatch events
      container.querySelectorAll('.btn-dispatch').forEach(btn => {
        btn.addEventListener('click', (e) => this.openDispatchModal(e.target.dataset.id));
      });
      // Attach track events
      container.querySelectorAll('.btn-track').forEach(btn => {
        btn.addEventListener('click', (e) => this.trackAmbulance(e.target.dataset.id));
      });
      // Attach details events
      container.querySelectorAll('.btn-details').forEach(btn => {
        btn.addEventListener('click', (e) => this.openDetailsModal(e.target.dataset.id));
      });
    },

    openDispatchModal(ambulanceId) {
      const amb = window.MediRoute.store && window.MediRoute.store.ambulances ? window.MediRoute.store.ambulances.find(a => a.id === ambulanceId) : null;
      if (!amb) return;

      const hospitals = (window.MediRoute.store && window.MediRoute.store.hospitals) || [];
      const hospitalOptions = hospitals.map(h => `<option value="${h.id}">${h.name}</option>`).join('');

      const content = `
        <div class="form-group mb-1">
          <label class="form-label">Patient Location</label>
          <input type="text" class="form-input" id="dispatch-location" placeholder="e.g. Connaught Place, Delhi" required>
        </div>
        <div class="form-group mb-1">
          <label class="form-label">Emergency Type</label>
          <select class="form-select" id="dispatch-type">
            <option value="Cardiac">🫀 Cardiac Arrest</option>
            <option value="Trauma">💥 Severe Trauma</option>
            <option value="Stroke">🧠 Stroke</option>
            <option value="Respiratory">🫁 Respiratory Distress</option>
            <option value="Other">Other Emergency</option>
          </select>
        </div>
        <div class="form-group mb-1">
          <label class="form-label">Destination Hospital</label>
          <select class="form-select" id="dispatch-hospital">
            ${hospitalOptions}
          </select>
        </div>
        <div class="form-group mb-2">
          <label class="form-label">Priority</label>
          <div class="flex gap-1">
            <label><input type="radio" name="priority" value="Normal"> Normal</label>
            <label><input type="radio" name="priority" value="Urgent"> Urgent</label>
            <label><input type="radio" name="priority" value="Critical" checked> Critical</label>
          </div>
        </div>
      `;

      if (window.MediRoute.components && window.MediRoute.components.createModal) {
        window.MediRoute.components.createModal(`Dispatch ${amb.id}`, content, [
          {
            label: 'Cancel',
            class: 'btn--ghost'
          },
          {
            label: '🚨 Dispatch Now',
            class: 'btn--danger',
            handler: () => {
              const loc = document.getElementById('dispatch-location').value;
              if (!loc) {
                if(window.MediRoute.components.showToast) window.MediRoute.components.showToast('Please enter patient location', 'error');
                return false; // don't close
              }
              
              // Update ambulance status
              amb.status = 'En Route';
              amb.eta = Math.floor(Math.random() * 15) + 5;
              
              // Update stats (rudimentary)
              if (window.MediRoute.store && window.MediRoute.store.stats && window.MediRoute.store.stats.ambulances) {
                window.MediRoute.store.stats.ambulances.available--;
                window.MediRoute.store.stats.ambulances.enRoute++;
              }

              if(window.MediRoute.components.showToast) window.MediRoute.components.showToast(`${amb.id} dispatched successfully to ${loc}`, 'success');
              
              // Re-render
              this.renderAmbulanceList();
              this.updateMapMarkers();
              
              return true;
            }
          }
        ]);
      }
    },

    trackAmbulance(ambulanceId) {
      const amb = (window.MediRoute.store && window.MediRoute.store.ambulances) ? window.MediRoute.store.ambulances.find(a => a.id === ambulanceId) : null;
      if (amb && this.map && this.markers[amb.id]) {
        this.map.setView([amb.lat, amb.lng], 15);
        this.markers[amb.id].openPopup();
        if (window.MediRoute.components && window.MediRoute.components.showToast) {
          window.MediRoute.components.showToast(`📍 Tracking Ambulance ${amb.id}`, 'info');
        }
      }
    },

    openDetailsModal(ambulanceId) {
      const amb = (window.MediRoute.store && window.MediRoute.store.ambulances) ? window.MediRoute.store.ambulances.find(a => a.id === ambulanceId) : null;
      if (!amb) return;

      const content = `
        <div class="mb-1"><strong>Vehicle ID:</strong> ${amb.id}</div>
        <div class="mb-1"><strong>Driver Name:</strong> ${amb.driver || 'Raj Kumar'}</div>
        <div class="mb-1"><strong>Paramedic Team:</strong> ${amb.paramedic || 'Team Alpha'}</div>
        <div class="mb-1">
          <strong>Equipment on board:</strong>
          <div class="flex gap-1 mt-0-5">
            ${(amb.equipment || ['Defibrillator', 'Oxygen', 'Ventilator']).map(eq => `<span class="badge badge--info">${eq}</span>`).join('')}
          </div>
        </div>
        <div class="mb-1"><strong>Current Speed/Location:</strong> ${amb.speed || '45 km/h'} / ${amb.location || 'Connaught Place'}</div>
        <div class="mb-1"><strong>Trip Log:</strong> ${amb.tripLog || 'En route to patient'}</div>
      `;

      if (window.MediRoute.components && window.MediRoute.components.createModal) {
        window.MediRoute.components.createModal(`Ambulance Details - ${amb.id}`, content, [
          { label: 'Close', class: 'btn--ghost' }
        ]);
      }
    },

    updateMapMarkers() {
      if (!this.map || !window.L) return;
      
      const ambulances = (window.MediRoute.store && window.MediRoute.store.ambulances) || [];
      
      ambulances.forEach(amb => {
        let lat = amb.lat || 28.6139 + (Math.random() - 0.5) * 0.1;
        let lng = amb.lng || 77.2090 + (Math.random() - 0.5) * 0.1;
        
        // Simulate movement if en route
        if (amb.status === 'En Route' || amb.status === 'At Scene') {
          lat += (Math.random() - 0.5) * 0.001;
          lng += (Math.random() - 0.5) * 0.001;
          amb.lat = lat;
          amb.lng = lng;
        }

        const color = amb.status === 'Available' ? '#10b981' : 
                      amb.status === 'En Route' ? '#f59e0b' : 
                      amb.status === 'At Scene' ? '#ef4444' : '#6b7280';
        const colorName = amb.status === 'Available' ? 'green' : 
                          amb.status === 'En Route' ? 'orange' : 
                          amb.status === 'At Scene' ? 'red' : 'gray';

        if (this.markers[amb.id]) {
          this.markers[amb.id].setLatLng([lat, lng]);
          
          const html = `<div class="status-dot status-dot--${colorName === 'green' ? 'online' : colorName === 'orange' ? 'busy' : 'offline'}" style="width: 20px; height: 20px; border-radius: 50%; background-color: ${color}; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-size: 10px;">🚑</div>`;
          const icon = L.divIcon({ html, className: 'custom-marker', iconSize: [20, 20] });
          this.markers[amb.id].setIcon(icon);
        } else {
           const html = `<div class="status-dot status-dot--${colorName === 'green' ? 'online' : colorName === 'orange' ? 'busy' : 'offline'}" style="width: 20px; height: 20px; border-radius: 50%; background-color: ${color}; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-size: 10px;">🚑</div>`;
           const icon = L.divIcon({ html, className: 'custom-marker', iconSize: [20, 20] });
           this.markers[amb.id] = L.marker([lat, lng], { icon }).addTo(this.map)
             .bindPopup(`<b>${amb.id}</b><br>Status: ${amb.status}`);
        }
      });
    },

    renderTripHistory() {
      const historyContainer = document.getElementById('trip-history');
      if (!historyContainer) return;

      const locations = ['Connaught Place, Delhi', 'Saket, Delhi', 'Vasant Kunj, Delhi', 'Karol Bagh, Delhi', 'Dwarka, Delhi', 'Rohini, Delhi', 'Lajpat Nagar, Delhi'];
      const statuses = ['Completed', 'Completed', 'Completed', 'Cancelled', 'Completed'];
      const hospitals = (window.MediRoute.store && window.MediRoute.store.hospitals) || [];
      
      const rows = Array.from({length: 10}).map((_, i) => {
        const id = `AMB-0${Math.floor(Math.random() * 90) + 10}`;
        const loc = locations[Math.floor(Math.random() * locations.length)];
        const hospitalName = hospitals.length > 0 ? hospitals[Math.floor(Math.random() * hospitals.length)].name : 'Apollo Emergency Hospital';
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const time = `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 50) + 10} ${Math.random() > 0.5 ? 'AM' : 'PM'}`;
        const duration = Math.floor(Math.random() * 45) + 15;
        const statusBadge = window.MediRoute.components && window.MediRoute.components.getStatusBadge 
          ? window.MediRoute.components.getStatusBadge(status === 'Completed' ? 'Available' : 'Offline')
          : `<span class="badge">${status}</span>`;

        return `
          <tr class="data-table__row animate-slide-up" style="animation-delay: ${i * 0.05}s">
            <td class="data-table__cell"><strong>${id}</strong></td>
            <td class="data-table__cell">${loc}</td>
            <td class="data-table__cell">${hospitalName}</td>
            <td class="data-table__cell">${time}</td>
            <td class="data-table__cell"><div class="flex gap-1 align-center">${statusBadge} ${status}</div></td>
            <td class="data-table__cell">${duration} mins</td>
          </tr>
        `;
      }).join('');

      historyContainer.innerHTML = rows;
    },

    mount() {
      // Filter functionality
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('btn--primary', 'active');
            b.classList.add('btn--ghost');
          });
          
          e.target.classList.remove('btn--ghost');
          e.target.classList.add('btn--primary', 'active');
          
          this.currentFilter = e.target.dataset.filter;
          this.renderAmbulanceList();
        });
      });

      // Render lists
      this.renderAmbulanceList();
      this.renderTripHistory();

      // Setup Map
      if (window.MediRoute.components && window.MediRoute.components.createMap) {
        this.map = window.MediRoute.components.createMap('ambulance-map', {
          center: [28.6139, 77.2090], // Delhi
          zoom: 11
        });
        
        // Initial markers
        this.updateMapMarkers();

        // Auto-refresh interval (simulate movement)
        this.updateInterval = setInterval(() => {
          this.updateMapMarkers();
        }, 3000);
      }
      
      // Animate counters
      if (window.MediRoute.components && window.MediRoute.components.animateCounter) {
        document.querySelectorAll('[data-animate="counter"]').forEach(el => {
          window.MediRoute.components.animateCounter(el, parseInt(el.textContent) || 0, 1000);
        });
      }
    },

    unmount() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
      }
      if (this.map && this.map.remove) {
        this.map.remove();
        this.map = null;
      }
      this.markers = {};
    }
  };
})();
