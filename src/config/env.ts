import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const resolveApiUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;

  const hostUri = Constants.expoConfig?.hostUri || Constants.expoConfig?.extra?.expoClient?.hostUri;
  const host = hostUri?.split(':')?.[0];

  if (host) {
    if (Platform.OS === 'android' && (host === '127.0.0.1' || host === 'localhost')) {
      return 'http://10.0.2.2:8001';
    }
    return `http://${host}:8001`;
  }

  if (Platform.OS === 'android') return 'http://10.0.2.2:8001';
  return 'http://localhost:8001';
};
