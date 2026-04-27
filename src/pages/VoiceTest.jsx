import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import NobiMascot from '../components/NobiMascot';
import { calculateVoiceScore } from '../utils/scoring';

export default function VoiceTest() {
  const { navigate, setTestResults, setNobiStateWithMessage } = useApp();
  const [phase, setPhase] = useState('ready'); // ready | recording | done
  const [duration, setDuration] = useState(0);
  const [score, setScore] = useState(null);
  const [amplitude, setAmplitude] = useState(0);
  const mediaRef = useRef(null);
  const analyserRef = useRef(null);
  const startTimeRef = useRef(null);
  const animFrameRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    setNobiStateWithMessage('idle', "Last test! Read aloud for 5–12 seconds: 'The weather is nice today and I feel good.'");
    return () => {
      stopAll();
    };
  }, []);

  const stopAll = () => {
    clearInterval(timerRef.current);
    cancelAnimationFrame(animFrameRef.current);
    if (mediaRef.current) { mediaRef.current.getTracks().forEach(t => t.stop()); }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRef.current = stream;
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      analyserRef.current = analyser;
      setPhase('recording');
      setDuration(0);
      setAmplitude(0);
      startTimeRef.current = Date.now();
      setNobiStateWithMessage('loading', 'I\'m listening... keep speaking clearly!');

      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 500);

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setAmplitude(avg);
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (err) {
      setNobiStateWithMessage('concern', "Couldn't access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    const dur = Math.floor((Date.now() - startTimeRef.current) / 1000);
    stopAll();
    const sc = calculateVoiceScore(dur);
    setScore(sc);
    setPhase('done');
    setTestResults(prev => ({ ...prev, voice: sc }));
    const state = sc >= 80 ? 'success' : sc >= 60 ? 'focus' : 'concern';
    const msgs = {
      success: "Great voice clarity! Your speech sounds strong and sustained.",
      focus: "Good effort! Slightly brief — try speaking a bit longer next time.",
      concern: "Your voice was quite brief. Soft, moist foods may help today."
    };
    setNobiStateWithMessage(state, msgs[state]);
  };

  const reset = () => {
    stopAll();
    setPhase('ready');
    setDuration(0);
    setScore(null);
    setAmplitude(0);
    setNobiStateWithMessage('idle', "Ready to try again! Speak clearly when the button turns red.");
  };

  const nobiState = phase === 'recording' ? 'loading' : phase === 'done'
    ? (score >= 80 ? 'success' : score >= 60 ? 'focus' : 'concern') : 'idle';

  // Audio visualizer bars
  const bars = 12;

  return (
    <div className="flex flex-col items-center px-5 pt-8 pb-28 min-h-screen">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <button id="voice-back" onClick={() => navigate('tap')} className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xl">‹</button>
          <h1 className="text-xl font-extrabold text-violet-900">Voice Test</h1>
        </div>
        <p className="text-sm text-slate-500 mb-4 font-semibold">
          Read this sentence aloud for 5–12 seconds:
        </p>
        <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 mb-5">
          <p className="text-base font-bold text-violet-800 text-center italic">
            "The weather is nice today and I feel good."
          </p>
        </div>

        <NobiMascot state={nobiState} size={100} />

        {/* Audio visualizer */}
        <div className="flex items-center justify-center gap-1 h-14 my-4">
          {Array.from({ length: bars }).map((_, i) => {
            const isActive = phase === 'recording';
            const h = isActive ? Math.max(6, (amplitude / 255) * 48 * (0.5 + Math.abs(Math.sin(i * 0.7 + Date.now() / 200)) * 0.5)) : 6;
            return (
              <motion.div key={i} animate={{ height: h }}
                transition={{ duration: 0.12 }}
                className="w-2 rounded-full"
                style={{ background: isActive ? '#7c3aed' : '#ede9fe', minHeight: 6 }}
              />
            );
          })}
        </div>

        {/* Duration display */}
        <div className="text-center mb-5">
          <span className={`text-5xl font-extrabold ${phase === 'recording' ? 'text-violet-700' : 'text-slate-300'}`}>
            {duration}s
          </span>
          <p className="text-sm font-semibold mt-1" style={{ color: duration >= 5 ? '#059669' : '#d97706' }}>
            {duration < 5 ? `Need ${5 - duration}s more` : '✓ Good duration!'}
          </p>
        </div>

        {phase === 'ready' && (
          <button id="voice-start" onClick={startRecording}
            className="w-full py-5 rounded-3xl text-white font-extrabold text-xl shadow-lg active:scale-95"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', minHeight: 80 }}>
            🎙 Start Speaking
          </button>
        )}
        {phase === 'recording' && (
          <motion.button id="voice-stop" onClick={stopRecording}
            animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1 }}
            className="w-full py-5 rounded-3xl text-white font-extrabold text-xl shadow-lg"
            style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)', minHeight: 80 }}>
            ⏹ Stop Recording
          </motion.button>
        )}

        {phase === 'done' && score !== null && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            className="p-4 rounded-2xl bg-white/80 border border-violet-100 text-center shadow-sm">
            <p className="text-3xl font-extrabold text-violet-700">{score}<span className="text-lg">/100</span></p>
            <p className="text-sm text-slate-600 font-semibold mt-1">
              {score >= 80 ? '✅ Strong voice clarity' : score >= 60 ? '⚠️ Moderate voice control' : '🔴 Brief voice — try longer'}
            </p>
            <p className="text-xs text-slate-400 mt-1">Recorded {duration} seconds</p>
          </motion.div>
        )}

        <div className="flex gap-3 mt-5">
          {phase !== 'recording' && (
            <button id="voice-reset" onClick={reset}
              className="flex-1 py-3 rounded-xl font-bold border-2 border-violet-200 text-violet-700 bg-white active:scale-95"
              style={{ minHeight: 52 }}>↺ Redo</button>
          )}
          {phase === 'done' && (
            <button id="voice-finish" onClick={() => navigate('results')}
              className="flex-1 py-3 rounded-xl text-white font-bold active:scale-95"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', minHeight: 52 }}>
              See Results →
            </button>
          )}
        </div>

        <button id="voice-skip" onClick={() => navigate('results')}
          className="w-full mt-3 text-sm text-slate-400 font-semibold py-2">
          Skip → See Results
        </button>
      </div>
    </div>
  );
}
