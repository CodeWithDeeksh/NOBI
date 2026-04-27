import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STATE_CONFIG = {
  idle:    { eyeRy: 10, mouthD: 'M88 118 Q100 128 112 118', cheekOpacity: 0.55, cheekFill: '#fca5a5' },
  loading: { eyeRy: 6,  mouthD: 'M88 118 Q100 120 112 118', cheekOpacity: 0.3,  cheekFill: '#fca5a5' },
  success: { eyeRy: 0,  mouthD: 'M82 115 Q100 132 118 115', cheekOpacity: 0.85, cheekFill: '#f87171' },
  focus:   { eyeRy: 7,  mouthD: 'M88 118 Q100 121 112 118', cheekOpacity: 0.45, cheekFill: '#fca5a5' },
  concern: { eyeRy: 10, mouthD: 'M88 124 Q100 114 112 124', cheekOpacity: 0.2,  cheekFill: '#fda4af' },
};

const variants = {
  idle:    { y: [0, -6, 0], transition: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' } },
  loading: { rotate: [0, 2, -2, 2, 0], scale: [1, 0.97, 1], transition: { duration: 1.2, repeat: Infinity } },
  success: { scale: [1, 1.15, 1.08, 1.12, 1], transition: { duration: 0.8 } },
  focus:   { x: [0, -4, 4, -4, 4, 0], transition: { duration: 2, repeat: Infinity } },
  concern: { x: [0, -3, 3, -3, 3, 0], transition: { duration: 1.5, repeat: Infinity } },
};

export default function NobiMascot({ state = 'idle', size = 180, onClick, message }) {
  const [blink, setBlink] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const blinkRef = useRef(null);
  const cfg = STATE_CONFIG[state] || STATE_CONFIG.idle;

  useEffect(() => {
    const schedule = () => {
      blinkRef.current = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 150);
        schedule();
      }, Math.random() * 2500 + 2500);
    };
    schedule();
    return () => clearTimeout(blinkRef.current);
  }, []);

  useEffect(() => {
    if (message) { setShowMsg(true); const t = setTimeout(() => setShowMsg(false), 4500); return () => clearTimeout(t); }
  }, [message]);

  const eyeRy = blink ? 1 : cfg.eyeRy;
  const isSuccess = state === 'success';

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        animate={variants[state]}
        whileHover={{ scale: 1.12, transition: { duration: 0.2 } }}
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={`Nobi mascot — ${state} state`}
        onKeyDown={e => e.key === 'Enter' && onClick?.()}
        style={{ width: size, height: size, cursor: 'pointer', position: 'relative' }}
      >
        {/* Glow */}
        {isSuccess && (
          <motion.div
            style={{ position: 'absolute', inset: -12, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.4) 0%, transparent 70%)' }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <svg viewBox="0 0 200 200" role="img" aria-label="Nobi the wellness mascot" width={size} height={size}>
          <defs>
            <radialGradient id="nb-fill" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="55%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#93c5fd" />
            </radialGradient>
          </defs>
          {/* Body */}
          <ellipse cx="100" cy="108" rx="72" ry="68" fill="url(#nb-fill)" />
          {/* Little feet */}
          <ellipse cx="80" cy="174" rx="18" ry="9" fill="#a78bfa" />
          <ellipse cx="120" cy="174" rx="18" ry="9" fill="#a78bfa" />
          {/* Cheeks */}
          <ellipse cx="68" cy="118" rx="13" ry="9" fill={cfg.cheekFill} opacity={cfg.cheekOpacity} />
          <ellipse cx="132" cy="118" rx="13" ry="9" fill={cfg.cheekFill} opacity={cfg.cheekOpacity} />
          {/* Eyes — arcs on success */}
          {isSuccess ? (
            <>
              <path d="M76 98 Q85 90 94 98" stroke="#1e1b4b" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M106 98 Q115 90 124 98" stroke="#1e1b4b" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <ellipse cx="85" cy={(state === 'concern') ? 97 : 100} rx="9" ry={eyeRy} fill="#1e1b4b" />
              <ellipse cx="115" cy={(state === 'concern') ? 97 : 100} rx="9" ry={eyeRy} fill="#1e1b4b" />
              {!blink && <><circle cx="88" cy="97" r="3" fill="white" /><circle cx="118" cy="97" r="3" fill="white" /></>}
            </>
          )}
          {/* Mouth */}
          <path d={cfg.mouthD} stroke="#4c1d95" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Loading orbit dots */}
          {state === 'loading' && [0, 1, 2].map(i => (
            <motion.circle
              key={i}
              cx="100" cy="40"
              r="5" fill="#7c3aed"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, delay: i * 0.67, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '100px 108px' }}
            />
          ))}
          {/* Success stars */}
          {isSuccess && ['✨','✨'].map((s, i) => (
            <motion.text key={i} x={i === 0 ? 30 : 155} y={75} fontSize="18" textAnchor="middle"
              initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 1, 0], y: -20 }}
              transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity }}
            >{s}</motion.text>
          ))}
        </svg>
      </motion.div>

      {/* Speech bubble */}
      <AnimatePresence>
        {showMsg && message && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="max-w-[260px] text-center bg-white/90 backdrop-blur border border-violet-100 rounded-2xl px-4 py-2 shadow-md text-sm font-semibold text-violet-800 leading-snug"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
