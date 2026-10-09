import * as SecureStore from 'expo-secure-store';

export const BASE_URL = 'https://kumpelliga.com';
const TOKEN_KEY = 'kl_token';

export const saveToken = (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token);
export const getToken = () => SecureStore.getItemAsync(TOKEN_KEY);

// Thrown when the server says the token is missing or no longer valid: the screen should go back to login.
export class NotLoggedInError extends Error {}

// GET request with the saved token; returns the parsed JSON response.
export const getJson = async <T>(path: string): Promise<T> => {
  const token = await getToken();
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: token ? {Authorization: `Bearer ${token}`} : {},
  });
  if (response.status === 401) {
    throw new NotLoggedInError();
  }
  if (!response.ok) {
    throw new Error(`GET ${path} failed with ${response.status}`);
  }
  return response.json();
};
