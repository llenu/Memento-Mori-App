/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppState } from './types';
import { loadAppState, getStreak } from './lib/storage';
import { Reflect } from './components/Reflect';
import { Clock } from './components/Clock';
import { Reckoning } from './components/Reckoning';
import { YourLife } from './components/YourLife';
import { Book, Moon, Clock as ClockIcon, Activity } from 'lucide-react';

type Tab = 'reflect' | 'clock' | 'reckoning' | 'life';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('reflect');
  const [state, setState] = useState<AppState>(loadAppState());

  const refreshState = () => {
    setState(loadAppState());
  };

  const streak = getStreak(state.logs);

  return (
    <div className="flex flex-col md:flex-row h-screen max-h-screen bg-background text-parchment overflow-hidden">
      {/* Navigation Sidebar (Desktop) / Bottom Bar (Mobile) */}
      <nav className="
        w-full md:w-24 
        h-20 md:h-full 
        flex md:flex-col 
        border-t md:border-t-0 md:border-r parchment-border 
        items-center justify-around md:justify-start
        py-0 md:py-12 
        bg-background/80 md:bg-background/50 backdrop-blur-md md:backdrop-blur-sm z-50
        order-last md:order-first
        shrink-0
      ">
        <div className="hidden md:block text-[10px] tracking-widest uppercase vertical-rl rotate-180 opacity-30 mb-auto">
          Memento Mori
        </div>
        
        <div className="flex md:flex-col space-x-8 md:space-x-0 md:space-y-12 items-center md:my-auto">
          <NavButton 
            active={activeTab === 'reflect'} 
            onClick={() => setActiveTab('reflect')} 
            icon={<Moon className="w-6 h-6" />}
          />
          <NavButton 
            active={activeTab === 'clock'} 
            onClick={() => setActiveTab('clock')} 
            icon={<ClockIcon className="w-6 h-6" />}
          />
          <NavButton 
            active={activeTab === 'reckoning'} 
            onClick={() => setActiveTab('reckoning')} 
            icon={<Book className="w-6 h-6" />}
          />
          <NavButton 
            active={activeTab === 'life'} 
            onClick={() => setActiveTab('life')} 
            icon={<Activity className="w-6 h-6" />}
          />
        </div>

        <div className="hidden md:block mt-auto text-[10px] uppercase opacity-20 tracking-[0.2em] vertical-rl rotate-180">
          Estd. {(new Date(state.user.birthDate)).getFullYear()}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden bg-background">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {activeTab === 'reflect' && <Reflect user={state.user} />}
            {activeTab === 'clock' && <Clock user={state.user} />}
            {activeTab === 'reckoning' && <Reckoning logs={state.logs} onCommit={refreshState} streak={streak} />}
            {activeTab === 'life' && <YourLife user={state.user} logs={state.logs} onUpdate={refreshState} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Backdrop Effects */}
      <div className="fixed inset-0 pointer-events-none z-[60] mix-blend-overlay opacity-30 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />
    </div>
  );
}

function NavButton({ active, onClick, icon }: { active: boolean; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`
        relative group transition-all duration-500 p-2
        ${active ? 'text-amber' : 'text-parchment/30 hover:text-parchment/60'}
      `}
    >
      <div className={`transition-all duration-500 ${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(186,117,23,0.4)]' : 'scale-100'}`}>
        {icon}
      </div>
      {active && (
        <motion.div 
          layoutId="nav-glow"
          className="absolute -inset-2 bg-amber/5 rounded-full blur-md"
        />
      )}
    </button>
  );
}
