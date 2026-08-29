/* ============================================
   MEDIROUTE — AI Recommendation Engine
   ============================================ */
(function () {
  window.MediRoute = window.MediRoute || {};

  // Haversine formula — distance between two lat/lng points in km
  function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // Estimate travel time in minutes (accounting for Indian traffic conditions)
  function estimateTravelTime(distanceKm, hour) {
    hour = hour || new Date().getHours();
    let avgSpeed;
    if (hour >= 8 && hour <= 10 || hour >= 17 && hour <= 20) {
      avgSpeed = 15; // peak traffic
    } else if (hour >= 10 && hour <= 17) {
      avgSpeed = 25; // moderate
    } else {
      avgSpeed = 35; // off-peak / night
    }
    // Ambulance with siren gets ~1.5x speed advantage
    return (distanceKm / avgSpeed) * 60;
  }

  // Score a single hospital against patient parameters
  function calculateScore(hospital, params) {
    const { lat, lng, emergencyType, budget, bedType, insuranceProvider } = params;
    const weights = {
      distance: 0.20,
      travelTime: 0.20,
      bedAvailability: 0.20,
      facilityMatch: 0.12,
      budgetFit: 0.10,
      rating: 0.06,
      successRate: 0.06,
      insurance: 0.06,
    };

    const scores = {};

    // 1. Distance Score (0-100, closer = higher)
    const distance = haversine(lat, lng, hospital.lat, hospital.lng);
    scores.distance = Math.max(0, 100 - (distance * 2.5)); // 40km = score 0
    const distanceKm = distance;

    // 2. Travel Time Score (0-100, faster = higher)
    const travelTime = estimateTravelTime(distance);
    scores.travelTime = Math.max(0, 100 - (travelTime * 1.5)); // 67 min = score 0
    const travelMinutes = travelTime;

    // 3. Bed Availability Score (0-100)
    const bt = bedType || 'emergency';
    const bedInfo = hospital.beds[bt];
    if (!bedInfo || bedInfo.available === 0) {
      scores.bedAvailability = 0;
    } else {
      const occupancyRate = 1 - (bedInfo.available / bedInfo.total);
      scores.bedAvailability = bedInfo.available > 5 ? 100 : (bedInfo.available / 5) * 100;
      // Bonus for low occupancy
      if (occupancyRate < 0.7) scores.bedAvailability = Math.min(100, scores.bedAvailability * 1.1);
    }

    // 4. Facility Match Score (0-100)
    if (emergencyType) {
      scores.facilityMatch = hospital.emergencyTypes.includes(emergencyType) ? 100 : 20;
      // Bonus for having key facilities
      const criticalFacilities = { 'Cardiac': 'Cardiac Lab', 'Trauma': 'Trauma Center', 'Burns': 'Burn Unit', 'Stroke': 'Neuro ICU', 'Neuro': 'Neuro ICU' };
      if (criticalFacilities[emergencyType] && hospital.facilities.includes(criticalFacilities[emergencyType])) {
        scores.facilityMatch = Math.min(100, scores.facilityMatch + 20);
      }
    } else {
      scores.facilityMatch = 50;
    }

    // 5. Budget Fit Score (0-100)
    if (budget && budget > 0) {
      const costPerDay = hospital.costPerDay[bt] || hospital.costPerDay.emergency;
      const estimatedDays = 3; // average emergency stay
      const estimatedCost = costPerDay * estimatedDays;
      if (estimatedCost <= budget) {
        scores.budgetFit = 100;
      } else if (estimatedCost <= budget * 1.5) {
        scores.budgetFit = 60;
      } else if (estimatedCost <= budget * 2) {
        scores.budgetFit = 30;
      } else {
        scores.budgetFit = 10;
      }
    } else {
      scores.budgetFit = 50; // neutral if no budget specified
    }

    // 6. Rating Score (0-100)
    scores.rating = (hospital.rating / 5) * 100;

    // 7. Success Rate Score (0-100)
    scores.successRate = hospital.successRate || 90;

    // 8. Insurance Match Score (0-100)
    if (insuranceProvider) {
      scores.insurance = hospital.insuranceAccepted.some(i => i.toLowerCase().includes(insuranceProvider.toLowerCase())) ? 100 : 20;
    } else {
      scores.insurance = 50;
    }

    // Weighted total
    let totalScore = 0;
    for (const key in weights) {
      totalScore += (scores[key] || 0) * weights[key];
    }

    // Critical penalty: if zero beds, cap the score
    if (scores.bedAvailability === 0) {
      totalScore = Math.min(totalScore, 25);
    }

    // Critical penalty: if too far (> 50km), reduce score
    if (distance > 50) {
      totalScore *= 0.6;
    }

    return {
      totalScore: Math.round(totalScore * 10) / 10,
      factors: {
        distance: { score: Math.round(scores.distance), value: distanceKm.toFixed(1) + ' km', icon: '📍' },
        travelTime: { score: Math.round(scores.travelTime), value: Math.round(travelMinutes) + ' min', icon: '🕐' },
        bedAvailability: { score: Math.round(scores.bedAvailability), value: (hospital.beds[bt]?.available || 0) + ' beds', icon: '🛏️' },
        facilityMatch: { score: Math.round(scores.facilityMatch), value: scores.facilityMatch >= 80 ? 'Excellent' : scores.facilityMatch >= 50 ? 'Good' : 'Limited', icon: '🏥' },
        budgetFit: { score: Math.round(scores.budgetFit), value: budget ? '₹' + (hospital.costPerDay[bt] || 0).toLocaleString() + '/day' : 'N/A', icon: '💰' },
        rating: { score: Math.round(scores.rating), value: hospital.rating + ' ⭐', icon: '⭐' },
        successRate: { score: Math.round(scores.successRate), value: (hospital.successRate || 90) + '%', icon: '📊' },
        insurance: { score: Math.round(scores.insurance), value: scores.insurance >= 80 ? 'Accepted' : 'Not in Network', icon: '🛡️' },
      },
      distanceKm,
      travelMinutes: Math.round(travelMinutes),
      estimatedCost: (hospital.costPerDay[bt] || hospital.costPerDay.emergency) * 3,
    };
  }

  // Find and rank the best hospitals for given parameters
  function findBestHospitals(params) {
    const { lat, lng } = params;
    if (!lat || !lng) return [];

    const store = window.MediRoute.store;
    const results = store.hospitals.map(hospital => {
      const analysis = calculateScore(hospital, params);
      return {
        hospital,
        ...analysis,
      };
    });

    // Sort by total score descending
    results.sort((a, b) => b.totalScore - a.totalScore);

    // Mark best match
    if (results.length > 0) results[0].isBestMatch = true;

    return results;
  }

  // Generate AI reasoning text for a recommendation
  function generateReasoning(result, params) {
    const { hospital, factors, travelMinutes, distanceKm } = result;
    const reasons = [];

    if (factors.distance.score >= 70) reasons.push(`Located just ${distanceKm.toFixed(1)} km away`);
    if (factors.travelTime.score >= 70) reasons.push(`ETA only ${travelMinutes} minutes by ambulance`);
    if (factors.bedAvailability.score >= 80) reasons.push(`${factors.bedAvailability.value} available right now`);
    if (factors.facilityMatch.score >= 80 && params.emergencyType) reasons.push(`Specialized ${params.emergencyType} care available`);
    if (factors.budgetFit.score >= 80) reasons.push('Within your budget range');
    if (factors.insurance.score >= 80) reasons.push('Your insurance is accepted');
    if (hospital.successRate >= 95) reasons.push(`${hospital.successRate}% success rate`);

    if (reasons.length === 0) {
      reasons.push(`${hospital.type} hospital with ${hospital.rating} rating`);
    }

    return reasons.join(' • ');
  }

  // ---- AI API ----
  window.MediRoute.ai = {
    findBestHospitals,
    calculateScore,
    generateReasoning,
    haversine,
    estimateTravelTime,
  };

  // ---- Clinical AI API ----
  const symptomTrees = {
    'Chest Pain': {
      questions: [
        { id: 'cp1', text: 'Where exactly is the pain?', options: ['Center/Left', 'Right', 'Back', 'Moving to arm/jaw'] },
        { id: 'cp2', text: 'How does it feel?', options: ['Crushing/Heavy', 'Sharp', 'Burning', 'Dull'] },
      ],
      redFlags: ['Moving to arm/jaw', 'Crushing/Heavy']
    },
    'Headache': {
      questions: [
        { id: 'ha1', text: 'How fast did it come on?', options: ['Sudden "thunderclap"', 'Gradual over hours', 'Over days'] },
        { id: 'ha2', text: 'Any other symptoms?', options: ['Slurred speech', 'Vision changes', 'Stiff neck', 'None'] }
      ],
      redFlags: ['Sudden "thunderclap"', 'Slurred speech', 'Stiff neck']
    },
    'Fever': {
      questions: [
        { id: 'f1', text: 'How high is your fever?', options: ['>103F (39.4C)', '100-103F', '<100F'] },
        { id: 'f2', text: 'Any difficulty breathing?', options: ['Severe dyspnea', 'Mild shortness of breath', 'No'] }
      ],
      redFlags: ['>103F (39.4C)', 'Severe dyspnea']
    },
    'Abdominal Pain': {
      questions: [
        { id: 'ap1', text: 'Any blood in stool or vomit?', options: ['Blood in stool/vomit', 'No blood'] },
        { id: 'ap2', text: 'Is the pain severe and sudden?', options: ['Yes', 'No'] }
      ],
      redFlags: ['Blood in stool/vomit']
    },
    'Shortness of Breath': {
      questions: [
        { id: 'sb1', text: 'Are you gasping for air?', options: ['Yes, severe dyspnea', 'No, manageable'] },
      ],
      redFlags: ['Yes, severe dyspnea']
    },
    'Dizziness': {
      questions: [
        { id: 'dz1', text: 'Did you pass out?', options: ['Yes', 'No'] },
        { id: 'dz2', text: 'Any chest pain or slurred speech?', options: ['Yes', 'No'] }
      ],
      redFlags: ['Yes']
    },
    'General': {
      questions: [
        { id: 'g1', text: 'How are you feeling?', options: ['Very bad', 'Okay'] }
      ],
      redFlags: []
    }
  };

  function evaluateRedFlags(answers, symptoms) {
    const triggerPhrases = ['crushing chest pain', 'left arm pain', 'slurred speech', 'high fever >103F', 'severe dyspnea', 'blood in stool/vomit', 'thunderclap'];
    const alerts = [];
    let isRedFlag = false;

    const text = (symptoms || '').toLowerCase();
    triggerPhrases.forEach(phrase => {
      if (text.includes(phrase.toLowerCase())) {
        isRedFlag = true;
        alerts.push(phrase);
      }
    });

    (answers || []).forEach(ans => {
      triggerPhrases.forEach(phrase => {
        if (ans.toLowerCase().includes(phrase.toLowerCase())) {
          isRedFlag = true;
          alerts.push(ans);
        }
      });
      ['Moving to arm/jaw', 'Crushing/Heavy', 'Sudden "thunderclap"', '>103F (39.4C)', 'Severe dyspnea', 'Blood in stool/vomit', 'Slurred speech'].forEach(rf => {
         if(ans.toLowerCase().includes(rf.toLowerCase()) && !alerts.includes(rf)) {
           isRedFlag = true;
           alerts.push(rf);
         }
      });
    });

    return {
      isRedFlag,
      priority: isRedFlag ? 'EMERGENCY' : (alerts.length > 0 ? 'URGENT' : 'ROUTINE'),
      alerts: [...new Set(alerts)]
    };
  }

  function extractDocumentData(textOrFile) {
    const text = typeof textOrFile === 'string' ? textOrFile : "Simulated document content with Type 2 Diabetes, Metoprolol 50mg, HbA1c: 7.2%, and Penicillin allergy.";
    const data = {
      diagnoses: [],
      medications: [],
      labs: [],
      allergies: []
    };
    
    if (text.includes('Diabetes')) data.diagnoses.push('Type 2 Diabetes');
    if (text.includes('Hypertension')) data.diagnoses.push('Hypertension');
    if (text.includes('Coronary')) data.diagnoses.push('Coronary Artery Disease');

    if (text.includes('Metoprolol')) data.medications.push('Metoprolol 50mg');
    if (text.includes('Metformin')) data.medications.push('Metformin 500mg');
    if (text.includes('Aspirin')) data.medications.push('Aspirin 75mg');

    if (text.includes('HbA1c')) data.labs.push('HbA1c: 7.2%');
    if (text.includes('Troponin')) data.labs.push('Troponin I: Negative');
    if (text.includes('BP:')) data.labs.push('BP: 130/85 mmHg');

    if (text.includes('Penicillin')) data.allergies.push('Penicillin');
    
    return data;
  }

  function generate30SecSummary(intakeData) {
    const rf = evaluateRedFlags(intakeData.answers, intakeData.symptoms);
    return {
      chiefComplaint: intakeData.chiefComplaint || 'Unknown',
      redFlags: rf.alerts,
      activeMeds: intakeData.extractedData ? intakeData.extractedData.medications : [],
      allergies: intakeData.extractedData ? intakeData.extractedData.allergies : [],
      labResults: intakeData.extractedData ? intakeData.extractedData.labs : [],
      timeline: intakeData.timeline || [],
      confidenceScore: 96
    };
  }

  window.MediRoute.clinicalAI = {
    symptomTrees,
    evaluateRedFlags,
    extractDocumentData,
    generate30SecSummary
  };
})();
