/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { format } from 'date-fns';
import { DayLog } from '../types';

interface ReckoningHistoryProps {
  logs: DayLog[];
}

export const ReckoningHistory: React.FC<ReckoningHistoryProps> = ({ logs }) => {
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 opacity-30">
        <div className="text-4xl">☠</div>
        <p className="font-display italic">No reckonings have been committed to the void yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      {sortedLogs.map((log) => (
        <article 
          key={log.id} 
          className="bg-black/20 parchment-border p-6 md:p-8 space-y-6 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < log.rating ? 'text-amber' : 'text-parchment'}>☠</span>
            ))}
          </div>

          <header className="border-b border-parchment/5 pb-4">
            <p className="text-amber font-display text-2xl">{format(new Date(log.date), 'MMMM d, yyyy')}</p>
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 mt-1">Intention Score: {log.intentionScore}/10</p>
          </header>

          <div className="grid md:grid-cols-2 gap-8">
            <section className="space-y-2">
              <h4 className="text-[10px] uppercase tracking-widest opacity-30 italic">Well Done</h4>
              <p className="text-sm md:text-base leading-relaxed">{log.wellDone}</p>
            </section>
            <section className="space-y-2">
              <h4 className="text-[10px] uppercase tracking-widest opacity-30 italic text-red-900/50">Wasted</h4>
              <p className="text-sm md:text-base leading-relaxed opacity-80">{log.wasted}</p>
            </section>
          </div>

          <footer className="pt-4 border-t border-parchment/5">
            <h4 className="text-[10px] uppercase tracking-widest opacity-30 italic mb-2">The Tomorrow Vow</h4>
            <p className="text-amber font-display font-bold italic text-lg">"{log.tomorrowVow}"</p>
          </footer>
        </article>
      ))}
    </div>
  );
};
