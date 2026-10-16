import {getJson} from './client';

export type Game = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  gameDay: number;
  oddsHome: number;
  oddsAway: number;
  oddsDraw: number;
  goalsHomeTeam: number;
  goalsAwayTeam: number;
  winner: string;
  isFinished: boolean;
  matchTime: string;
};

// The gameday of the earliest unfinished game; once the season is over, the last gameday.
export const getCurrentGameday = (): Promise<number> => getJson<number>('/gamedays/current');

export const getGamedayCount = (): Promise<number> => getJson<number>('/gamedays/count');

export const getGamesByGameday = (gameday: number): Promise<Game[]> => getJson<Game[]>(`/games?gameDay=${gameday}`);
