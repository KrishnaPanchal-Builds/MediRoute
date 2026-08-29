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
        <div class="page page--emergency">
          <div class="emergency-finder">
            <div class="emergency-finder__panel">
              <div class="page__header mb-2">
                <h1 class="section-title text-glow">🚨 Emergency Hospital Finder</h1>
                <p class="section-subtitle">AI-powered instant hospital matching and routing</p>
              </div>
              
              <div class="panel-content" style="max-height: calc(100vh - 120px); overflow-y: auto; padding-right: 10px;">
                <!-- Location Section -->
                <div class="card card--glass mb-2">
                  <h3 class="mb-1">📍 Your Location</h3>
                  <div class="form-group mb-1">
                    <input type="text" id="emergency-location-input" class="form-input" placeholder="Enter your location or use GPS" value="Delhi Center">
                  </div>
                  <button id="btn-use-location" class="btn btn--primary btn--sm mb-1 w-full flex-center gap-1">
                    <span>📍</span> Use My GPS Location
                  </button>
                  <div class="flex gap-1" id="city-selector" style="flex-wrap: wrap;">
                    <button class="badge badge--info cursor-pointer" data-city="delhi">Delhi</button>
                    <button class="badge badge--info cursor-pointer" data-city="mumbai">Mumbai</button>
                    <button class="badge badge--info cursor-pointer" data-city="bangalore">Bangalore</button>
                    <button class="badge badge--info cursor-pointer" data-city="chennai">Chennai</button>
                  </div>
                </div>

                <!-- Emergency Type Section -->
                <div class="card card--glass mb-2">
                  <h3 class="mb-1">🏥 Emergency Type</h3>
                  <div class="emergency-type-grid" id="emergency-type-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <button class="btn btn--ghost emergency-type-btn" data-type="Cardiac">🫀 Cardiac</button>
                    <button class="btn btn--ghost emergency-type-btn" data-type="Trauma">🦴 Trauma</button>
                    <button class="btn btn--ghost emergency-type-btn" data-type="Burns">🔥 Burns</button>
                    <button class="btn btn--ghost emergency-type-btn" data-type="Stroke">🧠 Stroke</button>
                    <button class="btn btn--ghost emergency-type-btn" data-type="Pediatric">👶 Pediatric</button>
                    <button class="btn btn--ghost emergency-type-btn selected" style="background: var(--primary); color: white;" data-type="General">🏥 General</button>
                  </div>
                </div>

                <!-- Bed Type Section -->
                <div class="card card--glass mb-2">
                  <h3 class="mb-1">🛏️ Bed Type</h3>
                  <div class="flex gap-1" id="bed-type-selector" style="flex-wrap: wrap;">
                    <button class="badge badge--primary cursor-pointer selected" data-bed="emergency">Emergency</button>
                    <button class="badge badge--info cursor-pointer" data-bed="icu">ICU</button>
                    <button class="badge badge--info cursor-pointer" data-bed="general">General</button>
                    <button class="badge badge--info cursor-pointer" data-bed="pediatric">Pediatric</button>
                  </div>
                </div>

                <!-- Budget Range Section -->
                <div class="card card--glass mb-2">
                  <h3 class="mb-1">💰 Budget Range (per day)</h3>
                  <input type="range" id="budget-range" class="form-range w-full" min="0" max="50000" step="1000" value="50000">
                  <div id="budget-display" class="mt-1 font-bold text-center text-gradient" style="font-size: 1.2rem;">₹50,000</div>
                </div>

                <!-- Search Button -->
                <button id="btn-search-hospitals" class="btn btn--danger btn--xl btn--glow w-full mb-2 animate-pulse">
                  🔍 Find Best Hospital Now
                </button>

                <!-- AI Thinking Animation -->
                <div id="ai-thinking" class="ai-thinking hidden card card--glow mb-2 text-center py-2" style="border-color: var(--primary);">
                  <div class="text-4xl mb-1" style="animation: pulse 1s infinite;">🧠</div>
                  <h3 class="mb-1 text-gradient">MediRoute AI is analyzing...</h3>
                  <div class="text-sm" style="color: var(--text-secondary);">
                    <div class="mb-1">Evaluating live traffic, bed availability,</div>
                    <div>specialities, cost, and insurance...</div>
                    <div class="mt-1 flex-center gap-1">
                      <span class="status-dot status-dot--online"></span> Processing 34 data points
                    </div>
                  </div>
                </div>

                <!-- Results List -->
                <div id="search-results" class="hidden pb-2">
                  <h3 class="mb-1 flex-between">
                    <span>Top Hospitals Ranked by AI</span>
                    <span class="badge badge--success" id="result-count">0</span>
                  </h3>
                  <div id="results-list" class="flex flex-col gap-2"></div>
                </div>
              </div>
            </div>
            
            <div class="emergency-finder__map map-container--full" style="height: 100vh; position: relative;">
              <div id="emergency-map" style="width: 100%; height: 100%;"></div>
            </div>
          </div>
        </div>
      `;
    },

    mount() {
      // Map init
      const mapContainer = document.getElementById('emergency-map');
      if (mapContainer && window.MediRoute.components.createMap) {
        map = window.MediRoute.components.createMap('emergency-map', {
          center: [currentParams.lat, currentParams.lng],
          zoom: 12
        });
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
            window.MediRoute.components.showToast(\`Location set to \${e.target.innerText}\`, 'info');
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
      const heroLoc = sessionStorage.getItem('hero_search_loc');
      const heroType = sessionStorage.getItem('hero_search_type');
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
      if (!window.MediRoute.ai || !window.MediRoute.ai.findBestHospitals) {
        console.error("AI engine not available");
        return;
      }

      const resultsList = document.getElementById('results-list');
      const resultCount = document.getElementById('result-count');
      
      // Get results from AI
      const topHospitals = window.MediRoute.ai.findBestHospitals(currentParams).slice(0, 8);
      
      if (topHospitals.length === 0) {
        resultsList.innerHTML = '<div class="card p-2 text-center">No hospitals found matching criteria.</div>';
        resultCount.innerText = '0';
        return;
      }
      
      resultCount.innerText = topHospitals.length;
      resultsList.innerHTML = '';

      const comps = window.MediRoute.components;
      const bounds = window.L ? L.latLngBounds([[currentParams.lat, currentParams.lng]]) : null;

      // Add patient marker
      if (map && window.L) {
        patientMarker = comps.createPatientMarker(map, currentParams.lat, currentParams.lng);
      }

      topHospitals.forEach((result, index) => {
        const hospital = result.hospital;
        const score = result.totalScore / 100;
        const breakdown = result.factors;
        
        // Build card HTML
        const isBest = index === 0;
        const cardClass = isBest ? 'card card--glass card--glow best-match' : 'card card--glass card--hover';
        const scorePercent = Math.round(score * 100);
        
        const html = `
          <div class="${cardClass} p-2 cursor-pointer" data-index="${index}" data-lat="${hospital.lat}" data-lng="${hospital.lng}" style="position: relative; overflow: hidden;">
            ${isBest ? '<div style="position:absolute; top:0; right:0; background:var(--primary); color:white; font-size:0.7rem; padding: 2px 8px; border-bottom-left-radius: 8px;">★ Best Match</div>' : ''}
            
            <div class="flex gap-1 mb-1">
              <div class="hospital-result__rank flex-center" style="width: 32px; height: 32px; border-radius: 50%; background: ${isBest ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}; font-weight: bold;">
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
                <span>🛏️</span> ${hospital.beds[currentParams.bedType].available} ${currentParams.bedType} beds
              </div>
              <div class="flex items-center gap-0.5">
                <span>💰</span> ${comps.formatCurrency(hospital.costPerDay[currentParams.bedType])}/day
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
              ${comps.createProgressBar(scorePercent, 100, scorePercent > 80 ? 'success' : 'warning')}
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
        if (map && window.L) {
          const marker = comps.createHospitalMarker(map, hospital.lat, hospital.lng, hospital);
          markers.push(marker);
          bounds.extend([hospital.lat, hospital.lng]);
        }
      });

      if (map && window.L) {
        const routeColors = ['#00D4AA', '#6C63FF', '#FFA502'];
        const routeWeights = [5, 3, 2];
        const routeDash = ['', '10, 8', '6, 6'];

        for (let i = 0; i < Math.min(3, topHospitals.length); i++) {
          const h = topHospitals[i].hospital;
          // Note: fetchRoute is assumed to be available in scope
          const coords = await fetchRoute(currentParams.lat, currentParams.lng, h.lat, h.lng);
          const line = L.polyline(coords, {
            color: routeColors[i],
            weight: routeWeights[i],
            opacity: 0.8,
            dashArray: routeDash[i]
          }).addTo(map);
          polylines.push(line);
        }
      }

      // Fit map bounds
      if (map && window.L && bounds) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }

      // Add click listeners to result cards for panning map
      resultsList.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', (e) => {
          // ignore if clicking a button
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
            const hospital = topHospitals[index].hospital;
            
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
                <div class="grid grid--2 gap-1 mb-2">
                  <div class="card p-1 text-center"><strong>ICU:</strong> ${hospital.beds.icu.available}/${hospital.beds.icu.total}</div>
                  <div class="card p-1 text-center"><strong>Emergency:</strong> ${hospital.beds.emergency.available}/${hospital.beds.emergency.total}</div>
                  <div class="card p-1 text-center"><strong>General:</strong> ${hospital.beds.general.available}/${hospital.beds.general.total}</div>
                  <div class="card p-1 text-center"><strong>Pediatric:</strong> ${hospital.beds.pediatric.available}/${hospital.beds.pediatric.total}</div>
                </div>

                <h4 class="mb-1 text-primary">🏥 Facilities</h4>
                <div class="flex gap-0.5 flex-wrap mb-2">
                  ${hospital.facilities.map(f => `<span class="badge badge--info">${f}</span>`).join('')}
                </div>

                <h4 class="mb-1 text-primary">🩺 Emergency Types</h4>
                <div class="flex gap-0.5 flex-wrap mb-2">
                  ${hospital.emergencyTypes.map(t => `<span class="badge badge--warning">${t}</span>`).join('')}
                </div>

                <h4 class="mb-1 text-primary">👨‍⚕️ Doctors</h4>
                <div class="flex flex-col gap-1 mb-2" style="max-height: 150px; overflow-y: auto;">
                  ${hospital.doctors ? hospital.doctors.map(d => `
                    <div class="flex-between border-bottom pb-0.5">
                      <span>${d.name}</span>
                      <span class="text-sm text-gray">${d.specialty}</span>
                    </div>
                  `).join('') : '<p>No doctors listed</p>'}
                </div>

                <h4 class="mb-1 text-primary">🛡️ Insurance Accepted</h4>
                <div class="flex gap-0.5 flex-wrap">
                  ${hospital.insuranceAccepted ? hospital.insuranceAccepted.map(i => `<span class="badge">${i}</span>`).join('') : '<p>None listed</p>'}
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
            const hospital = topHospitals[index].hospital;
            
            const dispatchHtml = `
              <div class="dispatch-form">
                <p class="mb-2 text-sm text-gray">Booking emergency admission for <strong>${hospital.name}</strong>.</p>
                <div class="form-group mb-1">
                  <label class="d-block mb-0.5">Select Bed Type</label>
                  <select id="dispatch-bed-type" class="form-select w-full">
                    <option value="emergency">Emergency Bed</option>
                    <option value="icu">ICU Bed</option>
                    <option value="general">General Bed</option>
                  </select>
                </div>
                <div class="form-group mb-1">
                  <label class="d-block mb-0.5">Patient Name</label>
                  <input type="text" id="dispatch-patient-name" class="form-input w-full" placeholder="Enter patient name">
                </div>
                <div class="form-group mb-1">
                  <label class="d-block mb-0.5">Patient Contact</label>
                  <input type="tel" id="dispatch-patient-contact" class="form-input w-full" placeholder="Enter contact number">
                </div>
                <div class="form-group mb-2">
                  <label class="d-block mb-0.5">Emergency Condition</label>
                  <select id="dispatch-condition" class="form-select w-full">
                    <option value="critical">Critical / Life-threatening</option>
                    <option value="urgent">Urgent</option>
                    <option value="stable">Stable</option>
                  </select>
                </div>
              </div>
            `;
            
            window.MediRoute.components.createModal('🚑 Emergency Bed Booking', dispatchHtml, [
              { id: 'cancel', label: 'Cancel', class: 'btn--ghost', handler: () => {} },
              { id: 'confirm', label: 'Confirm Submission', class: 'btn--danger', handler: () => {
                const bedType = document.getElementById('dispatch-bed-type').value;
                const pName = document.getElementById('dispatch-patient-name').value;
                const pContact = document.getElementById('dispatch-patient-contact').value;
                const condition = document.getElementById('dispatch-condition').value;
                if (!pName) {
                  window.MediRoute.components.showToast('Please enter patient name', 'warning');
                  return;
                }
                
                if (hospital.beds[bedType] && hospital.beds[bedType].available > 0) {
                  window.MediRoute.store.updateBed(hospital.id, bedType, -1);
                  const bookingId = 'MR-' + Math.floor(Math.random()*9000+1000);
                  window.MediRoute.components.showToast(`🚨 Emergency Admission Confirmed for ${pName}! Booking ID #${bookingId}`, 'success', 5000);
                  
                  // Refresh results
                  this.handleSearch();
                  return true;
                } else {
                  window.MediRoute.components.showToast('No beds available of this type!', 'error');
                  return false;
                }
              }}
            ]);
          });
        }
      });

      window.MediRoute.components.showToast(`Found ${topHospitals.length} hospitals. Best match: ${topHospitals[0].hospital.name}`, 'success');
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
