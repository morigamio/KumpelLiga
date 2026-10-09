import {getJson, send} from './client';

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

// League names are unique, so we look the league up by name and then join it by id (like the web version).
export const joinLeague = async (name: string, password: string): Promise<void> => {
  const found = await getJson<League[]>(`/leagues?name=${encodeURIComponent(name)}`);
  const league = found.find(l => l.name.toLowerCase() === name.toLowerCase());
  if (!league) {
    throw new Error(`Keine Liga namens „${name}“ gefunden.`);
  }
  const response = await send('POST', `/leagues/${league.id}/participants`, {password});
  if (response.status === 403) {
    throw new Error('Das Liga-Passwort stimmt nicht.');
  }
  if (response.status === 409) {
    throw new Error('Da bist du schon dabei.');
  }
  if (!response.ok) {
    throw new Error('Beitreten hat nicht geklappt. Versuch es später nochmal.');
  }
};

export const createLeague = async (name: string, password: string): Promise<void> => {
  const response = await send('POST', '/leagues', {name, password});
  if (response.status === 409) {
    throw new Error('Den Liga-Namen gibt es schon.');
  }
  if (!response.ok) {
    throw new Error('Gründen hat nicht geklappt. Versuch es später nochmal.');
  }
};
