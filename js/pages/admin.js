(function() {
  window.MediRoute = window.MediRoute || {};
  window.MediRoute.pages = window.MediRoute.pages || {};

  // Store references to things we might need to clean up
  let activityInterval = null;

  window.MediRoute.pages.admin = {
    render() {
      const store = window.MediRoute.store || { 
        stats: { totalHospitals: 45, availableBeds: 1250, totalBeds: 3400, livesSaved: 12450, citiesCovered: 12 },
        hospitals: [],
        insurancePlans: []
      };
      
      const hospitals = store.hospitals || [];
      const insurancePlans = (store.getInsurancePlans && store.getInsurancePlans()) || [
        { id: 'i1', name: 'Ayushman Bharat (PMJAY)', type: 'Government', coverageLimit: 500000, coveragePercentage: 100 },
        { id: 'i2', name: 'Star Health Comprehensive', type: 'Private', coverageLimit: 1000000, coveragePercentage: 90 },
        { id: 'i3', name: 'ICICI Lombard Complete Health', type: 'Private', coverageLimit: 750000, coveragePercentage: 85 }
      ];

      // Format currency helper
      const formatCurr = window.MediRoute.components?.formatCurrency || (val => '₹' + val);
      const getStatusBadge = window.MediRoute.components?.getStatusBadge || (status => `<span class="badge badge--success">${status}</span>`);
      const createProgress = window.MediRoute.components?.createProgressBar || ((val, max, color) => `<div class="progress"><div class="progress-bar ${color}" style="width: ${(val/max)*100}%"></div></div>`);

      // Generate table rows
      const hospitalRows = hospitals.map(h => {
        const totalBeds = h.beds ? Object.values(h.beds).reduce((sum, b) => sum + b.total, 0) : 0;
        const availableBeds = h.beds ? Object.values(h.beds).reduce((sum, b) => sum + b.available, 0) : 0;
        
        return `
          <tr class="data-table__row" data-name="${h.name.toLowerCase()} ${h.city.toLowerCase()}">
            <td class="data-table__cell"><strong>${h.name}</strong></td>
            <td class="data-table__cell">${h.city}</td>
            <td class="data-table__cell"><span class="badge badge--info">${h.type}</span></td>
            <td class="data-table__cell">⭐ ${h.rating}</td>
            <td class="data-table__cell">${totalBeds}</td>
            <td class="data-table__cell">${availableBeds}</td>
            <td class="data-table__cell">${getStatusBadge('Active')}</td>
          </tr>
        `;
      }).join('');

      const insuranceCards = insurancePlans.map(plan => `
        <div class="card card--hover flex-between" style="padding: 1rem; margin-bottom: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
          <div>
            <h4 style="margin: 0; color: #fff;">${plan.name}</h4>
            <div style="font-size: 0.8rem; color: #aaa; margin-top: 0.25rem;">
              <span class="badge ${plan.type === 'Government' ? 'badge--info' : 'badge--warning'}">${plan.type}</span>
              <span style="margin-left: 0.5rem;">Coverage: ${formatCurr(plan.coverageLimit)}</span>
            </div>
          </div>
          <div>
             <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" checked style="transform: scale(1.2);">
             </div>
          </div>
        </div>
      `).join('');

      return `
        <div class="page page--admin animate-fade-in">
          
          <header class="page__header flex-between mb-2">
            <div>
              <h1 class="section-title text-gradient">⚙️ Admin Control Center</h1>
              <p class="section-subtitle">Platform analytics, hospital management, and government integration</p>
            </div>
            <div>
              <span class="badge badge--info" style="font-size: 0.85rem;">Last Updated: ${new Date().toLocaleTimeString()}</span>
            </div>
          </header>

          <section class="grid grid--4 mb-2">
            <div class="stat-card stat-card--primary card--glass card--glow" data-animate="slide-up" style="animation-delay: 0.1s;">
              <div class="stat-card__icon">🏥</div>
              <div class="stat-card__label">Total Hospitals</div>
              <div class="stat-card__value"><span class="counter" data-target="${store.stats.totalHospitals}">${store.stats.totalHospitals}</span></div>
              <div style="font-size: 0.8rem; color: #4ade80; margin-top: 0.5rem;">↑ 3 this month</div>
            </div>
            
            <div class="stat-card stat-card--success card--glass card--glow" data-animate="slide-up" style="animation-delay: 0.2s;">
              <div class="stat-card__icon">🛏️</div>
              <div class="stat-card__label">Active Beds</div>
              <div class="stat-card__value"><span class="counter" data-target="${store.stats.availableBeds}">${store.stats.availableBeds}</span> <span style="font-size:1.2rem; color: #aaa;">/ ${store.stats.totalBeds}</span></div>
              <div style="font-size: 0.8rem; color: #4ade80; margin-top: 0.5rem;">78% Utilization</div>
            </div>
            
            <div class="stat-card stat-card--accent card--glass card--glow" data-animate="slide-up" style="animation-delay: 0.3s;">
              <div class="stat-card__icon">🫀</div>
              <div class="stat-card__label">Lives Saved</div>
              <div class="stat-card__value"><span class="counter" data-target="${store.stats.livesSaved}">${store.stats.livesSaved}</span></div>
              <div style="font-size: 0.8rem; color: #4ade80; margin-top: 0.5rem;">↑ 124 today</div>
            </div>
            
            <div class="stat-card stat-card--info card--glass card--glow" data-animate="slide-up" style="animation-delay: 0.4s;">
              <div class="stat-card__icon">📍</div>
              <div class="stat-card__label">Cities Covered</div>
              <div class="stat-card__value"><span class="counter" data-target="${store.stats.citiesCovered}">${store.stats.citiesCovered}</span></div>
              <div style="font-size: 0.8rem; color: #4ade80; margin-top: 0.5rem;">Pan India Expansion</div>
            </div>
          </section>

          <section class="grid grid--2 mb-2">
            
            <!-- Widget 1: Hospital Registry -->
            <div class="admin-widget card card--glass card--glow" data-animate="slide-up">
              <div class="flex-between mb-1">
                <h3 class="m-0">🏥 Registered Hospitals <span class="badge badge--info ml-1" style="font-size:0.8rem;">${store.hospitals.length}</span></h3>
                <button id="btn-add-hospital" class="btn btn--primary btn--sm">Add Hospital</button>
              </div>
              <div class="form-group mb-1">
                <input type="text" id="hospital-search" class="form-input" placeholder="Search by name or city..." style="background: rgba(0,0,0,0.2);">
              </div>
              <div style="max-height: 300px; overflow-y: auto; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                <table class="data-table" style="width: 100%; text-align: left; border-collapse: collapse;">
                  <thead style="background: rgba(255,255,255,0.05); position: sticky; top: 0; backdrop-filter: blur(5px);">
                    <tr>
                      <th class="data-table__cell">Name</th>
                      <th class="data-table__cell">City</th>
                      <th class="data-table__cell">Type</th>
                      <th class="data-table__cell">Rating</th>
                      <th class="data-table__cell">Beds (T)</th>
                      <th class="data-table__cell">Beds (A)</th>
                      <th class="data-table__cell">Status</th>
                    </tr>
                  </thead>
                  <tbody id="hospital-table-body">
                    ${hospitalRows.length > 0 ? hospitalRows : '<tr><td colspan="7" class="text-center" style="padding: 1rem;">No hospitals found</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Widget 2: Performance Analytics -->
            <div class="admin-widget card card--glass card--glow" data-animate="slide-up">
              <h3 class="mb-1 m-0">📊 Platform Performance</h3>
              <div id="chart-daily-matches" class="chart-container" style="height: 220px; width: 100%; margin-bottom: 1rem;"></div>
              
              <div class="grid grid--3 gap-1">
                <div style="background: rgba(255,255,255,0.05); padding: 0.75rem; border-radius: 8px; text-align: center;">
                  <div style="font-size: 0.8rem; color: #aaa; margin-bottom: 0.25rem;">Avg Match Time</div>
                  <div style="font-size: 1.2rem; font-weight: bold; color: #fff;">2.3 sec <span style="font-size:0.8rem;color:#4ade80;">↓</span></div>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 0.75rem; border-radius: 8px; text-align: center;">
                  <div style="font-size: 0.8rem; color: #aaa; margin-bottom: 0.25rem;">Match Success Rate</div>
                  <div style="font-size: 1.2rem; font-weight: bold; color: #fff;">97.4% <span style="font-size:0.8rem;color:#4ade80;">↑</span></div>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 0.75rem; border-radius: 8px; text-align: center;">
                  <div style="font-size: 0.8rem; color: #aaa; margin-bottom: 0.25rem;">User Satisfaction</div>
                  <div style="font-size: 1.2rem; font-weight: bold; color: #fff;">4.8/5 ⭐</div>
                </div>
              </div>
            </div>

            <!-- Widget 3: Government Integration -->
            <div class="admin-widget card card--glass" data-animate="slide-up">
              <h3 class="mb-1 m-0">🏛️ Government Integration</h3>
              
              <div class="card" style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); margin-bottom: 0.5rem; padding: 1rem;">
                <div class="flex-between">
                  <div>
                    <h4 style="margin:0 0 0.25rem 0; color:#fff;">PMJAY - Ayushman Bharat</h4>
                    <p style="margin:0; font-size: 0.8rem; color:#aaa;">National Health Protection Scheme</p>
                  </div>
                  <div class="form-switch">
                    <input class="form-check-input" type="checkbox" checked>
                  </div>
                </div>
                <div class="flex gap-2 mt-1" style="font-size: 0.85rem;">
                  <div><span class="status-dot status-dot--online"></span> Connected</div>
                  <div>🏥 120 Hospitals Enrolled</div>
                  <div>₹5L Coverage active</div>
                </div>
              </div>

              <div class="card" style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); margin-bottom: 0.5rem; padding: 1rem;">
                <div class="flex-between">
                  <div>
                    <h4 style="margin:0 0 0.25rem 0; color:#fff;">National Ambulance Service (108)</h4>
                    <p style="margin:0; font-size: 0.8rem; color:#aaa;">Centralized Dispatch Integration</p>
                  </div>
                  <div class="form-switch">
                    <input class="form-check-input" type="checkbox" checked>
                  </div>
                </div>
                <div class="flex gap-2 mt-1" style="font-size: 0.85rem;">
                  <div><span class="status-dot status-dot--online"></span> Connected (14 States)</div>
                  <div>🚑 450 Units Active</div>
                </div>
              </div>

              <div class="card" style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); margin-bottom: 0.5rem; padding: 1rem;">
                <div class="flex-between">
                  <div>
                    <h4 style="margin:0 0 0.25rem 0; color:#fff;">eHospital (NHP)</h4>
                    <p style="margin:0; font-size: 0.8rem; color:#aaa;">Digital Health Records Sync</p>
                  </div>
                  <div class="form-switch">
                    <input class="form-check-input" type="checkbox" checked>
                  </div>
                </div>
                <div class="flex gap-2 mt-1" style="font-size: 0.85rem;">
                  <div><span class="status-dot status-dot--online"></span> Syncing</div>
                  <div>📋 ABHA ID Supported</div>
                </div>
              </div>
            </div>

            <!-- Widget 4: Insurance Providers -->
            <div class="admin-widget card card--glass" data-animate="slide-up">
              <div class="flex-between mb-1">
                <h3 class="m-0">🛡️ Insurance Partners</h3>
                <button id="btn-add-provider" class="btn btn--ghost btn--sm">Add Provider</button>
              </div>
              <div style="max-height: 350px; overflow-y: auto;">
                ${insuranceCards}
              </div>
            </div>
          </section>

          <!-- Full Width Widget: System Health -->
          <section class="admin-widget--full card card--glass card--glow mb-2" data-animate="slide-up">
            <h3 class="mb-1 m-0">🔧 System Health Monitor</h3>
            <div class="grid grid--3 gap-1">
              
              <div class="flex-between align-center" style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px;">
                <div class="flex align-center gap-1">
                  <div style="font-size: 1.5rem;">⚡</div>
                  <div>
                    <div style="font-weight:bold; color:#fff;">API Uptime</div>
                    <div style="font-size:0.8rem; color:#aaa;">Global Infrastructure</div>
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-weight:bold; color:#4ade80;">99.97%</div>
                  <div style="width: 80px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-top:4px;">
                    <div style="width: 99.97%; height: 100%; background: #4ade80; border-radius: 2px;"></div>
                  </div>
                </div>
              </div>

              <div class="flex-between align-center" style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px;">
                <div class="flex align-center gap-1">
                  <div style="font-size: 1.5rem;">⏱️</div>
                  <div>
                    <div style="font-weight:bold; color:#fff;">Response Time</div>
                    <div style="font-size:0.8rem; color:#aaa;">P95 Latency</div>
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-weight:bold; color:#4ade80;">145ms</div>
                  <div style="width: 80px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-top:4px;">
                    <div style="width: 20%; height: 100%; background: #4ade80; border-radius: 2px;"></div>
                  </div>
                </div>
              </div>

              <div class="flex-between align-center" style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px;">
                <div class="flex align-center gap-1">
                  <div style="font-size: 1.5rem;">💽</div>
                  <div>
                    <div style="font-weight:bold; color:#fff;">Database Load</div>
                    <div style="font-size:0.8rem; color:#aaa;">Read/Write Replica</div>
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-weight:bold; color:#3b82f6;">34%</div>
                  <div style="width: 80px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-top:4px;">
                    <div style="width: 34%; height: 100%; background: #3b82f6; border-radius: 2px;"></div>
                  </div>
                </div>
              </div>

              <div class="flex-between align-center" style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px;">
                <div class="flex align-center gap-1">
                  <div style="font-size: 1.5rem;">👥</div>
                  <div>
                    <div style="font-weight:bold; color:#fff;">Active Users</div>
                  </div>
                </div>
                <div>
                  <span class="badge badge--primary">1,247 Online</span>
                </div>
              </div>

              <div class="flex-between align-center" style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px;">
                <div class="flex align-center gap-1">
                  <div style="font-size: 1.5rem;">💾</div>
                  <div>
                    <div style="font-weight:bold; color:#fff;">Last Backup</div>
                  </div>
                </div>
                <div>
                  <span style="font-size:0.9rem; color:#aaa;">2 hours ago</span>
                </div>
              </div>

              <div class="flex-between align-center" style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px;">
                <div class="flex align-center gap-1">
                  <div style="font-size: 1.5rem;">🔒</div>
                  <div>
                    <div style="font-weight:bold; color:#fff;">SSL Certificate</div>
                  </div>
                </div>
                <div>
                  <span class="badge badge--success">Valid</span>
                </div>
              </div>

            </div>
          </section>

          <!-- Activity Log -->
          <section class="card card--glass" data-animate="slide-up">
            <h3 class="mb-1 m-0">📋 Recent Activity Log</h3>
            <div id="activity-log-container" class="flex flex-column gap-1" style="max-height: 300px; overflow-y: auto;">
              <!-- Populated in mount() -->
            </div>
          </section>

        </div>
      `;
    },

    mount() {
      const components = window.MediRoute.components;
      
      // Animate counters
      if (components && components.animateCounter) {
        document.querySelectorAll('.counter').forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          if (!isNaN(target)) {
            components.animateCounter(el, target, 1500);
          }
        });
      }

      // Initialize Performance Chart
      if (components && components.createChart) {
        const chartContainer = document.getElementById('chart-daily-matches');
        if (chartContainer) {
          // Simulated 14 days data
          const labels = Array.from({length: 14}, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (13 - i));
            return d.getDate() + '/' + (d.getMonth()+1);
          });
          const data = [30, 45, 42, 55, 60, 58, 65, 70, 68, 75, 82, 80, 85, 90];
          
          components.createChart(chartContainer, 'line', {
            labels,
            datasets: [{
              label: 'Daily Matches',
              data: data,
              color: '#3b82f6'
            }]
          }, {
            yAxis: { show: true, min: 0, max: 100 },
            showPoints: true,
            animate: true
          });
        }
      }

      // Search functionality for hospital table
      const searchInput = document.getElementById('hospital-search');
      const tableBody = document.getElementById('hospital-table-body');
      
      if (searchInput && tableBody) {
        searchInput.addEventListener('input', (e) => {
          const term = e.target.value.toLowerCase();
          const rows = tableBody.querySelectorAll('tr');
          rows.forEach(row => {
            if (row.classList.contains('data-table__row')) {
              const text = row.getAttribute('data-name') || '';
              if (text.includes(term)) {
                row.style.display = '';
              } else {
                row.style.display = 'none';
              }
            }
          });
        });
      }

      // Add Hospital Modal
      const btnAddHospital = document.getElementById('btn-add-hospital');
      if (btnAddHospital && components && components.createModal) {
        btnAddHospital.addEventListener('click', () => {
          const formHtml = `
            <div class="form-group mb-1">
              <label class="form-label">Hospital Name</label>
              <input type="text" class="form-input" placeholder="e.g. Max Super Speciality">
            </div>
            <div class="grid grid--2 gap-1 mb-1">
              <div class="form-group">
                <label class="form-label">City</label>
                <select class="form-select">
                  <option>Delhi</option>
                  <option>Mumbai</option>
                  <option>Bangalore</option>
                  <option>Chennai</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Type</label>
                <select class="form-select">
                  <option>Multi-Specialty</option>
                  <option>Trauma Center</option>
                  <option>Cardiac Center</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Total Beds</label>
              <input type="number" class="form-input" placeholder="e.g. 200">
            </div>
          `;
          
          const actions = [
            { label: 'Cancel', class: 'btn--ghost' },
            { label: 'Register Hospital', class: 'btn--primary', handler: () => {
                if(window.MediRoute.components && window.MediRoute.components.showToast) {
                  window.MediRoute.components.showToast('Hospital registered successfully', 'success');
                }
                return true;
              }
            }
          ];
          
          components.createModal('🏥 Register New Hospital', formHtml, actions);
        });
      }

      // Add Insurance Provider Modal
      const btnAddProvider = document.getElementById('btn-add-provider');
      if (btnAddProvider && components && components.createModal) {
        btnAddProvider.addEventListener('click', () => {
          const formHtml = `
            <div class="form-group mb-1">
              <label class="form-label">Provider Name</label>
              <input type="text" id="provider-name" class="form-input" placeholder="e.g. HealthGuard Insurance">
            </div>
            <div class="form-group mb-1">
              <label class="form-label">Type</label>
              <select id="provider-type" class="form-select">
                <option>Private</option>
                <option>Government</option>
              </select>
            </div>
            <div class="form-group mb-1">
              <label class="form-label">Coverage Limit (₹)</label>
              <input type="number" id="provider-limit" class="form-input" placeholder="e.g. 500000">
            </div>
            <div class="form-group">
              <label class="form-label">Coverage Percentage (%)</label>
              <input type="number" id="provider-percentage" class="form-input" placeholder="e.g. 90">
            </div>
          `;
          
          const actions = [
            { label: 'Cancel', class: 'btn--ghost' },
            { label: 'Add Provider', class: 'btn--primary', handler: () => {
                const name = document.getElementById('provider-name').value;
                const type = document.getElementById('provider-type').value;
                const limit = document.getElementById('provider-limit').value;
                const percentage = document.getElementById('provider-percentage').value;
                
                if (!name || !limit) {
                  if(window.MediRoute.components.showToast) window.MediRoute.components.showToast('Please fill all required fields', 'error');
                  return false;
                }
                
                if (window.MediRoute.store && window.MediRoute.store.insurancePlans) {
                  window.MediRoute.store.insurancePlans.push({
                    id: 'i' + (window.MediRoute.store.insurancePlans.length + 1),
                    name: name,
                    type: type,
                    coverageLimit: parseInt(limit),
                    coveragePercentage: parseInt(percentage)
                  });
                }
                
                if(window.MediRoute.components.showToast) {
                  window.MediRoute.components.showToast('Provider added successfully', 'success');
                }
                
                // Note: To see the change, we would re-render the page or just the list, 
                // but since the store is updated, it will show on next render.
                return true;
              }
            }
          ];
          
          components.createModal('🛡️ Add Insurance Provider', formHtml, actions);
        });
      }

      // Integration Toggles
      document.querySelectorAll('.form-switch input[type="checkbox"]').forEach(toggle => {
        toggle.addEventListener('change', (e) => {
          const card = e.target.closest('.card');
          const systemName = card.querySelector('h4').textContent;
          if(window.MediRoute.components && window.MediRoute.components.showToast) {
            window.MediRoute.components.showToast(`Integration status updated for ${systemName}`, 'info');
          }
        });
      });

      // Populate Activity Log
      const activityLog = [
        { icon: '🏥', msg: 'New hospital registered: Fortis Escorts, Okhla', time: '10 mins ago', color: '#4ade80' },
        { icon: '⚡', msg: 'Emergency match completed for Cardiac patient in Delhi', time: '25 mins ago', color: '#f59e0b' },
        { icon: '🚑', msg: 'Ambulance AMB-005 dispatched to location', time: '42 mins ago', color: '#3b82f6' },
        { icon: '🔄', msg: 'eHospital database sync completed', time: '1 hour ago', color: '#8b5cf6' },
        { icon: '🛡️', msg: 'New insurance policy (Max Bupa) integration verified', time: '2 hours ago', color: '#10b981' },
        { icon: '🏥', msg: 'Bed inventory updated: Apollo Hospitals', time: '3 hours ago', color: '#a855f7' },
        { icon: '⚡', msg: 'Emergency match completed for Trauma patient in Mumbai', time: '4 hours ago', color: '#ef4444' },
        { icon: '📈', msg: 'System scale-up: Added 2 new DB read replicas', time: '5 hours ago', color: '#3b82f6' },
        { icon: '✅', msg: 'Daily automated platform health check passed', time: '8 hours ago', color: '#10b981' },
        { icon: '🚑', msg: 'Onboarded 50 new ambulances from 108 Service', time: '12 hours ago', color: '#f59e0b' }
      ];

      const logContainer = document.getElementById('activity-log-container');
      if (logContainer) {
        logContainer.innerHTML = activityLog.map(log => `
          <div class="flex align-center gap-1" style="padding: 0.75rem; background: rgba(0,0,0,0.15); border-radius: 8px; border-left: 4px solid ${log.color};">
            <div style="font-size: 1.25rem;">${log.icon}</div>
            <div style="flex: 1;">
              <div style="color: #fff; font-size: 0.9rem;">${log.msg}</div>
            </div>
            <div style="font-size: 0.8rem; color: #aaa;">${log.time}</div>
          </div>
        `).join('');
      }

      // Trigger standard animations if they exist in global scope
      if (typeof window.animateOnScroll === 'function') {
        window.animateOnScroll();
      } else {
        // Fallback for simple data-animate
        const animatedElements = document.querySelectorAll('[data-animate]');
        setTimeout(() => {
          animatedElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          });
        }, 100);
      }
    },

    unmount() {
      if (activityInterval) {
        clearInterval(activityInterval);
      }
    }
  };
})();
