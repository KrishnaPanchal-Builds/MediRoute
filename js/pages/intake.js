/* ============================================
   MEDIROUTE — Intake Page (Step 1 & 2)
   ============================================ */
(function () {
  window.MediRoute = window.MediRoute || {};
  window.MediRoute.pages = window.MediRoute.pages || {};

  let currentStep = 1;
  const TOTAL_STEPS = 10;
  let intakeData = {
    name: '',
    age: '',
    gender: 'Male',
    language: 'English',
    consent: false,
    abha: '',
    chiefComplaint: '',
    symptoms: '',
    answers: [],
    extractedData: null,
    timeline: []
  };

  function render() {
    return `
      <div class="intake-container glass-panel" style="padding: 2rem; max-width: 800px; margin: 0 auto;">
        <!-- Header -->
        <div class="intake-header flex-between mb-4">
          <div class="progress-bar-container" style="flex-grow: 1; margin-right: 1rem;">
            <div class="progress-bar" id="intake-progress" style="width: ${((currentStep) / TOTAL_STEPS) * 100}%; height: 8px; background: var(--accent); border-radius: 4px; transition: width 0.3s;"></div>
            <div class="text-sm mt-1 text-secondary">Step <span id="current-step-display">${currentStep}</span> of ${TOTAL_STEPS}</div>
          </div>
          <select id="lang-selector" class="input-field" style="width: 150px; border-radius: 8px;">
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Tamil">Tamil</option>
            <option value="Telugu">Telugu</option>
            <option value="Bengali">Bengali</option>
            <option value="Marathi">Marathi</option>
            <option value="Gujarati">Gujarati</option>
            <option value="Kannada">Kannada</option>
          </select>
          <button id="voice-toggle" class="btn btn-secondary ml-2" style="border-radius: 8px;">🔊 Sound On</button>
        </div>

        <!-- Step Content Area -->
        <div id="step-content" class="step-content" style="min-height: 400px; display: flex; flex-direction: column; justify-content: center;">
          ${renderStep(currentStep)}
        </div>

        <!-- Navigation -->
        <div class="intake-footer flex-between mt-4 pt-4" style="border-top: 1px solid var(--border);">
          <button id="btn-prev" class="btn btn-secondary" ${currentStep === 1 ? 'disabled' : ''}>Back</button>
          <button id="btn-next" class="btn btn-primary">${currentStep === TOTAL_STEPS ? 'Hand Off' : 'Next'}</button>
        </div>
      </div>
    `;
  }

  function renderStep(step) {
    switch (step) {
      case 1:
        return `
          <div class="text-center">
            <h2>Select Language & Accessibility</h2>
            <div class="grid grid-cols-2 gap-4 mt-4">
              <button class="btn btn-outline lang-btn" data-lang="English">🇺🇸 English</button>
              <button class="btn btn-outline lang-btn" data-lang="Hindi">🇮🇳 Hindi</button>
              <button class="btn btn-outline lang-btn" data-lang="Tamil">🇮🇳 Tamil</button>
              <button class="btn btn-outline lang-btn" data-lang="Telugu">🇮🇳 Telugu</button>
            </div>
            <p class="text-sm text-secondary mt-4">More languages available in dropdown.</p>
          </div>
        `;
      case 2:
        return `
          <div class="card p-4 text-center">
            <h2>Audio-Guided Consent</h2>
            <button class="btn btn-icon mt-4 mb-4" onclick="MediRoute.pages.intake.playAudio('Please provide your consent to proceed.')" style="font-size: 2rem;">▶️</button>
            <p class="mb-4">I consent to the collection and processing of my medical data for triage and hospital recommendation purposes.</p>
            <label class="flex-align-center" style="justify-content: center; gap: 10px; cursor: pointer;">
              <input type="checkbox" id="consent-checkbox" style="width: 24px; height: 24px;">
              <span style="font-size: 1.2rem;">I Consent</span>
            </label>
          </div>
        `;
      case 3:
        return `
          <div class="text-center">
            <h2>Patient Details & ABHA ID</h2>
            <div class="grid grid-cols-2 gap-4 mt-4 text-left">
              <div>
                <label class="form-label">Full Name</label>
                <input type="text" id="patient-name-input" class="input-field mb-2 w-full" placeholder="Enter Full Name">
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="form-label">Age</label>
                  <input type="number" id="patient-age-input" class="input-field mb-2 w-full" placeholder="Age">
                </div>
                <div>
                  <label class="form-label">Gender</label>
                  <select id="patient-gender-input" class="input-field mb-2 w-full">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="text-left">
              <label class="form-label">ABHA ID (Ayushman Bharat Health Account)</label>
              <input type="text" id="abha-input" class="input-field mb-2 w-full text-center" placeholder="XX-XXXX-XXXX-XXXX" style="font-size: 1.5rem; letter-spacing: 2px;">
            </div>
            <button id="btn-demo-abha" class="btn btn-secondary mt-2">Auto-fill Demo Info</button>
          </div>
        `;
      case 4:
        return `
          <div class="text-center">
            <h2>Interactive Visual Body Map</h2>
            <p class="text-secondary mb-4">Tap the area where you feel discomfort.</p>
            <div style="width: 200px; height: 400px; margin: 0 auto; background: rgba(0,0,0,0.2); border: 2px dashed var(--border); border-radius: 10px; display: flex; flex-direction: column; gap: 5px; padding: 10px;">
                <button class="btn btn-outline body-part" data-part="Head">Head</button>
                <button class="btn btn-outline body-part" data-part="Chest">Chest</button>
                <button class="btn btn-outline body-part" data-part="Abdomen">Abdomen</button>
                <button class="btn btn-outline body-part" data-part="Back">Back</button>
                <div class="flex-between"><button class="btn btn-outline body-part" data-part="Left Arm">L Arm</button><button class="btn btn-outline body-part" data-part="Right Arm">R Arm</button></div>
                <div class="flex-between"><button class="btn btn-outline body-part" data-part="Left Leg">L Leg</button><button class="btn btn-outline body-part" data-part="Right Leg">R Leg</button></div>
            </div>
            <div class="mt-4 text-lg text-primary" id="selected-body-part"></div>
          </div>
        `;
      case 5:
        return `
          <div class="text-center">
            <h2>Conversational AI Interview</h2>
            <div class="card p-4 mb-4" style="background: rgba(var(--primary-rgb), 0.1);">
               <p id="ai-question" class="text-xl mb-4">Please describe your symptoms.</p>
               <button class="btn btn-icon" onclick="MediRoute.pages.intake.playAudio(document.getElementById('ai-question').innerText)">🔊 Play</button>
            </div>
            <div class="flex-between gap-4 mb-4">
              <input type="text" id="symptom-input" class="input-field flex-grow" placeholder="Type or speak...">
              <button id="btn-mic" class="btn btn-primary" style="border-radius: 50%; width: 50px; height: 50px;">🎤</button>
            </div>
            <div id="ai-options" class="grid grid-cols-2 gap-4">
              <button class="btn btn-outline tree-option" data-val="Chest Pain">Chest Pain</button>
              <button class="btn btn-outline tree-option" data-val="Headache">Headache</button>
              <button class="btn btn-outline tree-option" data-val="Fever">Fever</button>
              <button class="btn btn-outline tree-option" data-val="General">Other</button>
            </div>
          </div>
        `;
      case 6:
        return `
          <div class="text-center">
            <h2>Live Red-Flag Scanner</h2>
            <div id="scanner-animation" class="mb-4" style="width: 100px; height: 100px; border-radius: 50%; border: 4px solid var(--accent); margin: 0 auto; display: flex; align-items: center; justify-content: center; animation: pulse 1.5s infinite;">
              🔍
            </div>
            <p id="scanner-status">Analyzing inputs...</p>
            <div id="red-flag-alert" class="card mt-4 hidden" style="background: rgba(255, 77, 77, 0.2); border: 1px solid #ff4d4d;">
              <h3 style="color: #ff4d4d;">⚠️ EMERGENCY DETECTED</h3>
              <p id="red-flag-details"></p>
            </div>
          </div>
          <style>
            @keyframes pulse {
              0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(var(--accent-rgb), 0.7); }
              70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(var(--accent-rgb), 0); }
              100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(var(--accent-rgb), 0); }
            }
          </style>
        `;
      case 7:
        return `
          <div class="text-center">
            <h2>Document Camera Scan & OCR</h2>
            <div id="doc-scanner" style="height: 150px; border: 2px dashed var(--border); border-radius: 10px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; margin-bottom: 1rem; cursor: pointer; background: rgba(0,0,0,0.1);">
              <div id="scan-line" style="position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: var(--accent); box-shadow: 0 0 10px var(--accent); display: none;"></div>
              <span>📷 Tap to Scan Document or Drag & Drop</span>
            </div>
            <textarea id="doc-text-input" class="input-field w-full mb-2" rows="3" placeholder="Or paste medical document text here..."></textarea>
            <button id="btn-extract-doc" class="btn btn-primary mb-2">Extract Data</button>
            <div id="extracted-data" class="hidden text-left card p-4">
              <h4>Extracted Information</h4>
              <div id="extracted-meds" class="mb-2"></div>
              <div id="extracted-labs"></div>
            </div>
          </div>
        `;
      case 8:
        return `
          <div class="text-center">
            <h2>Interactive Medical Timeline</h2>
            <div class="timeline mt-4 text-left pl-4" style="border-left: 2px solid var(--accent); margin-left: 20px;">
               <div style="position: relative; margin-bottom: 15px;">
                 <div style="position: absolute; left: -25px; top: 5px; width: 10px; height: 10px; border-radius: 50%; background: var(--accent);"></div>
                 <span class="text-secondary text-sm">2 Years Ago</span>
                 <div>Diagnosed with Type 2 Diabetes</div>
               </div>
               <div style="position: relative; margin-bottom: 15px;">
                 <div style="position: absolute; left: -25px; top: 5px; width: 10px; height: 10px; border-radius: 50%; background: var(--accent);"></div>
                 <span class="text-secondary text-sm">6 Months Ago</span>
                 <div>Started Metformin</div>
               </div>
               <div style="position: relative; margin-bottom: 15px;">
                 <div style="position: absolute; left: -25px; top: 5px; width: 10px; height: 10px; border-radius: 50%; background: var(--primary);"></div>
                 <span class="text-primary text-sm">Today</span>
                 <div>Chief Complaint: <span id="timeline-cc"></span></div>
               </div>
            </div>
          </div>
        `;
      case 9:
        return `
          <div class="text-center">
            <h2>Patient Review & Verification</h2>
            <div class="grid grid-cols-2 gap-4 mt-4 text-left">
              <div class="card p-3">
                <h4>Patient Info <button class="btn btn-icon text-sm float-right" onclick="MediRoute.pages.intake.gotoStep(3)">✏️</button></h4>
                <p>ABHA: <span id="review-abha"></span></p>
                <p>Language: <span id="review-lang"></span></p>
              </div>
              <div class="card p-3">
                <h4>Symptoms <button class="btn btn-icon text-sm float-right" onclick="MediRoute.pages.intake.gotoStep(4)">✏️</button></h4>
                <p>Complaint: <span id="review-cc"></span></p>
              </div>
              <div class="card p-3" style="grid-column: span 2;">
                <h4>Clinical Summary (AI Generated)</h4>
                <pre id="review-summary" class="text-sm p-2 mt-2" style="background: rgba(0,0,0,0.2); border-radius: 4px; white-space: pre-wrap; word-wrap: break-word;"></pre>
              </div>
            </div>
          </div>
        `;
      case 10:
        return `
          <div class="text-center">
            <h2>Intake Complete</h2>
            <p class="text-secondary mb-4">Your Patient QR Code is ready.</p>
            <div class="card p-4 mb-4" style="display: inline-block; background: white;">
              <svg id="patient-qr" width="150" height="150" viewBox="0 0 100 100" style="display: block;">
                 <rect width="100" height="100" fill="#fff"/>
                 <rect x="10" y="10" width="30" height="30" fill="#000"/>
                 <rect x="60" y="10" width="30" height="30" fill="#000"/>
                 <rect x="10" y="60" width="30" height="30" fill="#000"/>
                 <rect x="15" y="15" width="20" height="20" fill="#fff"/>
                 <rect x="65" y="15" width="20" height="20" fill="#fff"/>
                 <rect x="15" y="65" width="20" height="20" fill="#fff"/>
                 <rect x="20" y="20" width="10" height="10" fill="#000"/>
                 <rect x="70" y="20" width="10" height="10" fill="#000"/>
                 <rect x="20" y="70" width="10" height="10" fill="#000"/>
                 <path d="M50,10 h10 v10 h-10 z M50,30 h20 v10 h-20 z M80,50 h10 v30 h-10 z M40,60 h30 v10 h-30 z M10,45 h30 v10 h-30 z M60,80 h30 v10 h-30 z M40,80 h10 v10 h-10 z" fill="#000"/>
              </svg>
            </div>
            <div>
              <button class="btn btn-primary" onclick="window.location.hash='#doctor-triage'">Hand Off to Hospital / View Doctor Portal</button>
            </div>
          </div>
        `;
      default:
        return '<div>Unknown Step</div>';
    }
  }

  function updateStepUI() {
    const content = document.getElementById('step-content');
    if (content) {
      content.innerHTML = renderStep(currentStep);
    }
    const prog = document.getElementById('intake-progress');
    if (prog) prog.style.width = ((currentStep / TOTAL_STEPS) * 100) + '%';
    const stepDisp = document.getElementById('current-step-display');
    if (stepDisp) stepDisp.textContent = currentStep;
    
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    if (prevBtn) prevBtn.disabled = currentStep === 1;
    if (nextBtn) nextBtn.textContent = currentStep === TOTAL_STEPS ? 'Hand Off' : 'Next';

    bindStepEvents(currentStep);
  }

  function bindStepEvents(step) {
    if (step === 1) {
      document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          intakeData.language = e.target.dataset.lang;
          document.getElementById('lang-selector').value = intakeData.language;
          document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('btn-primary'));
          e.target.classList.add('btn-primary');
          if (window.MediRoute.components && window.MediRoute.components.showToast) {
             window.MediRoute.components.showToast('Language set to ' + intakeData.language);
          }
        });
      });
    } else if (step === 2) {
      const cb = document.getElementById('consent-checkbox');
      cb.checked = intakeData.consent;
      cb.addEventListener('change', e => intakeData.consent = e.target.checked);
    } else if (step === 3) {
      const nameInput = document.getElementById('patient-name-input');
      const ageInput = document.getElementById('patient-age-input');
      const genderInput = document.getElementById('patient-gender-input');
      const abhaInput = document.getElementById('abha-input');
      
      nameInput.value = intakeData.name;
      ageInput.value = intakeData.age;
      genderInput.value = intakeData.gender;
      abhaInput.value = intakeData.abha;
      
      nameInput.addEventListener('input', e => intakeData.name = e.target.value);
      ageInput.addEventListener('input', e => intakeData.age = e.target.value);
      genderInput.addEventListener('change', e => intakeData.gender = e.target.value);
      abhaInput.addEventListener('input', e => intakeData.abha = e.target.value);
      
      document.getElementById('btn-demo-abha').addEventListener('click', () => {
        intakeData.name = 'Rahul Sharma';
        intakeData.age = '45';
        intakeData.gender = 'Male';
        intakeData.abha = '14-' + Math.floor(1000+Math.random()*9000) + '-' + Math.floor(1000+Math.random()*9000) + '-1234';
        
        nameInput.value = intakeData.name;
        ageInput.value = intakeData.age;
        genderInput.value = intakeData.gender;
        abhaInput.value = intakeData.abha;
      });
    } else if (step === 4) {
      document.querySelectorAll('.body-part').forEach(btn => {
        btn.addEventListener('click', e => {
          intakeData.chiefComplaint = e.target.dataset.part;
          document.getElementById('selected-body-part').textContent = 'Selected: ' + intakeData.chiefComplaint;
        });
      });
    } else if (step === 5) {
      document.querySelectorAll('.tree-option').forEach(btn => {
        btn.addEventListener('click', e => {
          intakeData.answers.push(e.target.dataset.val);
          intakeData.symptoms += (intakeData.symptoms ? ' ' : '') + e.target.dataset.val;
          document.getElementById('symptom-input').value = intakeData.symptoms;
        });
      });
      const micBtn = document.getElementById('btn-mic');
      const symptomInput = document.getElementById('symptom-input');
      symptomInput.value = intakeData.symptoms;
      symptomInput.addEventListener('input', e => { intakeData.symptoms = e.target.value; });
      let recognition = null;
      if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.onresult = (event) => {
          const text = event.results[0][0].transcript;
          intakeData.symptoms += (intakeData.symptoms ? ' ' : '') + text;
          intakeData.answers.push(text);
          symptomInput.value = intakeData.symptoms.trim();
          micBtn.style.background = '';
          micBtn.classList.remove('btn-primary');
          setTimeout(() => micBtn.classList.add('btn-primary'), 100);
        };
        recognition.onerror = (e) => {
          console.warn('Speech recognition error', e);
          micBtn.style.background = '';
        };
      }
      micBtn.addEventListener('click', () => {
        micBtn.classList.toggle('btn-primary');
        micBtn.style.background = micBtn.style.background === 'var(--accent)' ? '' : 'var(--accent)';
        if (micBtn.style.background) {
           if (recognition) {
             recognition.start();
           } else {
             setTimeout(() => {
                 const simulatedSpeech = " I have crushing chest pain.";
                 intakeData.symptoms += simulatedSpeech;
                 intakeData.answers.push("crushing chest pain");
                 document.getElementById('symptom-input').value = intakeData.symptoms.trim();
                 micBtn.style.background = '';
                 micBtn.classList.add('btn-primary');
             }, 2000);
           }
        }
      });
    } else if (step === 6) {
      setTimeout(() => {
        const ai = window.MediRoute.clinicalAI;
        if (ai) {
          const res = ai.evaluateRedFlags(intakeData.answers, intakeData.symptoms);
          intakeData.priority = res.priority;
          document.getElementById('scanner-status').textContent = 'Analysis Complete';
          document.getElementById('scanner-animation').style.animation = 'none';
          
          if (res.isRedFlag) {
            const alertBox = document.getElementById('red-flag-alert');
            alertBox.classList.remove('hidden');
            document.getElementById('red-flag-details').textContent = 'Priority: ' + res.priority + ' - Flags: ' + res.alerts.join(', ');
            if (window.MediRoute.components && window.MediRoute.components.showToast) {
               window.MediRoute.components.showToast('🚨 Emergency Red Flag Detected!', 'error');
            }
          } else {
             document.getElementById('scanner-status').textContent = 'No critical red flags detected. Priority: ' + res.priority;
          }
        }
      }, 1500);
    } else if (step === 7) {
      const doExtraction = (text) => {
          const ai = window.MediRoute.clinicalAI;
          if (ai) {
             intakeData.extractedData = ai.extractDocumentData(text);
             const exBox = document.getElementById('extracted-data');
             exBox.classList.remove('hidden');
             document.getElementById('extracted-meds').innerHTML = '<strong>Meds:</strong> ' + intakeData.extractedData.medications.map(m => `<span class="badge" style="background:var(--accent);color:#000;margin:2px;padding:2px 5px;border-radius:4px;font-size:0.8rem;display:inline-block;">${m}</span>`).join(' ');
             document.getElementById('extracted-labs').innerHTML = '<strong>Labs:</strong> ' + intakeData.extractedData.labs.map(l => `<span class="badge" style="background:var(--primary);margin:2px;padding:2px 5px;border-radius:4px;font-size:0.8rem;display:inline-block;">${l}</span>`).join(' ');
          }
      };

      const btnExtract = document.getElementById('btn-extract-doc');
      btnExtract.addEventListener('click', () => {
          const text = document.getElementById('doc-text-input').value || "Simulated text with Diabetes, HbA1c: 7.2%, Metoprolol 50mg";
          doExtraction(text);
      });

      const scanner = document.getElementById('doc-scanner');
      scanner.addEventListener('click', () => {
        const scanLine = document.getElementById('scan-line');
        scanLine.style.display = 'block';
        scanLine.style.animation = 'scanAnim 1.5s linear infinite';
        
        setTimeout(() => {
          scanLine.style.display = 'none';
          doExtraction("Simulated image scan text: Diabetes, HbA1c: 7.2%, Metoprolol 50mg");
        }, 1500);
      });
      if (!document.getElementById('scan-anim-style')) {
          const style = document.createElement('style');
          style.id = 'scan-anim-style';
          style.innerHTML = '@keyframes scanAnim { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }';
          document.head.appendChild(style);
      }
    } else if (step === 8) {
      const cc = document.getElementById('timeline-cc');
      if(cc) cc.textContent = intakeData.chiefComplaint || 'Reported Symptoms';
    } else if (step === 9) {
      document.getElementById('review-name').textContent = intakeData.name || 'Not provided';
      document.getElementById('review-abha').textContent = intakeData.abha || 'Not provided';
      document.getElementById('review-lang').textContent = intakeData.language;
      document.getElementById('review-cc').textContent = (intakeData.chiefComplaint + ' ' + intakeData.symptoms).trim();
      
      const ai = window.MediRoute.clinicalAI;
      if (ai) {
          const summary = ai.generate30SecSummary(intakeData);
          document.getElementById('review-summary').textContent = JSON.stringify(summary, null, 2);
      }
    }
  }

  function mount(container) {
    container.innerHTML = render();
    
    document.getElementById('btn-next').addEventListener('click', () => {
      if (currentStep === 2 && !intakeData.consent) {
         if(window.MediRoute.components && window.MediRoute.components.showToast) {
            window.MediRoute.components.showToast('Please provide consent to proceed.', 'error');
         } else {
            alert('Please provide consent.');
         }
         return;
      }
      if (currentStep < TOTAL_STEPS) {
        currentStep++;
        updateStepUI();
      } else {
        if (window.MediRoute.store && window.MediRoute.store.addPatient) {
           const newPt = {
               id: 'pt-new-' + Math.floor(Math.random()*1000),
               name: intakeData.name || 'Unknown Patient',
               age: intakeData.age || 30,
               gender: intakeData.gender || 'Other',
               abha: intakeData.abha || 'None',
               severity: intakeData.priority ? intakeData.priority.toLowerCase() : 'yellow',
               severityLabel: (intakeData.priority || 'Yellow') + ' Priority',
               complaint: intakeData.chiefComplaint + ' - ' + intakeData.symptoms,
               duration: 'Recent',
               arrivalTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
               vitals: { bp: '120/80', pulse: '80', spo2: '98%', temp: '98.6°F' },
               redFlags: intakeData.priority === 'Red' ? ['High Priority Warning'] : [],
               allergies: [],
               medications: intakeData.extractedData ? intakeData.extractedData.medications : [],
               labs: intakeData.extractedData ? intakeData.extractedData.labs.map(l => ({name: l, status: 'normal', value: 'N/A'})) : [],
               aiLog: [],
               timeline: []
           };
           window.MediRoute.store.addPatient(newPt);
        }
        if(window.location.hash !== undefined) window.location.hash = '#doctor-triage';
      }
    });

    document.getElementById('btn-prev').addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateStepUI();
      }
    });

    document.getElementById('lang-selector').addEventListener('change', (e) => {
       intakeData.language = e.target.value;
    });

    bindStepEvents(currentStep);
  }

  function unmount(container) {
    container.innerHTML = '';
  }
  
  function playAudio(text) {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(msg);
    } else {
      console.log('Speech synthesis not supported: ' + text);
    }
  }

  function gotoStep(step) {
      if(step >= 1 && step <= TOTAL_STEPS) {
          currentStep = step;
          updateStepUI();
      }
  }

  window.MediRoute.pages.intake = {
    render,
    mount,
    unmount,
    playAudio,
    gotoStep
  };

})();
