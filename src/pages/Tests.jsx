import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import NobiMascot from '../components/NobiMascot';

const TEST_OPTIONS = [
  { id: 'spiral', label: 'Spiral Drawing', icon: '🌀', desc: 'Draw a smooth spiral to test hand control', duration: '~1 min', page: 'spiral' },
  { id: 'tap',    label: 'Finger Tap',     icon: '👆', desc: 'Tap as fast as possible for 10 seconds',   duration: '10 sec', page: 'tap' },
  { id: 'voice',  label: 'Voice Clarity',  icon: '🎙', desc: 'Read a sentence aloud for 5–12 seconds',   duration: '~30 sec', page: 'voice' },
];

export default function Tests() {
  const { navigate, setTestResults, setNobiStateWithMessage } = useApp();

  const startFull = () => {
    setTestResults({ spiral: null, tap: null, voice: null });
    setNobiStateWithMessage('idle', "Let's start the full assessment! We'll do spiral, tap, then voice. Take your time.");
    navigate('spiral');
  };

  return (
    <div className="flex flex-col items-center px-5 pt-8 pb-28 min-h-screen">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-extrabold text-violet-900 mb-1">🔍 Motor Tests</h1>
        <p className="text-sm text-slate-500 font-semibold mb-5">Choose a test or run the full assessment</p>

        <NobiMascot state="idle" size={110} message="Take your time — I'll be with you every step of the way!" />

        <motion.button
          id="start-full-test"
          onClick={startFull}
          className="w-full mt-5 py-5 rounded-2xl text-white font-extrabold text-lg shadow-lg active:scale-95"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', minHeight: 72 }}
          whileTap={{ scale: 0.97 }}
        >
          🚀 Start Full Assessment
        </motion.button>
        <p className="text-xs text-center text-slate-400 font-semibold mt-2 mb-6">Spiral + Tap + Voice — about 3 minutes</p>

        <p className="text-sm font-bold text-violet-600 mb-3">Or pick individual tests:</p>
        <div className="space-y-3">
          {TEST_OPTIONS.map((t, i) => (
            <motion.button
              key={t.id}
              id={`test-${t.id}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => {
                setTestResults({ spiral: null, tap: null, voice: null });
                navigate(t.page);
              }}
              className="w-full flex items-center gap-4 bg-white/80 backdrop-blur border border-violet-100 rounded-2xl px-4 py-4 shadow-sm active:scale-95 text-left"
              style={{ minHeight: 72 }}
            >
              <span className="text-3xl">{t.icon}</span>
              <div className="flex-1">
                <p className="font-extrabold text-violet-900">{t.label}</p>
                <p className="text-xs text-slate-400 font-semibold">{t.desc}</p>
              </div>
              <span className="text-xs text-violet-400 font-bold whitespace-nowrap">{t.duration}</span>
            </motion.button>
          ))}
        </div>

        <div className="mt-6 bg-violet-50 border border-violet-100 rounded-2xl p-4">
          <p className="text-xs font-bold text-violet-500 uppercase mb-1">ℹ️ How It Works</p>
          <p className="text-sm text-slate-600 font-semibold">
            Each test produces a score (0–100). The final score weighs Spiral (40%), Tap (30%), and Voice (30%). Results instantly generate personalized food recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}
