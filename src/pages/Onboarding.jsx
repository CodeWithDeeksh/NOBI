import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import NobiMascot from '../components/NobiMascot';

const STEPS = ['welcome', 'profile', 'symptoms', 'medication', 'goal'];

const AGE_GROUPS = [
  { id: 'under40', label: 'Under 40' },
  { id: '40-60',   label: '40 – 60' },
  { id: '60-75',   label: '60 – 75' },
  { id: 'above75', label: 'Above 75' },
];

const SYMPTOMS = [
  { id: 'tremor',    label: '🤲 Tremor' },
  { id: 'stiffness', label: '💪 Stiffness' },
  { id: 'swallowing',label: '🍵 Swallowing difficulty' },
  { id: 'fatigue',   label: '😴 Fatigue' },
  { id: 'none',      label: '✅ None currently' },
];

const GOALS = [
  { id: 'monitor',   label: '📈 Monitor my symptoms', desc: "Track changes over time" },
  { id: 'screen',    label: '🔍 Self-screening',       desc: "Check for early signs" },
  { id: 'caregiver', label: '🤝 Support a loved one',  desc: "I'm a caregiver" },
];

export default function Onboarding() {
  const { updateUser, navigate } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', ageGroup: '', dominantHand: '', symptoms: [],
    takingLevodopa: false, medicationTiming: [], goal: ''
  });

  const stepName = STEPS[step];

  const toggleSymptom = (id) => {
    if (id === 'none') { setForm(f => ({ ...f, symptoms: ['none'] })); return; }
    setForm(f => {
      const s = f.symptoms.filter(x => x !== 'none');
      return { ...f, symptoms: s.includes(id) ? s.filter(x => x !== id) : [...s, id] };
    });
  };

  const canProceed = () => {
    if (stepName === 'welcome') return form.name.trim().length > 0;
    if (stepName === 'profile') return form.ageGroup && form.dominantHand;
    if (stepName === 'symptoms') return form.symptoms.length > 0;
    if (stepName === 'medication') return true;
    if (stepName === 'goal') return form.goal;
    return true;
  };

  const finish = () => {
    updateUser({ ...form, onboarded: true });
    navigate('home');
  };

  const next = () => step < STEPS.length - 1 ? setStep(s => s + 1) : finish();

  const NOBI_GREET = [
    "Hi! I'm Nobi. I'll help track your wellness. What's your name?",
    "Nice to meet you! Tell me a bit about yourself.",
    "Which symptoms do you sometimes experience?",
    "Are you taking Levodopa or Carbidopa?",
    "What brings you to NOBI today?",
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-5 pt-10 pb-8">
      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i <= step ? 'bg-violet-600 w-6' : 'bg-violet-200 w-2'}`} />
        ))}
      </div>

      <NobiMascot state="idle" size={140} message={NOBI_GREET[step]} />

      <AnimatePresence mode="wait">
        <motion.div
          key={stepName}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm mt-6"
        >
          {/* Welcome */}
          {stepName === 'welcome' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-extrabold text-violet-900 text-center">Welcome to NOBI 🧠</h1>
              <p className="text-slate-500 text-center text-sm">Your friendly motor wellness & food companion.</p>
              <div>
                <label className="block text-sm font-bold text-violet-700 mb-2" htmlFor="onboard-name">Your first name</label>
                <input
                  id="onboard-name"
                  type="text"
                  className="w-full border-2 border-violet-200 rounded-xl px-4 text-lg font-semibold text-slate-800 outline-none focus:border-violet-500 transition-colors"
                  style={{ minHeight: 52 }}
                  placeholder="e.g. Anita"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Profile */}
          {stepName === 'profile' && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-violet-900 text-center">Hello, {form.name}! 👋</h2>
              <div>
                <p className="text-sm font-bold text-violet-700 mb-2">Age group</p>
                <div className="grid grid-cols-2 gap-2">
                  {AGE_GROUPS.map(ag => (
                    <button key={ag.id} id={`age-${ag.id}`}
                      onClick={() => setForm(f => ({ ...f, ageGroup: ag.id }))}
                      className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${form.ageGroup === ag.id ? 'border-violet-600 bg-violet-600 text-white' : 'border-violet-200 bg-white text-violet-800'}`}
                      style={{ minHeight: 52 }}
                    >{ag.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-violet-700 mb-2">Dominant hand</p>
                <div className="flex gap-3">
                  {['left', 'right'].map(h => (
                    <button key={h} id={`hand-${h}`}
                      onClick={() => setForm(f => ({ ...f, dominantHand: h }))}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all ${form.dominantHand === h ? 'border-violet-600 bg-violet-600 text-white' : 'border-violet-200 bg-white text-violet-800'}`}
                      style={{ minHeight: 52 }}
                    >{h === 'left' ? '🤚 Left' : '✋ Right'}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Symptoms */}
          {stepName === 'symptoms' && (
            <div className="space-y-3">
              <h2 className="text-xl font-extrabold text-violet-900 text-center">Your Symptoms</h2>
              <p className="text-sm text-slate-500 text-center">Select all that apply</p>
              {SYMPTOMS.map(s => (
                <button key={s.id} id={`symptom-${s.id}`}
                  onClick={() => toggleSymptom(s.id)}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm border-2 text-left transition-all ${form.symptoms.includes(s.id) ? 'border-violet-600 bg-violet-50 text-violet-800' : 'border-violet-100 bg-white text-slate-700'}`}
                  style={{ minHeight: 52 }}
                >{s.label}</button>
              ))}
            </div>
          )}

          {/* Medication */}
          {stepName === 'medication' && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-violet-900 text-center">Medication</h2>
              <p className="text-sm text-slate-500 text-center">Helps NOBI give better food timing advice</p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                ⚠️ High-protein foods can reduce Levodopa absorption by up to 40%.
              </div>
              <p className="text-sm font-bold text-violet-700">Are you taking Levodopa / Carbidopa?</p>
              <div className="flex gap-3">
                {[true, false].map(v => (
                  <button key={String(v)} id={`levodopa-${v}`}
                    onClick={() => setForm(f => ({ ...f, takingLevodopa: v }))}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all ${form.takingLevodopa === v ? 'border-violet-600 bg-violet-600 text-white' : 'border-violet-200 bg-white text-violet-800'}`}
                    style={{ minHeight: 52 }}
                  >{v ? '✅ Yes' : '❌ No'}</button>
                ))}
              </div>
            </div>
          )}

          {/* Goal */}
          {stepName === 'goal' && (
            <div className="space-y-3">
              <h2 className="text-xl font-extrabold text-violet-900 text-center">Your Goal</h2>
              {GOALS.map(g => (
                <button key={g.id} id={`goal-${g.id}`}
                  onClick={() => setForm(f => ({ ...f, goal: g.id }))}
                  className={`w-full py-4 px-4 rounded-xl font-bold text-sm border-2 text-left transition-all ${form.goal === g.id ? 'border-violet-600 bg-violet-50' : 'border-violet-100 bg-white'}`}
                  style={{ minHeight: 64 }}
                >
                  <div className="text-violet-900">{g.label}</div>
                  <div className="text-xs text-slate-400 font-normal mt-0.5">{g.desc}</div>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <button
        id="onboard-next"
        onClick={next}
        disabled={!canProceed()}
        className="mt-8 w-full max-w-sm py-4 rounded-2xl text-white font-extrabold text-lg transition-all disabled:opacity-40 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', minHeight: 56 }}
      >
        {step === STEPS.length - 1 ? "Let's start! 🚀" : 'Continue →'}
      </button>
    </div>
  );
}
