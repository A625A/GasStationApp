import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { fallbackLanguage } from '@/src/i18n/translations';
import { Language, User } from '@/src/types';
import { generateCouponCode, generateUniqueUserCode } from '@/src/utils/codes';
import { loginUser, registerUser, pingBackend } from '@/src/services/api';

type AuthResult = { success: boolean; message?: string };
type RedemptionResult = { success: boolean; code?: string; message?: string };

type AuthContextValue = {
  user: User | null;
  profiles: User[];
  language: Language;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (payload: {
    username: string;
    email: string;
    password: string;
    profilePicture?: string;
  }) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateProfile: (
    updates: Partial<Pick<User, 'username' | 'email' | 'password' | 'profilePicture' | 'language'>>,
  ) => Promise<AuthResult>;
  setLanguagePreference: (language: Language) => Promise<void>;
  redeemWithPoints: (pointsRequired: number) => Promise<RedemptionResult>;
  refreshUser: () => Promise<void>;
};

const USERS_KEY = 'shell_users_v2';
const CURRENT_USER_KEY = 'shell_current_user_v2';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const parseProfiles = (raw: string | null): User[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to parse stored users', err);
  }
  return [];
};

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profiles, setProfiles] = useState<User[]>([]);
  const [language, setLanguage] = useState<Language>(fallbackLanguage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadState = async () => {
      try {
        const [storedUsers, storedCurrentUser] = await Promise.all([
          AsyncStorage.getItem(USERS_KEY),
          AsyncStorage.getItem(CURRENT_USER_KEY),
        ]);
        const parsedUsers = parseProfiles(storedUsers);
        setProfiles(parsedUsers);
        if (storedCurrentUser) {
          const activeUser = parsedUsers.find((u) => u.id === storedCurrentUser);
          if (activeUser) {
            setUser(activeUser);
            setLanguage(activeUser.language);
          } else {
            await AsyncStorage.removeItem(CURRENT_USER_KEY);
          }
        }
      } catch (err) {
        console.warn('Failed to load auth state', err);
      } finally {
        setLoading(false);
      }
    };

    loadState();
  }, []);

  const persistProfiles = async (nextUsers: User[], currentUserId?: string | null) => {
    setProfiles(nextUsers);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
    if (typeof currentUserId !== 'undefined') {
      if (currentUserId) {
        await AsyncStorage.setItem(CURRENT_USER_KEY, currentUserId);
      } else {
        await AsyncStorage.removeItem(CURRENT_USER_KEY);
      }
    }
  };

  const hydrateProfile = (account: {
    id: number;
    email: string;
    username: string;
    token?: string | null;
  }) => {
    const existingProfile = profiles.find((p) => p.id === String(account.id));
    if (existingProfile) {
      return {
        ...existingProfile,
        email: account.email,
        username: account.username,
        token: account.token ?? existingProfile.token ?? null,
      };
    }
    const code = generateUniqueUserCode(profiles);
    return {
      id: String(account.id),
      email: account.email,
      username: account.username,
      language: 'es',
      points: 1250,
      code,
      token: account.token ?? null,
    } as User;
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      await pingBackend();
      const response = await loginUser({ email: email.trim().toLowerCase(), password });
      const nextProfile = hydrateProfile({
        id: response.user.id,
        email: response.user.email,
        username: response.user.username,
        token: response.token ?? null,
      });
      const mergedProfiles = profiles.some((p) => p.id === nextProfile.id)
        ? profiles.map((p) => (p.id === nextProfile.id ? nextProfile : p))
        : [...profiles, nextProfile];
      setUser(nextProfile);
      setLanguage(nextProfile.language);
      await persistProfiles(mergedProfiles, nextProfile.id);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message.toLowerCase() : '';
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error('Login error', message);
      }
      if (message.includes('network')) {
        return { success: false, message: 'network' };
      }
      if (message.includes('invalid') || message.includes('401')) {
        return { success: false, message: 'invalidCredentials' };
      }
      return { success: false, message };
    }
  };

  const register = async ({
    username,
    email,
    password,
    profilePicture,
  }: {
    username: string;
    email: string;
    password: string;
    profilePicture?: string;
  }): Promise<AuthResult> => {
    try {
      await pingBackend();
      const response = await registerUser({ username, email: email.trim().toLowerCase(), password });
      const newProfile = hydrateProfile({
        id: response.user.id,
        email: response.user.email,
        username: response.user.username,
        token: response.token ?? null,
      });
      newProfile.profilePicture = profilePicture;
      const nextUsers = [...profiles, newProfile];
      setUser(newProfile);
      setLanguage(newProfile.language);
      await persistProfiles(nextUsers, newProfile.id);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message.toLowerCase() : '';
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error('Register error', message);
      }
      if (message.includes('network')) {
        return { success: false, message: 'network' };
      }
      if (message.includes('already') || message.includes('registered') || message.includes('400')) {
        return { success: false, message: 'emailInUse' };
      }
      return { success: false, message };
    }
  };

  const logout = async () => {
    setUser(null);
    setLanguage(fallbackLanguage);
    await persistProfiles(profiles, null);
  };

  const updateProfile = async (
    updates: Partial<Pick<User, 'username' | 'email' | 'password' | 'profilePicture' | 'language'>>,
  ): Promise<AuthResult> => {
    if (!user) {
      return { success: false, message: 'unauthorized' };
    }

    const normalizedEmail = updates.email?.trim().toLowerCase();
    if (normalizedEmail && normalizedEmail !== user.email.toLowerCase()) {
      const emailTaken = profiles.some(
        (u) => u.id !== user.id && u.email.toLowerCase() === normalizedEmail,
      );
      if (emailTaken) {
        return { success: false, message: 'emailInUse' };
      }
    }

    const updatedUser: User = {
      ...user,
      ...updates,
      email: normalizedEmail ?? user.email,
      language: (updates.language as Language) ?? user.language,
    };

    const nextUsers = profiles.map((u) => (u.id === user.id ? updatedUser : u));
    setUser(updatedUser);
    setLanguage(updatedUser.language);
    await persistProfiles(nextUsers, updatedUser.id);
    return { success: true };
  };

  const setLanguagePreference = async (nextLanguage: Language) => {
    if (!user) {
      setLanguage(nextLanguage);
      return;
    }
    await updateProfile({ language: nextLanguage });
  };

  const redeemWithPoints = async (pointsRequired: number): Promise<RedemptionResult> => {
    if (!user) return { success: false, message: 'unauthorized' };
    if (user.points < pointsRequired) return { success: false, message: 'insufficient' };

    const updatedUser: User = { ...user, points: user.points - pointsRequired };
    const nextUsers = profiles.map((u) => (u.id === user.id ? updatedUser : u));
    setUser(updatedUser);
    await persistProfiles(nextUsers, updatedUser.id);
    return { success: true, code: generateCouponCode() };
  };

  const refreshUser = async () => {
    if (!user) return;
    const fresh = profiles.find((u) => u.id === user.id);
    if (fresh) {
      setUser(fresh);
      setLanguage(fresh.language);
      await persistProfiles(profiles, fresh.id);
    }
  };

  const value = useMemo(
    () => ({
      user,
      profiles,
      language,
      loading,
      login,
      register,
      logout,
      updateProfile,
      setLanguagePreference,
      redeemWithPoints,
      refreshUser,
    }),
    [user, profiles, language, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
