import {getJson, send} from './client';

// Same values as GameConstants in the backend (and game.winner).
export type Prediction = 'homeTeam' | 'draw' | 'awayTeam';

export type Bet = {
  id: number;
  owner: string;
  gameId: number;
  prediction: Prediction;
  stake: number;
  isDouble: boolean;
  // null until the game is settled.
  winnings: number | null;
};

// Request that must succeed; returns the parsed JSON response.
const sendJson = async <T>(method: string, path: string, body?: object): Promise<T> => {
  const response = await send(method, path, body);
  if (!response.ok) {
    throw new Error(`${method} ${path} failed with ${response.status}`);
  }
  return response.json();
};

// The server knows who I am from the token and returns only my bets in this league, open and settled.
export const getMyBets = (leagueId: string): Promise<Bet[]> => getJson<Bet[]>(`/leagues/${leagueId}/bets/mine`);

export const placeBet = (leagueId: string, gameId: number, prediction: Prediction): Promise<Bet> =>
  sendJson<Bet>('POST', `/leagues/${leagueId}/games/${gameId}/bets`, {prediction});

export const changeBet = (betId: number, prediction: Prediction): Promise<Bet> =>
  sendJson<Bet>('PUT', `/bets/${betId}`, {prediction});

export const deleteBet = async (betId: number): Promise<void> => {
  const response = await send('DELETE', `/bets/${betId}`);
  if (!response.ok) {
    throw new Error(`DELETE /bets/${betId} failed with ${response.status}`);
  }
};

// Doubling and undoubling return ALL bets of the participant, because only one 2x per gameday is allowed.
export const doubleBet = (betId: number): Promise<Bet[]> => sendJson<Bet[]>('PUT', `/bets/${betId}/double`);

export const undoubleBet = (betId: number): Promise<Bet[]> => sendJson<Bet[]>('DELETE', `/bets/${betId}/double`);
