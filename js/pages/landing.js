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
