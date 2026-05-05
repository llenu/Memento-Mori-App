/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserData {
  name: string;
  birthDate: string; // ISO format
  lifeExpectancy: number;
}

export interface DayLog {
  id: string;
  date: string; // ISO format (date only)
  wellDone: string;
  wasted: string;
  intentionScore: number; // 1-10
  tomorrowVow: string;
  rating: number; // 1-5 (skulls)
}

export interface AppState {
  user: UserData;
  logs: DayLog[];
  favoriteQuotes: string[];
}
