import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadData, saveData } from '../utils/storage';
import { getRandomMessage } from '../data/messages';
import { getTranslation } from '../data/i18n';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(loadData);
  const [currentPage, setCurrentPage] = useState('login');
  const [testResults, setTestResults] = useState({ spiral: null, tap: null, voice: null });
  const [nobiState, setNobiState] = useState('idle');
  const [nobiMessage, setNobiMessage] = useState("");

  const lang = data.settings?.language || 'en';

  useEffect(() => { saveData(data); }, [data]);

  // Translate wrapper
  const t = useCallback((key) => getTranslation(lang, key), [lang]);

  const updateUser = useCallback((userFields) => {
    setData(d => ({ ...d, user: { ...d.user, ...userFields } }));
  }, []);

  const updateSettings = useCallback((settingFields) => {
    setData(d => ({ ...d, settings: { ...d.settings, ...settingFields } }));
  }, []);

  const addSession = useCallback((session) => {
    setData(d => ({ ...d, sessions: [session, ...d.sessions].slice(0, 30) }));
  }, []);

  const addMealLog = useCallback((log) => {
    setData(d => ({ ...d, mealLogs: [log, ...d.mealLogs].slice(0, 90) }));
  }, []);

  const speak = useCallback((text, speedOverride) => {
    if (!window.speechSynthesis) return;
    if (data.settings && !data.settings.voiceOn) {
      setNobiMessage(text);
      return;
    }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = speedOverride || data.settings?.speed || 0.9;
    utt.pitch = 1.05;
    utt.volume = 0.85;
    
    // Set language for TTS
    const langMap = { en: 'en-US', hi: 'hi-IN', es: 'es-ES', ja: 'ja-JP', kn: 'kn-IN' };
    utt.lang = langMap[lang] || 'en-US';

    window.speechSynthesis.speak(utt);
    setNobiMessage(text);
  }, [data.settings, lang]);

  const setNobiStateWithMessage = useCallback((state, customMsg) => {
    setNobiState(state);
    const msg = customMsg || getRandomMessage(state);
    if (typeof msg === 'string') speak(msg);
  }, [speak]);

  const navigate = useCallback((page) => setCurrentPage(page), []);

  const logout = useCallback(() => {
    updateUser({ role: null, onboarded: false });
    navigate('login');
  }, [updateUser, navigate]);

  return (
    <AppContext.Provider value={{
      user: data.user,
      settings: data.settings,
      sessions: data.sessions,
      mealLogs: data.mealLogs,
      currentPage,
      testResults,
      nobiState,
      nobiMessage,
      t, // translation function
      updateUser,
      updateSettings,
      addSession,
      addMealLog,
      setTestResults,
      setNobiState,
      setNobiStateWithMessage,
      navigate,
      speak,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
