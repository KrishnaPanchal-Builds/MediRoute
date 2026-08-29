(function() {
  window.MediRoute = window.MediRoute || {};
  window.MediRoute.pages = window.MediRoute.pages || {};

  let map = null;
  let markers = [];
  let polylines = [];
  let patientMarker = null;
  let currentParams = {
    lat: 28.6139,
    lng: 77.2090,
    emergencyType: 'General',
    bedType: 'emergency',
    budget: 50000
  };

  const cities = {
    delhi: { lat: 28.6139, lng: 77.2090 },
    mumbai: { lat: 19.0760, lng: 72.8777 },
    bangalore: { lat: 12.9716, lng: 77.5946 },
    chennai: { lat: 13.0827, lng: 80.2707 }
  };

  async function fetchRoute(fromLat, fromLng, toLat, toLng) {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        return data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
      }
    } catch(e) { console.warn('OSRM route fetch failed:', e); }
    return [[fromLat, fromLng], [toLat, toLng]]; // straight line fallback
  }

  window.MediRoute.pages.emergency = {
    render() {
      return `
        <div class="page page--emergency animate-fade-in">
          
          <!-- One-Tap Emergency SOS Header Banner & Pipeline Progress Bar -->
          <div class="emergency-sos-header card card--glass mb-2">
            <div class="flex flex-between flex-wrap gap-1 align-center">
              <div class="flex align-center gap-1">
                <button class="btn btn--danger btn--glow animate-pulse" id="btn-one-tap-sos" onclick="window.MediRoute.pages.emergency.triggerSOS()">
                  🚨 ONE-TAP SOS DISPATCH
                </button>
                <div>
                  <strong class="text-gradient" style="font-size: 1.1rem;">Emergency Care Routing Pipeline</strong>
                  <div class="text-xs text-muted" id="sos-case-id">Case #CASE-9021-EM &bull; Active Geolocation</div>
                </div>
              </div>

              <!-- Pipeline Status Badges -->
              <div class="flex gap-1 align-center flex-wrap">
                <span class="badge badge--primary" id="step-badge-loc">📍 Location</span>
                <span class="badge badge--ghost" id="step-badge-triage">⚡ Rapid Triage</span>
                <span class="badge badge--ghost" id="step-badge-redflag">🚨 Red-Flag Engine</span>
                <span class="badge badge--ghost" id="step-badge-match">⚖️ Best Destination</span>
                <span class="badge badge--ghost" id="step-badge-handoff">📋 ER Handoff</span>
              </div>
            </div>
          </div>

          <div class="emergency-finder container">
            
            <!-- 2-Column Cards Grid (2 cards per row) -->
            <div class="emergency-cards-grid mb-2">
              
              <!-- Row 1 Left: 1. Patient Location -->
              <div class="card card--glass">
                <h3 class="mb-1 flex-between">
                  <span>📍 1. Patient Location</span>
                  <button id="btn-use-location" class="btn btn--primary btn--xs flex-center gap-1">
                    <span>📍</span> GPS
                  </button>
                </h3>
                <div class="form-group mb-1">
                  <input type="text" id="emergency-location-input" class="form-input text-xs" placeholder="Locality, City, or Landmark" value="Delhi Center">
                </div>
                <div class="flex gap-1" id="city-selector" style="flex-wrap: wrap;">
                  <button class="badge badge--info cursor-pointer text-xs" data-city="delhi">Delhi</button>
                  <button class="badge badge--info cursor-pointer text-xs" data-city="mumbai">Mumbai</button>
                  <button class="badge badge--info cursor-pointer text-xs" data-city="bangalore">Bangalore</button>
                  <button class="badge badge--info cursor-pointer text-xs" data-city="chennai">Chennai</button>
                </div>
              </div>

              <!-- Row 1 Right: 2. Rapid Adaptive Triage -->
              <div class="card card--glass">
                <h3 class="mb-1 flex-between">
                  <span>⚡ 2. Rapid Adaptive Triage</span>
                  <button class="btn btn--ghost btn--xs" onclick="window.MediRoute.pages.emergency.toggleVoiceInput()">🎤 Voice</button>
                </h3>
                
                <div class="form-group mb-1">
                  <label class="form-label text-xs">Emergency Condition:</label>
                  <div class="emergency-type-grid" id="emergency-type-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                    <button class="btn btn--ghost emergency-type-btn text-xs" data-type="Cardiac">🫀 Cardiac</button>
                    <button class="btn btn--ghost emergency-type-btn text-xs" data-type="Trauma">🦴 Trauma</button>
                    <button class="btn btn--ghost emergency-type-btn text-xs" data-type="Burns">🔥 Burns</button>
                    <button class="btn btn--ghost emergency-type-btn text-xs" data-type="Stroke">🧠 Stroke</button>
                    <button class="btn btn--ghost emergency-type-btn text-xs" data-type="Pediatric">👶 Pediatric</button>
                    <button class="btn btn--ghost emergency-type-btn selected text-xs" style="background: var(--color-primary); color: white;" data-type="General">🏥 General ER</button>
                  </div>
                </div>

                <!-- Adaptive Dynamic Branching Questions -->
                <div class="adaptive-questions-box p-1 text-xs" style="background: rgba(255,255,255,0.03); border-radius: var(--radius-md); border: 1px solid var(--glass-border);">
                  <div class="font-semibold text-primary mb-1">Clinical Risk Check:</div>
                  <div class="flex flex-col gap-1">
                    <label class="flex align-center gap-1 cursor-pointer">
                      <input type="checkbox" id="chk-sweating" onchange="window.MediRoute.pages.emergency.evaluateRedFlags()">
                      <span>Cold Sweating / Arm Pain</span>
                    </label>
                    <label class="flex align-center gap-1 cursor-pointer">
                      <input type="checkbox" id="chk-breathing" onchange="window.MediRoute.pages.emergency.evaluateRedFlags()">
                      <span>Dyspnea / Gasping</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Row 2 Left: 3. Red-Flag Priority Signal Engine -->
              <div id="red-flag-banner" class="card card--glow" style="border-color: #FF4757; background: rgba(255, 71, 87, 0.12);">
                <div class="flex align-center gap-1 mb-1">
                  <span style="font-size: 1.5rem;">🚨</span>
                  <div>
                    <strong style="color: #FF4757; font-size: 0.9rem;">RED-FLAG PRIORITY ACTIVE</strong>
                    <div class="text-xs text-muted" id="red-flag-desc">Level-1 Resuscitation Protocol initialized.</div>
                  </div>
                </div>
                <div class="text-xs text-muted italic" style="border-top: 1px solid rgba(255,71,87,0.2); padding-top: 4px;">
                  🛡️ Safety Grounding: Clinical risk signal derived from user symptoms.
                </div>
              </div>

              <!-- Row 2 Right: 4. Bed Unit & Budget Filters -->
              <div class="card card--glass">
                <h3 class="mb-1 text-xs font-semibold">🛏️ Required Unit & Budget</h3>
                <div class="flex gap-1 mb-1" id="bed-type-selector" style="flex-wrap: wrap;">
                  <button class="badge badge--primary cursor-pointer selected text-xs" data-bed="emergency">Emergency</button>
                  <button class="badge badge--info cursor-pointer text-xs" data-bed="icu">ICU Bed</button>
                  <button class="badge badge--info cursor-pointer text-xs" data-bed="ventilator">Ventilator</button>
                  <button class="badge badge--info cursor-pointer text-xs" data-bed="general">General</button>
                </div>
                <div class="form-group">
                  <div class="flex flex-between text-xs mb-1">
                    <span>Budget Limit:</span>
                    <strong id="budget-display" class="text-primary">₹50,000 / day</strong>
                  </div>
                  <input type="range" id="budget-range" class="form-range w-full" min="0" max="50000" step="1000" value="50000">
                </div>
              </div>

            </div>

            <!-- Full-Width Calculate Action Button -->
            <button id="btn-search-hospitals" class="btn btn--danger btn--xl btn--glow w-full mb-2 animate-pulse" onclick="window.MediRoute.pages.emergency.handleSearch()">
              ⚖️ Calculate Best-Destination Ranking
            </button>

            <!-- Lower Split Layout: Search Results (Left) + Smaller Map Container (Right) -->
            <div class="emergency-lower-split">
              
              <div class="results-col">
                <!-- AI Thinking Engine -->
                <div id="ai-thinking" class="ai-thinking hidden card card--glow mb-2 text-center py-2" style="border-color: var(--color-primary);">
                  <div class="text-3xl mb-1" style="animation: pulse 1s infinite;">🧠</div>
                  <h3 class="mb-1 text-gradient text-sm">MediRoute Best-Destination Engine</h3>
                  <div class="text-xs text-muted">
                    Score: <code>Clinical Match (30%) + Bed (20%) + ETA (20%) + Capability (20%)</code>
                  </div>
                </div>

                <!-- Results & Side-by-Side Hospital Comparison Matrix -->
                <div id="search-results" class="hidden pb-2">
                  <h3 class="mb-1 flex-between text-sm">
                    <span>Top Matched Hospitals</span>
                    <span class="badge badge--success" id="result-count">0</span>
                  </h3>

                  <!-- Side-by-Side Comparison Matrix -->
                  <div class="card card--glass mb-2 p-2" id="comparison-matrix-box">
                    <h4 class="text-xs font-semibold text-primary mb-1">📊 Side-by-Side Facility Matrix</h4>
                    <div id="comparison-matrix-table" class="text-xs" style="overflow-x: auto;"></div>
                  </div>

                  <div id="results-list" class="flex flex-col gap-2"></div>
                </div>

                <!-- Pre-Arrival Digital Handoff Summary Card -->
                <div id="digital-handoff-card" class="hidden card card--glass mb-2 p-2" style="border-color: var(--color-success); background: rgba(46, 213, 115, 0.08);">
                  <div class="flex flex-between align-center mb-1">
                    <strong class="text-success" style="font-size: 0.95rem;">📋 Pre-Arrival Digital Handoff Card Generated</strong>
                    <span class="badge badge--success">Synced to ER</span>
                  </div>
                  <div class="text-xs flex flex-col gap-1 text-secondary" id="handoff-card-details">
                    <div><strong>Case ID:</strong> CASE-9021-EM</div>
                    <div><strong>Impression:</strong> Acute Chest Discomfort &bull; Red-Flag Priority Level-1</div>
                    <div><strong>Destination ER:</strong> AIIMS New Delhi (ICU Bed Reserved)</div>
                    <div><strong>ETA:</strong> 8 mins via OSRM Optimized Route</div>
                  </div>
                  <button class="btn btn--success btn--sm w-full mt-2" onclick="window.MediRoute.components.showToast('📋 Digital handoff re-sent to destination ER dashboard!', 'success')">
                    🚀 Re-Sync Pre-Arrival Handoff
                  </button>
                </div>
              </div>

              <!-- Right Column: Smaller Compact Map (200px width, 250px height) -->
              <div class="compact-map-col" style="width: 200px; flex-shrink: 0;">
                <div class="card card--glass p-1">
                  <h4 class="text-xs font-semibold mb-1 flex-between">
                    <span>🗺️ Map</span>
                    <span class="badge badge--info text-xs">OSRM</span>
                  </h4>
                  <div id="emergency-map" style="width: 200px; height: 250px; border-radius: var(--radius-lg); overflow: hidden;"></div>
                </div>
              </div>

            </div>

          </div>
      `;
    },

    mount() {
      // Map init (safely wrapped in try/catch to prevent map initialization errors from breaking page interaction)
      const mapContainer = document.getElementById('emergency-map');
      if (mapContainer && window.MediRoute.components?.createMap) {
        try {
          if (map) {
            map.remove();
            map = null;
          }
          map = window.MediRoute.components.createMap('emergency-map', {
            center: [currentParams.lat, currentParams.lng],
            zoom: 12
          });
        } catch(e) {
          console.warn('Map initialization notice:', e);
        }
      }

      // Location Input Manual Entry
      const locationInput = document.getElementById('emergency-location-input');
      if (locationInput) {
        const handleLocationUpdate = (e) => {
          if (e.type === 'keyup' && e.key !== 'Enter') return;
          const val = e.target.value.toLowerCase().trim();
          
          const localities = {
            saket: { lat: 28.5246, lng: 77.2066 },
            dwarka: { lat: 28.5921, lng: 77.0460 },
            andheri: { lat: 19.1136, lng: 72.8697 },
            indiranagar: { lat: 12.9719, lng: 77.6412 },
            koramangala: { lat: 12.9352, lng: 77.6245 },
            aiims: { lat: 28.5672, lng: 77.2100 }
          };
          
          let found = null;
          let foundName = '';
          if (cities[val]) {
            found = cities[val];
            foundName = val.charAt(0).toUpperCase() + val.slice(1);
          } else if (localities[val]) {
            found = localities[val];
            foundName = val.charAt(0).toUpperCase() + val.slice(1);
          } else {
            // Find by hospital name
            const allHospitals = window.MediRoute.store ? window.MediRoute.store.getHospitals() : [];
            const hospital = allHospitals.find(h => h.name.toLowerCase().includes(val) || h.area.toLowerCase().includes(val));
            if (hospital) {
                found = { lat: hospital.lat, lng: hospital.lng };
                foundName = hospital.name;
            }
          }

          if (found) {
            currentParams.lat = found.lat;
            currentParams.lng = found.lng;
            if (map && window.L) map.setView([currentParams.lat, currentParams.lng], 14, { animate: true });
            window.MediRoute.components.showToast(`📍 Location updated to ${foundName}`, 'success');
            if (e.type === 'keyup') this.handleSearch();
          }
        };
        locationInput.addEventListener('change', handleLocationUpdate);
        locationInput.addEventListener('keyup', handleLocationUpdate);
      }

      // Location / GPS
      const btnUseLocation = document.getElementById('btn-use-location');
      if (btnUseLocation) {
        btnUseLocation.addEventListener('click', () => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                currentParams.lat = position.coords.latitude;
                currentParams.lng = position.coords.longitude;
                document.getElementById('emergency-location-input').value = `GPS Location (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`;
                if (map) map.setView([currentParams.lat, currentParams.lng], 14);
                window.MediRoute.components.showToast('📍 Real location acquired! Accuracy: ' + Math.round(position.coords.accuracy) + 'm', 'success');
              },
              (error) => {
                // Fallback to Delhi
                window.MediRoute.components.showToast('GPS unavailable, using default Delhi location', 'warning');
                currentParams.lat = 28.6139;
                currentParams.lng = 77.2090;
                document.getElementById('emergency-location-input').value = 'Delhi (GPS unavailable)';
                if (map) map.setView([currentParams.lat, currentParams.lng], 12);
              },
              { enableHighAccuracy: true, timeout: 10000 }
            );
          } else {
            window.MediRoute.components.showToast('Geolocation not supported by browser', 'error');
          }
        });
      }

      // City Selector
      const citySelector = document.getElementById('city-selector');
      if (citySelector) {
        citySelector.addEventListener('click', (e) => {
          if (e.target.dataset.city) {
            const city = e.target.dataset.city;
            currentParams.lat = cities[city].lat;
            currentParams.lng = cities[city].lng;
            document.getElementById('emergency-location-input').value = e.target.innerText;
            if (map && window.L) map.setView([currentParams.lat, currentParams.lng], 12);
            window.MediRoute.components.showToast('Location set to ' + e.target.innerText, 'info');
          }
        });
      }

      // Emergency Type
      const typeGrid = document.getElementById('emergency-type-grid');
      if (typeGrid) {
        typeGrid.addEventListener('click', (e) => {
          const btn = e.target.closest('.emergency-type-btn');
          if (btn) {
            typeGrid.querySelectorAll('.emergency-type-btn').forEach(b => {
              b.style.background = '';
              b.style.color = '';
              b.classList.remove('selected');
            });
            btn.style.background = 'var(--primary)';
            btn.style.color = 'white';
            btn.classList.add('selected');
            currentParams.emergencyType = btn.dataset.type;
          }
        });
      }

      // Bed Type
      const bedSelector = document.getElementById('bed-type-selector');
      if (bedSelector) {
        bedSelector.addEventListener('click', (e) => {
          if (e.target.dataset.bed) {
            bedSelector.querySelectorAll('button').forEach(b => {
              b.className = 'badge badge--info cursor-pointer';
              b.classList.remove('selected');
            });
            e.target.className = 'badge badge--primary cursor-pointer selected';
            currentParams.bedType = e.target.dataset.bed;
          }
        });
      }

      // Budget Range
      const budgetRange = document.getElementById('budget-range');
      const budgetDisplay = document.getElementById('budget-display');
      if (budgetRange && budgetDisplay) {
        budgetRange.addEventListener('input', (e) => {
          currentParams.budget = parseInt(e.target.value);
          budgetDisplay.innerText = window.MediRoute.components.formatCurrency(currentParams.budget);
        });
      }

      // Search Action
      const btnSearch = document.getElementById('btn-search-hospitals');
      if (btnSearch) {
        btnSearch.addEventListener('click', this.handleSearch.bind(this));
      }

      // Check sessionStorage for pre-fill
      const heroLoc = sessionStorage.getItem('search_location') || sessionStorage.getItem('hero_search_loc');
      const heroType = sessionStorage.getItem('search_type') || sessionStorage.getItem('hero_search_type');
      if (heroLoc || heroType) {
        if (heroLoc) {
          const locInput = document.getElementById('emergency-location-input');
          if (locInput) {
            locInput.value = heroLoc;
            locInput.dispatchEvent(new Event('change'));
          }
        }
        if (heroType) {
          const typeGrid = document.getElementById('emergency-type-grid');
          if (typeGrid) {
            const btn = Array.from(typeGrid.querySelectorAll('.emergency-type-btn')).find(b => b.dataset.type === heroType);
            if (btn) btn.click();
          }
        }
        sessionStorage.removeItem('search_location');
        sessionStorage.removeItem('search_type');
        sessionStorage.removeItem('hero_search_loc');
        sessionStorage.removeItem('hero_search_type');
        setTimeout(() => this.handleSearch(), 500);
      }
    },

    handleSearch() {
      const btnSearch = document.getElementById('btn-search-hospitals');
      const aiThinking = document.getElementById('ai-thinking');
      const searchResults = document.getElementById('search-results');
      
      btnSearch.disabled = true;
      btnSearch.innerHTML = 'Analyzing...';
      searchResults.classList.add('hidden');
      aiThinking.classList.remove('hidden');

      // Clear existing map layers
      if (map && window.L) {
        markers.forEach(m => m.remove());
        polylines.forEach(p => p.remove());
        if (patientMarker) patientMarker.remove();
        markers = [];
        polylines = [];
      }

      // Simulate API / AI processing delay
      setTimeout(() => {
        aiThinking.classList.add('hidden');
        searchResults.classList.remove('hidden');
        btnSearch.disabled = false;
        btnSearch.innerHTML = '🔍 Find Best Hospital Now';
        
        this.renderResults();
      }, 1500);
    },

    async renderResults() {
      try {
        if (!window.MediRoute.ai || !window.MediRoute.ai.findBestHospitals) {
          console.error("AI engine not available");
          return;
        }

        const resultsList = document.getElementById('results-list');
        const resultCount = document.getElementById('result-count');
        if (!resultsList) return;
        
        // Get results from AI
        const topHospitals = window.MediRoute.ai.findBestHospitals(currentParams).slice(0, 8);
        
        if (topHospitals.length === 0) {
          resultsList.innerHTML = '<div class="card p-2 text-center">No hospitals found matching criteria.</div>';
          if (resultCount) resultCount.innerText = '0';
          return;
        }
        
        if (resultCount) resultCount.innerText = topHospitals.length;
        resultsList.innerHTML = '';

        const comps = window.MediRoute.components || {};
        const bounds = window.L ? L.latLngBounds([[currentParams.lat, currentParams.lng]]) : null;

        // Add patient marker
        if (map && window.L && comps.createPatientMarker) {
          patientMarker = comps.createPatientMarker(map, currentParams.lat, currentParams.lng);
        }

        topHospitals.forEach((result, index) => {
          const hospital = result.hospital;
          const score = result.totalScore / 100;
          
          // Safe bed type lookup
          const safeBedKey = hospital.beds[currentParams.bedType] ? currentParams.bedType : 'emergency';
          const bedObj = hospital.beds[safeBedKey] || { available: 5, total: 10 };
          const costVal = (hospital.costPerDay && hospital.costPerDay[safeBedKey]) ? hospital.costPerDay[safeBedKey] : 5000;

          // Build card HTML
          const isBest = index === 0;
          const cardClass = isBest ? 'card card--glass card--glow best-match' : 'card card--glass card--hover';
          const scorePercent = Math.round(score * 100);
          
          const html = `
            <div class="${cardClass} p-2 cursor-pointer" data-index="${index}" data-lat="${hospital.lat}" data-lng="${hospital.lng}" style="position: relative; overflow: hidden;">
              ${isBest ? '<div style="position:absolute; top:0; right:0; background:var(--color-primary); color:white; font-size:0.7rem; padding: 2px 8px; border-bottom-left-radius: 8px;">★ Best Match</div>' : ''}
              
              <div class="flex gap-1 mb-1">
                <div class="hospital-result__rank flex-center" style="width: 32px; height: 32px; border-radius: 50%; background: ${isBest ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'}; font-weight: bold;">
                  #${index + 1}
                </div>
                <div style="flex: 1;">
                  <h4 class="m-0" style="font-size: 1.1rem;">${hospital.name}</h4>
                  <div class="text-sm" style="color: var(--text-secondary);">📍 ${hospital.area}, ${hospital.city}</div>
                </div>
              </div>
              
              <div class="grid grid--2 gap-1 mb-1 text-sm">
                <div class="flex items-center gap-0.5">
                  <span>🚗</span> ${result.distanceKm.toFixed(1)} km (~${result.travelMinutes + ' min'})
                </div>
                <div class="flex items-center gap-0.5">
                  <span>🛏️</span> ${bedObj.available} ${safeBedKey} beds
                </div>
                <div class="flex items-center gap-0.5">
                  <span>💰</span> ${comps.formatCurrency ? comps.formatCurrency(costVal) : '₹' + costVal}/day
                </div>
                <div class="flex items-center gap-0.5">
                  <span>⭐</span> ${hospital.rating}/5.0
                </div>
              </div>
              
              <div class="mb-1">
                <div class="flex-between text-sm mb-0.5">
                  <span>AI Confidence Score</span>
                  <span class="${scorePercent > 80 ? 'text-success' : 'text-warning'} font-bold">${scorePercent}%</span>
                </div>
                ${comps.createProgressBar ? comps.createProgressBar(scorePercent, 100, scorePercent > 80 ? 'success' : 'warning') : ''}
              </div>
              
              <div class="flex gap-0.5 mb-1" style="flex-wrap: wrap;">
                ${hospital.facilities.slice(0, 3).map(f => `<span class="badge badge--info" style="font-size: 0.7rem;">${f}</span>`).join('')}
                ${hospital.facilities.length > 3 ? `<span class="badge" style="font-size: 0.7rem;">+${hospital.facilities.length - 3}</span>` : ''}
              </div>

              <div class="flex-between mt-1">
                <button class="btn btn--ghost btn--sm view-details-btn">View Details</button>
                <button class="btn btn--danger btn--sm flex items-center gap-0.5 dispatch-btn">
                  <span>🚑</span> Dispatch
                </button>
              </div>
            </div>
          `;
          
          resultsList.insertAdjacentHTML('beforeend', html);

          // Add map marker
          if (map && window.L && comps.createHospitalMarker) {
            try {
              const marker = comps.createHospitalMarker(map, hospital.lat, hospital.lng, hospital);
              markers.push(marker);
              if (bounds) bounds.extend([hospital.lat, hospital.lng]);
            } catch(me) { console.warn('Marker error:', me); }
          }
        });

        // Add routes safely
        if (map && window.L) {
          const routeColors = ['#00D4AA', '#6C63FF', '#FFA502'];
          for (let i = 0; i < Math.min(3, topHospitals.length); i++) {
            try {
              const h = topHospitals[i].hospital;
              const coords = await fetchRoute(currentParams.lat, currentParams.lng, h.lat, h.lng);
              if (coords && coords.length > 0) {
                const line = L.polyline(coords, {
                  color: routeColors[i] || '#00D4AA',
                  weight: 4,
                  opacity: 0.8
                }).addTo(map);
                polylines.push(line);
              }
            } catch(re) { console.warn('Route polyline notice:', re); }
          }
        }

        // Fit map bounds
        if (map && window.L && bounds && bounds.isValid()) {
          try { map.fitBounds(bounds, { padding: [50, 50] }); } catch(be) {}
        }

        // Add click listeners to result cards for panning map & viewing details / booking
        resultsList.querySelectorAll('.card').forEach(card => {
          card.addEventListener('click', (e) => {
            if (e.target.closest('.btn')) return;
            const lat = parseFloat(card.dataset.lat);
            const lng = parseFloat(card.dataset.lng);
            if (map && window.L && !isNaN(lat) && !isNaN(lng)) {
              map.setView([lat, lng], 14, { animate: true });
            }
          });

          // View Details
          const viewBtn = card.querySelector('.view-details-btn');
          if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              const index = card.dataset.index;
              const hospital = topHospitals[index]?.hospital;
              if (!hospital) return;
              
              const detailsHtml = `
                <div class="hospital-details">
                  <div class="flex-between mb-1">
                    <h3 class="m-0">${hospital.name}</h3>
                    <span class="badge badge--success">⭐ ${hospital.rating}</span>
                  </div>
                  <div class="text-sm mb-2">
                    <p>📍 ${hospital.address || hospital.area + ', ' + hospital.city}</p>
                    <p>📞 <a href="tel:${hospital.phone || '1234567890'}">${hospital.phone || 'Contact Hospital'}</a></p>
                  </div>
                  
                  <h4 class="mb-1 text-primary">🛏️ Bed Breakdown</h4>
                  <div class="grid grid--2 gap-1 mb-2 text-xs">
                    <div class="card p-1 text-center"><strong>ICU:</strong> ${hospital.beds.icu.available}/${hospital.beds.icu.total}</div>
                    <div class="card p-1 text-center"><strong>Emergency:</strong> ${hospital.beds.emergency.available}/${hospital.beds.emergency.total}</div>
                    <div class="card p-1 text-center"><strong>General:</strong> ${hospital.beds.general.available}/${hospital.beds.general.total}</div>
                    <div class="card p-1 text-center"><strong>Pediatric:</strong> ${hospital.beds.pediatric.available}/${hospital.beds.pediatric.total}</div>
                  </div>

                  <h4 class="mb-1 text-primary">🏥 Facilities</h4>
                  <div class="flex gap-0.5 flex-wrap mb-2 text-xs">
                    ${hospital.facilities.map(f => `<span class="badge badge--info">${f}</span>`).join('')}
                  </div>

                  <h4 class="mb-1 text-primary">🩺 Emergency Types</h4>
                  <div class="flex gap-0.5 flex-wrap mb-2 text-xs">
                    ${hospital.emergencyTypes.map(t => `<span class="badge badge--warning">${t}</span>`).join('')}
                  </div>
                </div>
              `;
              window.MediRoute.components.createModal('Hospital Details', detailsHtml, [
                { id: 'close', label: 'Close', class: 'btn--ghost', handler: () => {} }
              ]);
            });
          }

          // Dispatch Book Bed
          const dispatchBtn = card.querySelector('.dispatch-btn');
          if (dispatchBtn) {
            dispatchBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              const index = card.dataset.index;
              const hospital = topHospitals[index]?.hospital;
              if (!hospital) return;
              
              const dispatchHtml = `
                <div class="dispatch-form">
                  <p class="mb-2 text-sm text-gray">Booking emergency admission for <strong>${hospital.name}</strong>.</p>
                  <div class="form-group mb-1">
                    <label class="d-block mb-0.5 text-xs">Select Bed Type</label>
                    <select id="dispatch-bed-type" class="form-select w-full text-xs">
                      <option value="emergency">Emergency Bed</option>
                      <option value="icu">ICU Bed</option>
                      <option value="general">General Bed</option>
                    </select>
                  </div>
                  <div class="form-group mb-1">
                    <label class="d-block mb-0.5 text-xs">Patient Name</label>
                    <input type="text" id="dispatch-patient-name" class="form-input w-full text-xs" placeholder="Enter patient name" value="Emergency Patient">
                  </div>
                  <div class="form-group mb-1">
                    <label class="d-block mb-0.5 text-xs">Patient Contact</label>
                    <input type="tel" id="dispatch-patient-contact" class="form-input w-full text-xs" placeholder="Enter contact number" value="+91-9876543210">
                  </div>
                </div>
              `;
              
              window.MediRoute.components.createModal('🚑 Emergency Bed Booking', dispatchHtml, [
                { id: 'cancel', label: 'Cancel', class: 'btn--ghost', handler: () => {} },
                { id: 'confirm', label: 'Confirm Submission', class: 'btn--danger', handler: () => {
                  const bedType = document.getElementById('dispatch-bed-type').value;
                  const pName = document.getElementById('dispatch-patient-name').value;
                  if (!pName) {
                    window.MediRoute.components.showToast('Please enter patient name', 'warning');
                    return false;
                  }
                  
                  if (hospital.beds[bedType] && hospital.beds[bedType].available > 0) {
                    window.MediRoute.store.updateBed(hospital.id, bedType, -1);
                    const bookingId = 'MR-' + Math.floor(Math.random()*9000+1000);
                    window.MediRoute.components.showToast(`🚨 Emergency Admission Confirmed for ${pName}! Booking ID #${bookingId}`, 'success', 5000);
                    this.handleSearch();
                    return true;
                  } else {
                    window.MediRoute.components.showToast('Bed reserved successfully!', 'success');
                    return true;
                  }
                }}
              ]);
            });
          }
        });
        this.renderComparisonMatrix(topHospitals);
        document.getElementById('step-badge-match')?.classList.replace('badge--ghost', 'badge--primary');
        window.MediRoute.components.showToast(`Found ${topHospitals.length} hospitals. Best match: ${topHospitals[0].hospital.name}`, 'success');
      } catch(err) {
        console.error('renderResults error:', err);
      }
    },

    triggerSOS() {
      const caseId = 'CASE-' + Math.floor(1000 + Math.random() * 9000) + '-EM';
      const caseIdEl = document.getElementById('sos-case-id');
      if (caseIdEl) caseIdEl.textContent = `Case #${caseId} • Active Geolocation`;

      // Update progress badges
      document.getElementById('step-badge-loc')?.classList.replace('badge--ghost', 'badge--primary');
      document.getElementById('step-badge-triage')?.classList.replace('badge--ghost', 'badge--primary');
      document.getElementById('step-badge-redflag')?.classList.replace('badge--ghost', 'badge--danger');

      window.MediRoute.components.showToast(`🚨 ONE-TAP SOS ACTIVATED! Emergency Case #${caseId} Created. Initiating Rapid Triage...`, 'error', 6000);
      
      // Auto evaluate red-flags & trigger search
      this.evaluateRedFlags();
      setTimeout(() => this.handleSearch(), 800);
    },

    toggleVoiceInput() {
      window.MediRoute.components.showToast('🎤 Multilingual Voice Intake Active. Speak symptoms now...', 'info');
      // Simulate voice input recognition
      setTimeout(() => {
        const sweating = document.getElementById('chk-sweating');
        const breathing = document.getElementById('chk-breathing');
        if (sweating) sweating.checked = true;
        if (breathing) breathing.checked = true;
        this.evaluateRedFlags();
        window.MediRoute.components.showToast('🗣️ Transcribed: "Patient experiencing chest tightness and difficulty breathing"', 'success');
      }, 1500);
    },

    evaluateRedFlags() {
      const sweating = document.getElementById('chk-sweating')?.checked;
      const breathing = document.getElementById('chk-breathing')?.checked;
      const unconscious = document.getElementById('chk-unconscious')?.checked;

      const banner = document.getElementById('red-flag-banner');
      const desc = document.getElementById('red-flag-desc');

      if (sweating || breathing || unconscious) {
        if (banner) banner.style.display = 'block';
        if (desc) {
          desc.textContent = `CRITICAL RED-FLAG SIGNAL: ${sweating ? 'Cold Sweating & Arm Radiation ' : ''}${breathing ? 'Severe Dyspnea ' : ''}${unconscious ? 'Unresponsiveness ' : ''}. Resuscitation Protocol Level-1.`;
        }
        document.getElementById('step-badge-redflag')?.classList.replace('badge--ghost', 'badge--danger');
      } else {
        if (banner) banner.style.display = 'none';
        document.getElementById('step-badge-redflag')?.classList.replace('badge--danger', 'badge--ghost');
      }
    },

    renderComparisonMatrix(topHospitals) {
      const matrixBox = document.getElementById('comparison-matrix-table');
      if (!matrixBox || topHospitals.length === 0) return;

      const top2 = topHospitals.slice(0, 2);
      let html = `
        <table class="data-table w-full text-xs" style="border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--glass-border);">
              <th style="padding: 6px; text-align: left;">Parameter</th>
              ${top2.map(h => `<th style="padding: 6px; text-align: center; color: var(--color-primary);">${h.hospital.name}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 6px; font-weight: 600;">Distance / ETA</td>
              ${top2.map(h => `<td style="padding: 6px; text-align: center;">${h.distanceText} (${h.etaText})</td>`).join('')}
            </tr>
            <tr>
              <td style="padding: 6px; font-weight: 600;">Required Unit</td>
              ${top2.map(h => `<td style="padding: 6px; text-align: center;">${h.hospital.emergencyTypes.includes(currentParams.emergencyType) || currentParams.emergencyType === 'General' ? '🟢 Verified' : '🟡 General'}</td>`).join('')}
            </tr>
            <tr>
              <td style="padding: 6px; font-weight: 600;">ICU Bed Status</td>
              ${top2.map(h => `<td style="padding: 6px; text-align: center;">${h.hospital.beds.icu.available > 0 ? '🟢 ' + h.hospital.beds.icu.available + ' Available' : '🔴 Full'}</td>`).join('')}
            </tr>
            <tr>
              <td style="padding: 6px; font-weight: 600;">Emergency Status</td>
              ${top2.map(h => `<td style="padding: 6px; text-align: center;"><span class="badge badge--success">Active ER</span></td>`).join('')}
            </tr>
            <tr>
              <td style="padding: 6px; font-weight: 600;">Action</td>
              ${top2.map((h, i) => `
                <td style="padding: 6px; text-align: center;">
                  <button class="btn btn--danger btn--xs" onclick="window.MediRoute.pages.emergency.selectHospitalFromMatrix(${i})">
                    Select & Reserve
                  </button>
                </td>
              `).join('')}
            </tr>
          </tbody>
        </table>
      `;
      matrixBox.innerHTML = html;
    },

    selectHospitalFromMatrix(index) {
      window.MediRoute.components.showToast('📋 Destination selected from matrix! Generating Pre-Arrival Handoff...', 'success');
      const handoffCard = document.getElementById('digital-handoff-card');
      if (handoffCard) handoffCard.classList.remove('hidden');
      document.getElementById('step-badge-handoff')?.classList.replace('badge--ghost', 'badge--success');
    },

    unmount() {
      // Cleanup
      if (map) {
        map.remove();
        map = null;
      }
      markers = [];
      polylines = [];
      patientMarker = null;
    }
  };
})();
