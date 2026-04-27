import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import NobiMascot from '../components/NobiMascot';
import { calculateSpiralScore } from '../utils/scoring';

export default function SpiralTest() {
  const { navigate, setTestResults, setNobiStateWithMessage } = useApp();
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(null);
  const [strokes, setStrokes] = useState(0);
  const [points, setPoints] = useState([]);
  const currentStroke = useRef([]);
  const strokeCount = useRef(0);
  const allPoints = useRef([]);

  // Draw reference spiral
  const drawReference = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(167,139,250,0.25)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    const cx = canvas.width / 2, cy = canvas.height / 2;
    for (let a = 0; a <= 4 * Math.PI; a += 0.05) {
      const r = 12 + (a / (4 * Math.PI)) * 90;
      const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
      a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }, []);

  useEffect(() => {
    drawReference();
    setNobiStateWithMessage('idle', "Let's start with the spiral drawing test. Follow the faint guide and draw a smooth spiral!");
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const startDraw = (e) => {
    e.preventDefault();
    if (done) return;
    setDrawing(true);
    strokeCount.current++;
    setStrokes(strokeCount.current);
    currentStroke.current = [getPos(e)];
    setNobiStateWithMessage('loading', 'Keep going... I\'m watching your movement!');
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing || done) return;
    const pos = getPos(e);
    currentStroke.current.push(pos);
    allPoints.current.push(pos);
    setPoints([...allPoints.current]);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const prev = currentStroke.current[currentStroke.current.length - 2];
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDraw = (e) => {
    e.preventDefault();
    setDrawing(false);
  };

  const finish = () => {
    const sc = calculateSpiralScore(strokeCount.current, allPoints.current.length);
    setScore(sc);
    setDone(true);
    setTestResults(prev => ({ ...prev, spiral: sc }));
    const state = sc >= 80 ? 'success' : sc >= 60 ? 'focus' : 'concern';
    const msgs = {
      success: "Great spiral! Your drawing looks smooth and controlled.",
      focus: "Nice effort! There's a little variation — that's totally normal.",
      concern: "Today's spiral shows some variation. That's okay — let's continue."
    };
    setNobiStateWithMessage(state, msgs[state]);
  };

  const reset = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawReference();
    strokeCount.current = 0;
    allPoints.current = [];
    setDrawing(false);
    setDone(false);
    setScore(null);
    setStrokes(0);
    setPoints([]);
    setNobiStateWithMessage('idle', "No worries! Let's try again — take your time.");
  };

  return (
    <div className="flex flex-col items-center px-5 pt-8 pb-28 min-h-screen">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <button id="spiral-back" onClick={() => navigate('tests')} className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xl">‹</button>
          <h1 className="text-xl font-extrabold text-violet-900">Spiral Drawing Test</h1>
        </div>
        <p className="text-sm text-slate-500 mb-4 font-semibold">Draw along the faint spiral guide. Lift your finger as few times as possible.</p>

        <NobiMascot state={done ? (score >= 80 ? 'success' : score >= 60 ? 'focus' : 'concern') : drawing ? 'loading' : 'idle'}
          size={100} />

        {/* Canvas */}
        <div className="mt-4 relative rounded-2xl overflow-hidden border-2 border-violet-200 bg-white shadow-sm" style={{ touchAction: 'none' }}>
          <canvas
            ref={canvasRef}
            width={340} height={340}
            style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none' }}
            onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
            onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
          />
        </div>

        <div className="flex justify-between text-xs text-slate-400 font-semibold mt-2 px-1">
          <span>Strokes: {strokes}</span>
          <span>Points: {points.length}</span>
        </div>

        {done && score !== null && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            className="mt-4 p-4 rounded-2xl bg-white/80 border border-violet-100 text-center shadow-sm">
            <p className="text-3xl font-extrabold text-violet-700">{score}<span className="text-lg">/100</span></p>
            <p className="text-sm text-slate-600 font-semibold mt-1">
              {score >= 80 ? '✅ Stable control' : score >= 60 ? '⚠️ Mild variation detected' : '🔴 Significant variation'}
            </p>
          </motion.div>
        )}

        <div className="flex gap-3 mt-5">
          <button id="spiral-reset" onClick={reset}
            className="flex-1 py-3 rounded-xl font-bold border-2 border-violet-200 text-violet-700 bg-white active:scale-95 transition-all"
            style={{ minHeight: 52 }}>↺ Redo</button>
          {done
            ? <button id="spiral-next" onClick={() => navigate('tap')}
                className="flex-1 py-3 rounded-xl text-white font-bold active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', minHeight: 52 }}>
                Next: Tap Test →
              </button>
            : <button id="spiral-finish" onClick={finish} disabled={points.length < 5}
                className="flex-1 py-3 rounded-xl text-white font-bold disabled:opacity-40 active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', minHeight: 52 }}>
                Finish ✓
              </button>
          }
        </div>

        <button id="spiral-skip" onClick={() => navigate('tap')}
          className="w-full mt-3 text-sm text-slate-400 font-semibold py-2">
          Skip this test →
        </button>
      </div>
    </div>
  );
}
