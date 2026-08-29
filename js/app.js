/* ============================================
   MEDIROUTE — App Core (Router + Init)
   ============================================ */
(function () {
  window.MediRoute = window.MediRoute || {};

  // ---- Route Definitions ----
  const routes = {
    '': 'landing',
    'landing': 'landing',
    'emergency': 'emergency',
    'dashboard': 'dashboard',
    'ambulance': 'ambulance',
    'patient': 'patient',
    'admin': 'admin',
    'intake': 'intake',
    'doctor-triage': 'doctor-triage',
    'doctortriage': 'doctor-triage',
    'ayush': 'ayush',
  };

  let currentPage = null;
  let currentPageName = null;

  // ---- Router ----
  function navigateTo(hash) {
    window.location.hash = hash;
  }

  function handleRoute() {
    const hash = window.location.hash.replace('#', '').toLowerCase() || '';
    const pageName = routes[hash] || 'landing';

    if (pageName === currentPageName) return;

    // Unmount current page
    if (currentPage && currentPage.unmount) {
      try { currentPage.unmount(); } catch (e) { console.warn('Unmount error:', e); }
    }

    // Get page module
    const page = window.MediRoute.pages?.[pageName];
    if (!page) {
      console.warn('Page not found:', pageName);
      return;
    }

    // Render page
    const content = document.getElementById('app-content');
    if (content) {
      content.innerHTML = page.render();
      content.scrollTop = 0;
    }

    // Mount page
    if (page.mount) {
      try {
        // Small delay to ensure DOM is ready
        requestAnimationFrame(() => {
          page.mount();
          // Trigger scroll animations
          if (window.MediRoute.components?.animateOnScroll) {
            window.MediRoute.components.animateOnScroll();
          }
        });
      } catch (e) { console.error('Mount error:', e); }
    }

    // Update active nav tabs
    document.querySelectorAll('.top-nav-tab').forEach(item => {
      const p = item.getAttribute('data-page');
      item.classList.toggle('active', p === pageName);
    });

    // Update header title
    const headerTitle = document.getElementById('header-title');
    const pageTitles = {
      landing: '🏠 Home',
      emergency: '🚨 Emergency Finder',
      dashboard: '🏥 Hospital Dashboard',
      ambulance: '🚑 Ambulance Tracker',
      patient: '👤 Patient Portal',
      admin: '⚙️ Admin Panel',
      intake: '🤖 AI Clinical Intake',
      'doctor-triage': '👨‍⚕️ Doctor Triage View',
      ayush: '🌿 AYUSH Mode',
    };
    if (headerTitle) headerTitle.textContent = pageTitles[pageName] || 'MediRoute';

    currentPage = page;
    currentPageName = pageName;
  }

  // ---- Theme Toggle ----
  function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const knob = document.getElementById('theme-toggle-knob');
    const saved = localStorage.getItem('mediroute-theme') || 'dark';
    
    if (saved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (knob) knob.style.transform = 'translateX(16px)';
    }

    if (toggle) {
      toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('mediroute-theme', next);
        if (knob) {
          knob.style.transform = next === 'light' ? 'translateX(16px)' : 'none';
        }
      });
    }
  }

  // ---- SOS Button ----
  function initSOS() {
    const sos = document.getElementById('sos-fab');
    if (sos) {
      sos.addEventListener('click', () => {
        navigateTo('emergency');
        window.MediRoute.components?.showToast('🚨 Emergency mode activated! Find the nearest hospital now.', 'error', 5000);
      });
    }
  }

  // ---- Nav Click Handlers ----
  function initNav() {
    document.querySelectorAll('.top-nav-icon-btn').forEach(item => {
      item.addEventListener('click', () => {
        const page = item.getAttribute('data-page');
        if (page) {
          navigateTo(page === 'landing' ? '' : page);
        }
      });
    });
  }

  // ---- Real-Time Clock ----
  function initClock() {
    const clock = document.getElementById('header-clock');
    if (!clock) return;

    function update() {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }
    update();
    setInterval(update, 30000);
  }

  // ---- Live Notification Badge ----
  function initNotifications() {
    const badge = document.getElementById('notification-count');
    if (badge) {
      let count = 4;
      badge.textContent = count;

      window.addEventListener('mediroute:dataUpdate', () => {
        if (Math.random() > 0.7) {
          count++;
          badge.textContent = count;
        }
      });
    }

    const btn = document.getElementById('notifications-btn');
    const dropdown = document.getElementById('notification-dropdown');
    if (btn && dropdown) {
      btn.addEventListener('click', () => {
        dropdown.style.display = dropdown.style.display === 'none' ? 'flex' : 'none';
      });
      document.addEventListener('click', (e) => {
        if (!e.target.closest('#notification-container')) {
          dropdown.style.display = 'none';
        }
      });
    }
  }

  // ---- App Initialization ----
  function init() {
    // Hide Loading Screen
    const loader = document.getElementById('app-loading');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 400);
    }

    initTheme();
    initSOS();
    initNav();
    initClock();
    initNotifications();

    // Start data simulation
    if (window.MediRoute.store?.startSimulation) {
      window.MediRoute.store.startSimulation();
    }

    // Listen to hash changes
    window.addEventListener('hashchange', handleRoute);

    // Initial route
    handleRoute();

    console.log('%c🏥 MediRoute', 'font-size:24px;font-weight:bold;color:#00D4AA;', 'AI-Powered Emergency Healthcare Platform');
    console.log('%cReady to save lives. 💚', 'font-size:14px;color:#A4B0C3;');
  }

  // ---- Public API ----
  window.MediRoute.app = {
    navigateTo,
    init,
  };

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
