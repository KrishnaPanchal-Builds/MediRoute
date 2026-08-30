/* ============================================
   MEDIROUTE — Doctor Triage Portal & Authentication Gateway
   Multi-Doctor Login • Assigned Roster Filtering • Prominent 30-Sec AI SBAR Report
   ============================================ */
(function() {
  window.MediRoute = window.MediRoute || {};
  window.MediRoute.pages = window.MediRoute.pages || {};

  // Pre-configured Verified Doctors Roster
  const DOCTORS = [
    {
      id: 'doc-101',
      name: 'Dr. Rahul Sharma, MD',
      specialty: 'Interventional Cardiology',
      hospital: 'AIIMS New Delhi',
      avatar: '👨‍⚕️',
      email: 'dr.sharma@aiims.edu',
      license: 'MCI-89201-DEL',
      assignedIds: ['pt-101', 'pt-new-901']
    },
    {
      id: 'doc-102',
      name: 'Dr. Ananya Verma, MS',
      specialty: 'Trauma & Emergency Surgery',
      hospital: 'Safdarjung Hospital',
      avatar: '👩‍⚕️',
      email: 'dr.verma@safdarjung.in',
      license: 'MCI-44102-DEL',
      assignedIds: ['pt-102']
    },
    {
      id: 'doc-103',
      name: 'Dr. Vikram Patel, MD',
      specialty: 'Critical Care & Stroke Lead',
      hospital: 'Max Healthcare Saket',
      avatar: '👨‍⚕️',
      email: 'dr.patel@max.in',
      license: 'MCI-77309-DEL',
      assignedIds: ['pt-103']
    }
  ];

  let currentDoctor = DOCTORS[0]; // Logged in doctor state
  let currentFilter = 'my'; // 'my', 'all', 'red'
  let selectedPatient = null;

  // Base Patients Roster
  const triagePatients = [
    {
      id: 'pt-101',
      name: 'Ramesh Kumar',
      age: 58,
      gender: 'Male',
      abha: '14-8921-3049-1234',
      severity: 'red',
      severityLabel: 'Level-1 Red Emergency',
      complaint: 'Crushing retrosternal chest pain radiating to left jaw',
      duration: '45 mins',
      arrivalTime: '10:15 AM',
      vitals: { bp: '160/95', pulse: '110', spo2: '92%', temp: '98.6°F' },
      redFlags: ['Suspected Myocardial Infarction (STEMI)', 'Severe Diaphoresis', 'Hypoxia (SpO2 92%)'],
      allergies: ['Sulfa Drugs'],
      medications: ['Amlodipine 5mg', 'Metformin 500mg'],
      assignedDocId: 'doc-101',
      labs: [
        { name: 'Troponin I', status: 'abnormal', value: 'High (4.8 ng/mL)' },
        { name: '12-Lead ECG', status: 'abnormal', value: 'ST Elevation V1-V4' },
        { name: 'RBS', status: 'normal', value: '140 mg/dL' }
      ],
      sbarSummary: {
        situation: '58M presents with acute crushing retrosternal pain radiating to left jaw & diaphoresis for 45 mins.',
        background: 'Known Hypertension & Type 2 Diabetes. Active Meds: Amlodipine 5mg, Metformin 500mg.',
        assessment: 'Level-1 Acute Myocardial Infarction (STEMI Suspected). Troponin I elevated (4.8 ng/mL). AI Confidence: 98%.',
        plan: 'Cath Lab Priority Bed Reserved. 12-Lead ECG active, Dual Antiplatelet & Heparin protocol initiated.'
      },
      aiLog: [
        { q: "Can you describe the pain?", a: "It's crushing, right in the middle of my chest.", conf: "98%" },
        { q: "Does the pain travel anywhere?", a: "Yes, to my jaw and left arm.", conf: "95%" },
        { q: "Are you feeling sweaty or breathless?", a: "Yes, cold sweats and severe breathlessness.", conf: "99%" }
      ],
      timeline: [
        { date: '2023-01', event: 'Diagnosed with Hypertension' },
        { date: '2025-05', event: 'Started Amlodipine 5mg' },
        { date: 'Today 09:30', event: 'Acute chest pain onset' }
      ]
    },
    {
      id: 'pt-102',
      name: 'Sunita Sharma',
      age: 42,
      gender: 'Female',
      abha: '14-9876-5432-1098',
      severity: 'yellow',
      severityLabel: 'Level-2 Yellow Urgent',
      complaint: 'Severe abdominal pain in right lower quadrant with fever',
      duration: '12 hours',
      arrivalTime: '10:30 AM',
      vitals: { bp: '120/80', pulse: '88', spo2: '98%', temp: '101.2°F' },
      redFlags: ['Fever (101.2°F)', 'RLQ Rebound Tenderness'],
      allergies: ['Penicillin'],
      medications: ['None'],
      assignedDocId: 'doc-102',
      labs: [
        { name: 'WBC Count', status: 'abnormal', value: '15,200 /mcL' },
        { name: 'Abdominal USG', status: 'pending', value: 'Ordered' }
      ],
      sbarSummary: {
        situation: '42F presents with 12h history of RLQ abdominal pain, fever (101.2°F), and nausea.',
        background: 'No prior surgeries. Allergy: Penicillin.',
        assessment: 'Level-2 Acute Appendicitis suspected. Leukocytosis (WBC 15.2K). AI Confidence: 89%.',
        plan: 'Abdominal Ultrasound ordered. Fasting for potential appendectomy, IV hydration started.'
      },
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
      abha: '14-5555-4444-3333',
      severity: 'green',
      severityLabel: 'Level-3 Green Routine',
      complaint: 'Mild sprain in right ankle following jogging accident',
      duration: '2 days',
      arrivalTime: '11:00 AM',
      vitals: { bp: '118/75', pulse: '72', spo2: '99%', temp: '98.4°F' },
      redFlags: [],
      allergies: [],
      medications: ['Ibuprofen PRN'],
      assignedDocId: 'doc-103',
      labs: [
        { name: 'X-Ray Ankle', status: 'normal', value: 'No fracture' }
      ],
      sbarSummary: {
        situation: '34M presents with right ankle sprain after minor twisting injury while jogging.',
        background: 'No prior orthopedic injuries.',
        assessment: 'Level-3 Soft Tissue Sprain. X-ray negative for bone fracture. AI Confidence: 96%.',
        plan: 'RICE protocol (Rest, Ice, Compression, Elevation). Elastic bandage applied.'
      },
      aiLog: [
        { q: "How did the injury happen?", a: "Twisted it while jogging.", conf: "99%" },
        { q: "Can you bear weight on it?", a: "Yes, but it hurts a bit.", conf: "92%" }
      ],
      timeline: [
        { date: '2 Days Ago', event: 'Twisted ankle while running' }
      ]
    }
  ];

  // Sync to global store
  if (window.MediRoute.store) {
    triagePatients.forEach(p => {
      if (!window.MediRoute.store.patients.find(sp => sp.id === p.id)) {
        window.MediRoute.store.patients.push(p);
      }
    });
  }

  function getQueue() {
    let all = window.MediRoute.store ? window.MediRoute.store.patients : triagePatients;
    if (currentFilter === 'my' && currentDoctor) {
      return all.filter(p => p.assignedDocId === currentDoctor.id || p.severity === 'red');
    } else if (currentFilter === 'red') {
      return all.filter(p => p.severity === 'red');
    }
    return all;
  }

  function render() {
    // If not logged in, show Login Gateway
    if (!currentDoctor) {
      return renderLoginGateway();
    }

    const queue = getQueue();
    if (!selectedPatient && queue.length > 0) {
      selectedPatient = queue[0];
    }

    return `
      <div class="page page--doctortriage animate-fade-in no-scroll-emergency">
        
        <!-- Header & Logged-in Doctor Credentials -->
        <div class="card card--glass p-1 mb-1" style="border-color: rgba(0, 212, 170, 0.3);">
          <div class="flex-between align-center flex-wrap gap-1">
            <div class="flex align-center gap-1">
              <div class="avatar" style="background: var(--color-primary); color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                ${currentDoctor.avatar}
              </div>
              <div>
                <h3 class="m-0 text-gradient text-xs font-bold">${currentDoctor.name} &bull; ${currentDoctor.specialty}</h3>
                <p class="text-xs text-muted m-0">${currentDoctor.hospital} &bull; License: <strong>${currentDoctor.license}</strong></p>
              </div>
            </div>

            <!-- Filter Tabs & Doctor Switch Button -->
            <div class="flex align-center gap-0.5">
              <div class="flex gap-0.5" id="roster-filter-tabs">
                <button class="btn btn--xs ${currentFilter === 'my' ? 'btn--primary' : 'btn--ghost'}" onclick="window.MediRoute.pages['doctor-triage'].setFilter('my')">
                  ⭐ My Assigned (${queue.length})
                </button>
                <button class="btn btn--xs ${currentFilter === 'all' ? 'btn--primary' : 'btn--ghost'}" onclick="window.MediRoute.pages['doctor-triage'].setFilter('all')">
                  📋 All Department
                </button>
                <button class="btn btn--xs ${currentFilter === 'red' ? 'btn--danger' : 'btn--ghost'}" onclick="window.MediRoute.pages['doctor-triage'].setFilter('red')">
                  🚨 Level-1 Red Flags
                </button>
              </div>

              <button class="btn btn--ghost btn--xs text-danger" onclick="window.MediRoute.pages['doctor-triage'].logoutDoctor()">
                🔒 Switch Doctor
              </button>
            </div>
          </div>
        </div>

        <!-- 2-Column Main Triage Workspace -->
        <div class="emergency-viewport-split container">
          
          <!-- LEFT COLUMN: Assigned Patients Queue (35% Width) -->
          <div class="emergency-left-panel" style="overflow-y: auto;">
            <div class="flex-between align-center mb-0.5">
              <strong class="text-xs font-semibold text-primary">Patient Roster Queue</strong>
              <span class="badge badge--info text-xs">${queue.length} Patients</span>
            </div>

            <div class="flex flex-col gap-0.5">
              ${queue.map(pt => renderPatientCard(pt)).join('')}
            </div>
          </div>

          <!-- RIGHT COLUMN: Deep 30-Sec Clinical AI Report & Physician Action Hub -->
          <div class="emergency-right-panel" style="overflow-y: auto;">
            ${selectedPatient ? renderRightPanel(selectedPatient) : '<div class="card p-2 text-center text-muted">Select a patient from roster to view 30-sec AI report.</div>'}
          </div>

        </div>

      </div>
    `;
  }

  function renderLoginGateway() {
    return `
      <div class="page page--doctortriage animate-fade-in flex-center" style="min-height: calc(100vh - 100px); padding: 1rem;">
        <div class="card card--glass p-2 text-center" style="max-width: 540px; width: 100%; border-color: var(--color-primary);">
          
          <div class="flex-center mb-1">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; box-shadow: 0 0 20px rgba(0, 212, 170, 0.4);">
              👨‍⚕️
            </div>
          </div>

          <h2 class="text-gradient text-md font-bold mb-0.5">Physician Triage Portal Gateway</h2>
          <p class="text-xs text-muted mb-1.5">Sign in to view your assigned ER queue & 30-second AI clinical reports.</p>

          <!-- Quick Demo Doctor Selectors -->
          <strong class="text-xs text-primary block mb-0.5 text-left">Select Verified Physician Profile (1-Tap Login):</strong>
          <div class="flex flex-col gap-0.5 mb-1.5 text-left">
            ${DOCTORS.map(doc => `
              <div class="card card--glass p-1 cursor-pointer intake-choice-card flex-between align-center" onclick="window.MediRoute.pages['doctor-triage'].loginAsDoctor('${doc.id}')">
                <div class="flex align-center gap-1">
                  <span class="text-lg">${doc.avatar}</span>
                  <div>
                    <strong class="text-xs text-primary block">${doc.name}</strong>
                    <span class="text-xs text-muted">${doc.specialty} &bull; ${doc.hospital}</span>
                  </div>
                </div>
                <span class="badge badge--primary text-xs">Login ➡️</span>
              </div>
            `).join('')}
          </div>

          <div class="badge badge--success text-xs w-full py-0.5">
            ✓ ABDM Medical Council License & FHIR Encryption Active
          </div>

        </div>
      </div>
    `;
  }

  function renderPatientCard(pt) {
    const isSelected = selectedPatient && selectedPatient.id === pt.id;
    const badgeColor = pt.severity === 'red' ? 'danger' : (pt.severity === 'yellow' ? 'warning' : 'success');

    return `
      <div class="card card--glass intake-choice-card p-1 ${isSelected ? 'selected' : ''}" 
           onclick="window.MediRoute.pages['doctor-triage'].selectPatient('${pt.id}')"
           style="border-left: 4px solid var(--color-${badgeColor});">
        
        <div class="flex-between align-center mb-0.5">
          <strong class="text-xs text-primary">${pt.name} (${pt.age}${pt.gender[0]})</strong>
          <span class="badge badge--${badgeColor} text-xs">${pt.severityLabel}</span>
        </div>

        <div class="text-xs text-muted mb-0.5">ABHA: ${pt.abha}</div>
        <div class="text-xs text-secondary font-semibold"><strong>CC:</strong> ${pt.complaint}</div>
        
        <div class="flex-between align-center text-xs text-muted mt-0.5">
          <span>🕒 Arrived: ${pt.arrivalTime}</span>
          <span class="text-primary font-bold">SpO2: ${pt.vitals.spo2}</span>
        </div>
      </div>
    `;
  }

  function renderRightPanel(pt) {
    const badgeColor = pt.severity === 'red' ? 'danger' : (pt.severity === 'yellow' ? 'warning' : 'success');
    const sbar = pt.sbarSummary || {
      situation: `${pt.age}${pt.gender[0]} presents with ${pt.complaint}.`,
      background: `ABHA Verified: ${pt.abha}. Meds: ${pt.medications.join(', ') || 'None'}.`,
      assessment: `${pt.severityLabel}. Vitals: BP ${pt.vitals.bp}, Pulse ${pt.vitals.pulse}.`,
      plan: `Admit & sync to ${pt.severity === 'red' ? 'Emergency ICU' : 'General Ward'}.`
    };

    return `
      <!-- PROMINENT 30-SECOND AI SBAR REPORT CARD -->
      <div class="card card--glass p-1.5 mb-1" style="border-left: 4px solid var(--color-primary); background: linear-gradient(135deg, rgba(0, 212, 170, 0.08), rgba(108, 99, 255, 0.08));">
        
        <div class="flex-between align-center mb-0.5">
          <div class="flex align-center gap-0.5">
            <span class="text-lg">⚡</span>
            <strong class="text-xs text-gradient font-bold">30-SECOND STRUCTURED CLINICAL AI REPORT (Abridge SBAR)</strong>
          </div>
          <span class="badge badge--success text-xs">98% Grounded</span>
        </div>

        <div class="grid grid--2 gap-1 text-xs mb-1" style="background: var(--bg-secondary); padding: 0.75rem; border-radius: var(--radius-sm); font-family: monospace;">
          <div>
            <strong class="text-primary block">S (Situation):</strong>
            <p class="m-0 text-secondary">${sbar.situation}</p>
          </div>
          <div>
            <strong class="text-primary block">B (Background):</strong>
            <p class="m-0 text-secondary">${sbar.background}</p>
          </div>
          <div>
            <strong class="text-danger block">A (Assessment):</strong>
            <p class="m-0 text-secondary">${sbar.assessment}</p>
          </div>
          <div>
            <strong class="text-success block">P (Plan & Protocols):</strong>
            <p class="m-0 text-secondary">${sbar.plan}</p>
          </div>
        </div>

        <!-- Doctor Quick Actions Bar -->
        <div class="flex gap-0.5">
          <button class="btn btn--primary btn--xs intake-choice-card flex-1" onclick="window.MediRoute.pages['doctor-triage'].acceptPatient('${pt.id}')">
            ✓ Accept Patient & Reserve Bed
          </button>
          <button class="btn btn--warning btn--xs intake-choice-card" onclick="window.MediRoute.pages['doctor-triage'].alertOT('${pt.id}')">
            📢 Alert Cath Lab / OT
          </button>
          <button class="btn btn--ghost btn--xs intake-choice-card" onclick="window.MediRoute.pages['doctor-triage'].exportReport('${pt.id}')">
            📄 Print / Export Report
          </button>
        </div>

      </div>

      <!-- Vitals & Labs Overview Grid -->
      <div class="grid grid--2 gap-1 mb-1 text-xs">
        
        <!-- Vitals Box -->
        <div class="card card--glass p-1">
          <strong class="text-primary block mb-0.5">📊 Live Vitals Screening</strong>
          <div class="grid grid--4 gap-0.5 text-center">
            <div class="card p-0.5">
              <span class="text-muted block text-xs">BP</span>
              <strong class="${pt.severity === 'red' ? 'text-danger' : 'text-primary'}">${pt.vitals.bp}</strong>
            </div>
            <div class="card p-0.5">
              <span class="text-muted block text-xs">Pulse</span>
              <strong class="${pt.severity === 'red' ? 'text-danger' : 'text-primary'}">${pt.vitals.pulse} bpm</strong>
            </div>
            <div class="card p-0.5">
              <span class="text-muted block text-xs">SpO2</span>
              <strong class="${pt.severity === 'red' ? 'text-danger' : 'text-primary'}">${pt.vitals.spo2}</strong>
            </div>
            <div class="card p-0.5">
              <span class="text-muted block text-xs">Temp</span>
              <strong>${pt.vitals.temp}</strong>
            </div>
          </div>
        </div>

        <!-- Red Flags & Labs -->
        <div class="card card--glass p-1">
          <strong class="text-primary block mb-0.5">🚨 Critical Biomarkers & Lab Results</strong>
          <div class="flex gap-0.5 flex-wrap">
            ${pt.labs.map(l => `
              <span class="badge badge--${l.status === 'abnormal' ? 'danger' : 'success'} text-xs">${l.name}: ${l.value}</span>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- AI Branching Intake Transcript Log -->
      <div class="card card--glass p-1 text-xs">
        <strong class="text-primary block mb-0.5">💬 Ambient Voice Intake Log (Infermedica Graph)</strong>
        <div class="flex flex-col gap-0.5">
          ${pt.aiLog.map(log => `
            <div class="card p-0.5" style="background: var(--bg-secondary);">
              <div class="text-primary font-bold">Q: ${log.q}</div>
              <div class="text-secondary">A: ${log.a} <span class="badge badge--success text-xs" style="float: right;">Conf: ${log.conf}</span></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function setFilter(filter) {
    currentFilter = filter;
    selectedPatient = getQueue()[0] || null;
    updateUI();
  }

  function selectPatient(id) {
    selectedPatient = getQueue().find(p => p.id === id) || null;
    updateUI();
  }

  function loginAsDoctor(docId) {
    currentDoctor = DOCTORS.find(d => d.id === docId) || DOCTORS[0];
    if (window.MediRoute.components?.showToast) {
      window.MediRoute.components.showToast(`👨‍⚕️ Logged in as ${currentDoctor.name} (${currentDoctor.specialty})`);
    }
    currentFilter = 'my';
    selectedPatient = getQueue()[0] || null;
    updateUI();
  }

  function logoutDoctor() {
    currentDoctor = null;
    selectedPatient = null;
    updateUI();
  }

  function acceptPatient(id) {
    if (window.MediRoute.components?.showToast) {
      window.MediRoute.components.showToast(`✓ Patient accepted by ${currentDoctor.name}! Bed Reserved.`, 'success');
    }
  }

  function alertOT(id) {
    if (window.MediRoute.components?.showToast) {
      window.MediRoute.components.showToast(`📢 Cath Lab / Operating Theater Alerted for ${selectedPatient ? selectedPatient.name : 'Patient'}!`, 'warning');
    }
  }

  function exportReport(id) {
    if (window.MediRoute.components?.showToast) {
      window.MediRoute.components.showToast(`📄 30-Sec Clinical AI SBAR Report exported to PDF!`, 'info');
    }
  }

  function updateUI() {
    const content = document.getElementById('app-content');
    if (content && window.location.hash.includes('doctor-triage')) {
      content.innerHTML = render();
    }
  }

  function mount(container) {
    container.innerHTML = render();
  }

  window.MediRoute.pages['doctor-triage'] = {
    render,
    mount,
    unmount: (c) => c.innerHTML = '',
    setFilter,
    selectPatient,
    loginAsDoctor,
    logoutDoctor,
    acceptPatient,
    alertOT,
    exportReport
  };

})();
