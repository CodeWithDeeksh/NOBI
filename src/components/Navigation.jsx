import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

export default function Navigation({ currentPage, onNavigate }) {
  const { t } = useApp();
  
  const TABS = [
    { id: 'home', icon: '🏠', label: t('nav_home') },
    { id: 'tests', icon: '🔍', label: t('nav_tests') },
    { id: 'dashboard', icon: '📊', label: t('nav_track') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 safe-bottom bg-white/90 backdrop-blur-md border-t border-violet-100 z-50">
      <div className="flex justify-around items-center max-w-2xl mx-auto px-4 h-20 relative">
        {TABS.map((tab) => {
          const isActive = currentPage === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="navBubble"
                  className="absolute inset-0 bg-violet-100 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className={`relative text-2xl mb-1 ${isActive ? 'scale-110' : 'opacity-60'}`}>
                {tab.icon}
              </span>
              <span className={`relative text-[10px] font-bold ${isActive ? 'text-violet-700' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
