(function() {
  window.MediRoute = window.MediRoute || {};
  window.MediRoute.pages = window.MediRoute.pages || {};

  window.MediRoute.pages.landing = {
    render() {
      return `
        <div class="page page--landing animate-fade-in">
          
          <!-- Live Emergency Alert Ticker -->
          <div class="alert-ticker">
            <div class="alert-ticker__content">
              🚨 LIVE UPDATE: Apollo Hospital Delhi added 5 ICU Beds &bull; 🚑 AMB-104 dispatched to Saket &bull; 🟢 48 Emergency Centers active across Delhi, Mumbai, Bangalore &bull; 🚨 LIVE UPDATE: Apollo Hospital Delhi added 5 ICU Beds
            </div>
          </div>

          <!-- Hero Section -->
          <section class="hero-section">
            <div class="hero-section__bg">
              <div class="gradient-orb orb-1"></div>
              <div class="gradient-orb orb-2"></div>
            </div>
            
            <div class="hero-content flex flex-col flex-center text-center gap-2">
              <h1 class="hero-title animate-slide-up">
                AI-POWERED EMERGENCY HEALTHCARE PLATFORM
              </h1>
              
              <p class="hero-subtitle animate-slide-up" style="animation-delay: 0.1s">
                Minimizing the critical delay between a medical emergency and hospital admission with real-time bed tracking, voice AI intake, and OSRM road navigation.
              </p>

              <!-- Live Emergency Bed Quick Search Bar -->
              <div class="quick-search-bar card card--glass animate-slide-up flex flex-wrap gap-1" style="animation-delay: 0.2s">
                <input type="text" id="hero-location-input" class="form-control" placeholder="City / Locality (e.g. Delhi)" style="flex: 1; min-width: 200px;">
                <select id="hero-emergency-type" class="form-control" style="flex: 1; min-width: 200px;">
                  <option value="Cardiac">Cardiac</option>
                  <option value="Trauma">Trauma</option>
                  <option value="Burns">Burns</option>
                  <option value="Stroke">Stroke</option>
                  <option value="Pediatric">Pediatric</option>
                  <option value="General">General</option>
                </select>
                <button class="btn btn--danger btn--glow" onclick="window.MediRoute.pages.landing.findNearestBed()">
                  ⚡ Find Nearest Bed Now
                </button>
              </div>
            </div>

            <!-- Animated ECG Line -->
            <div class="hero-ecg">
              <svg viewBox="0 0 1000 100" preserveAspectRatio="none">
                <path class="ecg-line" d="M 0,50 L 200,50 L 220,10 L 240,90 L 260,30 L 270,70 L 290,50 L 1000,50" />
              </svg>
            </div>
          </section>

          <!-- Quick Action Command Center (Sleek Compact Circular Launcher Pills) -->
          <section class="command-center container mt-4">
            <h2 class="section-title text-center mb-3">Quick Emergency Access</h2>
            <div class="quick-launcher-bar flex flex-center flex-wrap gap-2">
              <a href="#emergency" class="compact-circle-card card card--glass card--hover card--glow animate-slide-up">
                <div class="circle-avatar">🚨</div>
                <div class="circle-info">
                  <h4>Emergency Finder</h4>
                  <span>Instant Bed Match & Routing</span>
                </div>
              </a>
              <a href="#intake" class="compact-circle-card card card--glass card--hover card--glow animate-slide-up" style="animation-delay: 0.1s">
                <div class="circle-avatar">🤖</div>
                <div class="circle-info">
                  <h4>AI Intake Triage</h4>
                  <span>Voice & Touch Scanner</span>
                </div>
              </a>
              <a href="#doctor-triage" class="compact-circle-card card card--glass card--hover card--glow animate-slide-up" style="animation-delay: 0.2s">
                <div class="circle-avatar">👨‍⚕️</div>
                <div class="circle-info">
                  <h4>Doctor Review</h4>
                  <span>30-Sec ER Briefing Queue</span>
                </div>
              </a>
              <a href="#dashboard" class="compact-circle-card card card--glass card--hover card--glow animate-slide-up" style="animation-delay: 0.3s">
                <div class="circle-avatar">🏥</div>
                <div class="circle-info">
                  <h4>Bed Dashboard</h4>
                  <span>Live ICU & Ward Registry</span>
                </div>
              </a>
            </div>
          </section>

          <!-- Interactive 3-Step Emergency Workflow Simulator -->
          <section class="workflow-simulator container mt-4">
            <h2 class="section-title text-center mb-3">Interactive Emergency Workflow</h2>
            <div class="tabs card card--glass p-0">
              <div class="tabs__header flex">
                <button class="tab-btn active" onclick="window.MediRoute.pages.landing.switchTab(0)">1. Voice & Touch AI Intake</button>
                <button class="tab-btn" onclick="window.MediRoute.pages.landing.switchTab(1)">2. AI Recommendation & OSRM Routing</button>
                <button class="tab-btn" onclick="window.MediRoute.pages.landing.switchTab(2)">3. Doctor 30-Sec Summary & EMR Sync</button>
              </div>
              <div class="tabs__body p-3">
                <div class="tab-content active" id="sim-tab-0">
                  <div class="flex gap-2 flex-center">
                    <div class="simulator-icon badge badge--primary badge--glow" style="font-size: 2.5rem; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">🎤</div>
                    <div>
                      <h4>Multilingual Voice Intake</h4>
                      <p>"My father has severe chest pain and sweating..."</p>
                      <p class="text-muted">AI instantly translates, transcribes, and extracts key clinical entities.</p>
                    </div>
                  </div>
                </div>
                <div class="tab-content" id="sim-tab-1" style="display: none;">
                  <div class="flex gap-2 flex-center">
                    <div class="simulator-icon badge badge--primary badge--glow" style="font-size: 2.5rem; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">🗺️</div>
                    <div>
                      <h4>Smart Routing & Scoring</h4>
                      <p>AI Score: 92/100 (Max Healthcare)</p>
                      <p class="text-muted">Routing via OSRM avoids traffic. ETA: 8 mins.</p>
                    </div>
                  </div>
                </div>
                <div class="tab-content" id="sim-tab-2" style="display: none;">
                   <div class="flex gap-2 flex-center">
                    <div class="simulator-icon badge badge--primary badge--glow" style="font-size: 2.5rem; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">📋</div>
                    <div>
                      <h4>Doctor Executive Summary</h4>
                      <p>Pre-arrival briefing delivered to ER dashboard.</p>
                      <p class="text-muted">Patient vitals, PMH, and generated impression ready in 30s.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Stats Bar -->
          <section class="stats-bar mt-4">
            <div class="grid grid--4 container">
              <div class="stat-card card card--glass" data-animate="slide-up">
                <div class="stat-card__icon">🏥</div>
                <div class="stat-card__value" id="stat-hospitals">0</div>
                <div class="stat-card__label">Connected Hospitals</div>
              </div>
              <div class="stat-card card card--glass" data-animate="slide-up" style="animation-delay: 0.1s">
                <div class="stat-card__icon">🛏️</div>
                <div class="stat-card__value" id="stat-beds">0</div>
                <div class="stat-card__label">Available ICU Beds</div>
              </div>
              <div class="stat-card card card--glass" data-animate="slide-up" style="animation-delay: 0.2s">
                <div class="stat-card__icon">❤️</div>
                <div class="stat-card__value" id="stat-lives">0</div>
                <div class="stat-card__label">Lives Saved</div>
              </div>
              <div class="stat-card card card--glass" data-animate="slide-up" style="animation-delay: 0.3s">
                <div class="stat-card__icon">⏱️</div>
                <div class="stat-card__value"><span id="stat-response">0</span> <span style="font-size: 1rem; color: var(--text-muted)">min</span></div>
                <div class="stat-card__label">Avg Emergency Response</div>
              </div>
            </div>
          </section>

          <!-- Features Section (Sleek Compact Icon Pills) -->
          <section class="features-section container mt-4">
            <h2 class="section-title text-center mb-3">Core Capabilities</h2>
            
            <div class="compact-capabilities-grid">
              <div class="capability-pill card card--glass card--hover">
                <div class="pill-icon">🛏️</div>
                <div class="pill-text">
                  <strong>Real-Time Bed Intelligence</strong>
                  <span>Live tracking of ICU & Ward beds</span>
                </div>
              </div>
              
              <div class="capability-pill card card--glass card--hover">
                <div class="pill-icon">🧠</div>
                <div class="pill-text">
                  <strong>AI Multi-Parameter Scoring</strong>
                  <span>Severity & distance matching</span>
                </div>
              </div>
              
              <div class="capability-pill card card--glass card--hover">
                <div class="pill-icon">🎤</div>
                <div class="pill-text">
                  <strong>Voice-Guided Intake</strong>
                  <span>Speak naturally in 12+ languages</span>
                </div>
              </div>
              
              <div class="capability-pill card card--glass card--hover">
                <div class="pill-icon">📄</div>
                <div class="pill-text">
                  <strong>Document OCR Traceability</strong>
                  <span>Scan medical records instantly</span>
                </div>
              </div>
              
              <div class="capability-pill card card--glass card--hover">
                <div class="pill-icon">🚑</div>
                <div class="pill-text">
                  <strong>Ambulance Dispatch</strong>
                  <span>OSRM optimized GPS routes</span>
                </div>
              </div>
              
              <div class="capability-pill card card--glass card--hover">
                <div class="pill-icon">📱</div>
                <div class="pill-text">
                  <strong>ABDM Health Pass QR</strong>
                  <span>Digital records integration</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Accredited Partner Hospitals Grid -->
          <section class="trusted-by-section container mt-4 mb-4 text-center">
            <h3 class="section-title mb-2">Accredited Partner Hospitals</h3>
            <div class="flex flex-center gap-1" style="flex-wrap: wrap;">
              <div class="badge badge--glass badge--xl p-2">🏥 AIIMS New Delhi</div>
              <div class="badge badge--glass badge--xl p-2">🏥 Fortis Escorts</div>
              <div class="badge badge--glass badge--xl p-2">🏥 Max Healthcare</div>
              <div class="badge badge--glass badge--xl p-2">🏥 Apollo Hospitals</div>
              <div class="badge badge--glass badge--xl p-2">🏥 Medanta The Medicity</div>
              <div class="badge badge--glass badge--xl p-2">🏥 Manipal Hospitals</div>
            </div>
          </section>

          <style>
            .alert-ticker {
              background: rgba(var(--color-danger-rgb), 0.2);
              border-bottom: 1px solid rgba(var(--color-danger-rgb), 0.3);
              color: var(--color-danger);
              padding: 0.5rem;
              font-weight: bold;
              overflow: hidden;
              white-space: nowrap;
            }
            .alert-ticker__content {
              display: inline-block;
              animation: ticker 20s linear infinite;
            }
            @keyframes ticker {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .hero-section {
              position: relative;
              padding: 4rem 1rem 8rem 1rem;
              overflow: hidden;
            }
            .hero-section__bg {
              position: absolute;
              top: 0; left: 0; width: 100%; height: 100%;
              z-index: -1;
              overflow: hidden;
            }
            .gradient-orb {
              position: absolute;
              border-radius: 50%;
              filter: blur(80px);
              opacity: 0.5;
            }
            .orb-1 {
              top: -10%; left: -10%;
              width: 50vw; height: 50vw;
              background: rgba(var(--color-primary-rgb), 0.4);
            }
            .orb-2 {
              bottom: -20%; right: -10%;
              width: 60vw; height: 60vw;
              background: rgba(var(--color-danger-rgb), 0.3);
            }
            .hero-title {
              font-size: clamp(2rem, 5vw, 3.5rem);
              line-height: 1.2;
              max-width: 900px;
              font-weight: 800;
              letter-spacing: -1px;
            }
            .hero-subtitle {
              font-size: 1.25rem;
              color: var(--text-muted);
              max-width: 700px;
            }
            .quick-search-bar {
              margin-top: 2rem;
              padding: 1.5rem;
              border-radius: var(--radius-lg);
              max-width: 800px;
              width: 100%;
              align-items: center;
              justify-content: center;
            }
            .hero-ecg {
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              height: 120px;
              opacity: 0.4;
            }
            .hero-ecg svg {
              width: 100%;
              height: 100%;
            }
            .ecg-line {
              fill: none;
              stroke: var(--color-danger);
              stroke-width: 3;
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke-dasharray: 1000;
              stroke-dashoffset: 1000;
              animation: drawLine 2.5s ease-out infinite;
            }
            @keyframes drawLine {
              to {
                stroke-dashoffset: 0;
              }
            }
            .launcher-card {
              text-align: center;
              padding: 2rem;
              text-decoration: none;
              color: inherit;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 0.5rem;
            }
            .launcher-icon {
              font-size: 3.5rem;
              margin-bottom: 1rem;
              filter: drop-shadow(0 0 10px rgba(255,255,255,0.2));
            }
            .tabs__header {
              border-bottom: 1px solid var(--border-color);
              overflow-x: auto;
            }
            .tab-btn {
              background: transparent;
              border: none;
              color: var(--text-muted);
              padding: 1rem 1.5rem;
              cursor: pointer;
              font-weight: 600;
              white-space: nowrap;
              border-bottom: 2px solid transparent;
              transition: all 0.2s;
            }
            .tab-btn:hover {
              color: var(--text-light);
            }
            .tab-btn.active {
              color: var(--color-primary);
              border-bottom-color: var(--color-primary);
            }
            .badge--xl {
              font-size: 1.2rem;
            }
          </style>
        </div>
      `;
    },
    
    findNearestBed() {
      const loc = document.getElementById('hero-location-input').value;
      const type = document.getElementById('hero-emergency-type').value;
      
      sessionStorage.setItem('search_location', loc);
      sessionStorage.setItem('search_type', type);
      
      window.location.hash = '#emergency';
    },

    switchTab(index) {
      const btns = document.querySelectorAll('.tab-btn');
      const tabs = document.querySelectorAll('.tab-content');
      
      btns.forEach((btn, i) => {
        if (i === index) btn.classList.add('active');
        else btn.classList.remove('active');
      });
      
      tabs.forEach((tab, i) => {
        if (i === index) tab.style.display = 'block';
        else tab.style.display = 'none';
      });
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
        
        if (hospitalsEl) window.MediRoute.components.animateCounter(hospitalsEl, stats.hospitals, 2000);
        if (bedsEl) window.MediRoute.components.animateCounter(bedsEl, stats.beds, 2000);
        if (livesEl) window.MediRoute.components.animateCounter(livesEl, stats.lives, 2000);
        if (responseEl) window.MediRoute.components.animateCounter(responseEl, stats.response, 2000);

        if (typeof window.MediRoute.components.animateOnScroll === 'function') {
          window.MediRoute.components.animateOnScroll();
        } else {
          const animateEls = document.querySelectorAll('[data-animate]');
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const animationClass = 'animate-' + entry.target.dataset.animate;
                entry.target.classList.add(animationClass);
                entry.target.style.opacity = 1;
                observer.unobserve(entry.target);
              }
            });
          }, { threshold: 0.1 });
          
          animateEls.forEach(el => {
            el.style.opacity = 0;
            observer.observe(el);
          });
        }
      }
    },
    unmount() {
    }
  };
})();
