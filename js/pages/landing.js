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
              🚨 LIVE UPDATE: Apollo Hospital Delhi added 5 ICU Beds &bull; 🚑 AMB-104 dispatched to Saket &bull; 🟢 48 Emergency Centers active across Delhi, Mumbai, Bangalore &bull; 🚨 LIVE UPDATE: Apollo Hospital Delhi added 5 ICU Beds
            </div>
          </div>

          <!-- Single Screen Widescreen Split Layout (Left: Hero Text & Search | Right: Icon Portal Hub) -->
          <div class="home-split-grid container">
            
            <!-- Left Column: Headline & Bed Search Bar -->
            <div class="home-left-col">
              <h1 class="hero-title animate-slide-up">
                AI-POWERED EMERGENCY<br><span class="text-gradient">HEALTHCARE PLATFORM</span>
              </h1>
              
              <p class="hero-subtitle animate-slide-up">
                Minimizing the critical delay between a medical emergency and hospital admission with real-time bed tracking, voice AI intake, and OSRM road navigation.
              </p>

              <!-- Live Emergency Bed Quick Search Bar -->
              <div class="quick-search-bar card card--glass animate-slide-up flex flex-wrap gap-1">
                <input type="text" id="hero-location-input" class="form-control" placeholder="City / Locality (e.g. Delhi)" style="flex: 1; min-width: 160px;">
                <select id="hero-emergency-type" class="form-control" style="flex: 1; min-width: 140px;">
                  <option value="Cardiac">Cardiac</option>
                  <option value="Trauma">Trauma</option>
                  <option value="Burns">Burns</option>
                  <option value="Stroke">Stroke</option>
                  <option value="Pediatric">Pediatric</option>
                  <option value="General">General</option>
                </select>
                <button class="btn btn--danger btn--glow" onclick="window.MediRoute.pages.landing.findNearestBed()">
                  ⚡ Find Bed Now
                </button>
              </div>

              <!-- Compact Live Stats Row -->
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

            <!-- Right Column: Compact Circular Icon Portals Hub -->
            <div class="home-right-col card card--glass">
              <h3 class="hub-title text-center mb-2">⚡ Emergency Portals & Modules</h3>
              
              <div class="icon-portal-grid">
                <a href="#emergency" class="icon-hub-btn btn-glow-red" title="🚨 Emergency Hospital Finder — Instant AI scoring, OSRM routes, GPS">
                  <div class="hub-circle">🚨</div>
                  <span class="hub-label">Emergency</span>
                </a>
                <a href="#intake" class="icon-hub-btn btn-glow-blue" title="🤖 AI Clinical Intake — Voice & Touch Multilingual Triage, Body Map, QR">
                  <div class="hub-circle">🤖</div>
                  <span class="hub-label">AI Intake</span>
                </a>
                <a href="#doctor-triage" class="icon-hub-btn btn-glow-purple" title="👨‍⚕️ Doctor 30-Sec Review Portal — Live Triage Queue, Document OCR">
                  <div class="hub-circle">👨‍⚕️</div>
                  <span class="hub-label">Doctor Review</span>
                </a>
                <a href="#dashboard" class="icon-hub-btn btn-glow-green" title="🏥 Hospital Admin Dashboard — Live Bed Management & Registration">
                  <div class="hub-circle">🏥</div>
                  <span class="hub-label">Bed Dashboard</span>
                </a>
                <a href="#ambulance" class="icon-hub-btn btn-glow-warning" title="🚑 Ambulance Tracker & Dispatch — OSRM GPS Navigation">
                  <div class="hub-circle">🚑</div>
                  <span class="hub-label">Ambulances</span>
                </a>
                <a href="#patient" class="icon-hub-btn btn-glow-info" title="👤 Patient Portal & ABDM Health Pass QR">
                  <div class="hub-circle">👤</div>
                  <span class="hub-label">Patient Pass</span>
                </a>
                <a href="#ayush" class="icon-hub-btn btn-glow-ayush" title="🌿 AYUSH Traditional Medicine Mode">
                  <div class="hub-circle">🌿</div>
                  <span class="hub-label">AYUSH</span>
                </a>
                <a href="#admin" class="icon-hub-btn btn-glow-admin" title="⚙️ System Admin & Platform Analytics">
                  <div class="hub-circle">⚙️</div>
                  <span class="hub-label">Admin</span>
                </a>
              </div>

              <!-- Compact Capabilities Bar -->
              <div class="capability-tags-row flex flex-center gap-1 flex-wrap mt-2">
                <span class="cap-tag" title="Real-Time ICU Bed Intelligence">🛏️ Bed Intelligence</span>
                <span class="cap-tag" title="AI Multi-Parameter Scoring">🧠 AI Multi-Scoring</span>
                <span class="cap-tag" title="Voice-Guided Intake">🎤 Voice Intake</span>
                <span class="cap-tag" title="Document OCR Traceability">📄 Document OCR</span>
                <span class="cap-tag" title="Instant Ambulance GPS Dispatch">🚑 OSRM Dispatch</span>
                <span class="cap-tag" title="ABDM Health Pass QR">📱 ABDM Pass</span>
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
      
      if (window.MediRoute.app && window.MediRoute.app.navigateTo) {
        window.MediRoute.app.navigateTo('emergency');
      } else {
        window.location.hash = '#emergency';
      }
    },

    mount() {
      if (window.MediRoute && window.MediRoute.components) {
        const stats = {
          hospitals: 48,
          beds: 1250,
          lives: 15400,
          response: 7.5
        };
        
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
