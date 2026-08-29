/* ============================================
   MEDIROUTE — Thrilling & Relaxing AI Patient Intake Companion
   Zero Tedious Forms • 1-Tap Smart Cards • Ambient Vernacular Voice AI
   ============================================ */
(function () {
  window.MediRoute = window.MediRoute || {};
  window.MediRoute.pages = window.MediRoute.pages || {};

  let currentStep = 1;
  const TOTAL_STEPS = 10;

  const STEP_TITLES = [
    "Vernacular Language",
    "Smart Privacy Consent",
    "ABDM Health Locker",
    "Anatomical Body Map",
    "Adaptive AI Interview",
    "Red-Flag Safety Scan",
    "OCR Prescription Scan",
    "Interactive EHR Timeline",
    "AI Grounded Summary",
    "Digital Pre-Arrival QR Pass"
  ];

  const STEP_SUBTITLES = [
    "Select your native language for voice dictation",
    "Audio-guided consent & encrypted data policy",
    "Instant 1-tap ABDM Health Account link",
    "Tap the body region where you feel discomfort",
    "Speak or tap symptom chips naturally",
    "Automated clinical safety & biomarker scan",
    "AI extraction of active meds & lab values",
    "Longitudinal health records from ABDM locker",
    "Structured 30-second physician SBAR summary",
    "Sync digital pass to hospital ER triage counter"
  ];

  let intakeData = {
    name: 'Rahul Sharma',
    age: '45',
    gender: 'Male',
    language: 'English',
    consent: true,
    abha: '14-8921-3049-1234',
    chiefComplaint: 'Chest Pain',
    symptoms: 'Crushing retrosternal pain, cold sweats, dyspnea for 30 minutes.',
    bodyPart: 'Chest',
    answers: ['Chest Pain', 'Cold Sweats', 'Shortness of Breath'],
    priority: 'Red',
    extractedData: {
      medications: ['Aspirin 75mg', 'Metformin 500mg', 'Atorvastatin 20mg'],
      labs: ['HbA1c: 7.2%', 'SpO2: 95%', 'BP: 140/90 mmHg', 'ECG: ST Elevation']
    },
    timeline: [
      { date: '2 Years Ago', title: 'Diagnosed with Type 2 Diabetes', detail: 'On oral hypoglycemic therapy' },
      { date: '6 Months Ago', title: 'Hypertension Managed', detail: 'Prescribed Amlodipine 5mg' },
      { date: 'Today (Active)', title: 'Acute Retrosternal Chest Pain', detail: 'Radiating to left arm with cold sweats' }
    ]
  };

  function render() {
    const percent = Math.round((currentStep / TOTAL_STEPS) * 100);

    return `
      <div class="page page--intake animate-fade-in container py-2" style="max-width: 850px;">
        
        <!-- Relaxing Ambient AI Header -->
        <div class="card card--glass p-2 mb-2" style="border-color: rgba(0, 212, 170, 0.3); background: linear-gradient(135deg, rgba(0, 212, 170, 0.06), rgba(108, 99, 255, 0.06));">
          <div class="flex-between align-center flex-wrap gap-1">
            
            <div class="flex align-center gap-1">
              <div class="flex-center" style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); box-shadow: 0 0 16px rgba(0, 212, 170, 0.4); animation: pulse 2s infinite; font-size: 1.4rem;">
                🤖
              </div>
              <div>
                <h3 class="m-0 text-gradient text-md font-bold">MediRoute AI Care Companion</h3>
                <p class="text-xs text-muted m-0">Step ${currentStep} of ${TOTAL_STEPS}: <strong class="text-primary">${STEP_TITLES[currentStep - 1]}</strong> &bull; ${percent}% Complete</p>
              </div>
            </div>

            <!-- Voice Narrator & Sound Toggle -->
            <div class="flex align-center gap-0.5">
              <button class="btn btn--ghost btn--xs" onclick="window.MediRoute.pages.intake.speakStepPrompt()">
                🔊 Voice Guide
              </button>
              <span class="badge badge--success text-xs">✓ ABDM Verified</span>
            </div>

          </div>

          <!-- Smooth Progress Bar -->
          <div class="progress-bar-bg mt-1" style="width: 100%; height: 6px; background: var(--glass-border); border-radius: 3px; overflow: hidden;">
            <div id="intake-progress" style="width: ${percent}%; height: 100%; background: linear-gradient(90deg, var(--color-primary), var(--color-accent)); transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);"></div>
          </div>
        </div>

        <!-- Dynamic Relaxing Card Body -->
        <div class="card card--glass p-2 mb-2" id="step-content-box" style="min-height: 380px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          ${renderStep(currentStep)}
        </div>

        <!-- Navigation Buttons -->
        <div class="flex-between align-center">
          <button id="btn-prev" class="btn btn--ghost btn--md" ${currentStep === 1 ? 'disabled' : ''}>
            ⬅️ Back
          </button>

          <div class="flex align-center gap-1">
            <button class="btn btn--ghost btn--xs" onclick="window.MediRoute.pages.intake.gotoStep(9)">
              ⚡ Quick Review Pass
            </button>
            <button id="btn-next" class="btn btn--primary btn--md btn--glow">
              ${currentStep === TOTAL_STEPS ? '🚀 Hand Off to ER Doctor' : 'Continue ➡️'}
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
          <div class="text-center py-1">
            <span class="badge badge--info text-xs mb-1">🌐 Step 1: Vernacular Dictation</span>
            <h2 class="text-lg font-bold mb-0.5">Which language do you speak?</h2>
            <p class="text-xs text-muted mb-2">${STEP_SUBTITLES[0]}</p>
            
            <div class="grid grid--4 gap-1 mb-2" style="max-width: 680px; margin: 0 auto;">
              ${[
                { id: 'English', label: '🇺🇸 English' },
                { id: 'Hindi', label: '🇮🇳 Hindi (हिंदी)' },
                { id: 'Tamil', label: '🇮🇳 Tamil (தமிழ்)' },
                { id: 'Telugu', label: '🇮🇳 Telugu (తెలుగు)' },
                { id: 'Bengali', label: '🇮🇳 Bengali (বাংলা)' },
                { id: 'Marathi', label: '🇮🇳 Marathi (मराठी)' },
                { id: 'Gujarati', label: '🇮🇳 Gujarati (ગુજરાતી)' },
                { id: 'Kannada', label: '🇮🇳 Kannada (கன்னட)' }
              ].map(item => `
                <div class="card card--glass p-1 cursor-pointer lang-card flex-center text-center ${intakeData.language === item.id ? 'border-primary' : ''}" 
                     data-lang="${item.id}"
                     style="transition: all 0.2s; border: ${intakeData.language === item.id ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)'}; background: ${intakeData.language === item.id ? 'rgba(0,212,170,0.12)' : 'var(--bg-secondary)'};">
                  <strong class="text-xs">${item.label}</strong>
                </div>
              `).join('')}
            </div>

            <p class="text-xs text-secondary m-0">💡 <em>Tip: Tapping any language automatically saves your choice and advances!</em></p>
          </div>
        `;

      case 2:
        return `
          <div class="text-center py-1">
            <span class="badge badge--info text-xs mb-1">🔒 Step 2: ABDM Data Privacy</span>
            <h2 class="text-lg font-bold mb-0.5">Encrypted Clinical Consent</h2>
            <p class="text-xs text-muted mb-2">${STEP_SUBTITLES[1]}</p>

            <div class="card p-2 text-left mb-2" style="max-width: 600px; margin: 0 auto; background: var(--bg-secondary); border-radius: var(--radius-md);">
              <div class="flex-between align-center mb-1">
                <strong class="text-xs text-primary">📜 Patient Care Consent</strong>
                <button class="btn btn--ghost btn--xs" onclick="window.MediRoute.pages.intake.playAudio('I consent to sharing my clinical intake data with verified ER triage doctors and dispatchers.')">
                  🔊 Listen to Audio Consent
                </button>
              </div>
              <p class="text-xs text-secondary mb-1">
                MediRoute AI encrypts your chief complaints, vitals, and ABHA records using AES-256 standards for direct transmission to ER emergency triage.
              </p>
              
              <div class="card p-1 text-xs mb-1" style="background: rgba(0, 212, 170, 0.08); border-color: var(--color-primary);">
                ✓ Compliant with NDHM / ABDM Health Data Privacy Framework
              </div>

              <div class="card p-1 cursor-pointer text-center btn--glow mt-1" id="agree-consent-card" style="background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); color: white;">
                <strong class="text-sm">✓ Tap Here to Agree & Continue</strong>
              </div>
            </div>
          </div>
        `;

      case 3:
        return `
          <div class="py-1" style="max-width: 600px; margin: 0 auto;">
            <div class="text-center mb-1">
              <span class="badge badge--info text-xs mb-0.5">🆔 Step 3: ABDM Health Locker</span>
              <h2 class="text-lg font-bold m-0">Link ABHA Account</h2>
              <p class="text-xs text-muted m-0 mt-0.5">${STEP_SUBTITLES[2]}</p>
            </div>

            <div class="card p-2 mb-2 text-center" style="background: var(--bg-secondary);">
              <div class="text-xl mb-0.5">🆔</div>
              <strong class="text-xs text-primary block mb-0.5">Ayushman Bharat Health Account (ABHA)</strong>
              
              <div class="form-group mb-1">
                <input type="text" id="abha-input" class="form-input text-center text-md font-bold" value="${intakeData.abha}" placeholder="14-8921-3049-1234" style="letter-spacing: 2px;">
              </div>

              <div class="flex gap-1 justify-center">
                <button id="btn-demo-abha" class="btn btn--primary btn--md btn--glow w-full">
                  ⚡ 1-Tap Auto-Fetch ABHA Health Card & Records
                </button>
              </div>
            </div>

            <div class="card p-1 text-xs flex-between align-center" style="background: rgba(46, 213, 115, 0.08); border-color: var(--color-success);">
              <span><strong>Patient Name:</strong> Rahul Sharma (45M)</span>
              <span class="badge badge--success text-xs">✓ ABHA Verified</span>
            </div>
          </div>
        `;

      case 4:
        return `
          <div class="text-center py-1">
            <span class="badge badge--info text-xs mb-1">🫀 Step 4: Anatomical Selector</span>
            <h2 class="text-lg font-bold mb-0.5">Where does it hurt?</h2>
            <p class="text-xs text-muted mb-2">${STEP_SUBTITLES[3]}</p>

            <div class="grid grid--2 gap-2 align-center" style="max-width: 650px; margin: 0 auto;">
              
              <div class="card p-2 text-center flex-center flex-col" style="background: var(--bg-secondary); min-height: 220px;">
                <div style="font-size: 4.5rem; animation: pulse 2s infinite;">🧍‍♂️</div>
                <span class="badge badge--primary text-xs mt-1" id="selected-body-part">
                  Region: <strong>${intakeData.bodyPart || 'Chest'}</strong>
                </span>
              </div>

              <div class="flex flex-col gap-0.5 text-left">
                ${[
                  { id: 'Head', icon: '🧠', label: 'Head & Neurological' },
                  { id: 'Chest', icon: '🫀', label: 'Chest & Cardiac' },
                  { id: 'Abdomen', icon: '🩺', label: 'Abdomen & Stomach' },
                  { id: 'Limbs', icon: '🦴', label: 'Limbs & Joint Pain' },
                  { id: 'General', icon: '🔥', label: 'Fever & Systemic' }
                ].map(part => `
                  <button class="btn btn--ghost body-part-btn text-xs text-left p-1 ${intakeData.bodyPart === part.id ? 'btn--primary' : ''}" 
                          data-part="${part.id}"
                          style="display: flex; align-items: center; gap: 0.5rem;">
                    <span>${part.icon}</span>
                    <span>${part.label}</span>
                  </button>
                `).join('')}
              </div>

            </div>
          </div>
        `;

      case 5:
        return `
          <div class="py-1" style="max-width: 650px; margin: 0 auto;">
            <div class="text-center mb-1">
              <span class="badge badge--info text-xs mb-0.5">🧠 Step 5: AI Adaptive Voice Interview</span>
              <h2 class="text-lg font-bold m-0">Tell us what you're experiencing</h2>
              <p class="text-xs text-muted m-0 mt-0.5">${STEP_SUBTITLES[4]}</p>
            </div>

            <div class="card p-1.5 mb-1.5" style="background: rgba(108, 99, 255, 0.08); border-color: var(--color-accent);">
              <div class="flex-between align-center mb-0.5">
                <strong class="text-xs text-accent">🤖 AI Assistant Voice Prompt:</strong>
                <button class="btn btn--ghost btn--xs" onclick="window.MediRoute.pages.intake.playAudio('Describe your discomfort. Is it crushing, heavy, or radiating to your left arm?')">
                  🔊 Listen Prompt
                </button>
              </div>
              <p class="text-sm font-semibold m-0 text-primary">
                "Describe your discomfort. Is the pain crushing, heavy, or radiating to your left arm?"
              </p>
            </div>

            <div class="form-group mb-1">
              <label class="form-label text-xs">Patient Voice Transcript / Input</label>
              <div class="flex gap-0.5">
                <input type="text" id="symptom-input" class="form-input text-xs" value="${intakeData.symptoms}" placeholder="Type or click mic to speak naturally...">
                <button id="btn-mic" class="btn btn--primary btn--xs flex-shrink-0">🎤 Dictate Voice</button>
              </div>
            </div>

            <div class="text-xs text-muted mb-0.5">Or tap 1-click symptom chips:</div>
            <div class="grid grid--3 gap-0.5 mb-1" id="symptom-options-grid">
              ${[
                'Crushing Pain', 'Cold Sweats', 'Left Arm Radiation',
                'Shortness of Breath', 'Nausea', 'Dizziness'
              ].map(chip => `
                <button class="btn btn--ghost tree-option text-xs p-0.5" data-val="${chip}">💥 ${chip}</button>
              `).join('')}
            </div>
          </div>
        `;

      case 6:
        return `
          <div class="text-center py-1">
            <span class="badge badge--danger text-xs mb-1">🚨 Step 6: Corti Safety Scanner</span>
            <h2 class="text-lg font-bold mb-0.5">Red-Flag Safety Scan</h2>
            <p class="text-xs text-muted mb-2">${STEP_SUBTITLES[5]}</p>

            <div id="scanner-animation" class="mb-1" style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid var(--color-emergency); margin: 0 auto; display: flex; align-items: center; justify-content: center; animation: pulse 1.2s infinite; font-size: 2rem;">
              🔍
            </div>
            
            <strong class="text-xs text-gradient block mb-1">AI Biomarker Screening Active...</strong>

            <div class="card p-2 text-left" style="background: rgba(255, 71, 87, 0.12); border-color: var(--color-emergency); max-width: 600px; margin: 0 auto;">
              <div class="flex align-center gap-1 mb-1">
                <span class="text-xl">🚨</span>
                <div>
                  <strong class="text-xs text-danger">LEVEL-1 RED-FLAG TRIAGE SIGNAL DETECTED</strong>
                  <div class="text-xs text-muted">Immediate Resuscitation & Cath Lab Protocol Triggered</div>
                </div>
              </div>
              <ul class="text-xs text-secondary pl-1 m-0 mb-1">
                <li>&bull; <strong>Symptoms:</strong> Retrosternal Chest Pain + Diaphoresis + Left Arm Radiation</li>
                <li>&bull; <strong>Clinical Priority:</strong> Level-1 High Priority Emergency</li>
              </ul>
              <button class="btn btn--danger btn--xs w-full" onclick="window.location.hash='#emergency'">
                🚨 Tap for Immediate Ambulance Dispatch (#emergency)
              </button>
            </div>
          </div>
        `;

      case 7:
        return `
          <div class="py-1" style="max-width: 600px; margin: 0 auto;">
            <div class="text-center mb-1">
              <span class="badge badge--info text-xs mb-0.5">📷 Step 7: OCR Scanner</span>
              <h2 class="text-lg font-bold m-0">Prescription & Report OCR</h2>
              <p class="text-xs text-muted m-0 mt-0.5">${STEP_SUBTITLES[6]}</p>
            </div>

            <div id="doc-scanner" class="card p-2 text-center mb-1 cursor-pointer btn--glow" style="border: 2px dashed var(--glass-border); background: var(--bg-secondary);">
              <div class="text-xl mb-0.5">📄</div>
              <strong class="text-xs text-primary block">Tap Here to Scan Prescription or Lab Report</strong>
              <p class="text-xs text-muted m-0">Simulates Camera Scan & Auto NLP Medication Parsing</p>
            </div>

            <div id="extracted-data-box" class="card p-1 text-xs">
              <strong class="text-xs text-primary mb-0.5 block">Extracted Clinical Data:</strong>
              <div class="mb-0.5">
                <strong class="text-muted">Active Meds:</strong>
                ${intakeData.extractedData.medications.map(m => `<span class="badge badge--info text-xs ml-0.5">${m}</span>`).join('')}
              </div>
              <div>
                <strong class="text-muted">Extracted Labs:</strong>
                ${intakeData.extractedData.labs.map(l => `<span class="badge badge--primary text-xs ml-0.5">${l}</span>`).join('')}
              </div>
            </div>
          </div>
        `;

      case 8:
        return `
          <div class="py-1" style="max-width: 600px; margin: 0 auto;">
            <div class="text-center mb-1">
              <span class="badge badge--info text-xs mb-0.5">📅 Step 8: Longitudinal EHR</span>
              <h2 class="text-lg font-bold m-0">Longitudinal Health Record</h2>
              <p class="text-xs text-muted m-0 mt-0.5">${STEP_SUBTITLES[7]}</p>
            </div>

            <div class="timeline flex flex-col gap-1 pl-2" style="border-left: 2px solid var(--color-primary);">
              ${intakeData.timeline.map((item, idx) => `
                <div class="card p-1 text-xs relative" style="margin-left: 10px;">
                  <div style="position: absolute; left: -22px; top: 12px; width: 10px; height: 10px; border-radius: 50%; background: ${idx === 2 ? 'var(--color-emergency)' : 'var(--color-primary)'};"></div>
                  <div class="flex-between">
                    <strong class="text-primary">${item.title}</strong>
                    <span class="badge badge--ghost text-xs">${item.date}</span>
                  </div>
                  <p class="text-muted m-0 mt-0.5">${item.detail}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      case 9:
        return `
          <div class="py-1" style="max-width: 650px; margin: 0 auto;">
            <div class="text-center mb-1">
              <span class="badge badge--info text-xs mb-0.5">📋 Step 9: Abridge AI Grounded Note</span>
              <h2 class="text-lg font-bold m-0">Clinical Review & Summary</h2>
              <p class="text-xs text-muted m-0 mt-0.5">${STEP_SUBTITLES[8]}</p>
            </div>

            <div class="grid grid--2 gap-1 mb-1 text-xs">
              <div class="card p-1">
                <strong class="text-primary block mb-0.5">Patient Profile</strong>
                <div><strong>Name:</strong> ${intakeData.name} (${intakeData.age}M)</div>
                <div><strong>ABHA:</strong> ${intakeData.abha}</div>
                <div><strong>Language:</strong> ${intakeData.language}</div>
              </div>

              <div class="card p-1">
                <strong class="text-primary block mb-0.5">Triage Signals</strong>
                <div><strong>Region:</strong> ${intakeData.bodyPart}</div>
                <div><strong>Complaint:</strong> ${intakeData.chiefComplaint}</div>
                <div><strong>Priority:</strong> <span class="badge badge--danger text-xs">Level 1 Emergency</span></div>
              </div>
            </div>

            <div class="card p-1">
              <strong class="text-xs text-primary mb-0.5 block">🤖 Abridge AI Structured Clinical SBAR Note:</strong>
              <pre class="text-xs p-1 m-0" style="background: var(--bg-secondary); border-radius: var(--radius-sm); white-space: pre-wrap; font-family: monospace;">
S: 45M presents with acute retrosternal chest pain radiating to left arm. Associated with diaphoresis & dyspnea.
O: SpO2: 95%, BP: 140/90 mmHg. ABHA Verified. Active Meds: Aspirin, Metformin, Atorvastatin.
A: Level-1 Acute Coronary Syndrome (ACS) suspected. Red-Flag Active.
P: Immediate ALS Ambulance Dispatch & Cath Lab Pre-Arrival Handoff.
              </pre>
            </div>
          </div>
        `;

      case 10:
        return `
          <div class="text-center py-1" style="max-width: 600px; margin: 0 auto;">
            <span class="badge badge--success text-xs mb-0.5">✓ Step 10: Complete</span>
            <h2 class="text-lg font-bold mb-0.5 text-success">Digital Pre-Arrival Pass Ready!</h2>
            <p class="text-xs text-muted mb-1.5">${STEP_SUBTITLES[9]}</p>

            <div class="card p-2 mb-2 inline-block" style="background: white; border-radius: var(--radius-md);">
              <svg id="patient-qr" width="150" height="150" viewBox="0 0 100 100" style="display: block; margin: 0 auto;">
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
              <div class="text-xs text-primary font-bold mt-1">PASS #MR-9021-ABHA</div>
            </div>

            <div class="flex flex-col gap-1">
              <button class="btn btn--primary btn--md btn--glow w-full" onclick="window.MediRoute.pages.intake.completeAndHandoff()">
                🏥 Hand Off to ER Doctor Portal (#doctor-triage)
              </button>
              <button class="btn btn--danger btn--xs w-full" onclick="window.location.hash='#emergency'">
                🚨 Dispatch Emergency Ambulance (#emergency)
              </button>
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
    if (nextBtn) nextBtn.textContent = currentStep === TOTAL_STEPS ? '🚀 Hand Off to ER Doctor' : 'Continue ➡️';

    bindStepEvents(currentStep);
  }

  function nextStep() {
    if (currentStep < TOTAL_STEPS) {
      currentStep++;
      updateStepUI();
    } else {
      completeAndHandoff();
    }
  }

  function bindStepEvents(step) {
    if (step === 1) {
      document.querySelectorAll('.lang-card').forEach(card => {
        card.addEventListener('click', (e) => {
          const lang = card.dataset.lang;
          intakeData.language = lang;
          if (window.MediRoute.components?.showToast) {
            window.MediRoute.components.showToast(`🌐 Language set to ${lang}! Advancing...`);
          }
          setTimeout(nextStep, 300);
        });
      });
    } else if (step === 2) {
      const agreeCard = document.getElementById('agree-consent-card');
      if (agreeCard) {
        agreeCard.addEventListener('click', () => {
          intakeData.consent = true;
          if (window.MediRoute.components?.showToast) {
            window.MediRoute.components.showToast('✓ Privacy Consent Granted!');
          }
          setTimeout(nextStep, 300);
        });
      }
    } else if (step === 3) {
      const btnDemo = document.getElementById('btn-demo-abha');
      if (btnDemo) {
        btnDemo.addEventListener('click', () => {
          intakeData.name = 'Rahul Sharma';
          intakeData.age = '45';
          intakeData.abha = '14-8921-3049-1234';
          if (window.MediRoute.components?.showToast) {
            window.MediRoute.components.showToast('⚡ ABHA Health Records Fetched!');
          }
          setTimeout(nextStep, 300);
        });
      }
    } else if (step === 4) {
      document.querySelectorAll('.body-part-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const part = btn.dataset.part;
          intakeData.bodyPart = part;
          if (window.MediRoute.components?.showToast) {
            window.MediRoute.components.showToast(`🫀 Selected ${part} Region! Advancing...`);
          }
          setTimeout(nextStep, 300);
        });
      });
    } else if (step === 5) {
      document.querySelectorAll('.tree-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const val = btn.dataset.val;
          if (!intakeData.answers.includes(val)) intakeData.answers.push(val);
          intakeData.symptoms += ', ' + val;
          if (window.MediRoute.components?.showToast) {
            window.MediRoute.components.showToast(`Added: ${val}`);
          }
        });
      });

      const micBtn = document.getElementById('btn-mic');
      if (micBtn) {
        micBtn.addEventListener('click', () => {
          if (window.MediRoute.components?.showToast) {
            window.MediRoute.components.showToast('🎤 Voice Dictation Active...');
          }
          setTimeout(() => {
            intakeData.symptoms += ", Cold Sweats & Dyspnea";
            const input = document.getElementById('symptom-input');
            if (input) input.value = intakeData.symptoms;
          }, 1000);
        });
      }
    } else if (step === 7) {
      const scanner = document.getElementById('doc-scanner');
      if (scanner) {
        scanner.addEventListener('click', () => {
          if (window.MediRoute.components?.showToast) {
            window.MediRoute.components.showToast('📄 OCR Prescription Scanned!');
          }
        });
      }
    }
  }

  function completeAndHandoff() {
    if (window.MediRoute.store?.addPatient) {
      const newPt = {
        id: 'pt-new-' + Math.floor(Math.random() * 1000),
        name: intakeData.name || 'Rahul Sharma',
        age: intakeData.age || 45,
        gender: intakeData.gender || 'Male',
        abha: intakeData.abha || '14-8921-3049-1234',
        severity: 'red',
        severityLabel: 'Red Priority (Level 1)',
        complaint: intakeData.chiefComplaint + ' - ' + intakeData.symptoms,
        duration: '30 mins',
        arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        vitals: { bp: '140/90', pulse: '102', spo2: '95%', temp: '98.6°F' },
        redFlags: ['Acute Retrosternal Chest Pain', 'Diaphoresis', 'Left Arm Radiation'],
        allergies: ['Penicillin'],
        medications: intakeData.extractedData.medications,
        labs: intakeData.extractedData.labs.map(l => ({ name: l, status: 'normal', value: 'Attached' })),
        aiLog: ['ABDM Health Locker Verified', 'Corti Red-Flag Triggered', 'Abridge Note Generated'],
        timeline: intakeData.timeline
      };
      window.MediRoute.store.addPatient(newPt);
    }
    if (window.MediRoute.components?.showToast) {
      window.MediRoute.components.showToast('📋 Patient intake handed off to ER Doctor Triage!');
    }
    window.location.hash = '#doctor-triage';
  }

  function mount(container) {
    container.innerHTML = render();

    const btnNext = document.getElementById('btn-next');
    if (btnNext) {
      btnNext.addEventListener('click', nextStep);
    }

    const btnPrev = document.getElementById('btn-prev');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          updateStepUI();
        }
      });
    }

    bindStepEvents(currentStep);
  }

  function speakStepPrompt() {
    playAudio(`Step ${currentStep}: ${STEP_TITLES[currentStep - 1]}. ${STEP_SUBTITLES[currentStep - 1]}`);
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
    completeAndHandoff
  };

})();
