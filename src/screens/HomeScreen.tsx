import { Ionicons } from '@expo/vector-icons';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Avatar } from '@/src/components/Avatar';
import { PointsCard } from '@/src/components/PointsCard';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { useAuth } from '@/src/context/AuthContext';
import { useTranslation } from '@/src/i18n';
import { palette, spacing } from '@/src/theme';
import { AppStackParamList, MainTabParamList } from '@/src/navigation/types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type HomeNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<AppStackParamList>
>;

export const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNav>();

  useEffect(() => {
    navigation.setOptions({
      title: t('appTitle'),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.getParent()?.navigate('Settings')}
          style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={22} color={palette.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, t]);

  if (!user) {
    return (
      <Screen>
        <Text style={styles.muted}>{t('fillRequired')}</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.row}>
        <Avatar uri={user.profilePicture} fallbackLabel={user.username} size={68} />
        <View>
          <Text style={styles.welcome}>{t('welcomeHeadline', { username: user.username })}</Text>
          <Text style={styles.subtitle}>{t('welcomeSubtitle')}</Text>
        </View>
      </View>

      <PointsCard
        points={user.points}
        code={user.code}
        title={t('totalPoints')}
        caption={t('welcomeSubtitle')}
        codeLabel={t('yourCode')}
      />

      <PrimaryButton title={t('seePromotions')} onPress={() => navigation.navigate('Promotions')} />
      <PrimaryButton title={t('exchangeCoupons')} onPress={() => navigation.navigate('Exchange')} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '800',
    color: palette.text,
  },
  subtitle: {
    color: palette.muted,
    marginTop: spacing.xs,
  },
  settingsButton: {
    padding: spacing.xs,
  },
  muted: {
    color: palette.muted,
  },
});
