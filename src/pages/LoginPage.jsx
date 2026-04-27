import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import NobiMascot from '../components/NobiMascot';

export default function LoginPage() {
  const { updateUser, updateSettings, settings, navigate, t, setNobiStateWithMessage } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setNobiStateWithMessage('idle', "Welcome! Please select your language and log in.");
  }, []);

  const handleLogin = (role) => {
    // Mock login
    updateUser({ role, name: role === 'patient' ? 'Anita' : 'David' });
    if (role === 'patient') {
      navigate('onboarding'); // Go to onboarding or home depending on state, handled in App.jsx
    } else {
      updateUser({ onboarded: true }); // Caregivers don't need patient onboarding
      navigate('caregiver');
    }
  };

  const LANGS = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'es', label: 'Español' },
    { code: 'ja', label: '日本語' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
  ];

  return (
    <div className="flex flex-col items-center justify-center px-5 py-12 min-h-screen">
      <div className="w-full max-w-sm">
        <NobiMascot state="idle" size={140} />
        
        <h1 className="text-3xl font-extrabold text-violet-900 text-center mt-6">{t('login_title')}</h1>
        <p className="text-sm text-slate-500 font-semibold text-center mt-2 mb-8">{t('login_sub')}</p>

        <div className="bg-white/80 backdrop-blur border border-violet-100 rounded-3xl p-6 shadow-sm">
          {/* Language Selector */}
          <div className="mb-6">
            <label className="text-xs font-bold text-violet-500 uppercase block mb-2">{t('language')}</label>
            <div className="flex flex-wrap gap-2">
              {LANGS.map(l => (
                <button key={l.code}
                  onClick={() => updateSettings({ language: l.code })}
                  className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all ${settings.language === l.code ? 'bg-violet-600 text-white' : 'bg-violet-50 text-violet-700 hover:bg-violet-100'}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <input type="email" placeholder="Email (mock)" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border-2 border-violet-100 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-violet-500" />
            <input type="password" placeholder="Password (mock)" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border-2 border-violet-100 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-violet-500" />
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={() => handleLogin('patient')}
              className="w-full py-3.5 rounded-xl text-white font-extrabold text-base active:scale-95 shadow-md"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
              {t('role_patient')}
            </button>
            <button onClick={() => handleLogin('caregiver')}
              className="w-full py-3.5 rounded-xl font-extrabold text-base border-2 border-violet-200 text-violet-700 bg-white active:scale-95">
              {t('role_caregiver')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
