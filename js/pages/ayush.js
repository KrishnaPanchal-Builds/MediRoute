/* ============================================
   MEDIROUTE — AYUSH & Integrative Medicine Assessment Portal
   ============================================ */
(function () {
  window.MediRoute = window.MediRoute || {};
  window.MediRoute.pages = window.MediRoute.pages || {};

  function render() {
    return `
      <div class="page page--ayush">
        <div class="page__header flex items-center justify-between" style="flex-wrap:wrap; gap:16px;">
          <div>
            <h1>🌿 AYUSH Assessment & Integrative Healthcare</h1>
            <p>Holistic health evaluation and integrative pathways</p>
          </div>
          <div class="flex items-center gap-md">
            <div class="badge" style="background:rgba(var(--color-success-rgb), 0.1); color:var(--color-success); border-color:rgba(var(--color-success-rgb), 0.2);">
              Prakriti: Vata-Pitta
            </div>
            <select class="form-select" style="width:200px;">
              <option value="p1">Rahul Sharma (Age 45)</option>
              <option value="p2">Anjali Gupta (Age 32)</option>
            </select>
            <button class="btn btn--primary" onclick="window.MediRoute.pages.ayush.printPass()">Print / Export AYUSH Health Pass</button>
          </div>
        </div>

        <div class="tabs">
          <button class="tab-btn active" data-target="tab-dashavidha">Dashavidha Pariksha</button>
          <button class="tab-btn" data-target="tab-aharavihara">Ahara-Vihara</button>
          <button class="tab-btn" data-target="tab-integrative">Integrative Summary</button>
        </div>

        <!-- TAB 1: Dashavidha Pariksha -->
        <div class="tab-pane" id="tab-dashavidha" style="display: block;">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:var(--space-lg); margin-top:var(--space-xl);">
            
            <!-- 1. Dushya -->
            <div class="card card--glass">
              <h3 style="font-size:var(--text-lg); margin-bottom:8px;">1. Dushya (Affected Tissues)</h3>
              <p style="font-size:var(--text-sm); color:var(--text-muted); margin-bottom:12px;">Evaluation of Dhatus and Malas</p>
              <div class="badge">Mamsa (Muscle) - Vitiated</div>
              <div class="badge mt-sm">Rakta (Blood) - Normal</div>
            </div>

            <!-- 2. Desha -->
            <div class="card card--glass">
              <h3 style="font-size:var(--text-lg); margin-bottom:8px;">2. Desha (Habitat & Climate)</h3>
              <p style="font-size:var(--text-sm); color:var(--text-muted); margin-bottom:12px;">Environmental influences</p>
              <div style="display:flex; justify-content:space-between; font-size:var(--text-sm);">
                <span>Region:</span>
                <strong style="color:var(--color-primary);">Sadharana (Moderate)</strong>
              </div>
            </div>

            <!-- 3. Bala -->
            <div class="card card--glass">
              <h3 style="font-size:var(--text-lg); margin-bottom:8px;">3. Bala (Physical Strength)</h3>
              <p style="font-size:var(--text-sm); color:var(--text-muted); margin-bottom:12px;">Immunity & resilience</p>
              <div class="dosha-bar"><div class="dosha-bar__fill" style="width:70%; background:var(--color-success);"></div></div>
              <div class="flex justify-between mt-sm" style="font-size:var(--text-xs);"><span>Madhya (Medium)</span><span>70%</span></div>
            </div>

            <!-- 4. Kala -->
            <div class="card card--glass">
              <h3 style="font-size:var(--text-lg); margin-bottom:8px;">4. Kala (Seasonal Influence)</h3>
              <p style="font-size:var(--text-sm); color:var(--text-muted); margin-bottom:12px;">Time of year & disease stage</p>
              <div style="display:flex; justify-content:space-between; font-size:var(--text-sm);">
                <span>Season (Ritu):</span>
                <strong style="color:var(--color-primary);">Grishma (Summer)</strong>
              </div>
            </div>

            <!-- 5. Anala / Agni -->
            <div class="card card--glass">
              <h3 style="font-size:var(--text-lg); margin-bottom:8px;">5. Anala / Agni (Digestive Fire)</h3>
              <p style="font-size:var(--text-sm); color:var(--text-muted); margin-bottom:12px;">Metabolic capacity</p>
              <select class="form-select">
                <option value="vishamagni">Vishamagni (Irregular - Vata)</option>
                <option value="tikshnagni" selected>Tikshnagni (Intense - Pitta)</option>
                <option value="mandagni">Mandagni (Weak - Kapha)</option>
                <option value="samagni">Samagni (Balanced)</option>
              </select>
            </div>

            <!-- 6. Prakriti -->
            <div class="card card--glass" style="grid-column: 1 / -1;">
              <h3 style="font-size:var(--text-lg); margin-bottom:8px;">6. Prakriti (Dominant Body Constitution)</h3>
              <p style="font-size:var(--text-sm); color:var(--text-muted); margin-bottom:16px;">Innate metabolic and physical traits</p>
              <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:var(--space-lg);">
                <div>
                  <div class="flex justify-between" style="font-size:var(--text-sm); margin-bottom:4px;"><span>Vata</span><span>65%</span></div>
                  <div class="dosha-bar"><div class="dosha-bar__fill dosha-bar__fill--vata" style="width:65%;"></div></div>
                </div>
                <div>
                  <div class="flex justify-between" style="font-size:var(--text-sm); margin-bottom:4px;"><span>Pitta</span><span>80%</span></div>
                  <div class="dosha-bar"><div class="dosha-bar__fill dosha-bar__fill--pitta" style="width:80%;"></div></div>
                </div>
                <div>
                  <div class="flex justify-between" style="font-size:var(--text-sm); margin-bottom:4px;"><span>Kapha</span><span>30%</span></div>
                  <div class="dosha-bar"><div class="dosha-bar__fill dosha-bar__fill--kapha" style="width:30%;"></div></div>
                </div>
              </div>
            </div>

            <!-- 7. Vaya -->
            <div class="card card--glass">
              <h3 style="font-size:var(--text-lg); margin-bottom:8px;">7. Vaya (Age Stage)</h3>
              <div style="display:flex; justify-content:space-between; font-size:var(--text-sm);">
                <span>Current Stage:</span>
                <strong style="color:var(--color-primary);">Madhya (Middle Age)</strong>
              </div>
            </div>

            <!-- 8. Satva -->
            <div class="card card--glass">
              <h3 style="font-size:var(--text-lg); margin-bottom:8px;">8. Satva (Psychological Resilience)</h3>
              <select class="form-select">
                <option value="pravara">Pravara (High)</option>
                <option value="madhya" selected>Madhya (Moderate)</option>
                <option value="avara">Avara (Low)</option>
              </select>
            </div>

            <!-- 9. Satmya -->
            <div class="card card--glass">
              <h3 style="font-size:var(--text-lg); margin-bottom:8px;">9. Satmya (Habituation)</h3>
              <p style="font-size:var(--text-sm); color:var(--text-muted);">Tolerance to specific foods & environments.</p>
              <div class="badge mt-sm">Oka-Satmya (Acquired Tolerance)</div>
            </div>

            <!-- 10. Ahara -->
            <div class="card card--glass">
              <h3 style="font-size:var(--text-lg); margin-bottom:8px;">10. Ahara (Nutritional Intake Capacity)</h3>
              <div style="display:flex; justify-content:space-between; font-size:var(--text-sm); margin-bottom:8px;">
                <span>Abhyavaharana Shakti (Ingestion):</span>
                <strong style="color:var(--color-warning);">Moderate</strong>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:var(--text-sm);">
                <span>Jarana Shakti (Digestion):</span>
                <strong style="color:var(--color-success);">High</strong>
              </div>
            </div>

          </div>
        </div>

        <!-- TAB 2: Ahara-Vihara -->
        <div class="tab-pane" id="tab-aharavihara" style="display: none; margin-top:var(--space-xl);">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-xl);">
            
            <div class="card card--glass">
              <h2 style="font-size:var(--text-xl); margin-bottom:16px;">Ahara (Dietary Habits)</h2>
              <div class="form-group" style="margin-bottom:16px;">
                <label style="font-size:var(--text-sm); display:block; margin-bottom:4px;">Dominant Taste Preference (Rasa)</label>
                <select class="form-select">
                  <option>Madhura (Sweet)</option>
                  <option>Amla (Sour)</option>
                  <option>Lavana (Salty)</option>
                  <option selected>Katu (Pungent)</option>
                  <option>Tikta (Bitter)</option>
                  <option>Kashaya (Astringent)</option>
                </select>
              </div>
              <div class="form-group" style="margin-bottom:16px;">
                <label style="font-size:var(--text-sm); display:block; margin-bottom:4px;">Meal Timing</label>
                <input type="text" class="form-input" value="Irregular, late dinner">
              </div>
              <div class="form-group">
                <label style="font-size:var(--text-sm); display:block; margin-bottom:4px;">Food Nature Balance</label>
                <input type="text" class="form-input" value="Excessive Ushna (Hot) & Ruksha (Dry)">
              </div>
            </div>

            <div class="card card--glass">
              <h2 style="font-size:var(--text-xl); margin-bottom:16px;">Vihara (Lifestyle & Routine)</h2>
              <div class="form-group" style="margin-bottom:16px;">
                <label style="font-size:var(--text-sm); display:block; margin-bottom:4px;">Nidra (Sleep Pattern)</label>
                <input type="text" class="form-input" value="Disturbed, 5-6 hours">
              </div>
              <div class="form-group" style="margin-bottom:16px;">
                <label style="font-size:var(--text-sm); display:block; margin-bottom:4px;">Vyayama (Physical Exercise)</label>
                <input type="text" class="form-input" value="Minimal, sedentary desk job">
              </div>
              <div class="form-group" style="margin-bottom:16px;">
                <label style="font-size:var(--text-sm); display:block; margin-bottom:4px;">Stress Levels</label>
                <div class="dosha-bar"><div class="dosha-bar__fill" style="width:85%; background:var(--color-emergency);"></div></div>
                <div class="text-right mt-sm" style="font-size:var(--text-xs); color:var(--text-muted);">85% (High)</div>
              </div>
              <div style="padding:12px; background:rgba(var(--color-primary-rgb),0.1); border-radius:var(--radius-md); text-align:center;">
                <div style="font-size:var(--text-2xl); font-weight:bold; color:var(--color-primary);">42/100</div>
                <div style="font-size:var(--text-sm); color:var(--text-muted);">Dinacharya (Daily Routine) Score</div>
              </div>
            </div>
            
          </div>
        </div>

        <!-- TAB 3: Integrative Summary -->
        <div class="tab-pane" id="tab-integrative" style="display: none; margin-top:var(--space-xl);">
          <div class="exec-summary-card">
            <h2 style="font-size:var(--text-2xl); margin-bottom:16px; color:var(--color-primary);">AYUSH & Allopathic Integrative Summary</h2>
            <p style="font-size:var(--text-sm); color:var(--text-muted); margin-bottom:24px; line-height:1.6;">
              Patient exhibits symptoms consistent with Pitta aggravation (Tikshnagni, hyperacidity) alongside mild Vata imbalance due to stress and irregular routine. Allopathic diagnosis confirms GERD and mild hypertension. Integrative approach involves conventional PPIs for acute management, supplemented with Ayurvedic cooling herbs and lifestyle modifications.
            </p>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-xl);">
              <div>
                <h3 style="font-size:var(--text-lg); margin-bottom:12px; display:flex; align-items:center; gap:8px;">
                  <span>🥗</span> Pathya-Apathya (Dietary Advice)
                </h3>
                <ul style="font-size:var(--text-sm); color:var(--text-secondary); line-height:1.8; padding-left:20px;">
                  <li><strong>Pathya (Beneficial):</strong> Cooling foods, ghee, sweet fruits (melons), milk, coconut water. Regular meal timings.</li>
                  <li><strong>Apathya (Harmful):</strong> Spicy, fried, excessively sour or pungent foods (chillies, pickles). Late night meals.</li>
                </ul>
              </div>
              <div>
                <h3 style="font-size:var(--text-lg); margin-bottom:12px; display:flex; align-items:center; gap:8px;">
                  <span>🌿</span> Herbal Adjuvants & Lifestyle
                </h3>
                <ul style="font-size:var(--text-sm); color:var(--text-secondary); line-height:1.8; padding-left:20px;">
                  <li><strong>Herbs:</strong> Amalaki (Amla), Shatavari, Licorice (Yashtimadhu) as cooling digestives.</li>
                  <li><strong>Yoga/Pranayama:</strong> Sheetali Pranayama, gentle stretching, meditation to manage stress.</li>
                  <li><strong>Routine:</strong> Establish regular sleep schedule (Nidra), early dinner.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function mount() {
    // Tab switching logic
    const tabBtns = document.querySelectorAll('.page--ayush .tab-btn');
    const tabPanes = document.querySelectorAll('.page--ayush .tab-pane');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.style.display = 'none');
        
        btn.classList.add('active');
        const target = document.getElementById(btn.dataset.target);
        if (target) target.style.display = 'block';
      });
    });
  }

  function unmount() {
    // Cleanup if necessary
  }

  function printPass() {
    if (window.MediRoute.components && window.MediRoute.components.showToast) {
      window.MediRoute.components.showToast('Generating AYUSH Health Pass PDF...', 'success');
    } else {
      alert('Generating AYUSH Health Pass PDF...');
    }
  }

  window.MediRoute.pages.ayush = {
    render,
    mount,
    unmount,
    printPass
  };
})();
