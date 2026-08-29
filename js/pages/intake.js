/* ============================================
   MEDIROUTE — AI Intake & ABDM Health Locker (Generation 4 Care Engine)
   Grounded in Competitor Research: Infermedica, Abridge, Suki, ABDM Health Account
   ============================================ */
(function () {
  window.MediRoute = window.MediRoute || {};
  window.MediRoute.pages = window.MediRoute.pages || {};

  let currentStep = 1;
  const TOTAL_STEPS = 10;

  const STEP_TITLES = [
    "Language & Accessibility",
    "Consent & Data Privacy",
    "ABDM Health Account (ABHA)",
    "Anatomical Body Selector",
    "Adaptive AI Clinical Interview",
    "Red-Flag Safety Scan",
    "Document & OCR Scanner",
    "Interactive Health Timeline",
    "Clinical Verification & Summary",
    "Digital Pre-Arrival QR Pass"
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
    return `
      <div class="page page--intake animate-fade-in container py-2">
        
        <!-- Header & Stepper Bar -->
        <div class="card card--glass p-2 mb-2">
          <div class="flex-between align-center mb-1 flex-wrap gap-1">
            <div>
              <div class="flex align-center gap-1">
                <h2 class="m-0 text-gradient text-lg">📋 AI Patient Intake & ABDM Health Locker</h2>
                <span class="badge badge--info text-xs">Powered by Infermedica & Abridge AI</span>
              </div>
              <p class="text-xs text-muted m-0 mt-0.5">Step <span id="current-step-display">${currentStep}</span> of ${TOTAL_STEPS}: <strong>${STEP_TITLES[currentStep - 1]}</strong></p>
            </div>

            <!-- Language & Voice Bar -->
            <div class="flex align-center gap-1">
              <select id="lang-selector" class="form-select text-xs" style="width: 140px;">
                <option value="English" ${intakeData.language === 'English' ? 'selected' : ''}>🇺🇸 English</option>
                <option value="Hindi" ${intakeData.language === 'Hindi' ? 'selected' : ''}>🇮🇳 Hindi (हिंदी)</option>
                <option value="Tamil" ${intakeData.language === 'Tamil' ? 'selected' : ''}>🇮🇳 Tamil (தமிழ்)</option>
                <option value="Telugu" ${intakeData.language === 'Telugu' ? 'selected' : ''}>🇮🇳 Telugu (తెలుగు)</option>
                <option value="Bengali" ${intakeData.language === 'Bengali' ? 'selected' : ''}>🇮🇳 Bengali (বাংলা)</option>
                <option value="Marathi" ${intakeData.language === 'Marathi' ? 'selected' : ''}>🇮🇳 Marathi (मराठी)</option>
                <option value="Gujarati" ${intakeData.language === 'Gujarati' ? 'selected' : ''}>🇮🇳 Gujarati (ગુજરાતી)</option>
              </select>

              <button id="voice-narration-btn" class="btn btn--ghost btn--xs" onclick="window.MediRoute.pages.intake.speakStepPrompt()">
                🔊 Voice Guide
              </button>
            </div>
          </div>

          <!-- Visual Progress Bar -->
          <div class="progress-bar-bg" style="width: 100%; height: 6px; background: var(--glass-border); border-radius: 3px; overflow: hidden;">
            <div id="intake-progress" style="width: ${(currentStep / TOTAL_STEPS) * 100}%; height: 100%; background: linear-gradient(90deg, var(--color-primary), var(--color-accent)); transition: width 0.3s ease;"></div>
          </div>
        </div>

        <!-- Dynamic Step Content Body -->
        <div class="card card--glass p-2 mb-2" id="step-content-box" style="min-height: 380px;">
          ${renderStep(currentStep)}
        </div>

        <!-- Navigation Buttons -->
        <div class="flex-between align-center">
          <button id="btn-prev" class="btn btn--ghost btn--md" ${currentStep === 1 ? 'disabled' : ''}>
            ⬅️ Back
          </button>

          <div class="flex align-center gap-1">
            <button class="btn btn--outline btn--xs" onclick="window.MediRoute.pages.intake.gotoStep(9)">
              ⏩ Skip to Review
            </button>
            <button id="btn-next" class="btn btn--primary btn--md btn--glow">
              ${currentStep === TOTAL_STEPS ? '🚀 Hand Off to ER Doctor' : 'Next Step ➡️'}
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
            <h3 class="text-md font-bold mb-1">🌐 Select Preferred Vernacular Language</h3>
            <p class="text-xs text-muted mb-2">Voice assistant & clinical questions will adapt to your choice.</p>
            
            <div class="grid grid--4 gap-1 mb-2" style="max-width: 600px; margin: 0 auto;">
              <button class="btn btn--ghost lang-btn ${intakeData.language === 'English' ? 'btn--primary' : ''}" data-lang="English">🇺🇸 English</button>
              <button class="btn btn--ghost lang-btn ${intakeData.language === 'Hindi' ? 'btn--primary' : ''}" data-lang="Hindi">🇮🇳 Hindi</button>
              <button class="btn btn--ghost lang-btn ${intakeData.language === 'Tamil' ? 'btn--primary' : ''}" data-lang="Tamil">🇮🇳 Tamil</button>
              <button class="btn btn--ghost lang-btn ${intakeData.language === 'Telugu' ? 'btn--primary' : ''}" data-lang="Telugu">🇮🇳 Telugu</button>
              <button class="btn btn--ghost lang-btn ${intakeData.language === 'Bengali' ? 'btn--primary' : ''}" data-lang="Bengali">🇮🇳 Bengali</button>
              <button class="btn btn--ghost lang-btn ${intakeData.language === 'Marathi' ? 'btn--primary' : ''}" data-lang="Marathi">🇮🇳 Marathi</button>
              <button class="btn btn--ghost lang-btn ${intakeData.language === 'Gujarati' ? 'btn--primary' : ''}" data-lang="Gujarati">🇮🇳 Gujarati</button>
              <button class="btn btn--ghost lang-btn ${intakeData.language === 'Kannada' ? 'btn--primary' : ''}" data-lang="Kannada">🇮🇳 Kannada</button>
            </div>
            
            <div class="card p-1 text-xs" style="background: rgba(0, 212, 170, 0.08); border-color: var(--color-primary); display: inline-block;">
              🎙️ Ambient Voice Recognition (Abridge Engine) is active for natural dictation.
            </div>
          </div>
        `;

      case 2:
        return `
          <div class="text-center py-1">
            <h3 class="text-md font-bold mb-1">🔒 ABDM Audio-Guided Consent & Data Security</h3>
            <p class="text-xs text-muted mb-2">Compliant with NDHM / ABDM Health Data Management Policy.</p>
            
            <div class="card p-2 text-left mb-2" style="max-width: 600px; margin: 0 auto; background: var(--bg-secondary);">
              <div class="flex-between align-center mb-1">
                <strong class="text-xs text-primary">📜 Digital Patient Consent Form</strong>
                <button class="btn btn--ghost btn--xs" onclick="window.MediRoute.pages.intake.playAudio('I consent to sharing my medical intake summary with verified ER triage doctors and ambulance dispatchers.')">
                  🔊 Listen (Audio Consent)
                </button>
              </div>
              <p class="text-xs text-secondary mb-1">
                I hereby grant consent to MediRoute AI to securely process my chief complaints, vitals, active prescriptions, and ABHA health locker data for emergency triage and hospital routing.
              </p>
              <ul class="text-xs text-muted pl-1 mb-1">
                <li>&bull; End-to-end encrypted AES-256 transmission</li>
                <li>&bull; Direct FHIR API integration with ABDM Health Repository</li>
                <li>&bull; Ephemeral session data cleared after 24 hours</li>
              </ul>
              <label class="flex align-center gap-1 cursor-pointer mt-1">
                <input type="checkbox" id="consent-checkbox" ${intakeData.consent ? 'checked' : ''} style="width: 18px; height: 18px;">
                <strong class="text-xs text-success">I Agree & Grant Clinical Intake Consent</strong>
              </label>
            </div>
          </div>
        `;

      case 3:
        return `
          <div class="py-1" style="max-width: 600px; margin: 0 auto;">
            <h3 class="text-md font-bold mb-1 text-center">🆔 Ayushman Bharat Health Account (ABHA)</h3>
            <p class="text-xs text-muted mb-2 text-center">Link your 14-digit ABHA ID to fetch instant health records.</p>
            
            <div class="card p-2 mb-2">
              <div class="grid grid--2 gap-1 mb-1">
                <div>
                  <label class="form-label text-xs">Full Name</label>
                  <input type="text" id="patient-name-input" class="form-input text-xs" value="${intakeData.name}" placeholder="Patient Name">
                </div>
                <div class="grid grid--2 gap-0.5">
                  <div>
                    <label class="form-label text-xs">Age</label>
                    <input type="number" id="patient-age-input" class="form-input text-xs" value="${intakeData.age}" placeholder="Age">
                  </div>
                  <div>
                    <label class="form-label text-xs">Gender</label>
                    <select id="patient-gender-input" class="form-select text-xs">
                      <option value="Male" ${intakeData.gender === 'Male' ? 'selected' : ''}>Male</option>
                      <option value="Female" ${intakeData.gender === 'Female' ? 'selected' : ''}>Female</option>
                      <option value="Other" ${intakeData.gender === 'Other' ? 'selected' : ''}>Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="form-group mb-1">
                <label class="form-label text-xs">14-Digit ABHA ID / Health Number</label>
                <div class="flex gap-0.5">
                  <input type="text" id="abha-input" class="form-input text-xs" value="${intakeData.abha}" placeholder="14-8921-3049-1234" style="font-weight: bold; letter-spacing: 1px;">
                  <button id="btn-demo-abha" class="btn btn--primary btn--xs flex-shrink-0">⚡ Auto-Fetch ABHA</button>
                </div>
              </div>

              <div class="badge badge--success text-xs w-full flex-center py-0.5">
                ✓ ABDM Health Locker Connected &bull; Token #ABHA-9021
              </div>
            </div>
          </div>
        `;

      case 4:
        return `
          <div class="text-center py-1">
            <h3 class="text-md font-bold mb-1">🫀 Interactive Anatomical Body Canvas</h3>
            <p class="text-xs text-muted mb-2">Tap the affected body region to trigger localized Infermedica symptom pathways.</p>

            <div class="grid grid--2 gap-2 align-center" style="max-width: 650px; margin: 0 auto;">
              
              <!-- Anatomical Model Visual -->
              <div class="card p-2 text-center" style="background: var(--bg-secondary);">
                <div style="font-size: 4rem; animation: pulse 2s infinite;">🧍‍♂️</div>
                <div class="mt-1">
                  <span class="badge badge--primary text-xs" id="selected-body-part">
                    Selected Region: <strong>${intakeData.bodyPart || 'Chest'}</strong>
                  </span>
                </div>
              </div>

              <!-- Body Part Selector Grid -->
              <div class="flex flex-col gap-0.5 text-left">
                <button class="btn btn--ghost body-part-btn text-xs ${intakeData.bodyPart === 'Head' ? 'btn--primary' : ''}" data-part="Head">🧠 Head & Neurological</button>
                <button class="btn btn--ghost body-part-btn text-xs ${intakeData.bodyPart === 'Chest' ? 'btn--primary' : ''}" data-part="Chest">🫀 Chest & Cardiac</button>
                <button class="btn btn--ghost body-part-btn text-xs ${intakeData.bodyPart === 'Abdomen' ? 'btn--primary' : ''}" data-part="Abdomen">🩺 Abdomen & Gastro</button>
                <button class="btn btn--ghost body-part-btn text-xs ${intakeData.bodyPart === 'Limbs' ? 'btn--primary' : ''}" data-part="Limbs">🦴 Musculoskeletal / Limbs</button>
                <button class="btn btn--ghost body-part-btn text-xs ${intakeData.bodyPart === 'General' ? 'btn--primary' : ''}" data-part="General">🔥 Systemic / Fever</button>
              </div>

            </div>
          </div>
        `;

      case 5:
        return `
          <div class="py-1" style="max-width: 650px; margin: 0 auto;">
            <h3 class="text-md font-bold mb-1 text-center">🧠 Adaptive Clinical Interview (Infermedica Engine)</h3>
            <p class="text-xs text-muted mb-2 text-center">Speak or type your symptoms. AI generates dynamic follow-up questions.</p>

            <div class="card p-2 mb-2" style="background: rgba(108, 99, 255, 0.08); border-color: var(--color-accent);">
              <div class="flex-between align-center mb-0.5">
                <strong class="text-xs text-accent">🤖 AI Follow-up Question:</strong>
                <button class="btn btn--ghost btn--xs" onclick="window.MediRoute.pages.intake.playAudio('Is the chest pain crushing, sharp, or burning? Does it radiate to your left arm?')">
                  🔊 Speak Question
                </button>
              </div>
              <p class="text-sm font-semibold m-0" id="ai-dynamic-question">
                "Is the chest pain crushing or heavy? Are you experiencing cold sweats or radiation to your left jaw or arm?"
              </p>
            </div>

            <!-- Voice & Input Box -->
            <div class="form-group mb-1">
              <label class="form-label text-xs">Patient Voice Transcript / Input</label>
              <div class="flex gap-0.5">
                <input type="text" id="symptom-input" class="form-input text-xs" value="${intakeData.symptoms}" placeholder="Type or click microphone to dictate...">
                <button id="btn-mic" class="btn btn--primary btn--xs flex-shrink-0">🎤 Record Voice</button>
              </div>
            </div>

            <!-- Quick Choice Buttons -->
            <div class="grid grid--3 gap-0.5 mb-1" id="symptom-options-grid">
              <button class="btn btn--ghost tree-option text-xs p-0.5" data-val="Crushing Pain">💥 Crushing Pain</button>
              <button class="btn btn--ghost tree-option text-xs p-0.5" data-val="Cold Sweats">💦 Cold Sweats</button>
              <button class="btn btn--ghost tree-option text-xs p-0.5" data-val="Left Arm Radiation">⚡ Arm Radiation</button>
              <button class="btn btn--ghost tree-option text-xs p-0.5" data-val="Shortness of Breath">🫁 Dyspnea</button>
              <button class="btn btn--ghost tree-option text-xs p-0.5" data-val="Nausea">🤢 Nausea</button>
              <button class="btn btn--ghost tree-option text-xs p-0.5" data-val="Dizziness">💫 Dizziness</button>
            </div>
          </div>
        `;

      case 6:
        return `
          <div class="text-center py-1">
            <h3 class="text-md font-bold mb-1">🚨 Corti Emergency Red-Flag Scanner</h3>
            <p class="text-xs text-muted mb-2">Screening clinical inputs for life-threatening emergency signals...</p>

            <div id="scanner-animation" class="mb-2" style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid var(--color-emergency); margin: 0 auto; display: flex; align-items: center; justify-content: center; animation: pulse 1.2s infinite; font-size: 2rem;">
              🔍
            </div>
            
            <strong class="text-xs text-gradient" id="scanner-status">Analyzing Triage Biomarkers...</strong>

            <div id="red-flag-alert-box" class="card p-2 mt-2 text-left" style="background: rgba(255, 71, 87, 0.12); border-color: var(--color-emergency); max-width: 600px; margin: 1rem auto 0 auto;">
              <div class="flex align-center gap-1 mb-1">
                <span class="text-xl">🚨</span>
                <div>
                  <strong class="text-xs text-danger">LEVEL-1 RED FLAG EMERGENCY DETECTED</strong>
                  <div class="text-xs text-muted">Acutely Critical Biomarker Profile Identified</div>
                </div>
              </div>
              <ul class="text-xs text-secondary pl-1 m-0">
                <li>&bull; <strong>Trigger:</strong> Retrosternal Pain + Diaphoresis + Left Arm Radiation</li>
                <li>&bull; <strong>Clinical Protocol:</strong> Direct Level-1 Cath Lab Priority Reservation</li>
                <li>&bull; <strong>Action:</strong> Auto-Dispatching Nearest ALS Ambulance</li>
              </ul>
              <button class="btn btn--danger btn--xs w-full mt-1" onclick="window.location.hash='#emergency'">
                🚨 One-Tap Emergency Route Dispatch
              </button>
            </div>
          </div>
        `;

      case 7:
        return `
          <div class="py-1" style="max-width: 600px; margin: 0 auto;">
            <h3 class="text-md font-bold mb-1 text-center">📷 Document & Prescription Scanner (Notable OCR)</h3>
            <p class="text-xs text-muted mb-2 text-center">Upload or scan medical records, lab reports, or discharge summaries.</p>

            <div id="doc-scanner" class="card p-2 text-center mb-1 cursor-pointer" style="border: 2px dashed var(--glass-border); background: var(--bg-secondary);">
              <div class="text-xl mb-0.5">📄</div>
              <strong class="text-xs text-primary">Tap to Camera Scan or Drag & Drop Prescription</strong>
              <p class="text-xs text-muted m-0">Supports PDF, JPG, PNG & Digital E-Prescriptions</p>
            </div>

            <textarea id="doc-text-input" class="form-input text-xs w-full mb-1" rows="3" placeholder="Or paste clinical document text here...">Clinical Summary: Patient with Type 2 Diabetes on Metformin 500mg, Atorvastatin 20mg. Recent HbA1c: 7.2%, SpO2: 95%, BP: 140/90 mmHg.</textarea>

            <button id="btn-extract-doc" class="btn btn--primary btn--xs w-full mb-1">
              ⚡ Extract Meds & Labs (AI NLP Engine)
            </button>

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
            <h3 class="text-md font-bold mb-1 text-center">📅 Interactive Patient Health Timeline</h3>
            <p class="text-xs text-muted mb-2 text-center">Longitudinal EHR record pulled from ABDM Health Locker.</p>

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
            <h3 class="text-md font-bold mb-1 text-center">📋 Clinical Verification & Structured Summary</h3>
            <p class="text-xs text-muted mb-2 text-center">Abridge-style 30-second physician grounded transcript summary.</p>

            <div class="grid grid--2 gap-1 mb-1 text-xs">
              <div class="card p-1">
                <div class="flex-between align-center mb-0.5">
                  <strong class="text-primary">Patient Demographics</strong>
                  <button class="btn btn--ghost btn--xs" onclick="window.MediRoute.pages.intake.gotoStep(3)">✏️ Edit</button>
                </div>
                <div><strong>Name:</strong> <span id="review-name">${intakeData.name}</span> (${intakeData.age}y / ${intakeData.gender})</div>
                <div><strong>ABHA:</strong> <span id="review-abha">${intakeData.abha}</span></div>
                <div><strong>Language:</strong> <span id="review-lang">${intakeData.language}</span></div>
              </div>

              <div class="card p-1">
                <div class="flex-between align-center mb-0.5">
                  <strong class="text-primary">Chief Complaint</strong>
                  <button class="btn btn--ghost btn--xs" onclick="window.MediRoute.pages.intake.gotoStep(4)">✏️ Edit</button>
                </div>
                <div><strong>Region:</strong> ${intakeData.bodyPart}</div>
                <div><strong>Complaint:</strong> <span id="review-cc">${intakeData.chiefComplaint}</span></div>
                <div><strong>Priority:</strong> <span class="badge badge--danger text-xs">${intakeData.priority} Priority</span></div>
              </div>
            </div>

            <div class="card p-1">
              <strong class="text-xs text-primary mb-0.5 block">🤖 Abridge AI Structured Clinical Note:</strong>
              <pre id="review-summary" class="text-xs p-1 m-0" style="background: var(--bg-secondary); border-radius: var(--radius-sm); white-space: pre-wrap; font-family: monospace;">
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
            <h3 class="text-md font-bold mb-1 text-success">✓ Digital Pre-Arrival Pass Ready</h3>
            <p class="text-xs text-muted mb-2">Scan QR code at hospital ER intake counter or hand off to Doctor Triage Portal.</p>

            <div class="card p-2 mb-2 inline-block" style="background: white; border-radius: var(--radius-md);">
              <svg id="patient-qr" width="160" height="160" viewBox="0 0 100 100" style="display: block; margin: 0 auto;">
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

    const prog = document.getElementById('intake-progress');
    if (prog) prog.style.width = ((currentStep / TOTAL_STEPS) * 100) + '%';

    const stepDisp = document.getElementById('current-step-display');
    if (stepDisp) stepDisp.textContent = currentStep;

    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    if (prevBtn) prevBtn.disabled = currentStep === 1;
    if (nextBtn) nextBtn.textContent = currentStep === TOTAL_STEPS ? '🚀 Hand Off to ER Doctor' : 'Next Step ➡️';

    bindStepEvents(currentStep);
  }

  function bindStepEvents(step) {
    if (step === 1) {
      document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          intakeData.language = e.target.dataset.lang;
          const selector = document.getElementById('lang-selector');
          if (selector) selector.value = intakeData.language;
          document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('btn--primary'));
          e.target.classList.add('btn--primary');
          if (window.MediRoute.components?.showToast) {
            window.MediRoute.components.showToast('Language updated to ' + intakeData.language);
          }
        });
      });
    } else if (step === 2) {
      const cb = document.getElementById('consent-checkbox');
      if (cb) {
        cb.checked = intakeData.consent;
        cb.addEventListener('change', e => intakeData.consent = e.target.checked);
      }
    } else if (step === 3) {
      const nameInput = document.getElementById('patient-name-input');
      const ageInput = document.getElementById('patient-age-input');
      const genderInput = document.getElementById('patient-gender-input');
      const abhaInput = document.getElementById('abha-input');

      if (nameInput) nameInput.addEventListener('input', e => intakeData.name = e.target.value);
      if (ageInput) ageInput.addEventListener('input', e => intakeData.age = e.target.value);
      if (genderInput) genderInput.addEventListener('change', e => intakeData.gender = e.target.value);
      if (abhaInput) abhaInput.addEventListener('input', e => intakeData.abha = e.target.value);

      const btnDemo = document.getElementById('btn-demo-abha');
      if (btnDemo) {
        btnDemo.addEventListener('click', () => {
          intakeData.name = 'Rahul Sharma';
          intakeData.age = '45';
          intakeData.gender = 'Male';
          intakeData.abha = '14-8921-3049-1234';
          if (nameInput) nameInput.value = intakeData.name;
          if (ageInput) ageInput.value = intakeData.age;
          if (genderInput) genderInput.value = intakeData.gender;
          if (abhaInput) abhaInput.value = intakeData.abha;
          if (window.MediRoute.components?.showToast) {
            window.MediRoute.components.showToast('✓ ABDM Health Locker Records Fetched!');
          }
        });
      }
    } else if (step === 4) {
      document.querySelectorAll('.body-part-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          intakeData.bodyPart = e.target.dataset.part;
          document.querySelectorAll('.body-part-btn').forEach(b => b.classList.remove('btn--primary'));
          e.target.classList.add('btn--primary');
          const disp = document.getElementById('selected-body-part');
          if (disp) disp.innerHTML = `Selected Region: <strong>${intakeData.bodyPart}</strong>`;
        });
      });
    } else if (step === 5) {
      document.querySelectorAll('.tree-option').forEach(btn => {
        btn.addEventListener('click', e => {
          const val = e.target.dataset.val;
          if (!intakeData.answers.includes(val)) intakeData.answers.push(val);
          intakeData.symptoms += (intakeData.symptoms ? ', ' : '') + val;
          const input = document.getElementById('symptom-input');
          if (input) input.value = intakeData.symptoms;
        });
      });

      const micBtn = document.getElementById('btn-mic');
      if (micBtn) {
        micBtn.addEventListener('click', () => {
          if (window.MediRoute.components?.showToast) {
            window.MediRoute.components.showToast('🎤 Ambient Voice AI Listening (Abridge Engine)...');
          }
          setTimeout(() => {
            intakeData.symptoms += ", Cold Sweats & Dyspnea";
            const input = document.getElementById('symptom-input');
            if (input) input.value = intakeData.symptoms;
          }, 1500);
        });
      }
    } else if (step === 7) {
      const btnExtract = document.getElementById('btn-extract-doc');
      if (btnExtract) {
        btnExtract.addEventListener('click', () => {
          if (window.MediRoute.components?.showToast) {
            window.MediRoute.components.showToast('⚡ Extracting Meds & Labs via OCR NLP...');
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

    document.getElementById('btn-next').addEventListener('click', () => {
      if (currentStep === 2 && !intakeData.consent) {
        if (window.MediRoute.components?.showToast) {
          window.MediRoute.components.showToast('Please grant consent to proceed.', 'error');
        }
        return;
      }

      if (currentStep < TOTAL_STEPS) {
        currentStep++;
        updateStepUI();
      } else {
        completeAndHandoff();
      }
    });

    document.getElementById('btn-prev').addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateStepUI();
      }
    });

    const langSel = document.getElementById('lang-selector');
    if (langSel) {
      langSel.addEventListener('change', (e) => {
        intakeData.language = e.target.value;
      });
    }

    bindStepEvents(currentStep);
  }

  function speakStepPrompt() {
    playAudio(`Step ${currentStep}: ${STEP_TITLES[currentStep - 1]}. Please follow the instructions on screen.`);
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
    completeAndHandoff
  };

})();
