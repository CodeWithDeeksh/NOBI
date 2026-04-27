import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import NobiMascot from '../components/NobiMascot';
import MealCard from '../components/MealCard';
import { getRecommendationsForScore } from '../data/foodRecommendations';
import { getLevel } from '../utils/scoring';

const MED_TIMELINE = [
  { time: '7:30 AM', label: 'Levodopa dose', type: 'med', desc: 'On empty or low-protein stomach' },
  { time: '8:00 AM', label: 'Light Breakfast', type: 'food', desc: 'Oatmeal, fruit — low protein' },
  { time: '12:30 PM', label: 'Levodopa (if 3x/day)', type: 'med', desc: 'Take 30 min before lunch' },
  { time: '1:00 PM', label: 'Moderate Lunch', type: 'food', desc: 'Vegetables, grains, small protein' },
  { time: '6:30 PM', label: 'Levodopa (if 3x/day)', type: 'med', desc: 'Take 30 min before dinner' },
  { time: '7:00 PM', label: 'Protein-rich Dinner', type: 'food', desc: 'Safe window — 30 min post-medication' },
];

export default function Nourish() {
  const { sessions, addMealLog, mealLogs, setNobiStateWithMessage, user } = useApp();
  const latest = sessions[0];
  const score = latest?.finalScore ?? 72;
  const level = getLevel(score);
  const meals = getRecommendationsForScore(score);
  const [loggedIds, setLoggedIds] = useState(new Set());

  useEffect(() => {
    setNobiStateWithMessage('idle', `I've picked ${meals.length} meals for you today based on your motor score. Each one is easy to eat and packed with neuroprotective foods.`);
    // Load today's logs
    const today = new Date().toDateString();
    const todayLogs = mealLogs.filter(l => new Date(l.date).toDateString() === today);
    setLoggedIds(new Set(todayLogs.map(l => l.mealId)));
  }, []);

  const handleLog = (meal) => {
    const log = { id: Date.now().toString(), date: new Date().toISOString(), mealId: meal.id, mealType: meal.mealType, category: meal.tags[0] };
    addMealLog(log);
    setLoggedIds(prev => new Set([...prev, meal.id]));
    setNobiStateWithMessage('success', `Got it! Great choice — ${meal.name} logged. 🎉`);
  };

  return (
    <div className="flex flex-col items-center px-5 pt-8 pb-28 min-h-screen">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-extrabold text-violet-900 mb-1">🥗 Nourish</h1>
        <p className="text-sm text-slate-500 font-semibold mb-5">Today's personalized meal plan</p>

        {/* NOBI + level */}
        <div className="flex items-center gap-4 mb-5">
          <NobiMascot state="idle" size={90} />
          <div className="flex-1 bg-white/80 backdrop-blur border border-violet-100 rounded-2xl p-3 shadow-sm">
            <p className="text-xs text-violet-400 font-bold uppercase">Based on your score</p>
            <p className="text-xl font-extrabold text-violet-900">{score} — {level}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {level === 'Stable' ? 'Mediterranean diet recommended 🌿' :
               level === 'Mild Variation' ? 'Softer textures & B12-rich foods 💪' :
               'Easy-grip foods & hydration focus 💧'}
            </p>
          </div>
        </div>

        {/* Meal cards */}
        <div className="space-y-4 mb-6">
          {meals.map((meal, i) => (
            <MealCard key={meal.id} meal={meal} delay={i * 0.1}
              logged={loggedIds.has(meal.id)}
              onLog={handleLog} />
          ))}
        </div>

        {/* Neuroprotective tips */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
          className="bg-violet-50 border border-violet-200 rounded-2xl p-4 mb-5">
          <p className="text-sm font-extrabold text-violet-800 mb-2">🧠 Neuroprotective Foods</p>
          <div className="flex flex-wrap gap-2">
            {['Blueberries', 'Walnuts', 'Salmon', 'Turmeric', 'Spinach', 'Oats', 'Chia Seeds'].map(f => (
              <span key={f} className="text-xs px-2 py-1 bg-white border border-violet-100 rounded-full text-violet-700 font-semibold">{f}</span>
            ))}
          </div>
        </motion.div>

        {/* Medication timeline */}
        {user.takingLevodopa && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
            className="bg-white/80 backdrop-blur border border-amber-200 rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-extrabold text-amber-800 mb-3">💊 Today's Medication-Food Timeline</p>
            <div className="space-y-2">
              {MED_TIMELINE.map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="flex flex-col items-center pt-0.5">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${item.type === 'med' ? 'bg-amber-400' : 'bg-violet-400'}`} />
                    {i < MED_TIMELINE.length - 1 && <div className="w-0.5 h-5 bg-violet-100 mt-0.5" />}
                  </div>
                  <div className="flex-1 pb-1">
                    <p className="text-xs font-bold text-slate-700">{item.time} — <span className={item.type === 'med' ? 'text-amber-700' : 'text-violet-700'}>{item.label}</span></p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Hydration reminder */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }}
          className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-sm font-bold text-blue-800">💧 Hydration Reminder</p>
          <p className="text-xs text-blue-700 mt-1">Aim for 6–8 glasses of water today. Proper hydration helps with constipation, a common PD symptom.</p>
        </motion.div>
      </div>
    </div>
  );
}
