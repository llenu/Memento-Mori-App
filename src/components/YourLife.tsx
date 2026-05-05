/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserData, DayLog } from '../types';
import { updateUserData } from '../lib/storage';
import { format } from 'date-fns';

interface YourLifeProps {
  user: UserData;
  logs: DayLog[];
  onUpdate: () => void;
}

export const YourLife: React.FC<YourLifeProps> = ({ user, logs, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const avgIntention = logs.length > 0 
    ? (logs.reduce((sum, l) => sum + l.intentionScore, 0) / logs.length).toFixed(1)
    : '0';

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserData(formData);
    setEditing(false);
    onUpdate();
  };

  return (
    <div className="h-full w-full bg-background flex flex-col p-6 md:p-12 overflow-y-auto custom-scrollbar pb-32">
      <header className="mb-8 md:mb-12 border-b parchment-border pb-4 md:pb-6">
        <h2 className="text-3xl md:text-5xl font-display italic text-parchment">Your Life</h2>
        <p className="text-parchment/30 text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] mt-1 md:mt-2">
          Identity & Vital Statistics
        </p>
      </header>

      <section className="grid grid-cols-2 gap-4 md:gap-8 mb-10 md:mb-16">
        <div className="bg-[#1a1714]/30 parchment-border p-5 md:p-8 text-center space-y-1 md:space-y-2">
          <p className="text-amber text-2xl md:text-4xl font-display">{logs.length}</p>
          <p className="text-parchment/40 text-[8px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] font-serif italic">Days Reckoned</p>
        </div>
        <div className="bg-[#1a1714]/30 parchment-border p-5 md:p-8 text-center space-y-1 md:space-y-2">
          <p className="text-amber text-2xl md:text-4xl font-display">{avgIntention}</p>
          <p className="text-parchment/40 text-[8px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] font-serif italic">Mean Intention</p>
        </div>
      </section>

      {editing ? (
        <form onSubmit={handleUpdate} className="space-y-8 bg-black/20 p-6 md:p-10 parchment-border max-w-xl">
          <div className="space-y-2 md:space-y-4">
            <label className="block text-parchment/30 uppercase tracking-[0.2em] md:tracking-[0.3em] text-[8px] md:text-[10px] italic">Appellation</label>
            <input 
              className="bg-transparent border-b border-parchment/10 w-full p-2 outline-none focus:border-amber transition-colors font-display text-xl md:text-2xl h-10 md:h-12"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2 md:space-y-4">
            <label className="block text-parchment/30 uppercase tracking-[0.2em] md:tracking-[0.3em] text-[8px] md:text-[10px] italic">Existence Begun</label>
            <input 
              type="date"
              className="bg-transparent border-b border-parchment/10 w-full p-2 outline-none focus:border-amber transition-colors font-display text-xl md:text-2xl h-10 md:h-12"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            />
          </div>

          <div className="space-y-2 md:space-y-4">
            <label className="block text-parchment/30 uppercase tracking-[0.2em] md:tracking-[0.3em] text-[8px] md:text-[10px] italic">Projected Lifespan (Years)</label>
            <input 
              type="number" min="50" max="120"
              className="bg-transparent border-b border-parchment/10 w-full p-2 outline-none focus:border-amber transition-colors font-display text-xl md:text-2xl h-10 md:h-12"
              value={formData.lifeExpectancy}
              onChange={(e) => setFormData({ ...formData, lifeExpectancy: parseInt(e.target.value) })}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 pt-4 md:pt-6">
            <button 
              type="submit"
              className="flex-1 bg-amber text-background font-display font-bold py-4 uppercase tracking-[0.2em] transition-all hover:bg-amber/90"
            >
              Commit
            </button>
            <button 
              type="button"
              onClick={() => setEditing(false)}
              className="flex-1 border border-parchment/20 text-parchment/60 font-display py-4 uppercase tracking-[0.2em] hover:text-parchment transition-colors"
            >
              Back
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-12 md:space-y-16 max-w-xl">
          <div className="space-y-6 md:space-y-8">
            <div className="flex justify-between items-end border-b border-parchment/5 pb-3 md:pb-4">
              <span className="text-parchment/30 uppercase tracking-widest text-[8px] md:text-[10px] italic">Appellation</span>
              <span className="text-lg md:text-2xl font-display">{user.name}</span>
            </div>
            <div className="flex justify-between items-end border-b border-parchment/5 pb-3 md:pb-4">
              <span className="text-parchment/30 uppercase tracking-widest text-[8px] md:text-[10px] italic">Cycle Inception</span>
              <span className="text-lg md:text-2xl font-display">{format(new Date(user.birthDate), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex justify-between items-end border-b border-parchment/5 pb-3 md:pb-4">
              <span className="text-parchment/30 uppercase tracking-widest text-[8px] md:text-[10px] italic">Horizon Limit</span>
              <span className="text-lg md:text-2xl font-display">{user.lifeExpectancy} Years</span>
            </div>
          </div>

          <button 
            onClick={() => setEditing(true)}
            className="w-full border-2 border-amber/30 hover:border-amber text-amber font-display font-bold py-4 transition-all uppercase tracking-[0.3em] text-[10px] md:text-sm"
          >
            Amend Statistics
          </button>
        </div>
      )}

      <div className="mt-auto pt-16 border-t parchment-border opacity-20 text-center">
        <p className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.5em] leading-loose">
          The memory of your life is stored locally on this vessel.<br/>
          It belongs to you alone.
        </p>
      </div>
    </div>
  );
};
