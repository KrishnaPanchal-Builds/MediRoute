(function() {
  window.MediRoute = window.MediRoute || {};
  window.MediRoute.pages = window.MediRoute.pages || {};

  window.MediRoute.pages.patient = {
    render() {
      const patient = window.MediRoute.store.patients[0];
      const formatCurrency = window.MediRoute.components.formatCurrency;
      
      const initials = patient.name.split(' ').map(n => n[0]).join('');
      
      const insurancePlans = window.MediRoute.store.getInsurancePlans ? window.MediRoute.store.getInsurancePlans() : [];
      
      return `
        <div class="page page--patient">
          <div class="page__header flex-between mb-2">
            <div>
              <h1 class="section-title text-gradient">Patient Portal</h1>
              <p class="section-subtitle">Manage your health records and insurance</p>
            </div>
          </div>
          
          <div class="patient-profile" style="display:grid;grid-template-columns:300px 1fr;gap:2rem;">
            <!-- Left Sidebar -->
            <div class="patient-sidebar">
              <!-- Profile Card -->
              <div class="card card--glass patient-avatar-card mb-2 text-center" data-animate="fade-in">
                <div class="avatar avatar--xl mx-auto mb-1" style="background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem;">
                  ${initials}
                </div>
                <h2 class="mb-1">${patient.name}</h2>
                <div class="flex-center gap-1 mb-1 flex-wrap">
                  <span class="badge badge--info">${patient.age} yrs</span>
                  <span class="badge badge--info">${patient.gender}</span>
                  <span class="badge badge--danger">🩸 ${patient.bloodGroup}</span>
                </div>
                <p class="mb-1"><a href="tel:${patient.phone}" style="color:var(--color-primary);text-decoration:none;">📞 ${patient.phone}</a></p>
                <button id="btn-edit-profile" class="btn btn--ghost btn--sm w-full mt-1">Edit Profile</button>
              </div>

              <!-- Quick Stats -->
              <div class="card card--glass mb-2" data-animate="fade-in" style="animation-delay: 0.1s;">
                <h3 class="mb-1">Quick Stats</h3>
                <div class="flex-between mb-1">
                  <span>Hospital visits</span>
                  <strong>5</strong>
                </div>
                <div class="flex-between mb-1">
                  <span>Active prescriptions</span>
                  <strong>2</strong>
                </div>
                <div class="flex-between mb-1">
                  <span>Insurance</span>
                  <span class="badge badge--success">Active</span>
                </div>
                <div class="flex-between">
                  <span>Emergency contacts</span>
                  <strong>1</strong>
                </div>
              </div>

              <!-- Emergency Contact -->
              <div class="card card--glass card--emergency" data-animate="fade-in" style="animation-delay: 0.2s;">
                <h3 class="mb-1 text-danger">🚨 Emergency Contact</h3>
                <div class="mb-1">
                  <strong>${patient.emergencyContact.name}</strong>
                  <p class="text-sm">${patient.emergencyContact.relation}</p>
                  <p class="mt-1"><a href="tel:${patient.emergencyContact.phone}" style="color:var(--color-emergency);text-decoration:none;">📞 ${patient.emergencyContact.phone}</a></p>
                </div>
                <a href="tel:${patient.emergencyContact.phone}" class="btn btn--danger btn--sm w-full mt-1" style="display:block;text-align:center;text-decoration:none;">📞 Call Now</a>
              </div>
            </div>

            <!-- Main Content -->
            <div class="patient-main">
              <!-- Tabs Header -->
              <div class="tabs mb-2" style="display:flex;gap:0;border-bottom:2px solid var(--glass-border);overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;">
                <button class="tab-btn active" data-tab="overview" style="background:none;border:none;font-weight:600;cursor:pointer;padding:0.75rem 1.25rem;color:var(--text-primary);border-bottom:3px solid var(--color-primary);transition:all 0.2s ease;white-space:nowrap;font-size:0.9rem;">Overview</button>
                <button class="tab-btn" data-tab="history" style="background:none;border:none;font-weight:600;cursor:pointer;padding:0.75rem 1.25rem;color:var(--text-muted);border-bottom:3px solid transparent;transition:all 0.2s ease;white-space:nowrap;font-size:0.9rem;">Medical History</button>
                <button class="tab-btn" data-tab="insurance" style="background:none;border:none;font-weight:600;cursor:pointer;padding:0.75rem 1.25rem;color:var(--text-muted);border-bottom:3px solid transparent;transition:all 0.2s ease;white-space:nowrap;font-size:0.9rem;">Insurance</button>
                <button class="tab-btn" data-tab="prescriptions" style="background:none;border:none;font-weight:600;cursor:pointer;padding:0.75rem 1.25rem;color:var(--text-muted);border-bottom:3px solid transparent;transition:all 0.2s ease;white-space:nowrap;font-size:0.9rem;">Prescriptions</button>
                <button class="tab-btn" data-tab="documents" style="background:none;border:none;font-weight:600;cursor:pointer;padding:0.75rem 1.25rem;color:var(--text-muted);border-bottom:3px solid transparent;transition:all 0.2s ease;white-space:nowrap;font-size:0.9rem;">Documents</button>
              </div>

              <!-- Tab Contents -->
              <div class="tab-contents">
                
                <!-- Overview Tab -->
                <div class="tab-pane" id="tab-overview" data-animate="fade-in">
                  <div class="alert alert--danger mb-2" style="background-color: rgba(239, 68, 68, 0.1); border-left: 4px solid var(--danger); padding: 1rem; border-radius: 0.25rem;">
                    <strong>⚠️ Allergies:</strong> ${patient.allergies ? patient.allergies.join(', ') : 'Penicillin, Sulfa drugs'}
                  </div>
                  
                  <div class="grid grid--2 gap-2 mb-2">
                    <div class="card card--glass">
                      <h3 class="mb-1">🩺 Current Conditions</h3>
                      <div class="flex gap-1 flex-wrap">
                        ${patient.conditions ? patient.conditions.map(cond => `<span class="badge badge--warning">${cond}</span>`).join('') : '<span class="badge badge--warning">Hypertension</span>'}
                      </div>
                    </div>
                    
                    <div class="card card--glass">
                      <h3 class="mb-1">💊 Active Medications</h3>
                      <ul style="list-style: none; padding: 0;">
                        ${patient.medications ? patient.medications.map(med => `<li class="mb-1 flex gap-1 align-center"><span>💊</span> ${med}</li>`).join('') : '<li class="mb-1 flex gap-1 align-center"><span>💊</span> Metoprolol</li>'}
                      </ul>
                    </div>
                  </div>
                  
                  <div class="card card--glass mb-2">
                    <h3 class="mb-1">📅 Upcoming Appointments</h3>
                    <div class="flex-between align-center p-1" style="background: rgba(255,255,255,0.05); border-radius: 0.5rem; margin-bottom: 0.5rem;">
                      <div>
                        <strong>Dr. Sharma (Cardiologist)</strong>
                        <p class="text-sm text-muted">Apollo Hospital, Delhi</p>
                      </div>
                      <div class="text-right">
                        <div class="text-primary font-bold">Tomorrow</div>
                        <div class="text-sm">10:30 AM</div>
                      </div>
                    </div>
                    <div class="flex-between align-center p-1" style="background: rgba(255,255,255,0.05); border-radius: 0.5rem;">
                      <div>
                        <strong>Blood Test</strong>
                        <p class="text-sm text-muted">Max Super Specialty</p>
                      </div>
                      <div class="text-right">
                        <div class="text-primary font-bold">15 Aug</div>
                        <div class="text-sm">08:00 AM</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="card card--glass">
                    <h3 class="mb-1">⏱️ Recent Activity</h3>
                    <div class="timeline" style="border-left: 2px solid var(--primary); margin-left: 1rem; padding-left: 1rem;">
                      <div class="timeline-item mb-1" style="position: relative;">
                        <div class="timeline-dot" style="position: absolute; left: -1.4rem; top: 0.2rem; width: 0.8rem; height: 0.8rem; border-radius: 50%; background: var(--success);"></div>
                        <strong>Prescription Refilled</strong>
                        <p class="text-sm text-muted">2 days ago • Metoprolol</p>
                      </div>
                      <div class="timeline-item mb-1" style="position: relative;">
                        <div class="timeline-dot" style="position: absolute; left: -1.4rem; top: 0.2rem; width: 0.8rem; height: 0.8rem; border-radius: 50%; background: var(--info);"></div>
                        <strong>Routine Checkup</strong>
                        <p class="text-sm text-muted">1 month ago • Fortis Hospital</p>
                      </div>
                      <div class="timeline-item" style="position: relative;">
                        <div class="timeline-dot" style="position: absolute; left: -1.4rem; top: 0.2rem; width: 0.8rem; height: 0.8rem; border-radius: 50%; background: var(--warning);"></div>
                        <strong>Lab Results Uploaded</strong>
                        <p class="text-sm text-muted">2 months ago • Lipid Profile</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- History Tab -->
                <div class="tab-pane" id="tab-history" style="display: none;">
                  <div class="card card--glass">
                    <h2 class="mb-2">Medical History</h2>
                    <div class="medical-timeline" style="border-left: 2px solid var(--primary); margin-left: 1rem; padding-left: 1.5rem;">
                      ${patient.history && patient.history.length > 0 ? patient.history.map(item => `
                        <div class="timeline-item mb-2" style="position: relative;">
                          <div class="timeline-dot" style="position: absolute; left: -1.95rem; top: 0.2rem; width: 1rem; height: 1rem; border-radius: 50%; background: ${item.type === 'Emergency' ? 'var(--danger)' : item.type === 'Surgery' ? 'var(--warning)' : 'var(--info)'}; border: 2px solid var(--bg-color);"></div>
                          <div class="text-sm text-primary font-bold mb-0-5">${item.date}</div>
                          <h3 class="mb-0-5">${item.event}</h3>
                          <p class="text-muted mb-0-5">🏥 ${item.hospital}</p>
                          ${item.notes ? `<p class="text-sm" style="background: rgba(255,255,255,0.05); padding: 0.5rem; border-radius: 0.25rem;">📝 ${item.notes}</p>` : ''}
                        </div>
                      `).join('') : '<p>No medical history available.</p>'}
                    </div>
                  </div>
                </div>

                <!-- Insurance Tab -->
                <div class="tab-pane" id="tab-insurance" style="display: none;">
                  ${patient.insurance ? `
                    <div class="insurance-card mb-2" style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 2rem; border-radius: 1rem; position: relative; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
                      <div style="position: absolute; right: -2rem; top: -2rem; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                      <div class="flex-between align-center mb-2">
                        <h2 style="margin:0; font-size: 1.5rem; text-transform: uppercase; letter-spacing: 1px;">${patient.insurance.provider || 'Star Health'}</h2>
                        <span class="badge" style="background: rgba(255,255,255,0.2); color: white;">${patient.insurance.type || 'Comprehensive'}</span>
                      </div>
                      <div class="mb-2">
                        <p class="text-sm text-gray-300" style="opacity: 0.8; margin-bottom: 0.25rem;">Policy Number</p>
                        <p style="font-family: monospace; font-size: 1.25rem; letter-spacing: 2px;">${patient.insurance.policyNumber || 'SH-123456789'}</p>
                      </div>
                      <div class="flex-between align-end">
                        <div>
                          <p class="text-sm text-gray-300" style="opacity: 0.8; margin-bottom: 0.25rem;">Coverage</p>
                          <p style="font-size: 1.5rem; font-weight: bold;">${formatCurrency ? formatCurrency(patient.insurance.coverage || 500000) : '₹' + (patient.insurance.coverage || 500000).toLocaleString('en-IN')}</p>
                        </div>
                        <div class="text-right">
                          <p class="text-sm text-gray-300" style="opacity: 0.8; margin-bottom: 0.25rem;">Valid Till</p>
                          <p>${patient.insurance.validTill || '12/2027'}</p>
                        </div>
                      </div>
                    </div>
                  ` : `
                    <div class="alert alert--warning mb-2">No active insurance policy found.</div>
                  `}

                  <div class="card card--glass mb-2">
                    <h3 class="mb-1">Coverage Details</h3>
                    <div class="grid grid--2 gap-2">
                      <div>
                        <h4 class="mb-1 text-sm text-muted">What's Covered</h4>
                        <ul style="list-style-type: none; padding: 0;">
                          <li class="mb-0-5">✅ In-patient Hospitalization</li>
                          <li class="mb-0-5">✅ Day Care Procedures</li>
                          <li class="mb-0-5">✅ Pre & Post Hospitalization</li>
                          <li class="mb-0-5">✅ Road Ambulance Cover</li>
                        </ul>
                      </div>
                      <div>
                        <h4 class="mb-1 text-sm text-muted">Network Details</h4>
                        <p class="mb-0-5">🏥 <strong>10,000+</strong> Network Hospitals</p>
                        <p class="mb-0-5">⚡ Cashless Facility Available</p>
                        <h4 class="mt-1 mb-0-5 text-sm text-muted">Claim Process</h4>
                        <ol style="padding-left: 1.2rem; margin: 0; font-size: 0.9rem;">
                          <li>Intimate hospital 48hrs prior (planned) or 24hrs post (emergency).</li>
                          <li>Show Health Card at TPA desk.</li>
                          <li>Hospital sends authorization request.</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div class="flex-between align-center mb-1 mt-2">
                    <h3>Explore Insurance Plans</h3>
                    <button id="btn-view-insurance" class="btn btn--ghost btn--sm">View All</button>
                  </div>
                  
                  <div class="grid grid--2 gap-2">
                    ${insurancePlans.slice(0, 4).map(plan => `
                      <div class="card card--glass card--hover">
                        <div class="flex-between mb-1">
                          <h4>${plan.provider} - ${plan.name}</h4>
                          <span class="badge badge--primary">${plan.type}</span>
                        </div>
                        <p class="text-sm text-muted mb-1">${plan.description}</p>
                        <div class="flex-between mt-auto">
                          <div>
                            <p class="text-xs text-muted">Coverage</p>
                            <strong>${formatCurrency ? formatCurrency(plan.coverage) : '₹' + plan.coverage.toLocaleString()}</strong>
                          </div>
                          <div class="text-right">
                            <p class="text-xs text-muted">Premium</p>
                            <strong>${formatCurrency ? formatCurrency(plan.premium) : '₹' + plan.premium.toLocaleString()}/yr</strong>
                          </div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- Prescriptions Tab -->
                <div class="tab-pane" id="tab-prescriptions" style="display: none;">
                  <div class="card card--glass mb-2">
                    <h2 class="mb-2">Active Prescriptions</h2>
                    
                    <div class="prescription-item mb-2 p-1" style="border: 1px solid var(--border-color); border-radius: 0.5rem;">
                      <div class="flex-between align-center mb-1">
                        <div>
                          <h3 class="mb-0-5 text-primary">💊 Metoprolol (50mg)</h3>
                          <p class="text-sm text-muted">Take 1 tablet daily after breakfast</p>
                        </div>
                        <div class="text-right">
                          <span class="badge badge--success">Active</span>
                          <p class="text-xs text-muted mt-0-5">Dr. Sharma</p>
                        </div>
                      </div>
                      <div class="mt-1">
                        <div class="flex-between text-xs mb-0-5">
                          <span>Refill Progress (20/30 days)</span>
                          <span>66%</span>
                        </div>
                        ${window.MediRoute.components && window.MediRoute.components.createProgressBar ? window.MediRoute.components.createProgressBar(66, 100, 'var(--primary)') : `
                          <div style="width:100%; background:rgba(255,255,255,0.1); height:8px; border-radius:4px; overflow:hidden;">
                            <div style="width:66%; background:var(--primary); height:100%;"></div>
                          </div>
                        `}
                      </div>
                      <div class="flex gap-1 mt-1">
                        <button class="btn btn--sm btn--primary btn-refill" data-med="Metoprolol (50mg)">Request Refill</button>
                        <button class="btn btn--sm btn--ghost btn-rx-details" data-med="Metoprolol (50mg)" data-doc="Dr. Sharma" data-refills="2" data-instructions="Take 1 tablet daily after breakfast">View Details</button>
                      </div>
                    </div>

                    <div class="prescription-item p-1" style="border: 1px solid var(--border-color); border-radius: 0.5rem;">
                      <div class="flex-between align-center mb-1">
                        <div>
                          <h3 class="mb-0-5 text-primary">💊 Atorvastatin (20mg)</h3>
                          <p class="text-sm text-muted">Take 1 tablet at bedtime</p>
                        </div>
                        <div class="text-right">
                          <span class="badge badge--success">Active</span>
                          <p class="text-xs text-muted mt-0-5">Dr. Sharma</p>
                        </div>
                      </div>
                      <div class="mt-1">
                        <div class="flex-between text-xs mb-0-5">
                          <span>Refill Progress (10/30 days)</span>
                          <span>33%</span>
                        </div>
                        ${window.MediRoute.components && window.MediRoute.components.createProgressBar ? window.MediRoute.components.createProgressBar(33, 100, 'var(--primary)') : `
                          <div style="width:100%; background:rgba(255,255,255,0.1); height:8px; border-radius:4px; overflow:hidden;">
                            <div style="width:33%; background:var(--primary); height:100%;"></div>
                          </div>
                        `}
                      </div>
                      <div class="flex gap-1 mt-1">
                        <button class="btn btn--sm btn--primary btn-refill" data-med="Atorvastatin (20mg)">Request Refill</button>
                        <button class="btn btn--sm btn--ghost btn-rx-details" data-med="Atorvastatin (20mg)" data-doc="Dr. Sharma" data-refills="1" data-instructions="Take 1 tablet at bedtime">View Details</button>
                      </div>
                    </div>
                  </div>

                  <div class="card card--glass">
                    <h3 class="mb-1">Past Prescriptions</h3>
                    <table class="data-table w-full text-left" style="width: 100%; border-collapse: collapse;">
                      <thead>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                          <th style="padding: 0.5rem;">Medicine</th>
                          <th style="padding: 0.5rem;">Date</th>
                          <th style="padding: 0.5rem;">Doctor</th>
                          <th style="padding: 0.5rem;">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                          <td style="padding: 0.5rem;">Amoxicillin 500mg</td>
                          <td style="padding: 0.5rem;">15 Jan 2026</td>
                          <td style="padding: 0.5rem;">Dr. Gupta</td>
                          <td style="padding: 0.5rem;"><span class="badge badge--info">Completed</span></td>
                        </tr>
                        <tr>
                          <td style="padding: 0.5rem;">Paracetamol 650mg</td>
                          <td style="padding: 0.5rem;">10 Dec 2025</td>
                          <td style="padding: 0.5rem;">Dr. Verma</td>
                          <td style="padding: 0.5rem;"><span class="badge badge--info">Completed</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Documents Tab -->
                <div class="tab-pane" id="tab-documents" style="display: none;">
                  <div class="flex-between align-center mb-2">
                    <h2>Medical Documents</h2>
                    <button id="btn-upload-doc" class="btn btn--primary">
                      <span style="margin-right:0.5rem">📄</span> Upload Document
                    </button>
                  </div>

                  <div class="card card--glass mb-2">
                    <div class="grid gap-1">
                      ${patient.documents ? patient.documents.map(doc => `
                      <div class="flex-between align-center p-1 card--hover" style="border: 1px solid var(--border-color); border-radius: 0.5rem;">
                        <div class="flex align-center gap-1">
                          <div style="font-size: 2rem;">📄</div>
                          <div>
                            <strong>${doc.title}</strong>
                            <p class="text-sm text-muted">${doc.date || 'Today'} • ${doc.type}</p>
                            ${doc.notes ? `<p class="text-xs text-muted">${doc.notes}</p>` : ''}
                          </div>
                        </div>
                        <button class="btn btn--ghost btn--sm btn-download-doc" data-doc="${doc.title}">Download</button>
                      </div>
                      `).join('') : ''}
                      <div class="flex-between align-center p-1 card--hover" style="border: 1px solid var(--border-color); border-radius: 0.5rem;">
                        <div class="flex align-center gap-1">
                          <div style="font-size: 2rem;">🩻</div>
                          <div>
                            <strong>Chest X-Ray Report</strong>
                            <p class="text-sm text-muted">15 Mar 2026 • Apollo Hospital</p>
                          </div>
                        </div>
                        <button class="btn btn--ghost btn--sm btn-download-doc" data-doc="Chest X-Ray Report">Download</button>
                      </div>

                      <div class="flex-between align-center p-1 card--hover" style="border: 1px solid var(--border-color); border-radius: 0.5rem;">
                        <div class="flex align-center gap-1">
                          <div style="font-size: 2rem;">🩸</div>
                          <div>
                            <strong>Comprehensive Blood Panel</strong>
                            <p class="text-sm text-muted">10 Jan 2026 • Dr. Lal PathLabs</p>
                          </div>
                        </div>
                        <button class="btn btn--ghost btn--sm btn-download-doc" data-doc="Comprehensive Blood Panel">Download</button>
                      </div>

                      <div class="flex-between align-center p-1 card--hover" style="border: 1px solid var(--border-color); border-radius: 0.5rem;">
                        <div class="flex align-center gap-1">
                          <div style="font-size: 2rem;">📋</div>
                          <div>
                            <strong>Discharge Summary</strong>
                            <p class="text-sm text-muted">05 Sep 2025 • Fortis Hospital</p>
                          </div>
                        </div>
                        <button class="btn btn--ghost btn--sm btn-download-doc" data-doc="Discharge Summary">Download</button>
                      </div>
                      
                      <div class="flex-between align-center p-1 card--hover" style="border: 1px solid var(--border-color); border-radius: 0.5rem;">
                        <div class="flex align-center gap-1">
                          <div style="font-size: 2rem;">💊</div>
                          <div>
                            <strong>Prescription - Dr. Sharma</strong>
                            <p class="text-sm text-muted">01 Sep 2025 • Apollo Hospital</p>
                          </div>
                        </div>
                        <button class="btn btn--ghost btn--sm btn-download-doc" data-doc="Prescription - Dr. Sharma">Download</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div> <!-- tab-contents -->
            </div>
          </div>
        </div>
      `;
    },
    mount() {
      // Tab switching logic
      const tabBtns = document.querySelectorAll('.tab-btn');
      const tabPanes = document.querySelectorAll('.tab-pane');

      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          // Remove active class from all buttons and hide all panes
          tabBtns.forEach(b => {
            b.style.borderBottomColor = 'transparent';
            b.style.color = 'var(--text-muted)';
            b.classList.remove('active');
          });
          tabPanes.forEach(p => p.style.display = 'none');

          // Add active class to clicked button and show corresponding pane
          btn.classList.add('active');
          btn.style.borderBottomColor = 'var(--color-primary)';
          btn.style.color = 'var(--text-primary)';
          
          const tabId = btn.getAttribute('data-tab');
          const pane = document.getElementById('tab-' + tabId);
          if (pane) {
            pane.style.display = 'block';
          }
        });
      });

      // Animate elements if the animateOnScroll utility exists or just use a simple animation loop
      const animatedElements = document.querySelectorAll('[data-animate]');
      animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 100 * index + (parseFloat(el.style.animationDelay || 0) * 1000));
      });

      // Edit Profile
      const btnEditProfile = document.getElementById('btn-edit-profile');
      if (btnEditProfile && window.MediRoute.components && window.MediRoute.components.createModal) {
        btnEditProfile.addEventListener('click', () => {
          const patient = window.MediRoute.store.patients[0];
          const content = `
            <div class="form-group mb-1">
              <label class="form-label">Name</label>
              <input type="text" id="edit-name" class="form-input" value="${patient.name}">
            </div>
            <div class="form-group mb-1">
              <label class="form-label">Age</label>
              <input type="number" id="edit-age" class="form-input" value="${patient.age}">
            </div>
            <div class="form-group mb-1">
              <label class="form-label">Blood Group</label>
              <input type="text" id="edit-blood" class="form-input" value="${patient.bloodGroup || patient.blood || ''}">
            </div>
            <div class="form-group mb-1">
              <label class="form-label">Phone</label>
              <input type="text" id="edit-phone" class="form-input" value="${patient.phone}">
            </div>
            <div class="form-group mb-1">
              <label class="form-label">Emergency Contact Name</label>
              <input type="text" id="edit-em-name" class="form-input" value="${patient.emergencyContact.name}">
            </div>
            <div class="form-group mb-1">
              <label class="form-label">Emergency Contact Phone</label>
              <input type="text" id="edit-em-phone" class="form-input" value="${patient.emergencyContact.phone}">
            </div>
          `;
          window.MediRoute.components.createModal('Edit Profile', content, [
            { label: 'Cancel', class: 'btn--ghost' },
            { label: 'Save', class: 'btn--primary', handler: () => {
              const newName = document.getElementById('edit-name').value;
              const newAge = document.getElementById('edit-age').value;
              const newBlood = document.getElementById('edit-blood').value;
              const newPhone = document.getElementById('edit-phone').value;
              const newEmName = document.getElementById('edit-em-name').value;
              const newEmPhone = document.getElementById('edit-em-phone').value;
              
              if (newName) patient.name = newName;
              if (newAge) patient.age = newAge;
              if (newBlood) { patient.bloodGroup = newBlood; patient.blood = newBlood; }
              if (newPhone) patient.phone = newPhone;
              if (newEmName) patient.emergencyContact.name = newEmName;
              if (newEmPhone) patient.emergencyContact.phone = newEmPhone;
              
              if (window.MediRoute.components.showToast) window.MediRoute.components.showToast('Profile updated', 'success');
              
              if (window.MediRoute.store && window.MediRoute.store.updatePatient) {
                window.MediRoute.store.updatePatient(patient.id, patient);
                const container = document.querySelector('.page--patient').parentElement;
                if (container && container.id === 'app') {
                    window.MediRoute.pages.patient.unmount(container);
                    container.innerHTML = window.MediRoute.pages.patient.render();
                    window.MediRoute.pages.patient.mount();
                }
              }
              return true;
            }}
          ]);
        });
      }

      // View All Insurance
      const btnViewInsurance = document.getElementById('btn-view-insurance');
      if (btnViewInsurance && window.MediRoute.components && window.MediRoute.components.createModal) {
        btnViewInsurance.addEventListener('click', () => {
          const plans = window.MediRoute.store.getInsurancePlans ? window.MediRoute.store.getInsurancePlans() : [];
          const content = plans.map(p => `
            <div class="card mb-1 p-1" style="border: 1px solid var(--border-color); border-radius: 8px;">
              <h4>${p.provider} - ${p.name}</h4>
              <p class="text-sm">Type: ${p.type} | Coverage: ${window.MediRoute.components.formatCurrency ? window.MediRoute.components.formatCurrency(p.coverage) : p.coverage}</p>
              <p class="text-sm mt-0-5">${p.description}</p>
            </div>
          `).join('');
          
          window.MediRoute.components.createModal('Insurance Directory', content || '<p>No plans available</p>', [
            { label: 'Close', class: 'btn--ghost' }
          ]);
        });
      }

      // Request Refill
      document.querySelectorAll('.btn-refill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const med = e.target.dataset.med;
          if (window.MediRoute.components && window.MediRoute.components.confirm) {
            window.MediRoute.components.confirm(`Are you sure you want to request a refill for ${med}?`, () => {
              if (window.MediRoute.components.showToast) {
                window.MediRoute.components.showToast(`💊 Refill request submitted to hospital pharmacy for ${med}`, 'success');
              }
            });
          }
        });
      });

      // View Rx Details
      document.querySelectorAll('.btn-rx-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const med = e.target.dataset.med;
          const doc = e.target.dataset.doc;
          const refills = e.target.dataset.refills;
          const instructions = e.target.dataset.instructions;
          
          if (window.MediRoute.components && window.MediRoute.components.createModal) {
            const content = `
              <div class="mb-1"><strong>Medication:</strong> ${med}</div>
              <div class="mb-1"><strong>Doctor:</strong> ${doc}</div>
              <div class="mb-1"><strong>Instructions:</strong> ${instructions}</div>
              <div class="mb-1"><strong>Refills Remaining:</strong> ${refills}</div>
            `;
            window.MediRoute.components.createModal('Prescription Details', content, [
              { label: 'Close', class: 'btn--ghost' }
            ]);
          }
        });
      });

      // Upload Document
      const btnUploadDoc = document.getElementById('btn-upload-doc');
      if (btnUploadDoc && window.MediRoute.components && window.MediRoute.components.createModal) {
        btnUploadDoc.addEventListener('click', () => {
          const content = `
            <div class="form-group mb-1">
              <label class="form-label">Document Title</label>
              <input type="text" id="doc-title" class="form-input" placeholder="e.g. Latest Blood Report">
            </div>
            <div class="form-group mb-1">
              <label class="form-label">Document Type</label>
              <select id="doc-type" class="form-select">
                <option>Lab Report</option>
                <option>Scan</option>
                <option>Discharge Summary</option>
                <option>Prescription</option>
              </select>
            </div>
            <div class="form-group mb-1">
              <label class="form-label">Date</label>
              <input type="date" id="doc-date" class="form-input" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group mb-1">
              <label class="form-label">Notes</label>
              <input type="text" id="doc-notes" class="form-input" placeholder="Notes">
            </div>
            <div class="form-group mb-1">
              <label class="form-label">Document Content (Text)</label>
              <textarea id="doc-content" class="form-input" rows="3"></textarea>
            </div>
          `;
          window.MediRoute.components.createModal('Upload Document', content, [
            { label: 'Cancel', class: 'btn--ghost' },
            { label: 'Upload', class: 'btn--primary', handler: () => {
              const patient = window.MediRoute.store.patients[0];
              const title = document.getElementById('doc-title').value;
              const type = document.getElementById('doc-type').value;
              const date = document.getElementById('doc-date').value;
              const notes = document.getElementById('doc-notes').value;
              const docContent = document.getElementById('doc-content').value;
              
              if (!patient.documents) patient.documents = [];
              patient.documents.push({ title, type, date, notes, content: docContent });
              
              if (window.MediRoute.store && window.MediRoute.store.updatePatient) {
                  window.MediRoute.store.updatePatient(patient.id, { documents: patient.documents });
              }

              if (window.MediRoute.components.showToast) {
                window.MediRoute.components.showToast('Document uploaded successfully', 'success');
              }
              
              const container = document.querySelector('.page--patient').parentElement;
              if (container && container.id === 'app') {
                  window.MediRoute.pages.patient.unmount(container);
                  container.innerHTML = window.MediRoute.pages.patient.render();
                  window.MediRoute.pages.patient.mount();
              }
              return true;
            }}
          ]);
        });
      }

      // Download Document
      document.querySelectorAll('.btn-download-doc').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const docName = e.target.dataset.doc;
          const a = document.createElement('a');
          a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Medical Report\n\nDocument: ${docName}\n\n[Content of the report would go here]`);
          a.download = `${docName.replace(/\s+/g, '_')}.txt`;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          if (window.MediRoute.components && window.MediRoute.components.showToast) {
            window.MediRoute.components.showToast(`📥 Downloaded ${docName}`, 'success');
          }
        });
      });
    },
    unmount() {
      // Clean up if needed
    }
  };
})();
