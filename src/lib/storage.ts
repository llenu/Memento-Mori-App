/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppState, DayLog, UserData } from '../types';

const STORAGE_KEY = 'memento_mori_state';

const DEFAULT_STATE: AppState = {
  user: {
    name: 'Traveler',
    birthDate: '1995-01-01',
    lifeExpectancy: 80,
  },
  logs: [],
  favoriteQuotes: [],
};

export function loadAppState(): AppState {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_STATE;
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse app state', e);
    return DEFAULT_STATE;
  }
}

export function saveAppState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function updateUserData(user: UserData) {
  const state = loadAppState();
  state.user = user;
  saveAppState(state);
}

export function commitLog(log: DayLog) {
  const state = loadAppState();
  // Ensure we don't have multiple logs for the same day
  const existingIndex = state.logs.findIndex(l => l.date === log.date);
  if (existingIndex >= 0) {
    state.logs[existingIndex] = log;
  } else {
    state.logs.push(log);
  }
  saveAppState(state);
}

export function getStreak(logs: DayLog[]): number {
  if (logs.length === 0) return 0;
  
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Check if today or yesterday was the last log to continue streak
  const lastLogDate = new Date(sortedLogs[0].date);
  lastLogDate.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(currentDate.getTime() - lastLogDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 1) return 0; // Streak broken

  for (let i = 0; i < sortedLogs.length; i++) {
    const logDate = new Date(sortedLogs[i].date);
    logDate.setHours(0, 0, 0, 0);
    
    // This is simplified logic; real streak logic would check if each day is consecutive
    streak++;
    
    if (i < sortedLogs.length - 1) {
      const nextLogDate = new Date(sortedLogs[i+1].date);
      nextLogDate.setHours(0, 0, 0, 0);
      const dayDiff = (logDate.getTime() - nextLogDate.getTime()) / (1000 * 60 * 60 * 24);
      if (dayDiff !== 1) break;
    }
  }
  
  return streak;
}
