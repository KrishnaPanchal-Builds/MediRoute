/* ============================================
   MEDIROUTE — Shared UI Components
   ============================================ */
(function () {
  window.MediRoute = window.MediRoute || {};

  // ---- Toast Notifications ----
  let toastContainer = null;

  function ensureToastContainer() {
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    return toastContainer;
  }

  function showToast(message, type = 'info', duration = 4000) {
    const container = ensureToastContainer();
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <span class="toast__icon">${icons[type] || icons.info}</span>
      <span class="toast__message">${message}</span>
      <span class="toast__close" onclick="this.parentElement.remove()">✕</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('leaving');
      setTimeout(() => toast.remove(), 300);
    }, duration);
    return toast;
  }

  // ---- Modal System ----
  function createModal(title, content, actions = []) {
    const existing = document.querySelector('.modal-backdrop');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';

    let actionsHtml = '';
    let normalizedActions = [];
    if (typeof actions === 'string') {
      actionsHtml = actions;
    } else if (Array.isArray(actions)) {
      normalizedActions = actions.map((a, i) => {
        return {
          label: a.label || a.text || 'OK',
          handler: a.handler || a.onClick || (() => {}),
          id: a.id || `action-${i}`,
          class: a.class || 'btn--ghost',
          closeOnAction: a.closeOnAction !== false
        };
      });
      actionsHtml = normalizedActions.map(a =>
        `<button class="btn ${a.class}" data-action="${a.id}">${a.label}</button>`
      ).join('');
    }

    backdrop.innerHTML = `
      <div class="modal">
        <div class="modal__header">
          <h3 class="modal__title">${title}</h3>
          <button class="modal__close" id="modal-close">✕</button>
        </div>
        <div class="modal__body">${content}</div>
        ${actionsHtml ? `<div class="modal__footer">${actionsHtml}</div>` : ''}
      </div>
    `;

    document.body.appendChild(backdrop);

    // Close handlers
    backdrop.querySelector('#modal-close').addEventListener('click', () => backdrop.remove());
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.remove(); });

    // Action handlers
    // Action handlers
    if (Array.isArray(actions)) {
      normalizedActions.forEach(a => {
        backdrop.querySelector(`[data-action="${a.id}"]`)?.addEventListener('click', () => {
          a.handler();
          if (a.closeOnAction) closeModal();
        });
      });
    }

    return backdrop;
  }

  function closeModal() {
    const existing = document.querySelector('.modal-backdrop');
    if (existing) existing.remove();
  }

  // ---- Animated Counter ----
  function animateCounter(element, target, duration = 2000, prefix = '', suffix = '') {
    if (!element) return;
    const start = 0;
    const startTime = performance.now();
    target = parseFloat(target);

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = start + (target - start) * eased;
      element.textContent = prefix + (Number.isInteger(target) ? Math.floor(current).toLocaleString() : current.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ---- SVG Charts ----
  function createChart(container, type, data, options = {}) {
    if (typeof container === 'string') container = document.querySelector(container);
    if (!container) return;

    switch (type) {
      case 'donut': return createDonutChart(container, data, options);
      case 'bar': return createBarChart(container, data, options);
      case 'line': return createLineChart(container, data, options);
      case 'area': return createAreaChart(container, data, options);
    }
  }

  function createDonutChart(container, data, options) {
    const size = options.size || 200;
    const strokeWidth = options.strokeWidth || 20;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const cx = size / 2;
    const cy = size / 2;

    let offset = 0;
    const total = data.reduce((sum, d) => sum + d.value, 0);

    const paths = data.map((d, i) => {
      const pct = d.value / total;
      const dashLength = pct * circumference;
      const dashOffset = -offset;
      offset += dashLength;
      return `<circle class="donut-segment" cx="${cx}" cy="${cy}" r="${radius}"
        fill="none" stroke="${d.color}" stroke-width="${strokeWidth}"
        stroke-dasharray="${dashLength} ${circumference - dashLength}"
        stroke-dashoffset="${dashOffset}"
        style="transition: all 0.8s ease-out; animation: fadeIn 0.6s ease-out ${i * 0.1}s both;">
        <title>${d.label}: ${d.value} (${(pct * 100).toFixed(0)}%)</title>
      </circle>`;
    }).join('');

    const centerText = options.centerText || total;
    const centerLabel = options.centerLabel || 'Total';

    container.innerHTML = `
      <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
        <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="${strokeWidth}"/>
        <g transform="rotate(-90 ${cx} ${cy})">${paths}</g>
        <text x="${cx}" y="${cy - 8}" text-anchor="middle" fill="var(--text-primary)" font-family="var(--font-display)" font-size="24" font-weight="700">${centerText}</text>
        <text x="${cx}" y="${cy + 14}" text-anchor="middle" fill="var(--text-muted)" font-size="11">${centerLabel}</text>
      </svg>
      <div class="chart-legend" style="display:flex;flex-wrap:wrap;gap:12px;margin-top:12px;justify-content:center;">
        ${data.map(d => `<span style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-secondary);">
          <span style="width:10px;height:10px;border-radius:3px;background:${d.color};flex-shrink:0;"></span>${d.label}: ${d.value}
        </span>`).join('')}
      </div>
    `;
  }

  function createBarChart(container, data, options) {
    const width = options.width || 400;
    const height = options.height || 200;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;
    const max = Math.max(...data.map(d => d.value)) * 1.1;
    const barWidth = chartW / data.length - 8;

    const bars = data.map((d, i) => {
      const x = padding.left + i * (chartW / data.length) + 4;
      const barH = (d.value / max) * chartH;
      const y = padding.top + chartH - barH;
      return `<rect x="${x}" y="${height}" width="${barWidth}" height="0" rx="4" fill="${d.color || 'var(--color-primary)'}"
        style="animation: barGrow 0.6s ease-out ${i * 0.05}s both;" data-target-y="${y}" data-target-h="${barH}">
        <title>${d.label}: ${d.value}</title>
      </rect>
      <text x="${x + barWidth / 2}" y="${height - 6}" text-anchor="middle" fill="var(--text-muted)" font-size="10">${d.label}</text>`;
    }).join('');

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;">
        <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${width - padding.right}" y2="${padding.top + chartH}" stroke="var(--glass-border)" stroke-width="1"/>
        ${bars}
      </svg>
    `;

    // Animate bars after render
    requestAnimationFrame(() => {
      container.querySelectorAll('rect[data-target-y]').forEach(rect => {
        const ty = rect.getAttribute('data-target-y');
        const th = rect.getAttribute('data-target-h');
        rect.setAttribute('y', ty);
        rect.setAttribute('height', th);
        rect.style.transition = 'y 0.6s ease-out, height 0.6s ease-out';
      });
    });
  }

  function createLineChart(container, data, options) {
    const width = options.width || 400;
    const height = options.height || 200;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;
    const max = Math.max(...data.map(d => d.value)) * 1.1;
    const min = Math.min(...data.map(d => d.value)) * 0.9;
    const range = max - min || 1;

    const points = data.map((d, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartW;
      const y = padding.top + chartH - ((d.value - min) / range) * chartH;
      return { x, y, ...d };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    const color = options.color || 'var(--color-primary)';

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;">
        <defs>
          <linearGradient id="lineGrad-${Date.now()}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${width - padding.right}" y2="${padding.top + chartH}" stroke="var(--glass-border)" stroke-width="1"/>
        <path d="${linePath} L${points[points.length - 1].x},${padding.top + chartH} L${points[0].x},${padding.top + chartH} Z" fill="url(#lineGrad-${Date.now() - 1})" opacity="0.5"/>
        <path d="${linePath}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
          stroke-dasharray="1000" stroke-dashoffset="1000" style="animation: ecgLine 1.5s ease-out forwards;"/>
        ${points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="${color}" stroke="var(--bg-primary)" stroke-width="2">
          <title>${p.label}: ${p.value}</title>
        </circle>`).join('')}
        ${points.filter((_, i) => i % Math.ceil(data.length / 6) === 0).map(p => `
          <text x="${p.x}" y="${padding.top + chartH + 16}" text-anchor="middle" fill="var(--text-muted)" font-size="10">${p.label}</text>
        `).join('')}
      </svg>
    `;
  }

  function createAreaChart(container, data, options) {
    return createLineChart(container, data, { ...options, fill: true });
  }

  // ---- Leaflet Map Helper ----
  function createMap(containerId, options = {}) {
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container || typeof L === 'undefined') {
      // Fallback if Leaflet not loaded
      container.innerHTML = `<div class="flex-center h-full" style="height:100%;background:var(--bg-secondary);border-radius:var(--radius-lg);"><span style="color:var(--text-muted);font-size:14px;">🗺️ Map loading...</span></div>`;
      return null;
    }

    const map = L.map(container, {
      zoomControl: false,
      attributionControl: false,
    }).setView([options.lat || 28.6139, options.lng || 77.2090], options.zoom || 11);

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    return map;
  }

  // Custom marker creators
  function createHospitalMarker(map, lat, lng, hospital, onClick) {
    if (!map) return null;
    const icon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:linear-gradient(135deg,var(--color-primary),var(--color-accent));width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.3);"><span style="transform:rotate(45deg);font-size:14px;">🏥</span></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
    const marker = L.marker([lat, lng], { icon }).addTo(map);
    marker.bindPopup(`<div style="font-family:Inter,sans-serif;min-width:200px;">
      <strong style="font-size:14px;">${hospital.name}</strong><br>
      <span style="color:#888;font-size:12px;">${hospital.area}, ${hospital.city}</span><br>
      <span style="font-size:12px;">⭐ ${hospital.rating} | 🛏️ ${hospital.beds.emergency.available} emergency beds</span>
    </div>`);
    if (onClick) marker.on('click', onClick);
    return marker;
  }

  function createPatientMarker(map, lat, lng) {
    if (!map) return null;
    const icon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:linear-gradient(135deg,var(--color-emergency),#ff6b81);width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 0 20px rgba(255,71,87,0.5);animation:emergencyPulse 2s infinite;"><span style="font-size:18px;">🚨</span></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
    return L.marker([lat, lng], { icon }).addTo(map).bindPopup('<strong>📍 Your Location</strong>');
  }

  function createAmbulanceMarker(map, lat, lng, ambulance) {
    if (!map) return null;
    const statusColors = { 'Available': '#2ed573', 'En Route': '#ffa502', 'At Scene': '#ff4757', 'Returning': '#1e90ff', 'Maintenance': '#6b7a99' };
    const color = statusColors[ambulance.status] || '#6b7a99';
    const icon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 0 10px ${color}80;"><span style="font-size:14px;">🚑</span></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
    const marker = L.marker([lat, lng], { icon }).addTo(map);
    marker.bindPopup(`<div style="font-family:Inter,sans-serif;"><strong>${ambulance.id}</strong><br><span style="color:${color};">${ambulance.status}</span><br><span style="font-size:12px;">${ambulance.type}</span></div>`);
    return marker;
  }

  function drawRoute(map, fromLat, fromLng, toLat, toLng, color) {
    if (!map) return null;
    color = color || '#00D4AA';
    const midLat = (fromLat + toLat) / 2 + (Math.random() - 0.5) * 0.01;
    const midLng = (fromLng + toLng) / 2 + (Math.random() - 0.5) * 0.01;
    const route = L.polyline([[fromLat, fromLng], [midLat, midLng], [toLat, toLng]], {
      color: color,
      weight: 3,
      opacity: 0.7,
      dashArray: '10, 10',
      className: 'route-line',
    }).addTo(map);
    return route;
  }

  // ---- Format Helpers ----
  function formatCurrency(amount) {
    if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(1) + ' Cr';
    if (amount >= 100000) return '₹' + (amount / 100000).toFixed(1) + ' L';
    return '₹' + amount.toLocaleString('en-IN');
  }

  function formatTime(minutes) {
    if (minutes < 60) return Math.round(minutes) + ' min';
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return m > 0 ? `${h} hr ${m} min` : `${h} hr`;
  }

  function getStatusBadge(status) {
    const map = {
      'Available': 'success', 'On Duty': 'primary', 'In Surgery': 'danger',
      'On Break': 'warning', 'Off Duty': 'info',
      'En Route': 'warning', 'At Scene': 'danger', 'Returning': 'info', 'Maintenance': 'info',
    };
    const cls = map[status] || 'info';
    return `<span class="badge badge--${cls}">${status}</span>`;
  }

  function createProgressBar(value, max, color = 'primary') {
    const pct = max > 0 ? (value / max * 100) : 0;
    return `<div class="progress"><div class="progress__bar progress__bar--${color} progress__bar--animated" style="width:${pct}%"></div></div>`;
  }

  function getOccupancyColor(available, total) {
    const pct = total > 0 ? (available / total) : 0;
    if (pct > 0.3) return 'success';
    if (pct > 0.1) return 'warning';
    return 'danger';
  }

  // ---- Animate elements on scroll/load ----
  function animateOnScroll() {
    const elements = document.querySelectorAll('[data-animate]:not(.animated)');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animated');
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    elements.forEach(el => observer.observe(el));
  }

  // ---- Color generators for avatars ----
  const avatarColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];

  function getAvatarColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return avatarColors[Math.abs(hash) % avatarColors.length];
  }

  function createAvatar(name, size = '') {
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const color = getAvatarColor(name);
    const sizeClass = size ? `avatar--${size}` : '';
    return `<div class="avatar ${sizeClass}" style="background:${color};">${initials}</div>`;
  }

  // ---- Confirmation Dialog ----
  function confirm(message, onConfirm, onCancel) {
    createModal('Confirm Action', `<p>${message}</p>`, [
      { id: 'cancel', label: 'Cancel', class: 'btn--ghost', handler: onCancel || (() => {}) },
      { id: 'confirm', label: 'Confirm', class: 'btn--primary', handler: onConfirm },
    ]);
  }

  // ---- Components API ----
  window.MediRoute.components = {
    showToast,
    createModal,
    closeModal,
    animateCounter,
    createChart,
    createMap,
    createHospitalMarker,
    createPatientMarker,
    createAmbulanceMarker,
    drawRoute,
    formatCurrency,
    formatTime,
    getStatusBadge,
    createProgressBar,
    getOccupancyColor,
    animateOnScroll,
    createAvatar,
    getAvatarColor,
    confirm,
  };
})();
