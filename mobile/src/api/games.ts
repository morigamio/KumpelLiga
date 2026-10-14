import {getJson} from './client';

// The gameday of the earliest unfinished game; once the season is over, the last gameday.
export const getCurrentGameday = (): Promise<number> => getJson<number>('/gamedays/current');

export const getGamedayCount = (): Promise<number> => getJson<number>('/gamedays/count');
