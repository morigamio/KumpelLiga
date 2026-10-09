import * as SecureStore from 'expo-secure-store';

export const BASE_URL = 'https://kumpelliga.com';
const TOKEN_KEY = 'kl_token';

export const saveToken = (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token);
export const getToken = () => SecureStore.getItemAsync(TOKEN_KEY);
export const deleteToken = () => SecureStore.deleteItemAsync(TOKEN_KEY);

// Thrown when the server says the token is missing or no longer valid: the screen should go back to login.
export class NotLoggedInError extends Error {}

// Request with the saved token. Throws NotLoggedInError on 401, otherwise the caller checks the status.
export const send = async (method: string, path: string, body?: object): Promise<Response> => {
  const token = await getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (body) {
    headers['Content-Type'] = 'application/json';
  }
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (response.status === 401) {
    throw new NotLoggedInError();
  }
  return response;
};

// GET request with the saved token; returns the parsed JSON response.
export const getJson = async <T>(path: string): Promise<T> => {
  const response = await send('GET', path);
  if (!response.ok) {
    throw new Error(`GET ${path} failed with ${response.status}`);
  }
  return response.json();
};
