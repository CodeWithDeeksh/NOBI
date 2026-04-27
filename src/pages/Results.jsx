import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import NobiMascot from '../components/NobiMascot';
import ScoreOrb from '../components/ScoreOrb';
import MealCard from '../components/MealCard';
import { calculateFinalScore, getLevel } from '../utils/scoring';
import { runNourishEngine } from '../utils/NourishEngine';

export default function Results() {
  const { navigate, testResults, addSession, addMealLog, nobiMessage, setNobiStateWithMessage, user, t } = useApp();
  const { spiral, tap, voice } = testResults;
  const [saved, setSaved] = useState(false);
  const [loggedIds, setLoggedIds] = useState(new Set());

  // Calculate scores
  const finalScore = calculateFinalScore(spiral, tap, voice);
  const level = getLevel(finalScore);

  // Run Nourish Engine
  const trend = -5; // Mock trend for MVP, normally calculated from past sessions
  const engineResult = runNourishEngine(spiral, tap, voice, trend);

  const nobiState = finalScore >= 80 ? 'success' : finalScore >= 60 ? 'focus' : 'concern';

  useEffect(() => {
    // Nobi speaks the exact reason from the Nourish Engine
    setNobiStateWithMessage(nobiState, engineResult.insight);

    if (!saved) {
      const session = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        spiralScore: spiral,
        tapScore: tap,
        voiceScore: voice,
        finalScore,
        level,
        insight: engineResult.insight,
      };
      addSession(session);
      setSaved(true);
    }
  }, []);

  const handleLog = (meal) => {
    const log = { id: Date.now().toString(), date: new Date().toISOString(), mealId: meal.id, mealType: meal.mealType, category: meal.tags[0] };
    addMealLog(log);
    setLoggedIds(prev => new Set([...prev, meal.id]));
    setNobiStateWithMessage('success', `Got it! Great choice — ${meal.name} logged. 🎉`);
  };

  const SCORE_BREAKDOWN = [
    { label: t('test_spiral'), score: spiral, weight: '40%', icon: '🌀' },
    { label: t('test_tap'),    score: tap,    weight: '30%', icon: '👆' },
    { label: t('test_voice'),  score: voice,  weight: '30%', icon: '🎙' },
  ];

  return (
    <div className="flex flex-col items-center px-5 pt-8 pb-28 min-h-screen">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-extrabold text-violet-900 text-center mb-1">Your Results</h1>
        
        {/* NOBI + Score */}
        <div className="flex items-center justify-center gap-6 mb-6 mt-4">
          <NobiMascot state={nobiState} size={120} message={nobiMessage}
            onClick={() => setNobiStateWithMessage(nobiState, nobiMessage)} />
          <ScoreOrb score={finalScore} level={level} size={140} />
        </div>

        {/* Score breakdown */}
        <div className="bg-white/80 backdrop-blur border border-violet-100 rounded-2xl p-4 mb-6 shadow-sm">
          <h2 className="text-sm font-bold text-violet-500 uppercase tracking-wide mb-3">Score Breakdown</h2>
          <div className="space-y-3">
            {SCORE_BREAKDOWN.map((item, i) => (
              <motion.div key={item.label} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                transition={{ delay: i * 0.12 }}
                className="flex items-center gap-3">
                <span className="text-xl w-7">{item.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>{item.label}</span>
                    <span>{item.score !== null ? item.score : '—'} <span className="text-violet-400">({item.weight})</span></span>
                  </div>
                  <div className="h-2 rounded-full bg-violet-50 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: item.score !== null ? `${item.score}%` : '0%' }}
                      transition={{ duration: 0.8, delay: i * 0.12 }}
                      className="h-full rounded-full"
                      style={{ background: item.score === null ? '#e5e7eb' : item.score >= 80 ? '#059669' : item.score >= 60 ? '#d97706' : '#dc2626' }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* DIRECT NOURISH ENGINE INTEGRATION */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}>
          <h2 className="text-xl font-extrabold text-violet-900 mb-1">{t('food_plan_title')}</h2>
          <p className="text-sm font-semibold text-slate-500 mb-4">Directly adapted to your motor test results</p>

          <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 mb-5 shadow-inner">
            <p className="text-xs font-bold text-violet-500 uppercase mb-1">🧠 NOURISH ENGINE REASON</p>
            <p className="text-sm font-semibold text-violet-800">{engineResult.insight}</p>
          </div>

          <div className="space-y-4 mb-6">
            {engineResult.meals.map((meal, i) => (
              <MealCard key={meal.id} meal={meal} delay={0.5 + (i * 0.1)}
                logged={loggedIds.has(meal.id)}
                onLog={handleLog} />
            ))}
          </div>
        </motion.div>

        <button id="results-home" onClick={() => navigate('dashboard')}
          className="w-full py-4 rounded-2xl font-extrabold text-base border-2 border-violet-200 text-violet-700 bg-white active:scale-95 shadow-sm"
          style={{ minHeight: 56 }}>
          Finish & View Dashboard →
        </button>
      </div>
    </div>
  );
}
