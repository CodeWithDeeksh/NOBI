import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import NobiMascot from '../components/NobiMascot';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'es', label: 'Español' },
  { code: 'ja', label: '日本語' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
];

export default function Settings() {
  const { user, updateUser, settings, updateSettings, navigate, speak, logout, t } = useApp();
  const [speed, setSpeed] = useState(settings.speed || 0.9);

  const handleReset = () => {
    if (window.confirm('Reset all data and restart onboarding?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center px-5 pt-8 pb-28 min-h-screen">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-6">
          <button id="settings-back" onClick={() => navigate('home')} className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xl">‹</button>
          <h1 className="text-xl font-extrabold text-violet-900">{t('settings')}</h1>
        </div>

        <NobiMascot state="idle" size={90} message="Customize NOBI to suit you best!" />

        {/* Profile */}
        <div className="mt-5 bg-white/80 backdrop-blur border border-violet-100 rounded-2xl p-4 shadow-sm mb-4">
          <p className="text-xs font-bold text-violet-400 uppercase mb-3">👤 Profile</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Name</label>
              <input type="text"
                className="w-full border-2 border-violet-100 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-violet-400"
                value={user.name}
                onChange={e => updateUser({ name: e.target.value })}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-600">Taking Levodopa</span>
              <button onClick={() => updateUser({ takingLevodopa: !user.takingLevodopa })}
                className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all ${user.takingLevodopa ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-500'}`}
                style={{ minHeight: 32 }}>
                {user.takingLevodopa ? 'Yes' : 'No'}
              </button>
            </div>
          </div>
        </div>

        {/* Language & Voice */}
        <div className="bg-white/80 backdrop-blur border border-violet-100 rounded-2xl p-4 shadow-sm mb-4">
          <p className="text-xs font-bold text-violet-400 uppercase mb-3">🌐 {t('language')} & Voice</p>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-2">{t('language')}</label>
              <div className="flex flex-wrap gap-2">
                {LANGS.map(l => (
                  <button key={l.code}
                    onClick={() => updateSettings({ language: l.code })}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${settings.language === l.code ? 'bg-violet-600 text-white' : 'bg-violet-50 text-violet-700'}`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-violet-50">
              <span className="text-sm font-semibold text-slate-600">Voice Feedback</span>
              <button onClick={() => updateSettings({ voiceOn: !settings.voiceOn })}
                className={`w-12 h-6 rounded-full relative transition-all ${settings.voiceOn ? 'bg-violet-600' : 'bg-slate-200'}`}
                style={{ minHeight: 32, minWidth: 48 }}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${settings.voiceOn ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold text-slate-600 mb-2">
                <span>Speech Speed</span>
                <span className="text-violet-700">{speed.toFixed(1)}×</span>
              </div>
              <input type="range" min={0.6} max={1.4} step={0.1}
                value={speed} onChange={e => {
                  setSpeed(parseFloat(e.target.value));
                  updateSettings({ speed: parseFloat(e.target.value) });
                }}
                className="w-full accent-violet-600" style={{ minHeight: 32 }} />
            </div>

            <button onClick={() => speak(t('login_title'))}
              className="w-full py-3 rounded-xl font-bold border-2 border-violet-200 text-violet-700 bg-white active:scale-95 text-sm"
              style={{ minHeight: 48 }}>
              ▶ Test Voice
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
          <p className="text-xs font-bold text-red-400 uppercase mb-3">⚠️ Account & Data</p>
          <button onClick={logout}
            className="w-full py-3 mb-3 rounded-xl font-bold bg-white text-slate-700 border-2 border-slate-200 active:scale-95 text-sm"
            style={{ minHeight: 48 }}>
            {t('logout')}
          </button>
          <button onClick={handleReset}
            className="w-full py-3 rounded-xl font-bold border-2 border-red-200 text-red-600 bg-white active:scale-95 text-sm"
            style={{ minHeight: 48 }}>
            Reset All Data
          </button>
        </div>

      </div>
    </div>
  );
}
