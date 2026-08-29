(function() {
  window.MediRoute = window.MediRoute || {};
  window.MediRoute.pages = window.MediRoute.pages || {};

  const triagePatients = [
    {
      id: 'pt-101',
      name: 'Ramesh Kumar',
      age: 58,
      gender: 'Male',
      abha: 'ABHA-1234-5678-9012',
      severity: 'red',
      severityLabel: 'Red Emergency',
      complaint: 'Crushing substernal chest pain radiating to jaw',
      duration: '45 mins',
      arrivalTime: '10:15 AM',
      vitals: { bp: '160/95', pulse: '110', spo2: '92%', temp: '98.6°F' },
      redFlags: ['Suspected Myocardial Infarction (STEMI)', 'High BP', 'Low SpO2'],
      allergies: ['Sulfa Drugs'],
      medications: ['Amlodipine 5mg', 'Metformin 500mg'],
      labs: [
        { name: 'Troponin I', status: 'abnormal', value: 'High' },
        { name: 'ECG', status: 'abnormal', value: 'ST Elevation' },
        { name: 'RBS', status: 'normal', value: '140 mg/dL' }
      ],
      aiLog: [
        { q: "Can you describe the pain?", a: "It's crushing, right in the middle of my chest.", conf: "98%" },
        { q: "Does the pain travel anywhere?", a: "Yes, to my jaw and left arm.", conf: "95%" },
        { q: "Are you feeling sweaty or breathless?", a: "Yes, both.", conf: "99%" }
      ],
      timeline: [
        { date: '2023-01', event: 'Diagnosed with Hypertension' },
        { date: '2025-05', event: 'Started Amlodipine' },
        { date: 'Today 09:30', event: 'Chest pain onset' }
      ]
    },
    {
      id: 'pt-102',
      name: 'Sunita Sharma',
      age: 42,
      gender: 'Female',
      abha: 'ABHA-9876-5432-1098',
      severity: 'yellow',
      severityLabel: 'Yellow Urgent',
      complaint: 'Severe abdominal pain, right lower quadrant',
      duration: '12 hours',
      arrivalTime: '10:30 AM',
      vitals: { bp: '120/80', pulse: '88', spo2: '98%', temp: '101.2°F' },
      redFlags: ['Fever', 'Rebound tenderness suspected'],
      allergies: ['Penicillin'],
      medications: ['None'],
      labs: [
        { name: 'WBC Count', status: 'abnormal', value: '15,000 /mcL' },
        { name: 'Ultrasound', status: 'pending', value: 'Ordered' }
      ],
      aiLog: [
        { q: "Where exactly is the pain?", a: "Lower right side of my stomach.", conf: "95%" },
        { q: "Do you have a fever or nausea?", a: "Yes, I threw up twice.", conf: "96%" }
      ],
      timeline: [
        { date: 'Yesterday', event: 'Mild generalized pain started' },
        { date: 'Today 06:00', event: 'Pain localized to RLQ' }
      ]
    },
    {
      id: 'pt-103',
      name: 'Aarav Mehta',
      age: 34,
      gender: 'Male',
      abha: 'ABHA-5555-4444-3333',
      severity: 'green',
      severityLabel: 'Green Routine',
      complaint: 'Mild sprain in right ankle',
      duration: '2 days',
      arrivalTime: '11:00 AM',
      vitals: { bp: '118/75', pulse: '72', spo2: '99%', temp: '98.4°F' },
      redFlags: [],
      allergies: [],
      medications: ['Ibuprofen PRN'],
      labs: [
        { name: 'X-Ray Ankle', status: 'normal', value: 'No fracture' }
      ],
      aiLog: [
        { q: "How did the injury happen?", a: "Twisted it while jogging.", conf: "99%" },
        { q: "Can you bear weight on it?", a: "Yes, but it hurts a bit.", conf: "92%" }
      ],
      timeline: [
        { date: '2 Days Ago', event: 'Twisted ankle' }
      ]
    }
  ];

  if (window.MediRoute.store) {
      triagePatients.forEach(p => {
          if (!window.MediRoute.store.patients.find(sp => sp.id === p.id)) {
              window.MediRoute.store.patients.push(p);
          }
      });
  }

  function getQueue() {
      if (window.MediRoute.store) {
          return window.MediRoute.store.patients.filter(p => p.severity && p.status !== 'verified');
      }
      return triagePatients;
  }

  let selectedPatient = null;

  function renderPatientCard(pt) {
    if (!pt) return '';
    const isSelected = selectedPatient && selectedPatient.id === pt.id;
    const badgeColor = pt.severity === 'red' ? 'danger' : (pt.severity === 'yellow' ? 'warning' : 'success');
    return `
      <div class="card card--glass card--hover triage-card ${isSelected ? 'active' : ''}" data-id="${pt.id}" style="cursor:pointer; margin-bottom: 1rem; border-left: 4px solid var(--${badgeColor});">
        <div class="flex-between align-center mb-0-5">
          <strong>${pt.name} (${pt.age}${pt.gender[0]})</strong>
          <span class="badge badge--${badgeColor}">${pt.severityLabel}</span>
        </div>
        <div class="text-sm text-muted mb-0-5">ABHA: ${pt.abha}</div>
        <div class="text-sm"><strong>CC:</strong> ${pt.complaint}</div>
        <div class="text-xs text-muted mt-0-5 flex-between">
          <span>Arrived: ${pt.arrivalTime}</span>
        </div>
      </div>
    `;
  }

  function renderRightPanel() {
    const pt = selectedPatient;
    const badgeColor = pt.severity === 'red' ? 'danger' : (pt.severity === 'yellow' ? 'warning' : 'success');
    
    return `
      <!-- Top Banner -->
      <div class="card card--glass mb-1" style="border-top: 4px solid var(--${badgeColor});">
        <div class="flex-between align-center mb-1">
          <div>
            <h2 class="text-gradient">${pt.name} <span class="text-muted" style="font-size: 1rem;">(${pt.age} ${pt.gender})</span></h2>
            <div class="text-sm text-muted">ABHA ID: ${pt.abha}</div>
          </div>
          <div class="badge badge--${badgeColor}" style="font-size: 1.1rem; padding: 0.5rem 1rem;">${pt.severityLabel}</div>
        </div>
        
        <div class="grid grid--4 gap-1 mb-1">
          <div style="background: rgba(255,255,255,0.05); padding: 0.5rem; border-radius: 4px; text-align: center; position: relative;">
            <div class="text-xs text-muted">BP</div>
            <div class="font-bold ${pt.severity === 'red' ? 'text-danger' : ''}">${pt.vitals.bp}</div>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 0.5rem; border-radius: 4px; text-align: center;">
            <div class="text-xs text-muted">Pulse</div>
            <div class="font-bold ${pt.severity === 'red' ? 'text-danger' : ''}">${pt.vitals.pulse} bpm</div>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 0.5rem; border-radius: 4px; text-align: center;">
            <div class="text-xs text-muted">SpO2</div>
            <div class="font-bold ${pt.severity === 'red' ? 'text-danger' : ''}">${pt.vitals.spo2}</div>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 0.5rem; border-radius: 4px; text-align: center;">
            <div class="text-xs text-muted">Temp</div>
            <div class="font-bold ${pt.severity === 'yellow' ? 'text-warning' : ''}">${pt.vitals.temp}</div>
          </div>
        </div>
        <button id="btn-edit-vitals" class="btn btn--sm btn--ghost w-full">Edit Vitals</button>
      </div>

      <!-- Complaint & Flags -->
      <div class="grid grid--2 gap-1 mb-1">
        <div class="card card--glass">
          <div class="text-sm text-muted mb-0-5">Primary Concern</div>
          <h3 class="mb-0-5">${pt.complaint}</h3>
          <div class="text-sm text-primary">Duration: ${pt.duration}</div>
        </div>
        
        <div class="card card--glass" style="${pt.redFlags.length ? 'border: 1px solid var(--danger); background: rgba(239,68,68,0.05);' : ''}">
          <div class="text-sm text-muted mb-0-5">Red Flags / Alerts</div>
          ${pt.redFlags.length ? 
            pt.redFlags.map(f => `<div class="text-danger flex align-center gap-0-5 mb-0-5">⚠️ ${f}</div>`).join('') 
            : '<div class="text-success">No critical red flags detected.</div>'}
        </div>
      </div>

      <!-- Allergies, Meds, Labs -->
      <div class="grid grid--3 gap-1 mb-2">
        <div class="card card--glass">
          <div class="text-sm text-muted mb-0-5">Verified Allergies</div>
          <div class="flex flex-wrap gap-0-5">
            ${pt.allergies.length ? pt.allergies.map(a => `<span class="badge badge--danger">${a}</span>`).join('') : '<span class="text-sm">None known</span>'}
          </div>
        </div>
        <div class="card card--glass">
          <div class="flex-between align-center mb-0-5">
            <div class="text-sm text-muted">Active Medications</div>
            <button id="btn-add-med" class="btn btn--icon btn--ghost" style="font-size:0.8rem;">➕</button>
          </div>
          <div class="flex flex-wrap gap-0-5">
            ${pt.medications.length ? pt.medications.map(m => `<span class="badge badge--info">${m}</span>`).join('') : '<span class="text-sm">None</span>'}
          </div>
        </div>
        <div class="card card--glass">
          <div class="flex-between align-center mb-0-5">
            <div class="text-sm text-muted">Recent Labs</div>
            <button id="btn-add-lab" class="btn btn--icon btn--ghost" style="font-size:0.8rem;">➕</button>
          </div>
          <div class="flex flex-wrap gap-0-5">
            ${pt.labs.map(l => `<span class="badge badge--${l.status === 'abnormal' ? 'danger' : (l.status === 'pending' ? 'warning' : 'success')}">${l.name}: ${l.value}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs mb-1" style="display:flex;gap:0;border-bottom:2px solid var(--glass-border);overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;">
        <button class="triage-tab-btn active" data-target="history" style="background:none;border:none;font-weight:600;cursor:pointer;padding:0.75rem 1.25rem;color:var(--text-primary);border-bottom:3px solid var(--color-primary);transition:all 0.2s ease;">Full History & AI Log</button>
        <button class="triage-tab-btn" data-target="timeline" style="background:none;border:none;font-weight:600;cursor:pointer;padding:0.75rem 1.25rem;color:var(--text-muted);border-bottom:3px solid transparent;transition:all 0.2s ease;">Medical Timeline</button>
        <button class="triage-tab-btn" data-target="docs" style="background:none;border:none;font-weight:600;cursor:pointer;padding:0.75rem 1.25rem;color:var(--text-muted);border-bottom:3px solid transparent;transition:all 0.2s ease;">Scanned Documents</button>
        <button class="triage-tab-btn" data-target="edit" style="background:none;border:none;font-weight:600;cursor:pointer;padding:0.75rem 1.25rem;color:var(--text-muted);border-bottom:3px solid transparent;transition:all 0.2s ease;">Physician Verification</button>
      </div>

      <div class="triage-tab-contents">
        
        <!-- Tab: Full History -->
        <div class="triage-tab-pane" id="t-history">
          <div class="card card--glass">
            <h3 class="mb-1">AI Branching Intake Log</h3>
            ${pt.aiLog.map(log => `
              <div class="mb-1 p-1" style="background: rgba(255,255,255,0.02); border-radius: 8px;">
                <div class="text-sm text-primary mb-0-5"><strong>Q:</strong> ${log.q}</div>
                <div><strong>A:</strong> ${log.a} <span class="badge badge--success" style="font-size:0.7rem; float:right;">Conf: ${log.conf}</span></div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Tab: Timeline -->
        <div class="triage-tab-pane" id="t-timeline" style="display:none;">
          <div class="card card--glass">
            <h3 class="mb-1">Chronological Timeline</h3>
            <div class="timeline" style="border-left: 2px solid var(--primary); margin-left: 1rem; padding-left: 1rem;">
              ${pt.timeline.map(t => `
                <div class="timeline-item mb-1" style="position: relative;">
                  <div class="timeline-dot" style="position: absolute; left: -1.4rem; top: 0.2rem; width: 0.8rem; height: 0.8rem; border-radius: 50%; background: var(--info);"></div>
                  <strong>${t.event}</strong>
                  <p class="text-sm text-muted">${t.date}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Tab: Docs & AI Mapping -->
        <div class="triage-tab-pane" id="t-docs" style="display:none;">
          <div class="card card--glass">
            <div class="flex-between align-center mb-1">
              <h3 class="mb-0">Uploaded Rx / Document</h3>
              <span class="badge badge--info">AI Mapped</span>
            </div>
            <p class="text-sm text-muted mb-1">Hover over extracted items to see them highlighted on the original scan.</p>
            <div class="grid grid--2 gap-1" style="align-items: start;">
                <div style="position: absolute; inset:0; background: rgba(255,255,255,0.05); border: 1px dashed var(--glass-border); display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 1rem;">
                  <strong style="color: var(--color-primary);">📄 Document OCR Scan (Ramesh Kumar)</strong>
                  <span class="text-xs text-muted">Amlodipine 5mg OD • Metformin 500mg BD</span>
                </div>
                
                <!-- Bounding boxes (hidden by default, shown on hover) -->
                <div class="bbox" id="bbox-amlo" style="display:none; position:absolute; top: 55px; left: 15px; width: 180px; height: 20px; border: 2px solid var(--danger); background: rgba(239,68,68,0.2);"></div>
                <div class="bbox" id="bbox-met" style="display:none; position:absolute; top: 85px; left: 15px; width: 180px; height: 20px; border: 2px solid var(--danger); background: rgba(239,68,68,0.2);"></div>
              </div>
              
              <!-- Extracted Items List -->
              <div>
                <ul style="list-style:none; padding:0;">
                  <li class="extract-item card card--glass mb-0-5" data-box="bbox-amlo" style="cursor:pointer; transition: all 0.2s;">
                    <strong>💊 Amlodipine 5mg</strong>
                    <div class="text-xs text-muted">Frequency: OD</div>
                  </li>
                  <li class="extract-item card card--glass mb-0-5" data-box="bbox-met" style="cursor:pointer; transition: all 0.2s;">
                    <strong>💊 Metformin 500mg</strong>
                    <div class="text-xs text-muted">Frequency: BD</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Physician Edit -->
        <div class="triage-tab-pane" id="t-edit" style="display:none;">
          <div class="card card--glass">
            <h3 class="mb-1">Clinical Assessment & Verification</h3>
            
            <div class="form-group mb-1">
              <label class="form-label flex-between">Chief Complaint <button id="btn-edit-cc" class="btn btn--ghost btn--sm">Save</button></label>
              <input type="text" id="edit-pt-cc" class="form-input" value="${pt.complaint}">
            </div>
            
            <div class="form-group mb-1">
              <label class="form-label flex-between">Diagnosis / Impression <button id="btn-edit-dx" class="btn btn--ghost btn--sm">Save</button></label>
              <input type="text" id="edit-pt-dx" class="form-input" placeholder="e.g. Acute STEMI" value="${pt.diagnosis || ''}">
            </div>
            
            <div class="form-group mb-1">
              <label class="form-label">Clinical Notes</label>
              <textarea class="form-input" rows="3" placeholder="Physician notes here..."></textarea>
            </div>
            
            <div class="form-group mb-2">
              <label class="form-label">Final Disposition</label>
              <select class="form-select">
                <option value="icu" ${pt.severity === 'red' ? 'selected' : ''}>Admit to ICU</option>
                <option value="ward" ${pt.severity === 'yellow' ? 'selected' : ''}>Admit to Ward</option>
                <option value="opd" ${pt.severity === 'green' ? 'selected' : ''}>OPD / Discharge</option>
              </select>
            </div>
            
            <button id="btn-verify-sync" class="btn btn--primary w-full" style="padding: 1rem; font-size: 1.1rem; font-weight: bold;">
              ✓ Confirm & Sync EMR (ABDM Token)
            </button>
          </div>
        </div>

      </div>
    `;
  }

  function bindEvents() {
    // Left column click
    document.querySelectorAll('.triage-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        selectedPatient = getQueue().find(p => p.id === id);
        updateUI();
      });
    });

    // Tab switching
    const tabBtns = document.querySelectorAll('.triage-tab-btn');
    const tabPanes = document.querySelectorAll('.triage-tab-pane');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        tabBtns.forEach(b => {
          b.classList.remove('active');
          b.style.borderBottomColor = 'transparent';
          b.style.color = 'var(--text-muted)';
        });
        tabPanes.forEach(p => p.style.display = 'none');
        
        btn.classList.add('active');
        btn.style.borderBottomColor = 'var(--color-primary)';
        btn.style.color = 'var(--text-primary)';
        
        const target = btn.getAttribute('data-target');
        document.getElementById('t-' + target).style.display = 'block';
      });
    });

    // Hover interactive bbox
    document.querySelectorAll('.extract-item').forEach(item => {
      item.addEventListener('mouseenter', (e) => {
        const boxId = e.currentTarget.getAttribute('data-box');
        const box = document.getElementById(boxId);
        if (box) box.style.display = 'block';
        e.currentTarget.style.borderLeft = '4px solid var(--primary)';
      });
      item.addEventListener('mouseleave', (e) => {
        const boxId = e.currentTarget.getAttribute('data-box');
        const box = document.getElementById(boxId);
        if (box) box.style.display = 'none';
        e.currentTarget.style.borderLeft = 'none';
      });
    });

    // Verify Button
    const verifyBtn = document.getElementById('btn-verify-sync');
    if (verifyBtn) {
      verifyBtn.addEventListener('click', () => {
        if (window.MediRoute.components && window.MediRoute.components.showToast) {
          window.MediRoute.components.showToast('✅ Verified! EMR updated & ABDM Token issued.', 'success', 3000);
        }
        
        if (selectedPatient && window.MediRoute.store) {
          window.MediRoute.store.updatePatient(selectedPatient.id, { status: 'verified' });
        }
        
        selectedPatient = null;
        updateUI();
      });
    }

    // Editable fields
    const btnEditVitals = document.getElementById('btn-edit-vitals');
    if (btnEditVitals && window.MediRoute.components) {
        btnEditVitals.addEventListener('click', () => {
            const pt = selectedPatient;
            const content = `
                <div class="form-group mb-1"><label>BP</label><input type="text" id="v-bp" class="form-input" value="${pt.vitals.bp}"></div>
                <div class="form-group mb-1"><label>Pulse</label><input type="text" id="v-pulse" class="form-input" value="${pt.vitals.pulse}"></div>
                <div class="form-group mb-1"><label>SpO2</label><input type="text" id="v-spo2" class="form-input" value="${pt.vitals.spo2}"></div>
                <div class="form-group mb-1"><label>Temp</label><input type="text" id="v-temp" class="form-input" value="${pt.vitals.temp}"></div>
            `;
            window.MediRoute.components.createModal('Update Vitals', content, [
                { label: 'Cancel', class: 'btn--ghost' },
                { label: 'Save', class: 'btn--primary', handler: () => {
                    if (window.MediRoute.store) {
                        pt.vitals.bp = document.getElementById('v-bp').value;
                        pt.vitals.pulse = document.getElementById('v-pulse').value;
                        pt.vitals.spo2 = document.getElementById('v-spo2').value;
                        pt.vitals.temp = document.getElementById('v-temp').value;
                        window.MediRoute.store.updatePatient(pt.id, { vitals: pt.vitals });
                    }
                    updateUI();
                    return true;
                }}
            ]);
        });
    }
    
    const btnEditCc = document.getElementById('btn-edit-cc');
    if (btnEditCc) {
        btnEditCc.addEventListener('click', () => {
            if (window.MediRoute.store) {
                const newCc = document.getElementById('edit-pt-cc').value;
                selectedPatient.complaint = newCc;
                window.MediRoute.store.updatePatient(selectedPatient.id, { complaint: newCc });
                if (window.MediRoute.components.showToast) window.MediRoute.components.showToast('Chief Complaint updated', 'success');
                updateUI();
            }
        });
    }
    
    const btnEditDx = document.getElementById('btn-edit-dx');
    if (btnEditDx) {
        btnEditDx.addEventListener('click', () => {
            if (window.MediRoute.store) {
                const newDx = document.getElementById('edit-pt-dx').value;
                selectedPatient.diagnosis = newDx;
                window.MediRoute.store.updatePatient(selectedPatient.id, { diagnosis: newDx });
                if (window.MediRoute.components.showToast) window.MediRoute.components.showToast('Diagnosis updated', 'success');
                updateUI();
            }
        });
    }

    const btnAddMed = document.getElementById('btn-add-med');
    if (btnAddMed && window.MediRoute.components) {
        btnAddMed.addEventListener('click', () => {
            const content = `<div class="form-group mb-1"><label>Medication (Drug, Dose, Freq)</label><input type="text" id="new-med" class="form-input"></div>`;
            window.MediRoute.components.createModal('Add Medication', content, [
                { label: 'Cancel', class: 'btn--ghost' },
                { label: 'Add', class: 'btn--primary', handler: () => {
                    const val = document.getElementById('new-med').value;
                    if (val && window.MediRoute.store) {
                        selectedPatient.medications.push(val);
                        window.MediRoute.store.updatePatient(selectedPatient.id, { medications: selectedPatient.medications });
                        updateUI();
                    }
                    return true;
                }}
            ]);
        });
    }

    const btnAddLab = document.getElementById('btn-add-lab');
    if (btnAddLab && window.MediRoute.components) {
        btnAddLab.addEventListener('click', () => {
            const content = `
                <div class="form-group mb-1"><label>Test Name</label><input type="text" id="lab-name" class="form-input"></div>
                <div class="form-group mb-1"><label>Result Value</label><input type="text" id="lab-value" class="form-input"></div>
                <div class="form-group mb-1"><label>Status</label>
                  <select id="lab-status" class="form-select"><option value="normal">Normal</option><option value="abnormal">Abnormal</option><option value="pending">Pending</option></select>
                </div>
            `;
            window.MediRoute.components.createModal('Add Lab Result', content, [
                { label: 'Cancel', class: 'btn--ghost' },
                { label: 'Add', class: 'btn--primary', handler: () => {
                    const name = document.getElementById('lab-name').value;
                    const value = document.getElementById('lab-value').value;
                    const status = document.getElementById('lab-status').value;
                    if (name && window.MediRoute.store) {
                        selectedPatient.labs.push({ name, value, status });
                        window.MediRoute.store.updatePatient(selectedPatient.id, { labs: selectedPatient.labs });
                        updateUI();
                    }
                    return true;
                }}
            ]);
        });
    }

    // Filter clicks
    document.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active', 'btn--primary'));
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.add('btn--ghost'));
        
        e.currentTarget.classList.remove('btn--ghost');
        e.currentTarget.classList.add('active', 'btn--primary');
        
        // Note: Basic visual toggle, real app would re-render the list based on filter
        if (window.MediRoute.components && window.MediRoute.components.showToast) {
          window.MediRoute.components.showToast('Filter applied.', 'info');
        }
      });
    });
  }

  function updateUI() {
    const listContainer = document.getElementById('triage-list-container');
    const detailContainer = document.getElementById('triage-detail-container');
    
    const queue = getQueue();
    if (!selectedPatient && queue.length > 0) {
        selectedPatient = queue[0];
    }
    
    if (listContainer) {
      listContainer.innerHTML = queue.map(p => renderPatientCard(p)).join('');
    }
    
    if (detailContainer) {
      if (selectedPatient) {
        detailContainer.innerHTML = renderRightPanel();
        bindEvents(); // Rebind since DOM changed
      } else {
        detailContainer.innerHTML = `<div class="card card--glass text-center p-2"><h3 class="text-muted">No pending patients in queue.</h3></div>`;
      }
    }
  }

  window.MediRoute.pages['doctor-triage'] = {
    render() {
      return `
        <div class="page page--doctor-triage" data-animate="fade-in">
          
          <!-- Header -->
          <div class="page__header flex-between mb-2">
            <div>
              <h1 class="section-title text-gradient">Doctor Triage Portal</h1>
              <p class="section-subtitle">30-Second Clinical Review & Verification</p>
            </div>
            <div class="flex gap-1 align-center">
              <input type="text" class="form-input" placeholder="🔍 Search ABHA or Name..." style="width: 250px;">
              <button id="btn-add-walkin" class="btn btn--primary">➕ Add New Walk-in Patient</button>
              <button class="btn btn--icon btn--ghost" style="font-size: 1.5rem;">⚙️</button>
            </div>
          </div>
          
          <!-- Filter Pills -->
          <div class="flex gap-1 mb-2" style="overflow-x: auto; padding-bottom: 0.5rem;">
            <button class="btn btn--sm btn--primary filter-pill active">All Patients</button>
            <button class="btn btn--sm btn--ghost filter-pill">🚨 Red Emergency</button>
            <button class="btn btn--sm btn--ghost filter-pill">🟡 Yellow Urgent</button>
            <button class="btn btn--sm btn--ghost filter-pill">🟢 Green Routine</button>
          </div>

          <div style="display: grid; grid-template-columns: 350px 1fr; gap: 2rem; align-items: start;">
            
            <!-- Left Column: Queue -->
            <div class="triage-sidebar" style="height: calc(100vh - 250px); overflow-y: auto; padding-right: 0.5rem; scrollbar-width: thin;">
              <h3 class="mb-1 sticky" style="top:0; background:var(--bg-deep); z-index:10; padding-bottom:0.5rem; border-bottom: 1px solid var(--glass-border);">Live Queue (<span id="q-count">${getQueue().length}</span>)</h3>
              <div id="triage-list-container">
                ${getQueue().map(pt => renderPatientCard(pt)).join('')}
              </div>
            </div>
            
            <!-- Right Column: Details -->
            <div class="triage-main" id="triage-detail-container" style="height: calc(100vh - 250px); overflow-y: auto; padding-right: 0.5rem; scrollbar-width: thin;">
              ${selectedPatient ? renderRightPanel() : '<div class="card card--glass text-center p-2"><h3 class="text-muted">No pending patients in queue.</h3></div>'}
            </div>
            
          </div>
        </div>
        <style>
          /* Highlight for active triage card */
          .triage-card.active {
            background: rgba(255, 255, 255, 0.1);
            transform: scale(1.02);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          }
        `;
    },
    mount() {
      // Subscribe to store updates
      const onStoreUpdate = () => {
          updateUI();
          const qCount = document.getElementById('q-count');
          if (qCount) qCount.innerText = getQueue().length;
      };
      window.addEventListener('mediroute:dataUpdate', onStoreUpdate);
      this._storeListener = onStoreUpdate;
      
      updateUI();

      // Add walk in button logic
      const btnAddWalkin = document.getElementById('btn-add-walkin');
      if (btnAddWalkin && window.MediRoute.components) {
          btnAddWalkin.addEventListener('click', () => {
              const content = '<div class="form-group mb-1"><label>Name</label><input type="text" id="w-name" class="form-input"></div><div class="form-group mb-1"><label>Age</label><input type="number" id="w-age" class="form-input"></div><div class="form-group mb-1"><label>Gender</label><select id="w-gender" class="form-select"><option>Male</option><option>Female</option><option>Other</option></select></div><div class="form-group mb-1"><label>ABHA ID</label><input type="text" id="w-abha" class="form-input"></div><div class="form-group mb-1"><label>Chief Complaint</label><input type="text" id="w-cc" class="form-input"></div><div class="form-group mb-1"><label>Urgency</label><select id="w-urgency" class="form-select"><option value="red">Red Emergency</option><option value="yellow">Yellow Urgent</option><option value="green">Green Routine</option></select></div><div class="form-group mb-1"><label>Vitals (BP, Pulse, SpO2, Temp)</label><input type="text" id="w-vitals" class="form-input" placeholder="e.g. 120/80, 80, 98%, 98.6"></div>';
              window.MediRoute.components.createModal('Add Walk-in Patient', content, [
                  { label: 'Cancel', 'class': 'btn--ghost' },
                  { label: 'Add Patient', 'class': 'btn--primary', handler: () => {
                      if (window.MediRoute.store && window.MediRoute.store.addPatient) {
                          const vts = (document.getElementById('w-vitals').value || '120/80, 80, 98%, 98.6').split(',');
                          const newPt = {
                               id: 'pt-w-' + Math.floor(Math.random()*1000),
                               name: document.getElementById('w-name').value || 'Unknown',
                               age: document.getElementById('w-age').value || 30,
                               gender: document.getElementById('w-gender').value,
                               abha: document.getElementById('w-abha').value || 'None',
                               severity: document.getElementById('w-urgency').value,
                               severityLabel: document.getElementById('w-urgency').options[document.getElementById('w-urgency').selectedIndex].text,
                               complaint: document.getElementById('w-cc').value,
                               duration: 'Just arrived',
                               arrivalTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                               vitals: { bp: (vts[0]||'120/80').trim(), pulse: (vts[1]||'80').trim(), spo2: (vts[2]||'98%').trim(), temp: (vts[3]||'98.6').trim() },
                               redFlags: [], allergies: [], medications: [], labs: [], aiLog: [], timeline: []
                          };
                          window.MediRoute.store.addPatient(newPt);
                          selectedPatient = newPt;
                          updateUI();
                      }
                      return true;
                  }}
              ]);
          });
      }
    },
    unmount() {
      if (this._storeListener) {
          window.removeEventListener('mediroute:dataUpdate', this._storeListener);
      }
    }
  };

  window.MediRoute.pages.doctorTriage = window.MediRoute.pages['doctor-triage'];
})();
