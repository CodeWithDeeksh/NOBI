import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import NobiMascot from '../components/NobiMascot';
import ScoreOrb from '../components/ScoreOrb';
import { getLevel } from '../utils/scoring';

export default function Home() {
  const { user, sessions, setNobiStateWithMessage, navigate, t } = useApp();

  const latest = sessions[0];
  const score = latest ? latest.finalScore : null;
  const level = latest ? latest.level : null;

  const streak = (() => {
    if (!sessions.length) return 0;
    let count = 0;
    const today = new Date(); today.setHours(0,0,0,0);
    for (let i = 0; i < sessions.length; i++) {
      const d = new Date(sessions[i].date); d.setHours(0,0,0,0);
      const diff = Math.round((today - d) / 86400000);
      if (diff === i) count++;
      else break;
    }
    return count;
  })();

  useEffect(() => {
    if (score === null) {
      setNobiStateWithMessage('idle', `Hi ${user.name}! I'm NOBI. Ready for your first check-in today?`);
    } else {
      setNobiStateWithMessage('success', `Welcome back, ${user.name}! You're on a ${streak}-day streak!`);
    }
  }, [score, user.name, streak]);

  return (
    <div className="flex flex-col items-center px-5 pt-8 pb-28 min-h-screen">
      <div className="w-full max-w-sm flex flex-col items-center">
        
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-violet-900">Hi, {user.name} 👋</h1>
            <p className="text-sm text-slate-500 font-semibold">{t('streak')}: {streak} 🔥</p>
          </div>
          <button onClick={() => navigate('settings')} className="w-10 h-10 bg-white/80 rounded-full border border-violet-100 flex items-center justify-center text-xl shadow-sm">
            ⚙️
          </button>
        </div>

        {/* Mascot & Score */}
        <div className="relative mb-10 w-full flex justify-center mt-4">
          <ScoreOrb score={score} level={level} size={280} />
          <div className="absolute inset-0 flex items-center justify-center mt-2">
            <NobiMascot state="idle" size={140} />
          </div>
        </div>

        {/* Primary Action */}
        <motion.button
          onClick={() => navigate('tests')}
          className="w-full py-5 rounded-2xl text-white font-extrabold text-lg shadow-lg shadow-violet-200 active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }}
          whileTap={{ scale: 0.95 }}
        >
          {score === null ? '▶ Start First Test' : '▶ Run Daily Check-in'}
        </motion.button>
        
        <p className="text-xs text-slate-400 font-bold mt-3 text-center uppercase tracking-wide">Takes about 3 minutes</p>

        {/* Last session summary */}
        {latest && (
          <div className="w-full mt-6 bg-white/80 backdrop-blur border border-violet-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-bold text-violet-500 uppercase mb-2">Last Check-in</p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-600">
                {new Date(latest.date).toLocaleDateString(undefined, { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-sm font-extrabold text-violet-900">{latest.finalScore} / 100</span>
            </div>
            {latest.insight && (
              <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed border-t border-violet-50 pt-2">
                {latest.insight}
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
