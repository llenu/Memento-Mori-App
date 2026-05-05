/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { differenceInDays, differenceInWeeks, addYears, format } from 'date-fns';
import { UserData } from '../types';
import { motion } from 'motion/react';

type DisplayMode = 'years' | 'days' | 'weeks' | 'percent';

export const Clock: React.FC<{ user: UserData }> = ({ user }) => {
  const [mode, setMode] = useState<DisplayMode>('years');
  
  const birthDate = new Date(user.birthDate);
  const deathDate = addYears(birthDate, user.lifeExpectancy);
  const now = new Date();
  
  const totalDays = differenceInDays(deathDate, birthDate);
  const daysLived = differenceInDays(now, birthDate);
  const daysRemaining = totalDays - daysLived;
  const weeksLived = differenceInWeeks(now, birthDate);
  const totalWeeks = user.lifeExpectancy * 52;
  
  const yearsRemaining = (daysRemaining / 365.25).toFixed(1);
  const percentLived = ((daysLived / totalDays) * 100).toFixed(1);

  const stats = {
    years: { val: yearsRemaining, label: 'Years Remaining' },
    days: { val: daysRemaining.toLocaleString(), label: 'Days Remaining' },
    weeks: { val: (totalWeeks - weeksLived).toLocaleString(), label: 'Weeks Remaining' },
    percent: { val: `${percentLived}%`, label: 'Life Lived' }
  };

  const toggleMode = () => {
    const modes: DisplayMode[] = ['years', 'days', 'weeks', 'percent'];
    const nextIndex = (modes.indexOf(mode) + 1) % modes.length;
    setMode(modes[nextIndex]);
  };

  return (
    <div className="h-full w-full bg-background flex flex-col p-6 md:p-12 overflow-hidden">
      <header className="flex justify-between items-start mb-8 md:mb-12">
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-5xl font-display mb-1 md:mb-2">The Clock</h1>
          <p className="text-[10px] md:text-sm opacity-50 tracking-widest uppercase whitespace-nowrap">
            {stats.years.val} Years Remaining
          </p>
        </div>
        <div 
          className="text-right cursor-pointer group"
          onClick={toggleMode}
        >
          <div className="text-3xl md:text-5xl font-display text-amber group-hover:scale-110 transition-transform duration-300">
            {stats[mode].val}
          </div>
          <div className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-40 mt-1">
            {stats[mode].label}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center parchment-border p-4 md:p-8 bg-black/20 rounded-sm overflow-hidden">
        <div className="flex-1 overflow-y-auto custom-scrollbar w-full">
          <div className="grid grid-cols-[repeat(26,1fr)] md:grid-cols-[repeat(52,1fr)] gap-0.5 md:gap-1">
            {Array.from({ length: totalWeeks }).map((_, i) => {
              const isLived = i < weeksLived;
              const isToday = i === weeksLived;
              
              return (
                <div 
                  key={i}
                  className={`
                    aspect-square rounded-[1px]
                    ${isToday ? 'bg-amber shadow-[0_0_8px_rgba(186,117,23,0.8)] z-10' : 
                      isLived ? 'bg-dark-lived' : 'bg-lit-cell opacity-40'}
                  `}
                  title={`Week ${i + 1}`}
                />
              );
            })}
          </div>
        </div>
        <p className="mt-4 md:mt-8 text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] opacity-30 italic text-center">
          One cell = One week of existence
        </p>
      </div>
      
      <footer className="mt-6 md:mt-10 flex justify-between items-end border-t border-parchment/10 pt-4 md:pt-6">
        <div className="text-[8px] md:text-[10px] text-parchment/30 uppercase tracking-[0.1em] md:tracking-[0.2em] leading-relaxed">
          <p>Existence Begun: {format(birthDate, 'MMM d, yyyy')}</p>
          <p>Projected Horizon: {format(deathDate, 'MMM d, yyyy')}</p>
        </div>
        <div className="text-[8px] md:text-[10px] text-amber uppercase tracking-[0.2em] md:tracking-[0.3em] text-right">
          <p>{user.lifeExpectancy} Year Cycle</p>
        </div>
      </footer>
    </div>
  );
};
