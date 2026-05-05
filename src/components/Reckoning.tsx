/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { format } from 'date-fns';
import { commitLog } from '../lib/storage';
import { DayLog } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ReckoningHistory } from './ReckoningHistory';

interface ReckoningProps {
  logs: DayLog[];
  onCommit: () => void;
  streak: number;
}

export const Reckoning: React.FC<ReckoningProps> = ({ logs, onCommit, streak }) => {
  const [view, setView] = useState<'entry' | 'history'>('entry');
  const today = format(new Date(), 'yyyy-MM-dd');
  const existingLog = logs.find(l => l.date === today);
  
  const [formData, setFormData] = useState<Partial<DayLog>>(existingLog || {
    date: today,
    wellDone: '',
    wasted: '',
    intentionScore: 5,
    tomorrowVow: '',
    rating: 3
  });

  const handleCommit = (e: React.FormEvent) => {
    e.preventDefault();
    commitLog({
      ...formData as DayLog,
      id: formData.id || crypto.randomUUID(),
      date: today
    });
    onCommit();
    alert("Your day has been committed. It is now part of the past.");
  };

  const SkullRating = () => (
    <div className="flex gap-4 justify-center py-4">
      {[1, 2, 3, 4, 5].map((val) => (
        <button
          key={val}
          type="button"
          onClick={() => setFormData({ ...formData, rating: val })}
          className={`text-3xl transition-all duration-300 ${formData.rating && formData.rating >= val ? 'text-amber scale-110 drop-shadow-[0_0_8px_rgba(186,117,23,0.5)]' : 'text-dark-lived opacity-50 grayscale'}`}
        >
          ☠
        </button>
      ))}
    </div>
  );

  return (
    <div className="h-full w-full bg-background flex flex-col p-6 md:p-12 overflow-y-auto custom-scrollbar">
      <header className="flex justify-between items-start mb-8 border-b parchment-border pb-4 md:pb-6">
        <div className="flex-1">
          <h2 className="text-3xl md:text-5xl font-display italic text-parchment">The Reckoning</h2>
          <div className="flex gap-4 mt-4">
            <button 
              onClick={() => setView('entry')}
              className={`text-[10px] uppercase tracking-[0.3em] transition-all pb-1 border-b-2 ${view === 'entry' ? 'text-amber border-amber' : 'text-parchment/30 border-transparent italic'}`}
            >
              Today
            </button>
            <button 
              onClick={() => setView('history')}
              className={`text-[10px] uppercase tracking-[0.3em] transition-all pb-1 border-b-2 ${view === 'history' ? 'text-amber border-amber' : 'text-parchment/30 border-transparent italic'}`}
            >
              History
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-amber font-display text-2xl md:text-4xl">{streak} ☠</p>
          <p className="text-parchment/30 text-[8px] md:text-[10px] uppercase tracking-widest mt-1">Day Streak</p>
          <p className="text-parchment/50 text-[10px] md:text-xs italic mt-1 md:mt-2">{format(new Date(), 'MMM d, yyyy')}</p>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {view === 'entry' ? (
          <motion.form 
            key="entry-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleCommit} 
            className="space-y-10 md:space-y-12 max-w-2xl mx-auto w-full pb-32 md:pb-20"
          >
            <section className="space-y-3 md:space-y-4">
              <label className="text-parchment font-display text-lg md:text-xl border-l border-amber pl-3 md:pl-4">What did I do well today?</label>
              <textarea 
                required
                className="w-full bg-[#1a1714]/30 parchment-border p-4 md:p-6 text-parchment font-serif focus:border-amber min-h-[100px] md:min-h-[120px] outline-none transition-colors"
                value={formData.wellDone}
                onChange={(e) => setFormData({ ...formData, wellDone: e.target.value })}
                placeholder="Actions that honored my nature..."
              />
            </section>

            <section className="space-y-3 md:space-y-4">
              <label className="text-parchment font-display text-lg md:text-xl border-l border-amber pl-3 md:pl-4">What did I waste?</label>
              <p className="text-parchment/30 text-[8px] md:text-[10px] uppercase tracking-widest pl-3 md:pl-4">Time, focus, or potential</p>
              <textarea 
                required
                className="w-full bg-[#1a1714]/30 parchment-border p-4 md:p-6 text-parchment font-serif focus:border-amber min-h-[100px] md:min-h-[120px] outline-none transition-colors"
                value={formData.wasted}
                onChange={(e) => setFormData({ ...formData, wasted: e.target.value })}
                placeholder="Diverted focus, idle thoughts..."
              />
            </section>

            <section className="space-y-6 md:space-y-8 parchment-border p-6 md:p-8 bg-black/10">
              <label className="text-parchment font-display text-lg md:text-xl block text-center italic">Did I live with intention?</label>
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <div className="w-full flex items-center gap-4">
                  <span className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-30">Vague</span>
                  <div className="flex-1 flex flex-col gap-2">
                    <input 
                      type="range" min="1" max="10" step="1"
                      className="w-full accent-amber bg-parchment/10 h-0.5 appearance-none cursor-pointer"
                      value={formData.intentionScore}
                      onChange={(e) => setFormData({ ...formData, intentionScore: parseInt(e.target.value) })}
                    />
                    <div className="flex justify-between px-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className={`h-1 w-px ${i + 1 <= (formData.intentionScore || 0) ? 'bg-amber' : 'bg-parchment/10'}`} />
                      ))}
                    </div>
                  </div>
                  <span className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-30">Acute</span>
                </div>
                <span className="text-amber font-display text-3xl md:text-3xl w-12 text-center">{formData.intentionScore}</span>
              </div>
            </section>

            <section className="space-y-3 md:space-y-4">
              <label className="text-parchment font-display text-lg md:text-xl border-l border-amber pl-3 md:pl-4">One thing I will do tomorrow.</label>
              <input 
                required
                type="text"
                className="w-full bg-transparent p-4 text-amber font-display font-bold text-xl md:text-2xl outline-none border-b border-parchment/10 focus:border-amber transition-colors text-center"
                value={formData.tomorrowVow}
                onChange={(e) => setFormData({ ...formData, tomorrowVow: e.target.value })}
                placeholder="My singular vow..."
              />
            </section>

            <section className="text-center space-y-4 md:space-y-6 pt-2 md:pt-4">
              <label className="text-parchment/40 uppercase tracking-[0.2em] md:tracking-[0.3em] text-[8px] md:text-[10px]">Day Rating</label>
              <SkullRating />
            </section>

            <button 
              type="submit"
              className="w-full border-2 border-amber hover:bg-amber hover:text-background text-amber font-display font-bold py-5 md:py-6 tracking-[0.3em] md:tracking-[0.4em] uppercase transition-all duration-500 active:scale-[0.98] text-xs md:text-sm"
            >
              Commit Entry
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="history-log"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-4xl mx-auto w-full"
          >
            <ReckoningHistory logs={logs} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
