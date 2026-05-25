import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { navigationRef } from '@/src/navigation/AppNavigator';
import { getPromotions } from '@/src/services/promotions';

const SEEN_PROMOS_KEY = 'shell_seen_promotions_v1';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const ensurePermission = async () => {
  const settings = await Notifications.getPermissionsAsync();
  let granted = settings.status === 'granted';
  if (!granted) {
    const result = await Notifications.requestPermissionsAsync();
    granted = result.status === 'granted';
  }
  if (granted && Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  return granted;
};

export const checkForNewPromotions = async () => {
  const hasPermission = await ensurePermission();
  if (!hasPermission) return;

  const promos = await getPromotions();
  const seenRaw = await AsyncStorage.getItem(SEEN_PROMOS_KEY);
  const seen: string[] = seenRaw ? JSON.parse(seenRaw) : [];
  const seenSet = new Set(seen);

  const newPromos = promos.filter((promo) => !seenSet.has(promo.id));
  if (newPromos.length === 0) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Nuevas promociones disponibles',
      body: 'Revisa la app para ver tus nuevas promociones.',
      data: { target: 'Promotions' },
    },
    trigger: null,
  });

  const nextSeen = [...seenSet, ...newPromos.map((p) => p.id)];
  await AsyncStorage.setItem(SEEN_PROMOS_KEY, JSON.stringify(nextSeen));
};

export const registerNotificationResponseHandler = () => {
  return Notifications.addNotificationResponseReceivedListener(() => {
    if (navigationRef.isReady()) {
      const state = navigationRef.getRootState();
      const hasAppRoute = state?.routeNames?.includes('App');
      if (hasAppRoute) {
        navigationRef.navigate('App', {
          screen: 'MainTabs',
          params: { screen: 'Promotions' },
        } as never);
      }
    }
  });
};
