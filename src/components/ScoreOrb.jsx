import { motion } from 'framer-motion';

const LEVEL_CONFIG = {
  'Stable':        { color: '#059669', bg: '#d1fae5', glow: '#6ee7b7', label: 'Stable' },
  'Mild Variation':{ color: '#d97706', bg: '#fef3c7', glow: '#fcd34d', label: 'Mild Variation' },
  'Needs Attention':{ color: '#dc2626', bg: '#fee2e2', glow: '#fca5a5', label: 'Needs Attention' },
};

export default function ScoreOrb({ score, level, size = 160 }) {
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG['Stable'];
  const r = size / 2 - 14;
  const circ = 2 * Math.PI * r;
  const filled = circ * (score / 100);

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 16 }}
      style={{ width: size, height: size, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      aria-label={`Motor score: ${score} — ${level}`}
    >
      {/* Glow */}
      <motion.div
        style={{
          position: 'absolute', inset: -10, borderRadius: '50%',
          background: `radial-gradient(circle, ${cfg.glow}55 0%, transparent 70%)`,
          filter: 'blur(8px)',
        }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill={cfg.bg} stroke={cfg.bg} strokeWidth={12} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={cfg.color} strokeWidth={12}
          strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - filled }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.span
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ fontSize: size * 0.28, fontWeight: 800, color: cfg.color, lineHeight: 1 }}
        >{score}</motion.span>
        <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, opacity: 0.8, textAlign: 'center', maxWidth: size * 0.55 }}>
          {cfg.label}
        </span>
      </div>
    </motion.div>
  );
}
