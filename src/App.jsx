import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import Navigation from './components/Navigation';
import LoginPage from './pages/LoginPage';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Tests from './pages/Tests';
import SpiralTest from './pages/SpiralTest';
import TapTest from './pages/TapTest';
import VoiceTest from './pages/VoiceTest';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import CaregiverDashboard from './pages/CaregiverDashboard';

const PAGE_MAP = {
  login:     <LoginPage />,
  onboarding:<Onboarding />,
  home:      <Home />,
  tests:     <Tests />,
  spiral:    <SpiralTest />,
  tap:       <TapTest />,
  voice:     <VoiceTest />,
  results:   <Results />,
  dashboard: <Dashboard />,
  caregiver: <CaregiverDashboard />,
  settings:  <Settings />,
};

const HIDE_NAV = ['login', 'onboarding', 'spiral', 'tap', 'voice', 'results', 'settings'];

function AppShell() {
  const { user, currentPage, navigate, settings, updateSettings } = useApp();

  // Route guarding
  let renderPage = currentPage;
  if (!user.role) renderPage = 'login';
  else if (user.role === 'patient' && !user.onboarded) renderPage = 'onboarding';

  // Ensure caregiver doesn't get stuck on patient views
  if (user.role === 'caregiver' && renderPage !== 'login' && renderPage !== 'caregiver') {
    renderPage = 'caregiver';
  }

  const showNav = !HIDE_NAV.includes(renderPage) && user.role !== 'caregiver';

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #f0eeff 0%, #e8f5ff 100%)' }}>
      {/* Global Language Dropdown - Top Right */}
      {renderPage !== 'login' && (
        <div className="absolute top-4 right-4 z-50">
          <select 
            value={settings?.language || 'en'}
            onChange={(e) => updateSettings({ language: e.target.value })}
            className="bg-white/80 backdrop-blur border border-violet-200 text-violet-800 text-xs font-bold rounded-full px-3 py-1.5 shadow-sm outline-none cursor-pointer hover:bg-white transition-colors"
            aria-label="Select Language"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="es">Español</option>
            <option value="ja">日本語</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={renderPage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          {PAGE_MAP[renderPage]}
        </motion.div>
      </AnimatePresence>
      {showNav && <Navigation currentPage={renderPage} onNavigate={navigate} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
