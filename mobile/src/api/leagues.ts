import {getJson} from './client';

export type Participant = {
  id: number;
  name: string;
  status: string;
  balance: number;
  avgWinRate: number;
  highestWin: number;
};

export type League = {
  id: number;
  name: string;
  admin: string;
  participants: Participant[];
};

// The server has no "my leagues" endpoint, so like the web version we load all leagues
// and keep the ones where one of the participants is me.
export const getMyLeagues = async (myName: string): Promise<League[]> => {
  const leagues = await getJson<League[]>('/leagues');
  return leagues.filter(league => league.participants.some(p => p.name === myName));
};
