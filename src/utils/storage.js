export const STORAGE_KEY = 'nobi_app_data';

export const defaultState = {
  user: {
    name: '',
    ageGroup: '',
    dominantHand: '',
    symptoms: [],
    takingLevodopa: false,
    medicationTiming: [],
    goal: '',
    onboarded: false,
    role: null, // 'patient' | 'caregiver'
  },
  settings: {
    language: 'en', // en, hi, es, ja, kn
    voiceOn: true,
    speed: 0.9,
  },
  sessions: [],
  mealLogs: []
};

export const loadData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultState;
  } catch (e) {
    console.error('Failed to load data', e);
    return defaultState;
  }
};

export const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data', e);
  }
};
