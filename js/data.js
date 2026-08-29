/* ============================================
   MEDIROUTE — Data Store & Seed Data
   ============================================ */
(function () {
  window.MediRoute = window.MediRoute || {};

  // ---- Seed Data: Hospitals ----
  const hospitals = [
    { id: 'h1', name: 'AIIMS New Delhi', city: 'Delhi NCR', area: 'Ansari Nagar', lat: 28.5672, lng: 77.2100, phone: '+91-11-26588500', rating: 4.9, type: 'Government Super-Specialty', beds: { icu: { total: 50, available: 12 }, general: { total: 400, available: 85 }, emergency: { total: 60, available: 18 }, pediatric: { total: 40, available: 8 } }, facilities: ['Trauma Center', 'Blood Bank', 'Ventilators', 'MRI', 'CT Scan', 'Cardiac Lab', 'Burn Unit', 'Neuro ICU', 'Organ Transplant'], costPerDay: { icu: 3000, general: 500, emergency: 2000, pediatric: 800 }, ambulances: 15, insuranceAccepted: ['PMJAY', 'CGHS', 'ECHS', 'State Health Schemes'], emergencyTypes: ['Cardiac', 'Trauma', 'Burns', 'Stroke', 'Pediatric', 'General', 'Neuro', 'Transplant'], successRate: 94.2 },
    { id: 'h2', name: 'Fortis Escorts Heart Institute', city: 'Delhi NCR', area: 'Okhla Road', lat: 28.5604, lng: 77.2732, phone: '+91-11-47135000', rating: 4.8, type: 'Super-Specialty', beds: { icu: { total: 35, available: 8 }, general: { total: 200, available: 40 }, emergency: { total: 30, available: 7 }, pediatric: { total: 15, available: 3 } }, facilities: ['Trauma Center', 'Blood Bank', 'Ventilators', 'MRI', 'CT Scan', 'Cardiac Lab', 'Neuro ICU'], costPerDay: { icu: 30000, general: 6000, emergency: 20000, pediatric: 10000 }, ambulances: 8, insuranceAccepted: ['Star Health', 'ICICI Lombard', 'Max Bupa', 'PMJAY'], emergencyTypes: ['Cardiac', 'Trauma', 'Stroke', 'General'], successRate: 96.5 },
    { id: 'h3', name: 'Max Super Speciality Hospital', city: 'Delhi NCR', area: 'Saket', lat: 28.5284, lng: 77.2119, phone: '+91-11-26515050', rating: 4.7, type: 'Multi-Specialty', beds: { icu: { total: 40, available: 10 }, general: { total: 250, available: 50 }, emergency: { total: 40, available: 12 }, pediatric: { total: 20, available: 5 } }, facilities: ['Trauma Center', 'Blood Bank', 'Ventilators', 'MRI', 'CT Scan', 'Cardiac Lab', 'Robotic Surgery'], costPerDay: { icu: 28000, general: 5500, emergency: 18000, pediatric: 9000 }, ambulances: 10, insuranceAccepted: ['Star Health', 'ICICI Lombard', 'Max Bupa', 'PMJAY', 'HDFC ERGO'], emergencyTypes: ['Cardiac', 'Trauma', 'Stroke', 'General', 'Neuro'], successRate: 95.8 },
    { id: 'h4', name: 'Indraprastha Apollo Hospital', city: 'Delhi NCR', area: 'Sarita Vihar', lat: 28.5397, lng: 77.2834, phone: '+91-11-26925858', rating: 4.8, type: 'Super-Specialty', beds: { icu: { total: 45, available: 9 }, general: { total: 300, available: 60 }, emergency: { total: 50, available: 15 }, pediatric: { total: 25, available: 6 } }, facilities: ['Trauma Center', 'Blood Bank', 'Ventilators', 'MRI', 'CT Scan', 'Cardiac Lab', 'Organ Transplant', 'Burn Unit'], costPerDay: { icu: 32000, general: 6500, emergency: 21000, pediatric: 10500 }, ambulances: 12, insuranceAccepted: ['Star Health', 'ICICI Lombard', 'Max Bupa', 'PMJAY', 'Bajaj Allianz'], emergencyTypes: ['Cardiac', 'Trauma', 'Burns', 'Stroke', 'Pediatric', 'General', 'Transplant'], successRate: 97.2 },
    { id: 'h5', name: 'Medanta — The Medicity', city: 'Delhi NCR', area: 'Gurgaon Sector 38', lat: 28.4388, lng: 77.0425, phone: '+91-124-4141414', rating: 4.9, type: 'Super-Specialty', beds: { icu: { total: 60, available: 15 }, general: { total: 500, available: 110 }, emergency: { total: 70, available: 20 }, pediatric: { total: 30, available: 8 } }, facilities: ['Trauma Center', 'Blood Bank', 'Ventilators', 'MRI', 'CT Scan', 'Cardiac Lab', 'Organ Transplant', 'Robotic Surgery', 'Neuro ICU'], costPerDay: { icu: 35000, general: 7000, emergency: 22000, pediatric: 11000 }, ambulances: 14, insuranceAccepted: ['Star Health', 'ICICI Lombard', 'Max Bupa', 'PMJAY', 'HDFC ERGO', 'New India Assurance'], emergencyTypes: ['Cardiac', 'Trauma', 'Burns', 'Stroke', 'Pediatric', 'General', 'Neuro', 'Transplant'], successRate: 98.1 },
    { id: 'h6', name: 'Sir Ganga Ram Hospital', city: 'Delhi NCR', area: 'Rajinder Nagar', lat: 28.6385, lng: 77.1895, phone: '+91-11-25750000', rating: 4.6, type: 'Multi-Specialty', beds: { icu: { total: 30, available: 6 }, general: { total: 350, available: 70 }, emergency: { total: 35, available: 9 }, pediatric: { total: 20, available: 4 } }, facilities: ['Trauma Center', 'Blood Bank', 'Ventilators', 'MRI', 'CT Scan', 'Cardiac Lab', 'Organ Transplant'], costPerDay: { icu: 22000, general: 4500, emergency: 14000, pediatric: 7500 }, ambulances: 7, insuranceAccepted: ['Star Health', 'Max Bupa', 'New India Assurance', 'PMJAY', 'CGHS'], emergencyTypes: ['Cardiac', 'Trauma', 'Stroke', 'Pediatric', 'General', 'Transplant'], successRate: 95.8 },
    { id: 'h7', name: 'Asian Heart Institute', city: 'Mumbai', area: 'BKC Bandra', lat: 19.0657, lng: 72.8687, phone: '+91-22-66986666', rating: 4.8, type: 'Super-Specialty', beds: { icu: { total: 30, available: 7 }, general: { total: 180, available: 35 }, emergency: { total: 25, available: 6 }, pediatric: { total: 10, available: 2 } }, facilities: ['Blood Bank', 'Ventilators', 'MRI', 'CT Scan', 'Cardiac Lab', 'Robotic Surgery'], costPerDay: { icu: 35000, general: 7000, emergency: 20000, pediatric: 10000 }, ambulances: 6, insuranceAccepted: ['Star Health', 'ICICI Lombard', 'PMJAY'], emergencyTypes: ['Cardiac', 'Trauma', 'Stroke', 'General'], successRate: 97.5 },
    { id: 'h8', name: 'Lilavati Hospital', city: 'Mumbai', area: 'Bandra West', lat: 19.0518, lng: 72.8286, phone: '+91-22-26751000', rating: 4.7, type: 'Multi-Specialty', beds: { icu: { total: 35, available: 9 }, general: { total: 220, available: 45 }, emergency: { total: 30, available: 8 }, pediatric: { total: 15, available: 4 } }, facilities: ['Trauma Center', 'Blood Bank', 'Ventilators', 'MRI', 'CT Scan', 'Cardiac Lab', 'Neuro ICU'], costPerDay: { icu: 30000, general: 6000, emergency: 20000, pediatric: 10000 }, ambulances: 8, insuranceAccepted: ['Star Health', 'ICICI Lombard', 'Max Bupa', 'PMJAY'], emergencyTypes: ['Cardiac', 'Trauma', 'Stroke', 'Pediatric', 'General'], successRate: 96.2 },
    { id: 'h9', name: 'Kokilaben Dhirubhai Ambani Hospital', city: 'Mumbai', area: 'Andheri West', lat: 19.1311, lng: 72.8253, phone: '+91-22-30666666', rating: 4.9, type: 'Multi-Specialty', beds: { icu: { total: 45, available: 11 }, general: { total: 300, available: 65 }, emergency: { total: 40, available: 10 }, pediatric: { total: 20, available: 5 } }, facilities: ['Trauma Center', 'Blood Bank', 'Ventilators', 'MRI', 'CT Scan', 'Cardiac Lab', 'Robotic Surgery', 'Neuro ICU', 'Organ Transplant'], costPerDay: { icu: 32000, general: 6500, emergency: 22000, pediatric: 11000 }, ambulances: 10, insuranceAccepted: ['Star Health', 'ICICI Lombard', 'Max Bupa', 'PMJAY', 'HDFC ERGO'], emergencyTypes: ['Cardiac', 'Trauma', 'Stroke', 'Pediatric', 'General', 'Neuro', 'Transplant'], successRate: 97.8 },
    { id: 'h10', name: 'Manipal Hospital', city: 'Bangalore', area: 'Old Airport Road', lat: 12.9583, lng: 77.6487, phone: '+91-80-25024444', rating: 4.7, type: 'Multi-Specialty', beds: { icu: { total: 40, available: 10 }, general: { total: 300, available: 60 }, emergency: { total: 35, available: 9 }, pediatric: { total: 20, available: 4 } }, facilities: ['Trauma Center', 'Blood Bank', 'Ventilators', 'MRI', 'CT Scan', 'Cardiac Lab', 'Robotic Surgery'], costPerDay: { icu: 28000, general: 5500, emergency: 18000, pediatric: 9000 }, ambulances: 8, insuranceAccepted: ['Star Health', 'ICICI Lombard', 'Max Bupa', 'PMJAY', 'New India Assurance'], emergencyTypes: ['Cardiac', 'Trauma', 'Stroke', 'Pediatric', 'General'], successRate: 96.4 },
    { id: 'h11', name: 'Narayana Health City', city: 'Bangalore', area: 'Bommasandra', lat: 12.8081, lng: 77.6958, phone: '+91-80-71222222', rating: 4.8, type: 'Super-Specialty', beds: { icu: { total: 50, available: 14 }, general: { total: 450, available: 90 }, emergency: { total: 50, available: 15 }, pediatric: { total: 30, available: 7 } }, facilities: ['Trauma Center', 'Blood Bank', 'Ventilators', 'MRI', 'CT Scan', 'Cardiac Lab', 'Organ Transplant', 'Robotic Surgery'], costPerDay: { icu: 25000, general: 5000, emergency: 16000, pediatric: 8000 }, ambulances: 12, insuranceAccepted: ['Star Health', 'ICICI Lombard', 'Max Bupa', 'PMJAY', 'Bajaj Allianz', 'HDFC ERGO'], emergencyTypes: ['Cardiac', 'Trauma', 'Stroke', 'Pediatric', 'General', 'Transplant'], successRate: 97.5 },
    { id: 'h12', name: 'Apollo Hospitals', city: 'Chennai', area: 'Greams Road', lat: 13.0603, lng: 80.2514, phone: '+91-44-28290200', rating: 4.8, type: 'Multi-Specialty', beds: { icu: { total: 40, available: 10 }, general: { total: 320, available: 70 }, emergency: { total: 40, available: 11 }, pediatric: { total: 20, available: 5 } }, facilities: ['Trauma Center', 'Blood Bank', 'Ventilators', 'MRI', 'CT Scan', 'Cardiac Lab', 'Organ Transplant'], costPerDay: { icu: 28000, general: 5500, emergency: 18000, pediatric: 9000 }, ambulances: 10, insuranceAccepted: ['Star Health', 'ICICI Lombard', 'Max Bupa', 'PMJAY', 'HDFC ERGO'], emergencyTypes: ['Cardiac', 'Trauma', 'Stroke', 'Pediatric', 'General', 'Transplant'], successRate: 96.8 },
    { id: 'h13', name: 'AMRI Hospital Kolkata', city: 'Kolkata', area: 'Dhakuria', lat: 22.5134, lng: 88.3662, phone: '+91-33-66800000', rating: 4.5, type: 'Multi-Specialty', beds: { icu: { total: 30, available: 6 }, general: { total: 200, available: 40 }, emergency: { total: 25, available: 5 }, pediatric: { total: 15, available: 3 } }, facilities: ['Blood Bank', 'Ventilators', 'MRI', 'CT Scan', 'Cardiac Lab'], costPerDay: { icu: 22000, general: 4500, emergency: 15000, pediatric: 7500 }, ambulances: 6, insuranceAccepted: ['Star Health', 'ICICI Lombard', 'PMJAY', 'Swasthya Sathi'], emergencyTypes: ['Cardiac', 'Trauma', 'Stroke', 'General'], successRate: 94.5 },
    { id: 'h14', name: 'Yashoda Hospital Hyderabad', city: 'Hyderabad', area: 'Somajiguda', lat: 17.4256, lng: 78.4523, phone: '+91-40-45674567', rating: 4.6, type: 'Multi-Specialty', beds: { icu: { total: 40, available: 8 }, general: { total: 250, available: 50 }, emergency: { total: 30, available: 7 }, pediatric: { total: 20, available: 4 } }, facilities: ['Blood Bank', 'Ventilators', 'MRI', 'CT Scan', 'Cardiac Lab', 'Robotic Surgery'], costPerDay: { icu: 24000, general: 4800, emergency: 16000, pediatric: 8000 }, ambulances: 7, insuranceAccepted: ['Star Health', 'ICICI Lombard', 'PMJAY', 'Aarogyasri'], emergencyTypes: ['Cardiac', 'Trauma', 'Stroke', 'General'], successRate: 95.5 },
    { id: 'h15', name: 'Ruby Hall Clinic Pune', city: 'Pune', area: 'Sassoon Road', lat: 18.5332, lng: 73.8767, phone: '+91-20-66455100', rating: 4.7, type: 'Multi-Specialty', beds: { icu: { total: 35, available: 7 }, general: { total: 220, available: 45 }, emergency: { total: 25, available: 5 }, pediatric: { total: 15, available: 3 } }, facilities: ['Trauma Center', 'Blood Bank', 'Ventilators', 'MRI', 'CT Scan', 'Cardiac Lab', 'Organ Transplant'], costPerDay: { icu: 25000, general: 5000, emergency: 16000, pediatric: 8000 }, ambulances: 6, insuranceAccepted: ['Star Health', 'ICICI Lombard', 'Max Bupa', 'PMJAY', 'Bajaj Allianz'], emergencyTypes: ['Cardiac', 'Trauma', 'Stroke', 'General', 'Transplant'], successRate: 96.0 },
  ];

  // ---- Seed Data: Doctors ----
  const specialties = ['Cardiologist', 'Neurologist', 'Orthopedic Surgeon', 'General Surgeon', 'Pediatrician', 'Emergency Medicine', 'Pulmonologist', 'Anesthesiologist', 'Trauma Surgeon', 'Burn Specialist', 'Intensivist', 'Radiologist'];
  const firstNames = ['Dr. Rajesh', 'Dr. Priya', 'Dr. Amit', 'Dr. Sneha', 'Dr. Vikram', 'Dr. Anjali', 'Dr. Suresh', 'Dr. Meera', 'Dr. Arjun', 'Dr. Kavita', 'Dr. Rohit', 'Dr. Deepa', 'Dr. Sanjay', 'Dr. Nisha', 'Dr. Arun', 'Dr. Pooja', 'Dr. Manish', 'Dr. Swati', 'Dr. Karan', 'Dr. Divya'];
  const lastNames = ['Sharma', 'Patel', 'Gupta', 'Singh', 'Kumar', 'Reddy', 'Nair', 'Iyer', 'Das', 'Chopra', 'Mehta', 'Joshi', 'Verma', 'Rao', 'Bhatia', 'Agarwal', 'Mukherjee', 'Chatterjee', 'Menon', 'Pillai'];
  const statuses = ['Available', 'On Duty', 'In Surgery', 'On Break', 'Off Duty'];

  const doctors = [];
  let docId = 1;
  hospitals.forEach(h => {
    h.doctors = [];
    const count = 3 + Math.floor(Math.random() * 3); // 3 to 5 doctors
    for (let i = 0; i < count; i++) {
      const doc = {
        id: 'd' + docId++,
        hospitalId: h.id,
        name: firstNames[Math.floor(Math.random() * firstNames.length)] + ' ' + lastNames[Math.floor(Math.random() * lastNames.length)],
        specialty: specialties[Math.floor(Math.random() * specialties.length)],
        experience: 5 + Math.floor(Math.random() * 25),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        rating: (3.5 + Math.random() * 1.5).toFixed(1),
        phone: '+91-' + (7000000000 + Math.floor(Math.random() * 3000000000)),
      };
      doctors.push(doc);
      h.doctors.push(doc);
    }
  });

  // ---- Seed Data: Ambulances ----
  const ambulanceTypes = ['Basic Life Support', 'Advanced Life Support', 'Patient Transport', 'Neonatal'];
  const ambulanceStatuses = ['Available', 'En Route', 'At Scene', 'Returning', 'Maintenance'];
  const ambulances = [];
  let ambId = 1;
  hospitals.forEach(h => {
    for (let i = 0; i < h.ambulances; i++) {
      const status = ambulanceStatuses[Math.floor(Math.random() * ambulanceStatuses.length)];
      ambulances.push({
        id: 'AMB-' + String(ambId++).padStart(3, '0'),
        hospitalId: h.id,
        hospitalName: h.name,
        type: ambulanceTypes[Math.floor(Math.random() * ambulanceTypes.length)],
        status: status,
        driver: firstNames[Math.floor(Math.random() * firstNames.length)].replace('Dr. ', '') + ' ' + lastNames[Math.floor(Math.random() * lastNames.length)],
        phone: '+91-' + (7000000000 + Math.floor(Math.random() * 3000000000)),
        lat: h.lat + (Math.random() - 0.5) * 0.05,
        lng: h.lng + (Math.random() - 0.5) * 0.05,
        equipment: ['Oxygen', 'Defibrillator', 'Stretcher', 'First Aid Kit'].concat(Math.random() > 0.5 ? ['Ventilator'] : []),
        eta: status === 'En Route' ? Math.floor(5 + Math.random() * 25) : null,
        destination: status === 'En Route' ? h.name : null,
      });
    }
  });

  // ---- Seed Data: Patients (demo) ----
  const patients = [
    {
      id: 'p1', name: 'Aarav Mehta', age: 34, gender: 'Male', blood: 'O+', phone: '+91-9876543210',
      address: '42 MG Road, Connaught Place, Delhi',
      emergencyContact: { name: 'Priya Mehta', relation: 'Spouse', phone: '+91-9876543211' },
      insurance: { provider: 'Star Health', policyNumber: 'SH-2024-0892341', type: 'Comprehensive', coverage: 1000000, validTill: '2027-03-15' },
      allergies: ['Penicillin', 'Sulfa drugs'],
      conditions: ['Type 2 Diabetes', 'Hypertension'],
      medications: ['Metformin 500mg', 'Amlodipine 5mg'],
      history: [
        { date: '2025-11-20', event: 'Annual Checkup', hospital: 'Apollo Emergency Hospital', notes: 'Blood sugar levels slightly elevated. Medication adjusted.' },
        { date: '2025-06-15', event: 'Emergency Visit - Chest Pain', hospital: 'Max Super Speciality Hospital', notes: 'ECG normal. Stress test performed. Cleared.' },
        { date: '2024-09-10', event: 'Surgery - Appendectomy', hospital: 'Sir Ganga Ram Hospital', notes: 'Successful laparoscopic appendectomy. Recovery uneventful.' },
        { date: '2024-03-05', event: 'Diabetes Diagnosis', hospital: 'Apollo Emergency Hospital', notes: 'HbA1c: 7.2%. Started on Metformin.' },
        { date: '2023-08-22', event: 'Fracture Treatment', hospital: 'Fortis Hospital', notes: 'Right wrist fracture. Cast applied for 6 weeks.' },
      ]
    }
  ];

  // ---- Insurance Plans ----
  const insurancePlans = [
    { id: 'ins1', name: 'PMJAY - Ayushman Bharat', type: 'Government', coverage: 500000, premium: 0, description: 'Free health insurance for economically weaker sections', hospitals: 'All empanelled government & private hospitals' },
    { id: 'ins2', name: 'Star Health - Comprehensive', type: 'Private', coverage: 1000000, premium: 15000, description: 'Covers hospitalization, pre & post care, day care', hospitals: 'Network of 14,000+ hospitals' },
    { id: 'ins3', name: 'ICICI Lombard - Complete Health', type: 'Private', coverage: 2000000, premium: 22000, description: 'Comprehensive coverage with no-claim bonus', hospitals: 'Network of 10,000+ hospitals' },
    { id: 'ins4', name: 'Max Bupa - Health Companion', type: 'Private', coverage: 1500000, premium: 18000, description: 'Family floater with wellness benefits', hospitals: 'Network of 8,500+ hospitals' },
    { id: 'ins5', name: 'HDFC ERGO - Optima Restore', type: 'Private', coverage: 1000000, premium: 12000, description: 'Sum insured restoration benefit', hospitals: 'Network of 13,000+ hospitals' },
    { id: 'ins6', name: 'New India Assurance', type: 'Government', coverage: 500000, premium: 8000, description: 'PSU insurer with wide hospital network', hospitals: 'All government and most private hospitals' },
    { id: 'ins7', name: 'Aarogyasri (Telangana)', type: 'State Government', coverage: 500000, premium: 0, description: 'Telangana state health scheme', hospitals: 'Empanelled hospitals in Telangana' },
    { id: 'ins8', name: 'Swasthya Sathi (WB)', type: 'State Government', coverage: 500000, premium: 0, description: 'West Bengal state health scheme', hospitals: 'Empanelled hospitals in West Bengal' },
  ];

  // ---- Platform Stats ----
  const stats = {
    totalHospitals: hospitals.length,
    totalBeds: hospitals.reduce((sum, h) => sum + h.beds.icu.total + h.beds.general.total + h.beds.emergency.total + h.beds.pediatric.total, 0),
    availableBeds: hospitals.reduce((sum, h) => sum + h.beds.icu.available + h.beds.general.available + h.beds.emergency.available + h.beds.pediatric.available, 0),
    totalDoctors: doctors.length,
    activeDoctors: doctors.filter(d => d.status === 'Available' || d.status === 'On Duty').length,
    totalAmbulances: ambulances.length,
    availableAmbulances: ambulances.filter(a => a.status === 'Available').length,
    livesSaved: 12847,
    avgResponseTime: 8.5,
    citiesCovered: [...new Set(hospitals.map(h => h.city))].length,
  };

  // ---- Real-Time Simulation ----
  let simulationInterval = null;

  function startSimulation() {
    simulationInterval = setInterval(() => {
      // Randomly update bed availability
      const h = hospitals[Math.floor(Math.random() * hospitals.length)];
      const bedTypes = ['icu', 'general', 'emergency', 'pediatric'];
      const bedType = bedTypes[Math.floor(Math.random() * bedTypes.length)];
      const change = Math.random() > 0.5 ? 1 : -1;
      const newVal = h.beds[bedType].available + change;
      if (newVal >= 0 && newVal <= h.beds[bedType].total) {
        h.beds[bedType].available = newVal;
      }

      // Randomly update doctor statuses
      const d = doctors[Math.floor(Math.random() * doctors.length)];
      d.status = statuses[Math.floor(Math.random() * statuses.length)];

      // Randomly move ambulances
      ambulances.forEach(a => {
        if (a.status === 'En Route') {
          a.lat += (Math.random() - 0.5) * 0.002;
          a.lng += (Math.random() - 0.5) * 0.002;
          if (a.eta > 0) a.eta -= 1;
          if (a.eta <= 0) {
            a.status = 'At Scene';
            a.eta = null;
          }
        }
      });

      // Update stats
      stats.availableBeds = hospitals.reduce((sum, h2) => sum + h2.beds.icu.available + h2.beds.general.available + h2.beds.emergency.available + h2.beds.pediatric.available, 0);
      stats.activeDoctors = doctors.filter(d2 => d2.status === 'Available' || d2.status === 'On Duty').length;
      stats.availableAmbulances = ambulances.filter(a2 => a2.status === 'Available').length;

      // Fire event
      window.dispatchEvent(new CustomEvent('mediroute:dataUpdate'));
    }, 3000);
  }

  function stopSimulation() {
    if (simulationInterval) clearInterval(simulationInterval);
  }

  // ---- Store API ----
  window.MediRoute.store = {
    hospitals,
    doctors,
    ambulances,
    patients,
    insurancePlans,
    stats,
    getHospital(id) { return hospitals.find(h => h.id === id); },
    getDoctorsForHospital(hospitalId) { return doctors.filter(d => d.hospitalId === hospitalId); },
    getAvailableAmbulances() { return ambulances.filter(a => a.status === 'Available'); },
    getAmbulancesForHospital(hospitalId) { return ambulances.filter(a => a.hospitalId === hospitalId); },
    getInsurancePlans() { return insurancePlans; },
    getHospitalsByCity(city) { return hospitals.filter(h => h.city === city); },
    getCities() { return [...new Set(hospitals.map(h => h.city))]; },
    updateBed(hospitalId, bedType, change) {
      const h = hospitals.find(h2 => h2.id === hospitalId);
      if (h) {
        const newVal = h.beds[bedType].available + change;
        if (newVal >= 0 && newVal <= h.beds[bedType].total) {
          h.beds[bedType].available = newVal;
          window.dispatchEvent(new CustomEvent('mediroute:dataUpdate'));
          return true;
        }
      }
      return false;
    },
    addHospital(h) {
      hospitals.push(h);
      window.dispatchEvent(new CustomEvent('mediroute:dataUpdate'));
    },
    addPatient(p) {
      patients.push(p);
      window.dispatchEvent(new CustomEvent('mediroute:dataUpdate'));
    },
    updatePatient(id, data) {
      const p = patients.find(patient => patient.id === id);
      if (p) {
        Object.assign(p, data);
        window.dispatchEvent(new CustomEvent('mediroute:dataUpdate'));
      }
    },
    addAmbulance(a) {
      ambulances.push(a);
      window.dispatchEvent(new CustomEvent('mediroute:dataUpdate'));
    },
    addInsurancePlan(plan) {
      insurancePlans.push(plan);
      window.dispatchEvent(new CustomEvent('mediroute:dataUpdate'));
    },
    startSimulation,
    stopSimulation,
  };
})();
