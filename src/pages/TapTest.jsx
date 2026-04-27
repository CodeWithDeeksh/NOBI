import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import NobiMascot from '../components/NobiMascot';
import { calculateTapScore } from '../utils/scoring';

const TEST_DURATION = 10; // seconds

export default function TapTest() {
  const { navigate, setTestResults, setNobiStateWithMessage } = useApp();
  const [phase, setPhase] = useState('ready'); // ready | counting | done
  const [tapCount, setTapCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [score, setScore] = useState(null);
  const timestamps = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    setNobiStateWithMessage('idle', "Now let's test your finger speed! Tap the big button as fast as you can for 10 seconds.");
    return () => clearTimeout(timerRef.current);
  }, []);

  const startTest = () => {
    setPhase('counting');
    setTapCount(0);
    setTimeLeft(TEST_DURATION);
    timestamps.current = [];
    setNobiStateWithMessage('loading', 'Tap as fast as you can! Keep going!');
    let t = TEST_DURATION;
    timerRef.current = setInterval(() => {
      t--;
      setTimeLeft(t);
      if (t <= 0) {
        clearInterval(timerRef.current);
        finishTest();
      }
    }, 1000);
  };

  const finishTest = useCallback(() => {
    setPhase('done');
    const ts = timestamps.current;
    // Calculate CV of inter-tap intervals
    let cv = 0;
    if (ts.length > 2) {
      const intervals = ts.slice(1).map((t, i) => t - ts[i]);
      const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const sd = Math.sqrt(intervals.reduce((s, v) => s + (v - mean) ** 2, 0) / intervals.length);
      cv = sd / mean;
    }
    const sc = calculateTapScore(ts.length, cv);
    setScore(sc);
    setTestResults(prev => ({ ...prev, tap: sc }));
    const state = sc >= 80 ? 'success' : sc >= 60 ? 'focus' : 'concern';
    const msgs = {
      success: "Excellent tapping! Your rhythm and speed look great!",
      focus: "Good effort! Some rhythm variation detected — that's okay.",
      concern: "Your tapping showed some irregular rhythm. Let's keep an eye on that."
    };
    setNobiStateWithMessage(state, msgs[state]);
  }, [setTestResults, setNobiStateWithMessage]);

  const handleTap = () => {
    if (phase !== 'counting') return;
    timestamps.current.push(Date.now());
    setTapCount(c => c + 1);
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setPhase('ready');
    setTapCount(0);
    setTimeLeft(TEST_DURATION);
    setScore(null);
    timestamps.current = [];
    setNobiStateWithMessage('idle', "Ready to try again? Tap the button when you are!");
  };

  const nobiState = phase === 'counting' ? 'loading' : phase === 'done'
    ? (score >= 80 ? 'success' : score >= 60 ? 'focus' : 'concern')
    : 'idle';

  return (
    <div className="flex flex-col items-center px-5 pt-8 pb-28 min-h-screen">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <button id="tap-back" onClick={() => navigate('spiral')} className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xl">‹</button>
          <h1 className="text-xl font-extrabold text-violet-900">Finger Tap Test</h1>
        </div>
        <p className="text-sm text-slate-500 mb-4 font-semibold">Tap the button as fast as possible for 10 seconds.</p>

        <NobiMascot state={nobiState} size={100} />

        {/* Timer ring */}
        <div className="my-5 flex justify-center">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="absolute" width={112} height={112} viewBox="0 0 112 112" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={56} cy={56} r={48} fill="none" stroke="#ede9fe" strokeWidth={8} />
              <motion.circle cx={56} cy={56} r={48} fill="none" stroke="#7c3aed" strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 48}
                animate={{ strokeDashoffset: 2 * Math.PI * 48 * (1 - timeLeft / TEST_DURATION) }}
                transition={{ duration: 0.9, ease: 'linear' }}
              />
            </svg>
            <div className="text-center z-10">
              <span className="text-3xl font-extrabold text-violet-700">{timeLeft}</span>
              <p className="text-xs text-slate-400 font-bold">sec</p>
            </div>
          </div>
        </div>

        {/* Tap count */}
        <div className="text-center mb-5">
          <span className="text-5xl font-extrabold text-violet-900">{tapCount}</span>
          <p className="text-sm text-slate-500 font-semibold">taps</p>
        </div>

        {/* Big tap button */}
        {phase === 'counting' && (
          <motion.button
            id="tap-button"
            onPointerDown={handleTap}
            className="w-full rounded-3xl text-white font-extrabold text-2xl shadow-lg active:scale-95 select-none"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', minHeight: 120, touchAction: 'manipulation' }}
            whileTap={{ scale: 0.93 }}
          >
            TAP! 👆
          </motion.button>
        )}

        {phase === 'ready' && (
          <button id="tap-start" onClick={startTest}
            className="w-full py-5 rounded-3xl text-white font-extrabold text-xl active:scale-95 shadow-lg"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', minHeight: 80 }}>
            Start Test ▶
          </button>
        )}

        {phase === 'done' && score !== null && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            className="mt-2 p-4 rounded-2xl bg-white/80 border border-violet-100 text-center shadow-sm">
            <p className="text-3xl font-extrabold text-violet-700">{score}<span className="text-lg">/100</span></p>
            <p className="text-sm text-slate-600 font-semibold mt-1">
              {score >= 80 ? '✅ Excellent rhythm & speed' : score >= 60 ? '⚠️ Some rhythm variation' : '🔴 Irregular rhythm detected'}
            </p>
            <p className="text-xs text-slate-400 mt-1">{tapCount} taps in {TEST_DURATION} seconds</p>
          </motion.div>
        )}

        <div className="flex gap-3 mt-5">
          {phase !== 'counting' && (
            <button id="tap-reset" onClick={reset}
              className="flex-1 py-3 rounded-xl font-bold border-2 border-violet-200 text-violet-700 bg-white active:scale-95"
              style={{ minHeight: 52 }}>↺ Redo</button>
          )}
          {phase === 'done' && (
            <button id="tap-next" onClick={() => navigate('voice')}
              className="flex-1 py-3 rounded-xl text-white font-bold active:scale-95"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', minHeight: 52 }}>
              Next: Voice →
            </button>
          )}
        </div>

        <button id="tap-skip" onClick={() => navigate('voice')}
          className="w-full mt-3 text-sm text-slate-400 font-semibold py-2">
          Skip this test →
        </button>
      </div>
    </div>
  );
}
