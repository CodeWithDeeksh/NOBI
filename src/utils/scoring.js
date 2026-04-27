export const calculateSpiralScore = (strokes, points) => {
  let score = 85;
  if (strokes > 2) score -= 10 * (strokes - 2);
  if (points < 20) score -= 25;
  return Math.max(0, Math.min(100, score));
};

export const calculateTapScore = (taps, cv) => {
  // cv = coefficient of variation
  const speedScore = Math.min(100, (taps / 30) * 100); // assume 30 taps in 10s is 100%
  const rhythmScore = Math.max(0, 100 - (cv * 100)); // lower cv is better rhythm
  return Math.round((speedScore * 0.6) + (rhythmScore * 0.4));
};

export const calculateVoiceScore = (durationSec) => {
  if (durationSec >= 5) return 85;
  if (durationSec >= 3) return 60;
  return 25;
};

export const calculateFinalScore = (spiral, tap, voice) => {
  let totalWeight = 0;
  let finalScore = 0;
  
  if (spiral !== null) { finalScore += spiral * 0.4; totalWeight += 0.4; }
  if (tap !== null) { finalScore += tap * 0.3; totalWeight += 0.3; }
  if (voice !== null) { finalScore += voice * 0.3; totalWeight += 0.3; }
  
  if (totalWeight === 0) return 0;
  return Math.round(finalScore / totalWeight);
};

export const getLevel = (score) => {
  if (score >= 80) return 'Stable';
  if (score >= 60) return 'Mild Variation';
  return 'Needs Attention';
};
