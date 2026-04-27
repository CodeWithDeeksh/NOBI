import { motion } from 'framer-motion';

const TEXTURE_BADGE = { easy: '🥄 Easy', soft: '🍲 Soft', liquid: '🥤 Drinkable' };
const PROTEIN_BADGE = { low: { label: 'Low Protein', color: '#059669' }, moderate: { label: 'Moderate Protein', color: '#d97706' }, high: { label: 'High Protein', color: '#7c3aed' } };
const MEAL_EMOJI = { breakfast: '🌅', lunch: '☀️', dinner: '🌙' };

export default function MealCard({ meal, onLog, logged = false, delay = 0 }) {
  const proteinCfg = PROTEIN_BADGE[meal.proteinLevel] || PROTEIN_BADGE.moderate;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white/80 backdrop-blur border border-violet-100 rounded-2xl p-4 shadow-sm"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-violet-400">
            {MEAL_EMOJI[meal.mealType]} {meal.mealType}
          </span>
          <h3 className="text-base font-extrabold text-slate-800 mt-0.5">{meal.name}</h3>
        </div>
        {logged && <span className="text-green-600 text-xl">✓</span>}
      </div>
      <p className="text-sm text-slate-500 mb-3 leading-relaxed">{meal.description}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs px-2 py-1 bg-violet-50 text-violet-700 rounded-full font-semibold">
          {TEXTURE_BADGE[meal.texture]}
        </span>
        <span className="text-xs px-2 py-1 rounded-full font-semibold text-white" style={{ background: proteinCfg.color }}>
          {proteinCfg.label}
        </span>
      </div>
      {!logged && (
        <button
          id={`log-meal-${meal.id}`}
          onClick={() => onLog?.(meal)}
          className="w-full py-3 rounded-xl text-white font-bold text-sm transition-transform active:scale-95"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', minHeight: 44 }}
        >
          Log This Meal
        </button>
      )}
    </motion.div>
  );
}
