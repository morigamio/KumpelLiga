import {BASE_URL} from './client';

// Logs in and returns the JWT. Throws an Error with a German message the UI can show.
export const login = async (name: string, password: string): Promise<string> => {
  const response = await fetch(`${BASE_URL}/session`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name, password}),
  });
  if (response.status === 401) {
    throw new Error('Benutzername oder Passwort falsch.');
  }
  if (!response.ok) {
    throw new Error('Anmelden hat nicht geklappt. Versuch es später nochmal.');
  }
  return (await response.text()).trim();
};

export const register = async (name: string, password: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/account`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name, password}),
  });
  if (response.status === 409) {
    throw new Error('Den Namen gibt es schon.');
  }
  if (!response.ok) {
    throw new Error('Registrieren hat nicht geklappt. Versuch es später nochmal.');
  }
};
