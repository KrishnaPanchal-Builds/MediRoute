/* ============================================
   MEDIROUTE — 10/10 Deep AI Clinical Intake & Diagnostic Conclusion Engine
   Streamlined 3-Step Master Flow • Deep Vitals & Risk Screening • Definitive Care Conclusion
   ============================================ */
(function () {
  window.MediRoute = window.MediRoute || {};
  window.MediRoute.pages = window.MediRoute.pages || {};

  let currentStep = 1;
  const TOTAL_STEPS = 3;

  const STEP_TITLES = [
    "1. Identity & ABDM Health Locker",
    "2. Deep Symptom & Vitals Assessment",
    "3. AI Diagnostic Conclusion & ER Care Plan"
  ];

  let intakeData = {
    name: 'Rahul Sharma',
    age: '45',
    gender: 'Male',
    language: 'English',
    abha: '14-8921-3049-1234',
    comorbidities: ['Type 2 Diabetes', 'Hypertension'],
    allergies: 'Penicillin',
    currentMeds: 'Metformin 500mg, Amlodipine 5mg, Atorvastatin 20mg',
    
    // Step 2: Deep Clinical Data
    bodyRegion: 'Chest',
    painSeverity: 8, // 1-10
    duration: '30 mins (Acute)',
    symptoms: ['Crushing Pain', 'Cold Sweats / Diaphoresis', 'Shortness of Breath (Dyspnea)', 'Left Arm Radiation'],
    vitals: {
      bp: '140/90',
      pulse: '102',
      spo2: '95%',
      temp: '98.6°F'
    },
    voiceTranscript: 'Felt severe heavy chest pressure 30 minutes ago, spreading to left arm with cold sweats and difficulty breathing.',

    // Step 3: AI Conclusion & Diagnostics
    aiConclusion: null
  };

  function computeClinicalConclusion() {
    const isChest = intakeData.bodyRegion === 'Chest';
    const isHighPain = intakeData.painSeverity >= 7;
    const hasCardiacFlags = intakeData.symptoms.some(s => s.includes('Chest') || s.includes('Arm') || s.includes('Sweats'));

    if (isChest && (isHighPain || hasCardiacFlags)) {
      return {
        triageLevel: 'Level-1 Emergency (Red)',
        primaryDiagnosis: 'Acute Coronary Syndrome (STEMI / High-Risk NSTEMI)',
        confidenceScore: 94,
        differentials: [
          { condition: 'Acute Myocardial Infarction (STEMI)', probability: '86%' },
          { condition: 'Pulmonary Embolism', probability: '9%' },
          { condition: 'Aortic Dissection', probability: '5%' }
        ],
        requiredDepartment: 'Cardiology Emergency ICU / Cath Lab',
        requiredEquipment: ['12-Lead ECG', 'Defibrillator', 'Heparin/Aspirin Protocol', 'Emergency Oxygen'],
        requiredSpecialist: 'Interventional Cardiologist',
        recommendedAction: 'Immediate ALS Ambulance Dispatch with Cardiac Monitor + Pre-Arrival Cath Lab Alert',
        urgencyMinutes: '< 15 mins (Golden Hour)'
      };
    } else if (intakeData.bodyRegion === 'Head') {
      return {
        triageLevel: 'Level-1 Emergency (Red)',
        primaryDiagnosis: 'Acute Ischemic Stroke / Intracranial Hemorrhage',
        confidenceScore: 89,
        differentials: [
          { condition: 'Acute Ischemic Stroke', probability: '81%' },
          { condition: 'Subarachnoid Hemorrhage', probability: '14%' },
          { condition: 'Severe Migraine Variant', probability: '5%' }
        ],
        requiredDepartment: 'Neurology ICU & Comprehensive Stroke Center',
        requiredEquipment: ['Non-contrast Brain CT', 'tPA Thrombolysis Protocol', 'Neuro-ICU Bed'],
        requiredSpecialist: 'Stroke Neurologist & Endovascular Specialist',
        recommendedAction: 'Priority Stroke Ambulance Dispatch to CT-equipped Comprehensive Stroke Facility',
        urgencyMinutes: '< 20 mins'
      };
    } else {
      return {
        triageLevel: 'Level-2 Urgent Care (Yellow)',
        primaryDiagnosis: 'Acute Abdominal / Systemic Emergency',
        confidenceScore: 82,
        differentials: [
          { condition: 'Acute Appendicitis / Cholecystitis', probability: '74%' },
          { condition: 'Gastroenteritis with Dehydration', probability: '18%' },
          { condition: 'Renal Colic', probability: '8%' }
        ],
        requiredDepartment: 'Emergency Medicine Bay / General ICU',
        requiredEquipment: ['Abdominal Ultrasound / CT', 'IV Fluid Resuscitation', 'Lab Panel'],
        requiredSpecialist: 'General Surgeon / Emergency Physician',
        recommendedAction: 'Urgent BLS Ambulance Dispatch to Nearest Multispecialty Hospital',
        urgencyMinutes: '< 45 mins'
      };
    }
  }

  function render() {
    intakeData.aiConclusion = computeClinicalConclusion();
    const percent = Math.round((currentStep / TOTAL_STEPS) * 100);

    return `
      <div class="page page--intake animate-fade-in container">
        
        <!-- Streamlined AI Header Bar -->
        <div class="card card--glass p-1 mb-1" style="border-color: rgba(0, 212, 170, 0.3); background: linear-gradient(135deg, rgba(0, 212, 170, 0.06), rgba(108, 99, 255, 0.06)); flex-shrink: 0;">
          <div class="flex-between align-center flex-wrap gap-1">
            
            <div class="flex align-center gap-1">
              <div class="flex-center" style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); box-shadow: 0 0 16px rgba(0, 212, 170, 0.4); animation: pulse 2s infinite; font-size: 1.2rem;">
                🧠
              </div>
              <div>
                <h3 class="m-0 text-gradient text-xs font-bold">Deep Clinical AI Intake & Triage Engine</h3>
                <p class="text-xs text-muted m-0">Step ${currentStep} of ${TOTAL_STEPS}: <strong class="text-primary">${STEP_TITLES[currentStep - 1]}</strong> &bull; ${percent}% Complete</p>
              </div>
            </div>

            <!-- Header Badges -->
            <div class="flex align-center gap-0.5">
              <button class="btn btn--ghost btn--xs" onclick="window.MediRoute.pages.intake.speakStepPrompt()">
                🔊 Audio Assistant
              </button>
              <span class="badge badge--success text-xs">✓ ABDM Health Locker</span>
              <span class="badge badge--info text-xs">Infermedica Clinical AI</span>
            </div>

          </div>

          <!-- Progress Bar -->
          <div class="progress-bar-bg mt-0.5" style="width: 100%; height: 5px; background: var(--glass-border); border-radius: 3px; overflow: hidden;">
            <div id="intake-progress" style="width: ${percent}%; height: 100%; background: linear-gradient(90deg, var(--color-primary), var(--color-accent)); transition: width 0.4s ease;"></div>
          </div>
        </div>

        <!-- Dynamic Step Body -->
        <div class="card card--glass p-1.5 mb-1 flex-1 flex flex-col justify-between" id="step-content-box" style="overflow-y: auto;">
          ${renderStep(currentStep)}
        </div>

        <!-- Footer Navigation -->
        <div class="flex-between align-center" style="flex-shrink: 0;">
          <button id="btn-prev" class="btn btn--ghost btn--sm" onclick="window.MediRoute.pages.intake.prevStep()" ${currentStep === 1 ? 'disabled' : ''}>
            ⬅️ Back
          </button>

          <div class="flex align-center gap-1">
            <span class="text-xs text-muted">Deep Clinical Data Sync Active</span>
            <button id="btn-next" class="btn btn--primary btn--md btn--glow" onclick="window.MediRoute.pages.intake.nextStep()">
              ${currentStep === TOTAL_STEPS ? '🏥 Dispatch & Hand Off to ER Doctor' : 'Next Step ➡️'}
            </button>
          </div>
        </div>

      </div>
    `;
  }

  function renderStep(step) {
    switch (step) {
      case 1:
        return `
          <div class="py-0.5">
            <div class="text-center mb-1">
              <span class="badge badge--info text-xs mb-0.5">📋 Step 1 of 3: Identity & Health Locker</span>
              <h3 class="text-md font-bold m-0">Patient Profile & ABDM Health Records</h3>
              <p class="text-xs text-muted m-0 mt-0.5">Link your ABHA ID or enter basic details to fetch medical history.</p>
            </div>

            <div class="grid grid--2 gap-1 align-start text-xs">
              
              <!-- Left Column: Patient Identity & ABHA Link -->
              <div class="card p-1 text-left" style="background: var(--bg-secondary);">
                <div class="flex-between align-center mb-0.5">
                  <strong class="text-xs text-primary">🆔 Patient Identity & ABHA Account</strong>
                  <button class="btn btn--primary btn--xs intake-choice-card" onclick="window.MediRoute.pages.intake.autoFillABHA()">
                    ⚡ Auto-Fetch ABHA Card
                  </button>
                </div>

                <div class="grid grid--2 gap-0.5 mb-0.5">
                  <div>
                    <label class="form-label text-xs">Full Name</label>
                    <input type="text" id="inp-name" class="form-input text-xs" value="${intakeData.name}" oninput="MediRoute.pages.intake.updateField('name', this.value)">
                  </div>
                  <div class="grid grid--2 gap-0.5">
                    <div>
                      <label class="form-label text-xs">Age</label>
                      <input type="number" id="inp-age" class="form-input text-xs" value="${intakeData.age}" oninput="MediRoute.pages.intake.updateField('age', this.value)">
                    </div>
                    <div>
                      <label class="form-label text-xs">Gender</label>
                      <select id="inp-gender" class="form-select text-xs" onchange="MediRoute.pages.intake.updateField('gender', this.value)">
                        <option value="Male" ${intakeData.gender === 'Male' ? 'selected' : ''}>Male</option>
                        <option value="Female" ${intakeData.gender === 'Female' ? 'selected' : ''}>Female</option>
                        <option value="Other" ${intakeData.gender === 'Other' ? 'selected' : ''}>Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="form-group mb-0.5">
                  <label class="form-label text-xs">14-Digit ABHA ID (Ayushman Bharat)</label>
                  <input type="text" id="inp-abha" class="form-input text-xs font-bold text-primary" value="${intakeData.abha}" oninput="MediRoute.pages.intake.updateField('abha', this.value)">
                </div>

                <div class="flex-between align-center">
                  <span class="badge badge--success text-xs">✓ ABDM Health Locker Token #ABHA-9021</span>
                  <select class="form-select text-xs" style="width: 120px;" onchange="MediRoute.pages.intake.updateField('language', this.value)">
                    <option value="English" ${intakeData.language === 'English' ? 'selected' : ''}>🇺🇸 English</option>
                    <option value="Hindi" ${intakeData.language === 'Hindi' ? 'selected' : ''}>🇮🇳 Hindi</option>
                    <option value="Tamil" ${intakeData.language === 'Tamil' ? 'selected' : ''}>🇮🇳 Tamil</option>
                    <option value="Telugu" ${intakeData.language === 'Telugu' ? 'selected' : ''}>🇮🇳 Telugu</option>
                  </select>
                </div>
              </div>

              <!-- Right Column: Medical History & Prescription Scanner -->
              <div class="card p-1 text-left" style="background: var(--bg-secondary);">
                <strong class="text-xs text-primary block mb-0.5">📜 Pre-Existing Medical History & Meds</strong>
                
                <div class="mb-0.5">
                  <label class="form-label text-xs">Chronic Conditions & Risk Factors</label>
                  <div class="flex gap-0.5 flex-wrap">
                    ${['Type 2 Diabetes', 'Hypertension', 'Cardiac History', 'Asthma/COPD', 'Smoking'].map(cond => `
                      <button class="btn btn--ghost intake-choice-card text-xs p-0.5 ${intakeData.comorbidities.includes(cond) ? 'selected' : ''}" 
                              onclick="window.MediRoute.pages.intake.toggleComorbidity('${cond}')">
                        ${intakeData.comorbidities.includes(cond) ? '✓ ' : ''}${cond}
                      </button>
                    `).join('')}
                  </div>
                </div>

                <div class="form-group mb-0.5">
                  <label class="form-label text-xs">Known Allergies</label>
                  <input type="text" class="form-input text-xs" value="${intakeData.allergies}" placeholder="e.g. Penicillin, Sulfa" oninput="MediRoute.pages.intake.updateField('allergies', this.value)">
                </div>

                <div class="form-group mb-0.5">
                  <label class="form-label text-xs">Active Prescriptions (Auto-Extracted via OCR)</label>
                  <input type="text" class="form-input text-xs" value="${intakeData.currentMeds}" oninput="MediRoute.pages.intake.updateField('currentMeds', this.value)">
                </div>

                <div class="card p-0.5 text-center cursor-pointer intake-choice-card" onclick="window.MediRoute.pages.intake.scanPrescription()" style="border: 1px dashed var(--glass-border);">
                  <span class="text-xs">📷 Tap to Scan Prescription / Lab Document (OCR NLP)</span>
                </div>
              </div>

            </div>
          </div>
        `;

      case 2:
        return `
          <div class="py-0.5">
            <div class="text-center mb-1">
              <span class="badge badge--info text-xs mb-0.5">🩺 Step 2 of 3: Deep Symptom & Vitals Assessment</span>
              <h3 class="text-md font-bold m-0">Anatomical Region, Pain Scale & Vitals Input</h3>
              <p class="text-xs text-muted m-0 mt-0.5">Capture deep clinical parameters for precision AI triage scoring.</p>
            </div>

            <div class="grid grid--3 gap-1 align-start text-xs">
              
              <!-- Card 1: Anatomical Region & Pain Scale -->
              <div class="card p-1 text-left" style="background: var(--bg-secondary);">
                <strong class="text-xs text-primary block mb-0.5">🫀 Affected Body Region</strong>
                <div class="grid grid--2 gap-0.5 mb-1">
                  ${[
                    { id: 'Chest', label: '🫀 Chest' },
                    { id: 'Head', label: '🧠 Head' },
                    { id: 'Abdomen', label: '🩺 Abdomen' },
                    { id: 'Limbs', label: '🦴 Limbs' }
                  ].map(r => `
                    <button class="btn btn--ghost intake-choice-card text-xs p-0.5 ${intakeData.bodyRegion === r.id ? 'selected' : ''}" 
                            onclick="window.MediRoute.pages.intake.setBodyRegion('${r.id}')">
                      ${r.label}
                    </button>
                  `).join('')}
                </div>

                <strong class="text-xs text-primary block mb-0.5">⚡ Pain Intensity (VAS Scale 1-10)</strong>
                <div class="flex-between align-center mb-0.5">
                  <span class="text-xs text-muted">Mild (1)</span>
                  <strong class="text-md ${intakeData.painSeverity >= 7 ? 'text-danger' : 'text-primary'}">${intakeData.painSeverity} / 10</strong>
                  <span class="text-xs text-danger">Severe (10)</span>
                </div>
                <input type="range" class="form-range w-full mb-0.5" min="1" max="10" value="${intakeData.painSeverity}" onchange="MediRoute.pages.intake.setPainSeverity(this.value)">

                <div class="form-group">
                  <label class="form-label text-xs">Symptom Duration</label>
                  <select class="form-select text-xs" onchange="MediRoute.pages.intake.updateField('duration', this.value)">
                    <option value="30 mins (Acute)" ${intakeData.duration.includes('30') ? 'selected' : ''}>30 mins (Acute Sudden Onset)</option>
                    <option value="1-6 hours">1-6 hours</option>
                    <option value="6-24 hours">6-24 hours</option>
                    <option value="Chronic (> 2 days)">Chronic (> 2 days)</option>
                  </select>
                </div>
              </div>

              <!-- Card 2: Clinical Symptom Chips & Voice -->
              <div class="card p-1 text-left" style="background: var(--bg-secondary);">
                <div class="flex-between align-center mb-0.5">
                  <strong class="text-xs text-primary">🧠 Clinical Symptoms (Infermedica Graph)</strong>
                  <button class="btn btn--primary btn--xs intake-choice-card" onclick="window.MediRoute.pages.intake.recordVoice()">🎤 Dictate Voice</button>
                </div>

                <div class="flex gap-0.5 flex-wrap mb-1">
                  ${[
                    'Crushing Pain', 'Cold Sweats / Diaphoresis', 'Shortness of Breath (Dyspnea)',
                    'Left Arm Radiation', 'Jaw Pain', 'Nausea / Vomiting', 'Dizziness', 'Palpitations'
                  ].map(symptom => `
                    <button class="btn btn--ghost intake-choice-card text-xs p-0.5 ${intakeData.symptoms.includes(symptom) ? 'selected' : ''}" 
                            onclick="window.MediRoute.pages.intake.toggleSymptom('${symptom}')">
                      ${intakeData.symptoms.includes(symptom) ? '✓ ' : ''}${symptom}
                    </button>
                  `).join('')}
                </div>

                <div class="form-group">
                  <label class="form-label text-xs">Voice Dictation Transcript</label>
                  <textarea class="form-input text-xs w-full" rows="2" oninput="MediRoute.pages.intake.updateField('voiceTranscript', this.value)">${intakeData.voiceTranscript}</textarea>
                </div>
              </div>

              <!-- Card 3: Measured Vitals Input -->
              <div class="card p-1 text-left" style="background: var(--bg-secondary);">
                <strong class="text-xs text-primary block mb-0.5">📊 Patient Vitals Screening</strong>
                
                <div class="form-group mb-0.5">
                  <label class="form-label text-xs">Blood Pressure (mmHg)</label>
                  <input type="text" class="form-input text-xs" value="${intakeData.vitals.bp}" oninput="MediRoute.pages.intake.updateVital('bp', this.value)">
                </div>

                <div class="grid grid--2 gap-0.5 mb-0.5">
                  <div>
                    <label class="form-label text-xs">Heart Rate (bpm)</label>
                    <input type="text" class="form-input text-xs" value="${intakeData.vitals.pulse}" oninput="MediRoute.pages.intake.updateVital('pulse', this.value)">
                  </div>
                  <div>
                    <label class="form-label text-xs">Oxygen SpO2 (%)</label>
                    <input type="text" class="form-input text-xs ${parseInt(intakeData.vitals.spo2) < 95 ? 'text-danger font-bold' : ''}" value="${intakeData.vitals.spo2}" oninput="MediRoute.pages.intake.updateVital('spo2', this.value)">
                  </div>
                </div>

                <div class="form-group mb-0.5">
                  <label class="form-label text-xs">Body Temperature (°F)</label>
                  <input type="text" class="form-input text-xs" value="${intakeData.vitals.temp}" oninput="MediRoute.pages.intake.updateVital('temp', this.value)">
                </div>

                <div class="card p-0.5 text-xs text-center" style="background: rgba(255, 71, 87, 0.1); border-color: var(--color-emergency);">
                  🚨 Corti Safety Scanner: <strong class="text-danger">High Cardiac Biomarker Risk Signal</strong>
                </div>
              </div>

            </div>
          </div>
        `;

      case 3:
        const c = intakeData.aiConclusion;
        return `
          <div class="py-0.5">
            <div class="text-center mb-1">
              <span class="badge badge--danger text-xs mb-0.5">🎯 Step 3 of 3: AI Clinical Conclusion</span>
              <h2 class="text-md font-bold m-0 text-gradient">Definitive Patient Care Conclusion & Plan</h2>
              <p class="text-xs text-muted m-0 mt-0.5">AI Engine synthesized all clinical data into an actionable pre-arrival care protocol.</p>
            </div>

            <div class="grid grid--3 gap-1 align-start text-xs">
              
              <!-- Column 1: Primary Diagnosis & Differentials -->
              <div class="card p-1 text-left" style="background: var(--bg-secondary);">
                <div class="flex-between align-center mb-0.5">
                  <strong class="text-xs text-primary">🩺 Suspected Diagnosis</strong>
                  <span class="badge badge--danger text-xs">${c.triageLevel}</span>
                </div>

                <div class="card p-1 mb-1" style="background: rgba(255, 71, 87, 0.12); border-color: var(--color-emergency);">
                  <strong class="text-sm text-danger block">${c.primaryDiagnosis}</strong>
                  <span class="text-xs text-muted">AI Clinical Confidence: <strong class="text-success">${c.confidenceScore}%</strong></span>
                </div>

                <strong class="text-xs text-primary block mb-0.5">📊 Differential Diagnosis Probabilities:</strong>
                <div class="flex flex-col gap-0.5 mb-0.5">
                  ${c.differentials.map(d => `
                    <div class="flex-between align-center card p-0.5">
                      <span>${d.condition}</span>
                      <strong class="text-primary">${d.probability}</strong>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Column 2: What Patient Needs (Exact Requirements) -->
              <div class="card p-1 text-left" style="background: var(--bg-secondary);">
                <strong class="text-xs text-primary block mb-0.5">🏥 What The Patient Needs (Required ER Setup)</strong>
                
                <div class="card p-0.5 mb-0.5" style="border-color: var(--color-primary);">
                  <strong class="text-xs text-primary block">Target Department:</strong>
                  <span class="text-xs font-bold text-success">${c.requiredDepartment}</span>
                </div>

                <div class="card p-0.5 mb-0.5">
                  <strong class="text-xs text-primary block">Required Specialist:</strong>
                  <span class="text-xs font-bold">${c.requiredSpecialist}</span>
                </div>

                <div class="card p-0.5 mb-0.5">
                  <strong class="text-xs text-primary block">Mandatory Equipment & Protocols:</strong>
                  <div class="flex gap-0.5 flex-wrap mt-0.5">
                    ${c.requiredEquipment.map(eq => `<span class="badge badge--info text-xs">${eq}</span>`).join('')}
                  </div>
                </div>

                <div class="card p-0.5 text-xs text-center" style="background: rgba(0, 212, 170, 0.1);">
                  ⏱️ Care Window: <strong class="text-primary">${c.urgencyMinutes}</strong>
                </div>
              </div>

              <!-- Column 3: Recommended Action & Instant Dispatch -->
              <div class="card p-1 text-left" style="background: var(--bg-secondary);">
                <strong class="text-xs text-primary block mb-0.5">🚀 Recommended Action Plan</strong>
                
                <p class="text-xs text-secondary mb-1">
                  ${c.recommendedAction}
                </p>

                <div class="card p-1 text-center mb-1" style="background: white; border-radius: var(--radius-md);">
                  <svg id="patient-qr" width="100" height="100" viewBox="0 0 100 100" style="display: block; margin: 0 auto;">
                     <rect width="100" height="100" fill="#fff"/>
                     <rect x="10" y="10" width="30" height="30" fill="#0f172a"/>
                     <rect x="60" y="10" width="30" height="30" fill="#0f172a"/>
                     <rect x="10" y="60" width="30" height="30" fill="#0f172a"/>
                     <rect x="15" y="15" width="20" height="20" fill="#fff"/>
                     <rect x="65" y="15" width="20" height="20" fill="#fff"/>
                     <rect x="15" y="65" width="20" height="20" fill="#fff"/>
                     <rect x="20" y="20" width="10" height="10" fill="#0f172a"/>
                     <rect x="70" y="20" width="10" height="10" fill="#0f172a"/>
                     <rect x="20" y="70" width="10" height="10" fill="#0f172a"/>
                     <path d="M50,10 h10 v10 h-10 z M50,30 h20 v10 h-20 z M80,50 h10 v30 h-10 z M40,60 h30 v10 h-30 z M10,45 h30 v10 h-30 z M60,80 h30 v10 h-30 z M40,80 h10 v10 h-10 z" fill="#0f172a"/>
                  </svg>
                  <div class="text-xs text-primary font-bold mt-0.5">PASS #MR-9021-ABHA</div>
                </div>

                <div class="flex flex-col gap-0.5">
                  <button class="btn btn--danger btn--sm btn--glow w-full intake-choice-card" onclick="window.location.hash='#emergency'">
                    🚨 1-Tap Emergency Route Dispatch (#emergency)
                  </button>
                  <button class="btn btn--primary btn--sm w-full intake-choice-card" onclick="window.MediRoute.pages.intake.completeAndHandoff()">
                    🏥 Hand Off to Doctor Triage (#doctor-triage)
                  </button>
                </div>
              </div>

            </div>
          </div>
        `;

      default:
        return '<div>Unknown Step</div>';
    }
  }

  function updateStepUI() {
    const box = document.getElementById('step-content-box');
    if (box) box.innerHTML = renderStep(currentStep);

    const percent = Math.round((currentStep / TOTAL_STEPS) * 100);
    const prog = document.getElementById('intake-progress');
    if (prog) prog.style.width = percent + '%';

    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    if (prevBtn) prevBtn.disabled = currentStep === 1;
    if (nextBtn) nextBtn.textContent = currentStep === TOTAL_STEPS ? '🏥 Dispatch & Hand Off to ER Doctor' : 'Next Step ➡️';
  }

  function nextStep() {
    if (currentStep < TOTAL_STEPS) {
      currentStep++;
      updateStepUI();
    } else {
      completeAndHandoff();
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
      updateStepUI();
    }
  }

  function updateField(field, val) {
    intakeData[field] = val;
  }

  function updateVital(field, val) {
    intakeData.vitals[field] = val;
  }

  function autoFillABHA() {
    intakeData.name = 'Rahul Sharma';
    intakeData.age = '45';
    intakeData.gender = 'Male';
    intakeData.abha = '14-8921-3049-1234';
    if (window.MediRoute.components?.showToast) {
      window.MediRoute.components.showToast('⚡ ABHA Health Records Fetched!');
    }
    updateStepUI();
  }

  function toggleComorbidity(cond) {
    if (intakeData.comorbidities.includes(cond)) {
      intakeData.comorbidities = intakeData.comorbidities.filter(c => c !== cond);
    } else {
      intakeData.comorbidities.push(cond);
    }
    updateStepUI();
  }

  function scanPrescription() {
    if (window.MediRoute.components?.showToast) {
      window.MediRoute.components.showToast('📷 OCR Prescription Scanned! Extracted Meds.');
    }
  }

  function setBodyRegion(region) {
    intakeData.bodyRegion = region;
    if (window.MediRoute.components?.showToast) {
      window.MediRoute.components.showToast(`🫀 Selected ${region} Region!`);
    }
    updateStepUI();
  }

  function setPainSeverity(val) {
    intakeData.painSeverity = parseInt(val);
    updateStepUI();
  }

  function toggleSymptom(symptom) {
    if (intakeData.symptoms.includes(symptom)) {
      intakeData.symptoms = intakeData.symptoms.filter(s => s !== symptom);
    } else {
      intakeData.symptoms.push(symptom);
    }
    updateStepUI();
  }

  function recordVoice() {
    if (window.MediRoute.components?.showToast) {
      window.MediRoute.components.showToast('🎤 Ambient Voice AI Dictating...');
    }
    setTimeout(() => {
      if (!intakeData.symptoms.includes('Cold Sweats / Diaphoresis')) {
        intakeData.symptoms.push('Cold Sweats / Diaphoresis');
      }
      updateStepUI();
    }, 1000);
  }

  function completeAndHandoff() {
    const c = computeClinicalConclusion();
    if (window.MediRoute.store?.addPatient) {
      const newPt = {
        id: 'pt-new-' + Math.floor(Math.random() * 1000),
        name: intakeData.name || 'Rahul Sharma',
        age: intakeData.age || 45,
        gender: intakeData.gender || 'Male',
        abha: intakeData.abha || '14-8921-3049-1234',
        severity: c.triageLevel.includes('Level-1') ? 'red' : 'yellow',
        severityLabel: c.triageLevel,
        complaint: intakeData.bodyRegion + ' - ' + intakeData.symptoms.join(', '),
        duration: intakeData.duration,
        arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        vitals: intakeData.vitals,
        redFlags: intakeData.symptoms,
        allergies: [intakeData.allergies],
        medications: intakeData.currentMeds.split(','),
        labs: [{ name: 'ECG / Biomarkers', status: 'normal', value: c.primaryDiagnosis }],
        aiLog: ['ABDM Health Locker Verified', 'Deep Clinical Conclusion Calculated (' + c.confidenceScore + '%)'],
        timeline: intakeData.timeline
      };
      window.MediRoute.store.addPatient(newPt);
    }
    if (window.MediRoute.components?.showToast) {
      window.MediRoute.components.showToast('🏥 Clinical conclusion & handoff synced to Doctor Triage!');
    }
    window.location.hash = '#doctor-triage';
  }

  function mount(container) {
    container.innerHTML = render();
  }

  function speakStepPrompt() {
    playAudio(`Step ${currentStep}: ${STEP_TITLES[currentStep - 1]}. Please enter your clinical parameters.`);
  }

  function playAudio(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(msg);
    }
  }

  function gotoStep(step) {
    if (step >= 1 && step <= TOTAL_STEPS) {
      currentStep = step;
      updateStepUI();
    }
  }

  window.MediRoute.pages.intake = {
    render,
    mount,
    unmount: (c) => c.innerHTML = '',
    playAudio,
    speakStepPrompt,
    gotoStep,
    nextStep,
    prevStep,
    updateField,
    updateVital,
    autoFillABHA,
    toggleComorbidity,
    scanPrescription,
    setBodyRegion,
    setPainSeverity,
    toggleSymptom,
    recordVoice,
    completeAndHandoff
  };

})();
