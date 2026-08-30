/* ============================================
   MEDIROUTE — Clinical Command Center (Doctor & Triage System)
   Dual-Role Architecture: Triage Command Center & Doctor Clinical Workspace
   Compliant with ABDM Health Management Policy & Need-to-Know Privacy Design
   ============================================ */
(function() {
  window.MediRoute = window.MediRoute || {};
  window.MediRoute.pages = window.MediRoute.pages || {};

  // Auth & Session State
  let authRole = null; // 'doctor', 'triage', 'nurse', 'admin' or null
  let currentUser = null;
  let securityConsentAccepted = false;

  // Pre-configured Verified Users Roster
  const DEMO_USERS = {
    doctor: {
      id: 'doc-101',
      role: 'doctor',
      name: 'Dr. Rahul Sharma, MD',
      specialty: 'Interventional Cardiology',
      hospital: 'AIIMS New Delhi',
      avatar: '👨‍⚕️',
      email: 'dr.sharma@aiims.edu',
      license: 'MCI-89201-DEL'
    },
    triage: {
      id: 'trg-501',
      role: 'triage',
      name: 'Sister Priya Nair, B.Sc RN',
      specialty: 'Emergency Triage Coordinator',
      hospital: 'AIIMS New Delhi',
      avatar: '🚨',
      email: 'priya.nair@aiims.edu',
      license: 'INC-44102-DEL'
    },
    nurse: {
      id: 'nrs-202',
      role: 'nurse',
      name: 'Nurse Sunita Deshmukh',
      specialty: 'ER Trauma Nurse',
      hospital: 'AIIMS New Delhi',
      avatar: '👩‍⚕️',
      email: 'sunita.d@aiims.edu',
      license: 'INC-99120-DEL'
    },
    admin: {
      id: 'adm-901',
      role: 'admin',
      name: 'Dr. Vikram Malhotra',
      specialty: 'Chief Medical Officer & Admin',
      hospital: 'AIIMS New Delhi',
      avatar: '🏥',
      email: 'cmo@aiims.edu',
      license: 'MCI-11002-DEL'
    }
  };

  // Master Cases Database
  let casesDatabase = [
    {
      caseId: 'MR-1047',
      patientName: 'Ramesh Kumar',
      age: 58,
      gender: 'Male',
      abha: '14-8921-3049-1234',
      arrivalTime: '11:15 AM',
      waitTime: '04:12',
      priority: 'critical', // 'critical', 'high', 'moderate', 'routine'
      priorityLabel: '🔴 Critical Priority',
      chiefComplaint: 'Chest discomfort & sudden dyspnea for 2 days',
      assignedDocId: 'doc-101',
      assignedStaff: 'Dr. Rahul Sharma',
      status: 'waiting', // 'waiting', 'accepted', 'under_review', 'verified', 'escalated'
      vitals: { bp: '160/95', pulse: '110', spo2: '92%', temp: '98.6°F', resp: '24/min' },
      redFlags: ['Suspected Myocardial Infarction (STEMI)', 'High BP (160/95)', 'Hypoxia (SpO2 92%)'],
      hpi: {
        onset: '2 days ago (sudden worsening 45 mins ago)',
        course: 'Progressive crushing retrosternal pain',
        site: 'Substernal chest radiating to left jaw & shoulder',
        character: 'Heavy crushing pressure',
        severity: '8/10 on VAS Scale',
        aggravating: 'Exertion & lying flat',
        relieving: 'Sublingual Nitroglycerin (partial)',
        associated: 'Cold diaphoresis, nausea, dyspnea'
      },
      allergies: ['Sulfa Drugs (Severe Rash)', 'Penicillin (Mild)'],
      medications: ['Amlodipine 5mg OD', 'Metformin 500mg BD', 'Atorvastatin 20mg HS'],
      labs: [
        { name: 'Troponin I', status: 'abnormal', value: '4.8 ng/mL (High)' },
        { name: '12-Lead ECG', status: 'abnormal', value: 'ST Elevation V1-V4' },
        { name: 'RBS', status: 'normal', value: '140 mg/dL' }
      ],
      whatChanged: {
        newSymptoms: ['Cold diaphoresis', 'Left jaw radiation'],
        newMeds: ['Ticagrelor 180mg (Loading Dose)'],
        newLabs: ['Troponin I Elevated (4.8 ng/mL)'],
        unchanged: ['Hypertension history', 'Type 2 Diabetes']
      },
      sbarSummary: {
        situation: '58M presents with acute crushing retrosternal chest pain radiating to left jaw & diaphoresis for 45 mins.',
        background: 'Known Hypertension & Type 2 Diabetes. Active Meds: Amlodipine 5mg, Metformin 500mg.',
        assessment: 'Level-1 Acute Myocardial Infarction (STEMI Suspected). Troponin I elevated (4.8 ng/mL). AI Confidence: 98%.',
        plan: 'Cath Lab Priority Bed Reserved. 12-Lead ECG active, Dual Antiplatelet & Heparin protocol initiated.'
      },
      ayushHistory: {
        prakriti: 'Pitta-Kapha Dominant',
        vikriti: 'Vata-Pitta Agravation (Hridroga Variant)',
        tridosha: 'Vata Vitiation in Rasavaha Srotas',
        aharaVihara: 'Excessive spicy/salty diet, irregular sleep, acute mental stress'
      },
      documents: [
        { title: 'Prior ECG Report (2025)', type: 'ECG', conf: '🟢 98%', text: 'Normal Sinus Rhythm' },
        { title: 'Discharge Summary (AIIMS 2024)', type: 'Discharge', conf: '🟢 95%', text: 'Admitted for Glycemic Control' }
      ],
      audioProof: 'Felt severe crushing pressure in middle of my chest spreading to left arm with cold sweats.',
      auditTimeline: [
        { time: '11:15 AM', event: 'Case created via ABDM Pre-Arrival Pass' },
        { time: '11:16 AM', event: 'Rapid Triage Intake Started' },
        { time: '11:18 AM', event: '🚨 Red-Flag Priority Signal Detected (STEMI)' },
        { time: '11:20 AM', event: 'Case Assigned to Dr. Rahul Sharma (Cardiology)' }
      ]
    },
    {
      caseId: 'MR-1048',
      patientName: 'Sunita Sharma',
      age: 42,
      gender: 'Female',
      abha: '14-9876-5432-1098',
      arrivalTime: '11:22 AM',
      waitTime: '08:14',
      priority: 'high',
      priorityLabel: '🟠 High Priority',
      chiefComplaint: 'Severe abdominal pain localized to RLQ with fever',
      assignedDocId: 'doc-102',
      assignedStaff: 'Dr. Ananya Verma',
      status: 'under_review',
      vitals: { bp: '120/80', pulse: '88', spo2: '98%', temp: '101.2°F', resp: '18/min' },
      redFlags: ['Fever (101.2°F)', 'RLQ Rebound Tenderness'],
      hpi: {
        onset: '12 hours ago',
        course: 'Started as periumbilical dull ache, localized to RLQ',
        site: 'Right Lower Quadrant (McBurney\'s Point)',
        character: 'Sharp constant pain',
        severity: '7/10',
        aggravating: 'Coughing & walking',
        relieving: 'Lying still with knees flexed',
        associated: 'Fever, nausea, 2 episodes of vomiting'
      },
      allergies: ['Penicillin (Anaphylaxis)'],
      medications: ['None'],
      labs: [
        { name: 'WBC Count', status: 'abnormal', value: '15,200 /mcL (Leukocytosis)' },
        { name: 'Abdominal USG', status: 'pending', value: 'Ordered' }
      ],
      whatChanged: {
        newSymptoms: ['Pain localized to RLQ', 'Fever 101.2°F'],
        newMeds: ['IV Normal Saline Started'],
        newLabs: ['WBC Elevated'],
        unchanged: ['No past abdominal surgeries']
      },
      sbarSummary: {
        situation: '42F presents with 12h history of RLQ abdominal pain, fever (101.2°F), and nausea.',
        background: 'No prior abdominal surgeries. Severe allergy to Penicillin.',
        assessment: 'Level-2 Acute Appendicitis suspected. WBC 15.2K. AI Confidence: 89%.',
        plan: 'Abdominal Ultrasound ordered. Fasting for potential appendectomy.'
      },
      ayushHistory: {
        prakriti: 'Pitta Dominant',
        vikriti: 'Pitta-Kapha Samurchana (Gulma/Shoola)',
        tridosha: 'Pitta Vitiation in Annavaha Srotas',
        aharaVihara: 'Frequent oily foods, delayed meal timing'
      },
      documents: [
        { title: 'USG Report Requisition', type: 'Lab', conf: '🟢 96%', text: 'Appendicitis Protocol' }
      ],
      audioProof: 'Pain started near belly button yesterday, now it is sharp on my right lower side with fever.',
      auditTimeline: [
        { time: '11:22 AM', event: 'Case created via Emergency Walk-in' },
        { time: '11:24 AM', event: 'Assigned to Dr. Ananya Verma (Trauma Surgery)' }
      ]
    },
    {
      caseId: 'MR-1049',
      patientName: 'Aarav Mehta',
      age: 34,
      gender: 'Male',
      abha: '14-5555-4444-3333',
      arrivalTime: '11:30 AM',
      waitTime: '14:09',
      priority: 'routine',
      priorityLabel: '🟢 Routine Priority',
      chiefComplaint: 'Right ankle sprain following jogging accident',
      assignedDocId: 'doc-103',
      assignedStaff: 'Dr. Vikram Patel',
      status: 'waiting',
      vitals: { bp: '118/75', pulse: '72', spo2: '99%', temp: '98.4°F', resp: '16/min' },
      redFlags: [],
      hpi: {
        onset: '2 days ago',
        course: 'Mild swelling & tenderness',
        site: 'Right lateral malleolus',
        character: 'Aching pain on weight bearing',
        severity: '3/10',
        aggravating: 'Walking',
        relieving: 'Rest & ice',
        associated: 'Mild localized swelling'
      },
      allergies: [],
      medications: ['Ibuprofen 400mg PRN'],
      labs: [
        { name: 'X-Ray Ankle', status: 'normal', value: 'No fracture seen' }
      ],
      whatChanged: {
        newSymptoms: ['Ankle swelling'],
        newMeds: ['Ibuprofen'],
        newLabs: ['X-Ray Negative'],
        unchanged: ['Healthy baseline']
      },
      sbarSummary: {
        situation: '34M presents with right ankle sprain after minor twisting injury while jogging.',
        background: 'No prior orthopedic injuries.',
        assessment: 'Level-3 Soft Tissue Sprain. X-ray negative for bone fracture. AI Confidence: 96%.',
        plan: 'RICE protocol (Rest, Ice, Compression, Elevation). Elastic bandage applied.'
      },
      ayushHistory: {
        prakriti: 'Vata-Pitta',
        vikriti: 'Vata Abhighata (Mamsa-Snayu Kshata)',
        tridosha: 'Vata aggravation in Sandhi',
        aharaVihara: 'Regular athletic routine'
      },
      documents: [
        { title: 'Ankle X-Ray Digital Film', type: 'Radiology', conf: '🟢 99%', text: 'Intact Malleolus' }
      ],
      audioProof: 'Twisted ankle while jogging in park 2 days ago. Can walk with mild discomfort.',
      auditTimeline: [
        { time: '11:30 AM', event: 'Routine Intake Completed' }
      ]
    }
  ];

  let selectedCaseId = 'MR-1047';
  let activeTab = 'summary'; // 'summary', 'history', 'docs', 'ayush', 'verification'

  let activeAuthTab = 'signin'; // 'signin' or 'register'

  function switchAuthTab(tab) {
    activeAuthTab = tab;
    updateUI();
  }

  function handleSignIn() {
    const docId = document.getElementById('signin-doc-id')?.value.trim();
    const email = document.getElementById('signin-email')?.value.trim();
    
    if (!docId || !email) {
      if (window.MediRoute.components?.showToast) {
        window.MediRoute.components.showToast('Please enter your Doctor Registration ID and Email', 'warning');
      }
      return;
    }

    currentUser = {
      id: docId.toLowerCase(),
      role: 'doctor',
      name: docId.toUpperCase().startsWith('DR') ? docId : 'Dr. ' + docId.toUpperCase(),
      specialty: 'Clinical Specialist',
      hospital: 'Verified Emergency Center',
      avatar: '👨‍⚕️',
      email: email,
      license: docId.toUpperCase()
    };
    authRole = 'doctor';
    securityConsentAccepted = true;

    if (window.MediRoute.components?.showToast) {
      window.MediRoute.components.showToast(`🔑 Verified Practitioner ${currentUser.license} signed in successfully!`, 'success');
    }
    updateUI();
  }

  function handleRegister() {
    const name = document.getElementById('reg-name')?.value.trim();
    const license = document.getElementById('reg-license')?.value.trim();
    const specialty = document.getElementById('reg-specialty')?.value;
    const hospital = document.getElementById('reg-hospital')?.value.trim();
    const email = document.getElementById('reg-email')?.value.trim();

    if (!name || !license || !hospital || !email) {
      if (window.MediRoute.components?.showToast) {
        window.MediRoute.components.showToast('Please fill out all doctor registration fields', 'warning');
      }
      return;
    }

    currentUser = {
      id: 'doc-' + Date.now(),
      role: 'doctor',
      name: name,
      specialty: specialty || 'Emergency Medicine',
      hospital: hospital,
      avatar: '👨‍⚕️',
      email: email,
      license: license.toUpperCase()
    };
    authRole = 'doctor';
    securityConsentAccepted = true;

    if (window.MediRoute.components?.showToast) {
      window.MediRoute.components.showToast(`🎉 Welcome ${currentUser.name}! Doctor Account registered under ${currentUser.license}.`, 'success');
    }
    updateUI();
  }

  function quickLogin(roleId) {
    if (roleId === 'trg-501' || roleId === 'triage') {
      currentUser = { id: 'trg-501', role: 'triage', name: 'Sister Priya Nair, RN', specialty: 'Emergency Triage Coordinator', hospital: 'AIIMS New Delhi', avatar: '🚨', email: 'priya@aiims.edu', license: 'INC-44102-DEL' };
      authRole = 'triage';
    } else {
      currentUser = { id: 'doc-101', role: 'doctor', name: 'Dr. Rahul Sharma, MD', specialty: 'Interventional Cardiology', hospital: 'AIIMS New Delhi', avatar: '👨‍⚕️', email: 'dr.sharma@aiims.edu', license: 'MCI-89201-DEL' };
      authRole = 'doctor';
    }
    securityConsentAccepted = true;
    if (window.MediRoute.components?.showToast) {
      window.MediRoute.components.showToast(`⚡ Authenticated as ${currentUser.name} (${currentUser.specialty})`, 'success');
    }
    updateUI();
  }

  // ---- Main Page Renderer ----
  function render() {
    if (!securityConsentAccepted || !authRole) {
      return renderAuthGateway();
    }

    if (authRole === 'triage') {
      return renderTriageWorkspace();
    } else {
      return renderDoctorWorkspace();
    }
  }

  // ---- PART A: AUTHENTICATION & REGISTRATION GATEWAY ----
  function renderAuthGateway() {
    return `
      <div class="page page--doctortriage animate-fade-in flex-center py-1.5" style="min-height: calc(100vh - 80px);">
        <div class="card card--glass p-2 text-center" style="max-width: 620px; width: 100%; border-color: var(--color-primary); box-shadow: 0 12px 40px rgba(0,0,0,0.35); border-radius: var(--radius-2xl);">
          
          <!-- Header Badge Icon -->
          <div class="flex-center mb-1">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); display: flex; align-items: center; justify-content: center; font-size: 2.4rem; box-shadow: 0 0 28px rgba(0, 230, 184, 0.45);">
              👨‍⚕️
            </div>
          </div>

          <h2 class="text-gradient text-xl font-bold mb-0.25">Doctor Portal Authentication</h2>
          <p class="text-xs text-muted mb-1.5">National Medical Commission (NMC) & ABDM Verified Clinical Gateway</p>

          <!-- Interactive Toggle Tabs: Sign In vs Register -->
          <div class="flex gap-0.5 mb-1.5 p-0.5" style="background: rgba(255,255,255,0.04); border-radius: var(--radius-lg); border: 1px solid var(--glass-border);">
            <button class="btn btn--sm flex-1 ${activeAuthTab === 'signin' ? 'btn--primary' : 'btn--ghost'}" 
                    onclick="window.MediRoute.pages['doctor-triage'].switchAuthTab('signin')">
              🔑 Doctor Sign In
            </button>
            <button class="btn btn--sm flex-1 ${activeAuthTab === 'register' ? 'btn--primary' : 'btn--ghost'}" 
                    onclick="window.MediRoute.pages['doctor-triage'].switchAuthTab('register')">
              📝 Register Doctor Account
            </button>
          </div>

          ${activeAuthTab === 'signin' ? renderSignInFormHTML() : renderRegisterFormHTML()}

          <!-- 1-Tap Verified Quick Login Section -->
          <div class="mt-1.5 pt-1.5 text-left" style="border-top: 1px solid rgba(255,255,255,0.08);">
            <div class="flex-between align-center mb-0.5">
              <strong class="text-xs text-primary">⚡ 1-Tap Verified Demo Login:</strong>
              <span class="badge badge--success text-xs">Instantly Access Clinical Workspace</span>
            </div>

            <div class="grid grid--2 gap-1">
              <div class="card card--glass p-1 cursor-pointer intake-choice-card" onclick="window.MediRoute.pages['doctor-triage'].quickLogin('doc-101')">
                <div class="flex align-center gap-0.5 mb-0.5">
                  <span class="text-lg">👨‍⚕️</span>
                  <div>
                    <strong class="text-xs text-primary block">Dr. Rahul Sharma, MD</strong>
                    <span class="text-xs text-muted">Cardiology (MCI-89201-DEL)</span>
                  </div>
                </div>
                <span class="badge badge--primary text-xs w-full text-center">Login as Dr. Sharma ➡️</span>
              </div>

              <div class="card card--glass p-1 cursor-pointer intake-choice-card" onclick="window.MediRoute.pages['doctor-triage'].quickLogin('trg-501')">
                <div class="flex align-center gap-0.5 mb-0.5">
                  <span class="text-lg">🚨</span>
                  <div>
                    <strong class="text-xs text-primary block">Sister Priya Nair, RN</strong>
                    <span class="text-xs text-muted">Triage RN (INC-44102-DEL)</span>
                  </div>
                </div>
                <span class="badge badge--danger text-xs w-full text-center">Login as Triage RN ➡️</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  function renderSignInFormHTML() {
    return `
      <form onsubmit="event.preventDefault(); window.MediRoute.pages['doctor-triage'].handleSignIn();" class="text-left">
        <div class="mb-1">
          <label class="text-xs text-primary font-bold block mb-0.25">Doctor ID / Medical Registration Number</label>
          <div style="position: relative;">
            <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 0.95rem;">🆔</span>
            <input type="text" id="signin-doc-id" class="form-input text-xs"
                   placeholder="Enter your NMC / Medical License No. (e.g. MCI-89201-DEL)" required
                   style="padding-left: 36px; height: 40px; background: rgba(255,255,255,0.06); color: var(--text-primary); border-radius: var(--radius-md);">
          </div>
        </div>

        <div class="mb-1">
          <label class="text-xs text-primary font-bold block mb-0.25">Email or Mobile Number</label>
          <div style="position: relative;">
            <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 0.95rem;">✉️</span>
            <input type="text" id="signin-email" class="form-input text-xs"
                   placeholder="Enter official email or mobile" required
                   style="padding-left: 36px; height: 40px; background: rgba(255,255,255,0.06); color: var(--text-primary); border-radius: var(--radius-md);">
          </div>
        </div>

        <div class="mb-1">
          <div class="flex-between align-center mb-0.25">
            <label class="text-xs text-primary font-bold">Security Password</label>
            <a href="javascript:void(0)" onclick="alert('Password reset link sent via ABDM OTP Verification.')" class="text-xs text-accent">Forgot Password?</a>
          </div>
          <div style="position: relative;">
            <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 0.95rem;">🔒</span>
            <input type="password" id="signin-password" class="form-input text-xs"
                   placeholder="Enter your security password" required
                   style="padding-left: 36px; height: 40px; background: rgba(255,255,255,0.06); color: var(--text-primary); border-radius: var(--radius-md);">
          </div>
        </div>

        <div class="card p-0.75 text-left mb-1.5" style="background: var(--bg-secondary); border-color: var(--glass-border);">
          <label class="flex align-center gap-0.5 cursor-pointer">
            <input type="checkbox" id="chk-security-consent" checked style="width: 16px; height: 16px;">
            <span class="text-xs text-muted">Acknowledge ABDM Security Policy & Clinical Audit Logging</span>
          </label>
        </div>

        <button type="submit" class="btn btn--primary btn--md btn--glow w-full" style="height: 42px; font-weight: bold;">
          🔓 Sign In & Launch Clinical Workspace
        </button>
      </form>
    `;
  }

  function renderRegisterFormHTML() {
    return `
      <form onsubmit="event.preventDefault(); window.MediRoute.pages['doctor-triage'].handleRegister();" class="text-left">
        <div class="grid grid--2 gap-1 mb-1">
          <div>
            <label class="text-xs text-primary font-bold block mb-0.25">Full Name & Degree</label>
            <input type="text" id="reg-name" class="form-input text-xs" placeholder="e.g. Dr. Ananya Verma, MS" required style="height: 38px; background: rgba(255,255,255,0.06); color: var(--text-primary);">
          </div>
          <div>
            <label class="text-xs text-primary font-bold block mb-0.25">Medical Council Reg. No.</label>
            <input type="text" id="reg-license" class="form-input text-xs" placeholder="e.g. DEL-2026-8891" required style="height: 38px; background: rgba(255,255,255,0.06); color: var(--text-primary);">
          </div>
        </div>

        <div class="grid grid--2 gap-1 mb-1">
          <div>
            <label class="text-xs text-primary font-bold block mb-0.25">Medical Specialty</label>
            <select id="reg-specialty" class="form-input text-xs" required style="height: 38px; background: rgba(255,255,255,0.06); color: var(--text-primary);">
              <option value="" disabled selected>Select Medical Specialty</option>
              <option value="Interventional Cardiology">Interventional Cardiology</option>
              <option value="Emergency & Trauma Surgery">Emergency & Trauma Surgery</option>
              <option value="Neurology / Stroke Care">Neurology / Stroke Care</option>
              <option value="Critical Care / ICU">Critical Care / ICU</option>
              <option value="Ayurvedic Medicine & Panchakarma">Ayurvedic Medicine & Panchakarma</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-primary font-bold block mb-0.25">Hospital Affiliation</label>
            <input type="text" id="reg-hospital" class="form-input text-xs" placeholder="e.g. AIIMS New Delhi" required style="height: 38px; background: rgba(255,255,255,0.06); color: var(--text-primary);">
          </div>
        </div>

        <div class="grid grid--2 gap-1 mb-1">
          <div>
            <label class="text-xs text-primary font-bold block mb-0.25">Official Email</label>
            <input type="email" id="reg-email" class="form-input text-xs" placeholder="e.g. dr.verma@aiims.edu" required style="height: 38px; background: rgba(255,255,255,0.06); color: var(--text-primary);">
          </div>
          <div>
            <label class="text-xs text-primary font-bold block mb-0.25">Security Password</label>
            <input type="password" id="reg-password" class="form-input text-xs" placeholder="Create security password" required style="height: 38px; background: rgba(255,255,255,0.06); color: var(--text-primary);">
          </div>
        </div>

        <button type="submit" class="btn btn--success btn--glow w-full" style="height: 42px; font-weight: bold;">
          📝 Register Doctor & Open Clinical Workspace
        </button>
      </form>
    `;
  }

  // ---- PART B: TRIAGE COMMAND CENTER WORKSPACE ----
  function renderTriageWorkspace() {
    const criticalCount = casesDatabase.filter(c => c.priority === 'critical').length;
    const highCount = casesDatabase.filter(c => c.priority === 'high').length;
    const routineCount = casesDatabase.filter(c => c.priority === 'routine').length;

    return `
      <div class="page page--doctortriage animate-fade-in no-scroll-emergency">
        
        <!-- Triage Header Bar -->
        <div class="card card--glass p-1 mb-1">
          <div class="flex-between align-center flex-wrap gap-1">
            <div class="flex align-center gap-1">
              <span class="text-xl">🚨</span>
              <div>
                <h3 class="m-0 text-gradient text-xs font-bold">TRIAGE COMMAND CENTER &bull; ${currentUser.name}</h3>
                <p class="text-xs text-muted m-0">Rapid Priority Assessment & Urgent Patient Escalation Engine</p>
              </div>
            </div>

            <!-- Header Action Tools -->
            <div class="flex align-center gap-0.5">
              <button class="btn btn--danger btn--xs" onclick="window.MediRoute.pages['doctor-triage'].openNewTriageModal()">
                ➕ New Triage Case
              </button>
              <button class="btn btn--ghost btn--xs text-danger" onclick="window.MediRoute.pages['doctor-triage'].logout()">
                🔒 Logout / Switch Role
              </button>
            </div>
          </div>
        </div>

        <!-- Priority Metric Cards -->
        <div class="grid grid--4 gap-1 mb-1">
          <div class="card card--glass p-1" style="border-left: 4px solid var(--color-danger); background: rgba(255, 71, 87, 0.1);">
            <div class="flex-between align-center">
              <div>
                <div class="text-xs text-muted">🔴 Critical Priority</div>
                <div class="text-md font-bold text-danger">${criticalCount} Active</div>
              </div>
              <span class="badge badge--danger text-xs">Immediate</span>
            </div>
          </div>

          <div class="card card--glass p-1" style="border-left: 4px solid var(--color-warning); background: rgba(255, 165, 2, 0.1);">
            <div class="flex-between align-center">
              <div>
                <div class="text-xs text-muted">🟠 High Urgency</div>
                <div class="text-md font-bold text-warning">${highCount} Active</div>
              </div>
              <span class="badge badge--warning text-xs">&lt; 15 min</span>
            </div>
          </div>

          <div class="card card--glass p-1" style="border-left: 4px solid var(--color-success);">
            <div class="flex-between align-center">
              <div>
                <div class="text-xs text-muted">🟢 Routine Cases</div>
                <div class="text-md font-bold text-success">${routineCount} Active</div>
              </div>
              <span class="badge badge--success text-xs">Standard</span>
            </div>
          </div>

          <div class="card card--glass p-1" style="border-left: 4px solid var(--color-primary);">
            <div class="flex-between align-center">
              <div>
                <div class="text-xs text-muted">⏱️ Longest Wait</div>
                <div class="text-md font-bold text-primary">14:09 mins</div>
              </div>
              <span class="badge badge--info text-xs">Queue Safe</span>
            </div>
          </div>
        </div>

        <!-- Main Triage Queue Table & Action Panel -->
        <div class="card card--glass p-1 flex-1 overflow-y-auto">
          <div class="flex-between align-center mb-0.5">
            <strong class="text-xs text-primary">📋 Active Triage Queue & Escalation Roster</strong>
            <span class="text-xs text-muted">Sorted by Longest Waiting Critical Cases</span>
          </div>

          <table class="w-full text-xs" style="border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid var(--glass-border); text-align: left;">
                <th class="p-0.5">Case ID</th>
                <th class="p-0.5">Patient Name</th>
                <th class="p-0.5">Priority</th>
                <th class="p-0.5">Chief Complaint</th>
                <th class="p-0.5">Arrived</th>
                <th class="p-0.5">Assigned Doctor</th>
                <th class="p-0.5">Triage Actions</th>
              </tr>
            </thead>
            <tbody>
              ${casesDatabase.map(c => `
                <tr style="border-bottom: 1px solid var(--glass-border); background: ${c.priority === 'critical' ? 'rgba(255, 71, 87, 0.05)' : 'transparent'};">
                  <td class="p-0.5 font-bold">${c.caseId}</td>
                  <td class="p-0.5">${c.patientName} (${c.age}${c.gender[0]})</td>
                  <td class="p-0.5"><span class="badge badge--${c.priority === 'critical' ? 'danger' : (c.priority === 'high' ? 'warning' : 'success')} text-xs">${c.priorityLabel}</span></td>
                  <td class="p-0.5">${c.chiefComplaint}</td>
                  <td class="p-0.5">${c.arrivalTime} (${c.waitTime})</td>
                  <td class="p-0.5"><strong>${c.assignedStaff}</strong></td>
                  <td class="p-0.5">
                    <div class="flex gap-0.5">
                      <button class="btn btn--danger btn--xs" onclick="window.MediRoute.pages['doctor-triage'].escalateCase('${c.caseId}')">🚨 Escalate</button>
                      <button class="btn btn--primary btn--xs" onclick="window.location.hash='#emergency'">🚑 Ambulance</button>
                      <button class="btn btn--ghost btn--xs" onclick="window.location.hash='#dashboard'">🛏️ Bed</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

      </div>
    `;
  }

  // ---- PART C: DOCTOR CLINICAL WORKSPACE ----
  function renderDoctorWorkspace() {
    const currentCase = casesDatabase.find(c => c.caseId === selectedCaseId) || casesDatabase[0];
    
    return `
      <div class="page page--doctortriage animate-fade-in no-scroll-emergency">
        
        <!-- Doctor Header Credentials Bar -->
        <div class="card card--glass p-1 mb-1">
          <div class="flex-between align-center flex-wrap gap-1">
            
            <div class="flex align-center gap-1">
              <div class="avatar" style="background: var(--color-primary); color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                👨‍⚕️
              </div>
              <div>
                <h3 class="m-0 text-gradient text-xs font-bold">Good morning, ${currentUser.name}</h3>
                <p class="text-xs text-muted m-0">${currentUser.specialty} &bull; ${currentUser.hospital} (License: ${currentUser.license})</p>
              </div>
            </div>

            <!-- Queue Filters & Role Switch -->
            <div class="flex align-center gap-0.5">
              <div class="flex gap-0.5">
                <button class="btn btn--xs ${currentFilter === 'my' ? 'btn--primary' : 'btn--ghost'}" onclick="window.MediRoute.pages['doctor-triage'].setFilter('my')">
                  ⭐ My Assigned Queue
                </button>
                <button class="btn btn--xs ${currentFilter === 'all' ? 'btn--primary' : 'btn--ghost'}" onclick="window.MediRoute.pages['doctor-triage'].setFilter('all')">
                  📋 All ER Queue
                </button>
                <button class="btn btn--xs ${currentFilter === 'red' ? 'btn--danger' : 'btn--ghost'}" onclick="window.MediRoute.pages['doctor-triage'].setFilter('red')">
                  🚨 Level-1 Critical
                </button>
              </div>

              <button class="btn btn--ghost btn--xs text-danger" onclick="window.MediRoute.pages['doctor-triage'].logout()">
                🔒 Switch Role / Doctor
              </button>
            </div>

          </div>
        </div>

        <!-- 2-Column Doctor Workspace Split -->
        <div class="emergency-viewport-split container">
          
          <!-- LEFT COLUMN: Roster Queue Cards (34% Width) -->
          <div class="emergency-left-panel" style="overflow-y: auto;">
            <div class="flex-between align-center mb-0.5">
              <strong class="text-xs text-primary">Patient Roster Queue</strong>
              <span class="badge badge--info text-xs">${casesDatabase.length} Cases</span>
            </div>

            <div class="flex flex-col gap-0.5">
              ${casesDatabase.map(c => `
                <div class="card card--glass intake-choice-card p-1 ${c.caseId === selectedCaseId ? 'selected' : ''}"
                     onclick="window.MediRoute.pages['doctor-triage'].selectCase('${c.caseId}')"
                     style="border-left: 4px solid var(--color-${c.priority === 'critical' ? 'danger' : (c.priority === 'high' ? 'warning' : 'success')});">
                  
                  <div class="flex-between align-center mb-0.5">
                    <strong class="text-xs text-primary">${c.patientName} (${c.age}${c.gender[0]}) &bull; ${c.caseId}</strong>
                    <span class="badge badge--${c.priority === 'critical' ? 'danger' : 'warning'} text-xs">${c.priorityLabel}</span>
                  </div>

                  <div class="text-xs text-secondary mb-0.5"><strong>CC:</strong> ${c.chiefComplaint}</div>
                  <div class="flex-between align-center text-xs text-muted">
                    <span>Arrived: ${c.arrivalTime}</span>
                    <span class="text-primary font-bold">SpO2: ${c.vitals.spo2}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- RIGHT COLUMN: Multi-Tab Doctor Clinical Case File (66% Width) -->
          <div class="emergency-right-panel" style="overflow-y: auto;">
            
            <!-- Clinical Case Tabs Bar -->
            <div class="card card--glass p-0.5 mb-1 flex gap-0.5 overflow-x-auto">
              <button class="btn btn--xs ${activeTab === 'summary' ? 'btn--primary' : 'btn--ghost'}" onclick="window.MediRoute.pages['doctor-triage'].setActiveTab('summary')">
                ⚡ 30-Sec AI SBAR View
              </button>
              <button class="btn btn--xs ${activeTab === 'history' ? 'btn--primary' : 'btn--ghost'}" onclick="window.MediRoute.pages['doctor-triage'].setActiveTab('history')">
                📜 Full Clinical History
              </button>
              <button class="btn btn--xs ${activeTab === 'docs' ? 'btn--primary' : 'btn--ghost'}" onclick="window.MediRoute.pages['doctor-triage'].setActiveTab('docs')">
                📄 Document Intelligence
              </button>
              <button class="btn btn--xs ${activeTab === 'ayush' ? 'btn--primary' : 'btn--ghost'}" onclick="window.MediRoute.pages['doctor-triage'].setActiveTab('ayush')">
                🌿 AYUSH History
              </button>
              <button class="btn btn--xs ${activeTab === 'verification' ? 'btn--primary' : 'btn--ghost'}" onclick="window.MediRoute.pages['doctor-triage'].setActiveTab('verification')">
                ✏️ Verification & EMR
              </button>
            </div>

            <!-- Tab Content Renderers -->
            ${renderTabContent(currentCase)}

          </div>

        </div>

      </div>
    `;
  }

  function renderTabContent(c) {
    switch (activeTab) {
      case 'summary':
        return `
          <!-- ⚡ 30-SECOND PATIENT LANDING VIEW -->
          <div class="card card--glass p-1.5 mb-1" style="border-left: 4px solid var(--color-primary); background: linear-gradient(135deg, rgba(0, 212, 170, 0.08), rgba(108, 99, 255, 0.08));">
            <div class="flex-between align-center mb-0.5">
              <div class="flex align-center gap-0.5">
                <span class="text-lg">⚡</span>
                <strong class="text-xs text-gradient font-bold">30-SECOND PATIENT VIEW (Abridge SBAR Summary)</strong>
              </div>
              <span class="badge badge--success text-xs">✓ ABDM Verified</span>
            </div>

            <div class="grid grid--2 gap-1 text-xs mb-1" style="background: var(--bg-secondary); padding: 0.75rem; border-radius: var(--radius-sm); font-family: monospace;">
              <div>
                <strong class="text-primary block">S (Situation):</strong>
                <p class="m-0 text-secondary">${c.sbarSummary.situation}</p>
              </div>
              <div>
                <strong class="text-primary block">B (Background):</strong>
                <p class="m-0 text-secondary">${c.sbarSummary.background}</p>
              </div>
              <div>
                <strong class="text-danger block">A (Assessment):</strong>
                <p class="m-0 text-secondary">${c.sbarSummary.assessment}</p>
              </div>
              <div>
                <strong class="text-success block">P (Plan & Protocols):</strong>
                <p class="m-0 text-secondary">${c.sbarSummary.plan}</p>
              </div>
            </div>

            <div class="flex gap-0.5">
              <button class="btn btn--primary btn--xs intake-choice-card flex-1" onclick="window.MediRoute.pages['doctor-triage'].acceptCase('${c.caseId}')">
                ✓ Accept Case & Reserve Bed
              </button>
              <button class="btn btn--danger btn--xs intake-choice-card" onclick="window.MediRoute.pages['doctor-triage'].escalateCase('${c.caseId}')">
                🚨 Escalate to Triage
              </button>
              <button class="btn btn--ghost btn--xs intake-choice-card" onclick="window.location.hash='#emergency'">
                🚑 Request Ambulance
              </button>
            </div>
          </div>

          <!-- WHAT CHANGED? SECTION -->
          <div class="card card--glass p-1 mb-1 text-xs">
            <strong class="text-xs text-primary block mb-0.5">🔄 WHAT CHANGED SINCE LAST VISIT?</strong>
            <div class="grid grid--2 gap-0.5">
              <div class="card p-0.5" style="background: rgba(255,71,87,0.08);">
                <strong class="text-danger">🆕 New Symptoms & Signs:</strong>
                <ul class="m-0 pl-1 text-muted">
                  ${c.whatChanged.newSymptoms.map(s => `<li>${s}</li>`).join('')}
                </ul>
              </div>
              <div class="card p-0.5" style="background: rgba(0,212,170,0.08);">
                <strong class="text-primary">🆕 New Meds & Labs:</strong>
                <ul class="m-0 pl-1 text-muted">
                  ${c.whatChanged.newMeds.concat(c.whatChanged.newLabs).map(m => `<li>${m}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        `;

      case 'history':
        return `
          <!-- FULL CLINICAL HISTORY STRUCTURE (HPI, Past, Drug, Allergies, Family) -->
          <div class="card card--glass p-1.5 text-xs">
            <strong class="text-xs text-primary block mb-1">📜 Full Clinical History & Structured HPI</strong>
            
            <div class="grid grid--2 gap-1 mb-1">
              <div class="card p-1">
                <strong class="text-primary block mb-0.5">History of Present Illness (HPI)</strong>
                <div><strong>Onset:</strong> ${c.hpi.onset}</div>
                <div><strong>Course:</strong> ${c.hpi.course}</div>
                <div><strong>Site & Character:</strong> ${c.hpi.site} (${c.hpi.character})</div>
                <div><strong>Severity:</strong> ${c.hpi.severity}</div>
                <div><strong>Aggravating / Relieving:</strong> ${c.hpi.aggravating} / ${c.hpi.relieving}</div>
              </div>

              <div class="card p-1">
                <strong class="text-primary block mb-0.5">Allergies & Active Medications</strong>
                <div class="mb-0.5">
                  <strong class="text-danger block">Allergies:</strong>
                  ${c.allergies.map(a => `<span class="badge badge--danger text-xs ml-0.5">${a}</span>`).join('')}
                </div>
                <div>
                  <strong class="text-primary block">Active Meds:</strong>
                  ${c.medications.map(m => `<span class="badge badge--info text-xs ml-0.5">${m}</span>`).join('')}
                </div>
              </div>
            </div>

            <!-- Voice Proof Audio Player -->
            <div class="card p-1 text-xs" style="background: var(--bg-secondary);">
              <div class="flex-between align-center">
                <span>🎤 Patient Voice Statement Evidence: <em>"${c.audioProof}"</em></span>
                <button class="btn btn--ghost btn--xs" onclick="window.MediRoute.pages['doctor-triage'].playAudio('${c.audioProof}')">
                  🔊 Play Original Audio
                </button>
              </div>
            </div>
          </div>
        `;

      case 'docs':
        return `
          <!-- DOCUMENT INTELLIGENCE & BOUNDING BOX MAPPING -->
          <div class="card card--glass p-1.5 text-xs">
            <div class="flex-between align-center mb-1">
              <strong class="text-xs text-primary">📄 Document Intelligence & OCR Extraction</strong>
              <span class="badge badge--info text-xs">98% Grounded Source Evidence</span>
            </div>

            <div class="grid grid--2 gap-1 align-start">
              <div class="card p-1 text-center" style="background: var(--bg-secondary); border: 1px dashed var(--glass-border); min-height: 180px;">
                <div class="text-xl mb-0.5">📄</div>
                <strong class="text-xs text-primary block">Original Document Scan (${c.patientName})</strong>
                <p class="text-xs text-muted m-0 mt-0.5">Extracted: Amlodipine 5mg OD • Metformin 500mg BD</p>
                <div class="badge badge--success text-xs mt-1">✓ Source Bounding Boxes Active</div>
              </div>

              <div>
                <strong class="text-xs text-primary block mb-0.5">Extracted Medical Data:</strong>
                <div class="flex flex-col gap-0.5">
                  ${c.documents.map(doc => `
                    <div class="card p-0.5 intake-choice-card">
                      <div class="flex-between">
                        <strong>${doc.title}</strong>
                        <span class="text-xs text-success">${doc.conf}</span>
                      </div>
                      <div class="text-muted mt-0.5">${doc.text}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        `;

      case 'ayush':
        return `
          <!-- 🌿 AYUSH CLINICAL WORKSPACE -->
          <div class="card card--glass p-1.5 text-xs">
            <strong class="text-xs text-success block mb-1">🌿 AYUSH Traditional Medicine Profile</strong>
            
            <div class="grid grid--2 gap-1">
              <div class="card p-1">
                <strong class="text-primary block mb-0.5">Prakriti & Vikriti Assessment</strong>
                <div><strong>Prakriti (Constitutional Type):</strong> ${c.ayushHistory.prakriti}</div>
                <div><strong>Vikriti (Imbalance):</strong> ${c.ayushHistory.vikriti}</div>
                <div><strong>Tridosha State:</strong> ${c.ayushHistory.tridosha}</div>
              </div>

              <div class="card p-1">
                <strong class="text-primary block mb-0.5">Ahara & Vihara Lifestyle Factors</strong>
                <p class="m-0 text-muted">${c.ayushHistory.aharaVihara}</p>
              </div>
            </div>
          </div>
        `;

      case 'verification':
        return `
          <!-- PHYSICIAN VERIFICATION & EMR SYNC -->
          <div class="card card--glass p-1.5 text-xs">
            <strong class="text-xs text-primary block mb-1">✏️ Physician Review, Verification & EMR Token Sync</strong>
            
            <div class="form-group mb-1">
              <label class="form-label text-xs">Primary Impression / Diagnosis</label>
              <input type="text" id="inp-dx" class="form-input text-xs" value="${c.sbarSummary.assessment}">
            </div>

            <div class="form-group mb-1">
              <label class="form-label text-xs">Final Disposition</label>
              <select class="form-select text-xs">
                <option value="icu" ${c.priority === 'critical' ? 'selected' : ''}>Admit to Emergency ICU / Cath Lab</option>
                <option value="ward">Admit to General Ward</option>
                <option value="opd">OPD Discharge</option>
              </select>
            </div>

            <button class="btn btn--primary btn--md btn--glow w-full" onclick="window.MediRoute.pages['doctor-triage'].verifyAndSync('${c.caseId}')">
              ✓ Confirm Physician Verification & Issue ABDM EMR Token
            </button>
          </div>
        `;

      default:
        return '<div>Select a tab above</div>';
    }
  }

  // ---- CONTROLLERS & ACTIONS ----
  function selectDemoRole(role) {
    authRole = role;
    currentUser = DEMO_USERS[role] || DEMO_USERS.doctor;
  }

  function proceedWithLogin() {
    const chk = document.getElementById('chk-security-consent');
    if (chk && chk.checked) {
      securityConsentAccepted = true;
      if (window.MediRoute.components?.showToast) {
        window.MediRoute.components.showToast(`🔓 Authenticated as ${currentUser.name} (${currentUser.specialty})`);
      }
      updateUI();
    } else {
      if (window.MediRoute.components?.showToast) {
        window.MediRoute.components.showToast('Please acknowledge security consent to proceed', 'error');
      }
    }
  }

  function logout() {
    authRole = null;
    currentUser = null;
    securityConsentAccepted = false;
    updateUI();
  }

  function selectCase(id) {
    selectedCaseId = id;
    updateUI();
  }

  function setActiveTab(tab) {
    activeTab = tab;
    updateUI();
  }

  function setFilter(f) {
    currentFilter = f;
    updateUI();
  }

  function acceptCase(id) {
    if (window.MediRoute.components?.showToast) {
      window.MediRoute.components.showToast(`✓ Case ${id} accepted by ${currentUser.name}! ICU Bed Reserved.`, 'success');
    }
  }

  function escalateCase(id) {
    if (window.MediRoute.components?.showToast) {
      window.MediRoute.components.showToast(`🚨 Case ${id} escalated to Triage Command Center!`, 'warning');
    }
  }

  function verifyAndSync(id) {
    if (window.MediRoute.components?.showToast) {
      window.MediRoute.components.showToast(`✓ Case ${id} Verified by ${currentUser.name}! ABDM Token Issued.`, 'success');
    }
  }

  function playAudio(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(msg);
    }
  }

  function openNewTriageModal() {
    if (window.MediRoute.components?.showToast) {
      window.MediRoute.components.showToast('🚨 Opening Rapid Triage Intake Modal...');
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
    switchAuthTab,
    handleSignIn,
    handleRegister,
    quickLogin,
    selectDemoRole,
    proceedWithLogin,
    logout,
    selectCase,
    setActiveTab,
    setFilter,
    acceptCase,
    escalateCase,
    verifyAndSync,
    playAudio,
    openNewTriageModal
  };

})();
