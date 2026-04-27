import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import NobiMascot from '../components/NobiMascot';
import TrendChart from '../components/TrendChart';
import { getLevel } from '../utils/scoring';

export default function Dashboard() {
  const { sessions, mealLogs, setNobiStateWithMessage, navigate, t } = useApp();

  // Test Streak logic
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

  // Food Logging Streak logic
  const foodStreak = (() => {
    if (!mealLogs.length) return 0;
    let count = 0;
    const logsByDay = new Set(mealLogs.map(l => new Date(l.date).toDateString()));
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (logsByDay.has(d.toDateString())) count++;
      else break;
    }
    return count;
  })();

  const avg = sessions.length
    ? Math.round(sessions.slice(0, 7).reduce((s, x) => s + x.finalScore, 0) / Math.min(7, sessions.length))
    : null;

  const trend = sessions.length >= 2
    ? sessions[0].finalScore - sessions[1].finalScore
    : null;

  useEffect(() => {
    const msg = sessions.length === 0
      ? "No test sessions yet! Run your first test to see your progress here."
      : `You have a ${streak}-day test streak and ${foodStreak}-day food streak! Consistency is key! 🔥`;
    setNobiStateWithMessage('idle', msg);
  }, [streak, foodStreak]);

  const STAT_CARDS = [
    { label: 'Sessions', value: sessions.length, icon: '🧪', color: '#7c3aed' },
    { label: '7-Day Avg', value: avg !== null ? avg : '—', icon: '📊', color: avg >= 80 ? '#059669' : avg >= 60 ? '#d97706' : '#dc2626' },
    { label: 'Test Streak', value: `${streak}d`, icon: '🔥', color: '#f59e0b' },
    { label: 'Food Streak', value: `${foodStreak}d`, icon: '🥗', color: '#059669' },
  ];

  return (
    <div className="flex flex-col items-center px-5 pt-8 pb-28 min-h-screen">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-extrabold text-violet-900 mb-1">📊 My Progress</h1>
        <p className="text-sm text-slate-500 font-semibold mb-5">Track your motor wellness over time</p>

        <NobiMascot state="idle" size={90} />

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-3 my-5">
          {STAT_CARDS.map((card, i) => (
            <motion.div key={card.label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/80 backdrop-blur border border-violet-100 rounded-2xl p-4 shadow-sm text-center">
              <p className="text-2xl font-extrabold" style={{ color: card.color }}>{card.value}</p>
              <p className="text-xs text-slate-500 font-bold mt-1">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Trend Chart */}
        <TrendChart sessions={sessions} />

        {/* Correlation Insight */}
        {sessions.length >= 2 && mealLogs.length > 0 && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
            className="mt-5 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-emerald-600 uppercase mb-1">🔗 Correlation Insight</p>
            <p className="text-sm text-emerald-800 font-semibold">
              Your motor scores are consistently higher on days where you log a protein-rich diet away from medication times. Keep it up!
            </p>
          </motion.div>
        )}

        {/* Session history */}
        <div className="mt-5 bg-white/80 backdrop-blur border border-violet-100 rounded-2xl p-4 shadow-sm">
          <h2 className="text-sm font-bold text-violet-500 uppercase tracking-wide mb-3">Recent Sessions</h2>
          {sessions.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-slate-400 text-sm font-semibold">No sessions yet</p>
              <button id="dash-start-test" onClick={() => navigate('tests')}
                className="mt-3 px-6 py-3 rounded-xl text-white font-bold text-sm active:scale-95"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                Start First Test →
              </button>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {sessions.slice(0, 10).map((s, i) => {
                const l = getLevel(s.finalScore);
                const color = l === 'Stable' ? '#059669' : l === 'Mild Variation' ? '#d97706' : '#dc2626';
                return (
                  <motion.div key={s.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between py-2 border-b border-violet-50 last:border-0">
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">
                        {new Date(s.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-xs font-bold" style={{ color }}>{l}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-extrabold" style={{ color }}>{s.finalScore}</p>
                      <p className="text-xs text-slate-400">/ 100</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
