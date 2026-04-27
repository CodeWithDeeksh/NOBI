import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import NobiMascot from '../components/NobiMascot';
import TrendChart from '../components/TrendChart';

export default function CaregiverDashboard() {
  const { sessions, mealLogs, logout, setNobiStateWithMessage, t } = useApp();
  
  useEffect(() => {
    setNobiStateWithMessage('idle', "Welcome, Caregiver. Here is Anita's wellness summary for today.");
  }, []);

  const latest = sessions[0];

  return (
    <div className="flex flex-col items-center px-5 pt-8 pb-28 min-h-screen">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-violet-900">{t('nav_caregiver')} View</h1>
          <button onClick={logout} className="text-sm font-bold text-violet-500">{t('logout')}</button>
        </div>

        <div className="flex items-center gap-4 mb-6 bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-violet-100">
          <NobiMascot state="idle" size={80} />
          <div>
            <p className="text-xs font-bold text-violet-500 uppercase">Patient Profile</p>
            <p className="text-lg font-extrabold text-violet-900">Anita</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">Status: {latest ? latest.level : 'No data yet'}</p>
          </div>
        </div>

        <div className="mb-6">
          <TrendChart sessions={sessions} />
        </div>

        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <p className="text-sm font-extrabold text-amber-800 mb-1">⏰ Medication Alerts</p>
          <p className="text-xs font-semibold text-amber-700">Next Levodopa dose: 6:30 PM. Ensure dinner (protein) is served at least 30 mins after.</p>
        </motion.div>

        <div className="bg-white/80 backdrop-blur border border-violet-100 rounded-2xl p-4 shadow-sm">
          <h2 className="text-sm font-bold text-violet-500 uppercase tracking-wide mb-3">Recent Food Logs</h2>
          {mealLogs.length === 0 ? (
            <p className="text-xs text-slate-400 font-semibold">No meals logged yet.</p>
          ) : (
            <div className="space-y-3">
              {mealLogs.slice(0, 5).map(l => (
                <div key={l.id} className="flex justify-between items-center border-b border-violet-50 pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-bold text-slate-700 capitalize">{l.mealType}</p>
                    <p className="text-xs text-violet-500 font-semibold capitalize">{l.category} diet</p>
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">
                    {new Date(l.date).toLocaleDateString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
