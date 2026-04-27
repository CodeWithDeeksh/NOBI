import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export default function TrendChart({ sessions }) {
  const last10 = [...sessions].reverse().slice(-10);
  const labels = last10.map((s, i) => {
    const d = new Date(s.date);
    return `${d.getMonth()+1}/${d.getDate()}`;
  });
  const scores = last10.map(s => s.finalScore);

  const data = {
    labels,
    datasets: [{
      label: 'Motor Score',
      data: scores,
      fill: true,
      borderColor: '#7c3aed',
      backgroundColor: 'rgba(124,58,237,0.12)',
      tension: 0.4,
      pointBackgroundColor: scores.map(s => s >= 80 ? '#059669' : s >= 60 ? '#d97706' : '#dc2626'),
      pointRadius: 6,
      pointHoverRadius: 9,
    }]
  };

  const options = {
    responsive: true,
    scales: {
      y: { min: 0, max: 100, ticks: { font: { family: 'Nunito', weight: '700' }, color: '#7c3aed' }, grid: { color: '#ede9fe' } },
      x: { ticks: { font: { family: 'Nunito', weight: '600' }, color: '#6d28d9' }, grid: { display: false } }
    },
    plugins: { legend: { display: false }, tooltip: { bodyFont: { family: 'Nunito' }, titleFont: { family: 'Nunito' } } }
  };

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-violet-100 shadow-sm">
      <h3 className="text-sm font-bold text-violet-600 mb-3">Motor Score Trend</h3>
      {sessions.length === 0
        ? <p className="text-center text-slate-400 text-sm py-6">No sessions yet. Run your first test!</p>
        : <Line data={data} options={options} />
      }
    </div>
  );
}
