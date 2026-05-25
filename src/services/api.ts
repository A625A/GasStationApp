import { resolveApiUrl } from '@/src/config/env';

export const API_URL = resolveApiUrl();

type ApiUser = {
  id: number;
  email: string;
  username: string;
};

type AuthResponse = {
  user: ApiUser;
  token?: string | null;
};

const request = async <T>(path: string, body: Record<string, unknown>): Promise<T> => {
  if (__DEV__) {
    // Helps confirm the mobile client is pointing at the expected backend.
    // eslint-disable-next-line no-console
    console.log('API_URL ->', API_URL);
  }
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new Error('network');
  }

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();
  if (!response.ok) {
    const detail =
      typeof payload === 'string' ? payload : (payload as Record<string, unknown>)?.detail;
    const message = (detail as string) || `error_${response.status}`;
    throw new Error(message.toLowerCase());
  }
  return payload as T;
};

export const pingBackend = async () => {
  try {
    const res = await fetch(`${API_URL}/health`);
    if (!res.ok) throw new Error('health_error');
    return true;
  } catch (err) {
    throw new Error('network');
  }
};

export const registerUser = (payload: {
  email: string;
  username: string;
  password: string;
}) => request<AuthResponse>('/api/register', payload);

export const loginUser = (payload: { email: string; password: string }) =>
  request<AuthResponse>('/api/login', payload);
