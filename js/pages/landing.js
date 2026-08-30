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
              <div class="quick-search-bar card card--glass animate-slide-up flex flex-wrap gap-1 mb-1">
                <input type="text" id="hero-location-input" class="form-control text-xs" placeholder="City / Locality (e.g. Delhi)" style="flex: 1; min-width: 150px;">
                <select id="hero-emergency-type" class="form-control text-xs" style="flex: 1; min-width: 130px;">
                  <option value="Cardiac">Cardiac</option>
                  <option value="Trauma">Trauma</option>
                  <option value="Burns">Burns</option>
                  <option value="Stroke">Stroke</option>
                  <option value="Pediatric">Pediatric</option>
                  <option value="General">General</option>
                </select>
                <button class="btn btn--danger btn--glow btn--xs" onclick="window.MediRoute.pages.landing.findNearestBed()">
                  ⚡ Find Bed Now
                </button>
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

            <!-- Right Column: Clean 3-Portal Role Entry Gateway (Doctor, Patient, Admin) -->
            <div class="home-right-col card card--glass p-1.5 flex flex-col justify-between">
              
              <div>
                <div class="flex-between align-center mb-1">
                  <h3 class="m-0 text-gradient text-sm font-bold">🏥 Select Your Portal Gateway</h3>
                  <span class="badge badge--success text-xs">Role-Based Access</span>
                </div>

                <!-- 3 Master Role Portal Cards -->
                <div class="flex flex-col gap-1 mb-1">
                  
                  <!-- Portal 1: 👨‍⚕️ DOCTOR -->
                  <div class="card card--glass p-1 cursor-pointer intake-choice-card" 
                       onclick="window.location.hash='#doctor-triage'"
                       style="border-left: 4px solid var(--color-primary); background: linear-gradient(135deg, rgba(0, 212, 170, 0.08), rgba(108, 99, 255, 0.05));">
                    <div class="flex-between align-center mb-0.5">
                      <div class="flex align-center gap-0.5">
                        <span class="text-xl">👨‍⚕️</span>
                        <div>
                          <strong class="text-xs text-primary block font-bold">DOCTOR PORTAL</strong>
                          <span class="text-xs text-muted">Physician Login / Registration</span>
                        </div>
                      </div>
                      <span class="badge badge--primary text-xs">Enter Portal ➡️</span>
                    </div>
                    <p class="text-xs text-secondary m-0">
                      Access Assigned ER Patients &bull; 30-Sec AI SBAR Summary &bull; Voice Transcript &bull; Document OCR
                    </p>
                  </div>

                  <!-- Portal 2: 🧑‍🦽 PATIENT -->
                  <div class="card card--glass p-1 cursor-pointer intake-choice-card" 
                       onclick="window.location.hash='#intake'"
                       style="border-left: 4px solid var(--color-accent); background: linear-gradient(135deg, rgba(108, 99, 255, 0.08), rgba(0, 212, 170, 0.05));">
                    <div class="flex-between align-center mb-0.5">
                      <div class="flex align-center gap-0.5">
                        <span class="text-xl">🧑‍🦽</span>
                        <div>
                          <strong class="text-xs text-accent block font-bold">PATIENT PORTAL</strong>
                          <span class="text-xs text-muted">Patient Login & Emergency Services</span>
                        </div>
                      </div>
                      <span class="badge badge--info text-xs">Enter Portal ➡️</span>
                    </div>
                    <p class="text-xs text-secondary m-0">
                      Emergency AI Intake &bull; Read-Only Bed Availability &bull; Ambulance Request &bull; ABHA Pass &bull; AYUSH
                    </p>
                  </div>

                  <!-- Portal 3: 🛠️ ADMIN -->
                  <div class="card card--glass p-1 cursor-pointer intake-choice-card" 
                       onclick="window.location.hash='#dashboard'"
                       style="border-left: 4px solid var(--color-warning); background: linear-gradient(135deg, rgba(255, 165, 2, 0.08), rgba(255, 71, 87, 0.05));">
                    <div class="flex-between align-center mb-0.5">
                      <div class="flex align-center gap-0.5">
                        <span class="text-xl">🛠️</span>
                        <div>
                          <strong class="text-xs text-warning block font-bold">HOSPITAL ADMIN PORTAL</strong>
                          <span class="text-xs text-muted">Hospital Management & Compounder Login</span>
                        </div>
                      </div>
                      <span class="badge badge--warning text-xs">Enter Portal ➡️</span>
                    </div>
                    <p class="text-xs text-secondary m-0">
                      Full Bed Intelligence CRUD Control &bull; ICU Capacity Management &bull; OSRM Ambulance Fleet Dispatch
                    </p>
                  </div>

                </div>
              </div>

              <!-- Service Capabilities Matrix Footer -->
              <div class="card p-0.5 text-xs text-center" style="background: var(--bg-secondary);">
                <span class="text-muted">⚡ Powered by AI Multi-Scoring, Voice Intake, Document OCR & OSRM Dispatch</span>
              </div>

            </div>

          </div>
        </div>
      `;
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
