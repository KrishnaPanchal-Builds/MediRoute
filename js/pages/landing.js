/* ============================================
   MEDIROUTE — 3-Portal Entry Point Homepage
   Roles: 👨‍⚕️ Doctor Gateway | 🧑‍🦽 Patient Gateway | 🛠️ Admin Gateway
   ============================================ */
(function() {
  window.MediRoute = window.MediRoute || {};
  window.MediRoute.pages = window.MediRoute.pages || {};

  window.MediRoute.pages.landing = {
    render() {
      return `
        <div class="page page--landing animate-fade-in no-scroll-home">
          
          <!-- Live Emergency Alert Ticker -->
          <div class="alert-ticker">
            <div class="alert-ticker__content">
              🚨 LIVE UPDATE: AIIMS Delhi ICU Bed Availability Updated &bull; 🚑 AMB-104 Dispatched to Saket &bull; 🟢 48 Emergency Centers Synchronized across ABDM Network &bull; 🚨 LIVE UPDATE: AIIMS Delhi ICU Bed Availability Updated
            </div>
          </div>

          <!-- Widescreen 2-Column Split Layout -->
          <div class="home-split-grid container">
            
            <!-- Left Column: Platform Headline & Quick Bed Finder -->
            <div class="home-left-col">
              <h1 class="hero-title animate-slide-up">
                AI-POWERED EMERGENCY<br><span class="text-gradient">HEALTHCARE PLATFORM</span>
              </h1>
              
              <p class="hero-subtitle animate-slide-up">
                Minimizing the critical delay between a medical emergency and hospital admission with role-based clinical workspaces, real-time bed tracking, and OSRM navigation.
              </p>

              <!-- Live Emergency Bed Quick Search Bar -->
              <div class="quick-search-bar card card--glass animate-slide-up p-1 mb-1" style="border-radius: var(--radius-xl); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25); border: 1px solid rgba(0, 230, 184, 0.35);">
                
                <div class="flex-between align-center mb-0.5">
                  <span class="text-xs text-primary font-bold">⚡ Emergency Bed & ICU Search</span>
                  <span class="badge badge--success text-xs">Direct Typing & Auto-Suggestions Active</span>
                </div>

                <div class="flex flex-wrap gap-0.5 align-center mb-0.5">
                  <!-- Input 1: Location with Autocomplete Datalist -->
                  <div style="position: relative; flex: 1.2; min-width: 160px;">
                    <span style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 0.9rem;">📍</span>
                    <input type="text" id="hero-location-input" list="location-suggestions" class="form-input text-xs" 
                           placeholder="Type City, Locality or Hospital (e.g. Saket, Delhi)" 
                           style="padding-left: 32px; border-radius: var(--radius-md); background: rgba(255,255,255,0.06); border: 1px solid var(--glass-border); color: var(--text-primary); width: 100%;">
                    <datalist id="location-suggestions">
                      <option value="AIIMS Delhi (Ansari Nagar)"></option>
                      <option value="Safdarjung Hospital Delhi"></option>
                      <option value="Max Super Specialty Saket"></option>
                      <option value="Fortis Hospital Vasant Kunj"></option>
                      <option value="Apollo Hospitals Sarita Vihar"></option>
                      <option value="Mumbai Central Emergency"></option>
                      <option value="Bangalore Indiranagar"></option>
                    </datalist>
                  </div>

                  <!-- Input 2: Specialty / Symptom with Direct Typing + Datalist -->
                  <div style="position: relative; flex: 1; min-width: 160px;">
                    <span style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 0.9rem;">🩺</span>
                    <input type="text" id="hero-emergency-type" list="specialty-suggestions" class="form-input text-xs" 
                           placeholder="Type Specialty or Symptom (e.g. Heart Attack)" 
                           style="padding-left: 32px; border-radius: var(--radius-md); background: rgba(255,255,255,0.06); border: 1px solid var(--glass-border); color: var(--text-primary); width: 100%;">
                    <datalist id="specialty-suggestions">
                      <option value="Cardiac / Heart Attack"></option>
                      <option value="Trauma / Fracture / Accident"></option>
                      <option value="Stroke / Brain Hemorrhage"></option>
                      <option value="Respiratory / Severe Dyspnea"></option>
                      <option value="Pediatric / Child ICU"></option>
                      <option value="Burns & Plastic Surgery"></option>
                      <option value="Maternity / High-Risk Delivery"></option>
                      <option value="Poisoning / Toxicology"></option>
                      <option value="General ICU & Ventilator"></option>
                    </datalist>
                  </div>

                  <!-- Search Action Button -->
                  <button class="btn btn--danger btn--glow btn--sm" onclick="window.MediRoute.pages.landing.findNearestBed()" style="padding: 0.5rem 1.25rem; font-weight: bold; border-radius: var(--radius-md);">
                    ⚡ Find Bed Now
                  </button>
                </div>

                <!-- 1-Tap Quick Selection Chips -->
                <div class="flex gap-0.5 flex-wrap align-center mt-0.5">
                  <span class="text-xs text-muted">Quick Options:</span>
                  <button class="btn btn--xs btn--ghost chip-btn" onclick="window.MediRoute.pages.landing.quickSelect('Cardiac / Heart Attack')">❤️ Cardiac</button>
                  <button class="btn btn--xs btn--ghost chip-btn" onclick="window.MediRoute.pages.landing.quickSelect('Stroke / Brain Hemorrhage')">🧠 Stroke</button>
                  <button class="btn btn--xs btn--ghost chip-btn" onclick="window.MediRoute.pages.landing.quickSelect('Trauma / Fracture / Accident')">🦴 Trauma</button>
                  <button class="btn btn--xs btn--ghost chip-btn" onclick="window.MediRoute.pages.landing.quickSelect('Respiratory / Severe Dyspnea')">🫁 Oxygen / ICU</button>
                  <button class="btn btn--xs btn--ghost chip-btn" onclick="window.MediRoute.pages.landing.quickSelect('Pediatric / Child ICU')">👶 Pediatric</button>
                  <button class="btn btn--xs btn--ghost chip-btn" onclick="window.MediRoute.pages.landing.quickSelect('Burns & Plastic Surgery')">🔥 Burns</button>
                </div>

              </div>

              <!-- Live Platform Metrics Row -->
              <div class="compact-stats-row flex gap-2">
                <div class="compact-stat-item">
                  <span class="stat-icon">🏥</span>
                  <div>
                    <strong id="stat-hospitals">48</strong>
                    <small>Centers</small>
                  </div>
                </div>
                <div class="compact-stat-item">
                  <span class="stat-icon">🛏️</span>
                  <div>
                    <strong id="stat-beds">1,250</strong>
                    <small>ICU Beds</small>
                  </div>
                </div>
                <div class="compact-stat-item">
                  <span class="stat-icon">❤️</span>
                  <div>
                    <strong id="stat-lives">15.4K</strong>
                    <small>Lives Saved</small>
                  </div>
                </div>
                <div class="compact-stat-item">
                  <span class="stat-icon">⏱️</span>
                  <div>
                    <strong><span id="stat-response">7.5</span>m</strong>
                    <small>Avg ETA</small>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Premium 3 Circular Icon Portal Hub (Zero Wasted Space) -->
            <div class="home-right-col card card--glass p-2 flex flex-col justify-between align-center text-center" style="min-height: 480px;">
              
              <div class="w-full">
                <div class="flex-between align-center mb-1">
                  <h3 class="hub-title m-0 text-gradient text-md font-bold">⚡ Emergency Healthcare Portals</h3>
                  <span class="badge badge--success text-xs" style="animation: pulse 2s infinite;">Role-Based Access</span>
                </div>
                <p class="text-xs text-muted mb-2">Select your role gateway to access your dedicated clinical or emergency workspace</p>

                <!-- 3 Large Circular Icon Hub Buttons -->
                <div class="icon-portal-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; justify-items: center; align-items: center; padding: 1.5rem 0;">
                  
                  <!-- Large Circular Icon 1: Doctor -->
                  <a href="#doctor-triage" class="icon-hub-btn flex flex-col align-center" style="text-decoration: none;" title="👨‍⚕️ Doctor Portal Gateway — Physician Login & Clinical Workspace">
                    <div class="hub-circle" style="font-size: 3.5rem; width: 110px; height: 110px; border-radius: 50%; background: linear-gradient(135deg, rgba(108, 99, 255, 0.25), rgba(0, 212, 170, 0.1)); border: 3px solid var(--color-accent); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 35px rgba(108, 99, 255, 0.4); transition: all 0.35s ease;">
                      👨‍⚕️
                    </div>
                    <strong class="hub-label font-bold text-sm mt-1" style="color: var(--color-accent); font-size: 1.1rem;">Doctor</strong>
                    <span class="text-xs text-muted mt-0.5">Clinical Workspace</span>
                  </a>

                  <!-- Large Circular Icon 2: Patient -->
                  <a href="#intake" class="icon-hub-btn flex flex-col align-center" style="text-decoration: none;" title="🧑‍🦽 Patient Portal Gateway — Patient Services & AI Intake">
                    <div class="hub-circle" style="font-size: 3.5rem; width: 110px; height: 110px; border-radius: 50%; background: linear-gradient(135deg, rgba(0, 212, 170, 0.25), rgba(108, 99, 255, 0.1)); border: 3px solid var(--color-primary); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 35px rgba(0, 212, 170, 0.4); transition: all 0.35s ease;">
                      🧑‍🦽
                    </div>
                    <strong class="hub-label font-bold text-sm mt-1" style="color: var(--color-primary); font-size: 1.1rem;">Patient</strong>
                    <span class="text-xs text-muted mt-0.5">Patient Services</span>
                  </a>

                  <!-- Large Circular Icon 3: Admin -->
                  <a href="#dashboard" class="icon-hub-btn flex flex-col align-center" style="text-decoration: none;" title="🛠️ Admin Portal Gateway — Hospital Management & Bed Intelligence">
                    <div class="hub-circle" style="font-size: 3.5rem; width: 110px; height: 110px; border-radius: 50%; background: linear-gradient(135deg, rgba(255, 165, 2, 0.25), rgba(255, 71, 87, 0.1)); border: 3px solid var(--color-warning); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 35px rgba(255, 165, 2, 0.4); transition: all 0.35s ease;">
                      🛠️
                    </div>
                    <strong class="hub-label font-bold text-sm mt-1" style="color: var(--color-warning); font-size: 1.1rem;">Admin</strong>
                    <span class="text-xs text-muted mt-0.5">Hospital Admin</span>
                  </a>

                </div>
              </div>

              <!-- Service Capabilities Matrix Footer -->
              <div class="card p-1 text-xs text-center w-full mt-2" style="background: var(--bg-secondary); border-color: var(--glass-border);">
                <div class="flex-center gap-1 flex-wrap text-muted">
                  <span>🧠 AI Multi-Scoring</span> &bull;
                  <span>🎙️ Voice Intake</span> &bull;
                  <span>📄 Document OCR</span> &bull;
                  <span>🚑 OSRM Dispatch</span> &bull;
                  <span>🪪 ABDM Pass</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      `;
    },
    
    quickSelect(val) {
      const typeInput = document.getElementById('hero-emergency-type');
      if (typeInput) {
        typeInput.value = val;
      }
      this.findNearestBed();
    },

    findNearestBed() {
      const loc = document.getElementById('hero-location-input')?.value || '';
      const type = document.getElementById('hero-emergency-type')?.value || '';
      
      sessionStorage.setItem('search_location', loc);
      sessionStorage.setItem('search_type', type);
      
      window.location.hash = '#emergency';
    },

    mount() {
      if (window.MediRoute && window.MediRoute.components) {
        const stats = { hospitals: 48, beds: 1250, lives: 15400, response: 7.5 };
        
        const hospitalsEl = document.getElementById('stat-hospitals');
        const bedsEl = document.getElementById('stat-beds');
        const livesEl = document.getElementById('stat-lives');
        const responseEl = document.getElementById('stat-response');
        
        if (hospitalsEl) window.MediRoute.components.animateCounter(hospitalsEl, stats.hospitals, 1500);
        if (bedsEl) window.MediRoute.components.animateCounter(bedsEl, stats.beds, 1500);
        if (livesEl) window.MediRoute.components.animateCounter(livesEl, stats.lives, 1500);
        if (responseEl) window.MediRoute.components.animateCounter(responseEl, stats.response, 1500);
      }
    }
  };
})();
