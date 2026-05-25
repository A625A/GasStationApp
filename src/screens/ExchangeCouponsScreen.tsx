import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { CouponCard } from '@/src/components/CouponCard';
import { Screen } from '@/src/components/Screen';
import { useAuth } from '@/src/context/AuthContext';
import { useTranslation } from '@/src/i18n';
import { coupons } from '@/src/services/mockData';
import { palette, spacing } from '@/src/theme';

export const ExchangeCouponsScreen: React.FC = () => {
  const { user, redeemWithPoints } = useAuth();
  const { t } = useTranslation();
  const totalPoints = user?.points ?? 0;

  const handleRedeem = async (pointsRequired: number) => {
    const result = await redeemWithPoints(pointsRequired);
    if (!result.success) {
      Alert.alert(t('redeem'), t('notEnoughPoints'));
      return;
    }
    Alert.alert(t('redeemSuccess'), t('redeemCode', { code: result.code ?? '' }));
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>{t('exchangeTitle')}</Text>
        <Text style={styles.pointsLabel}>
          {t('yourPoints')}: <Text style={styles.pointsValue}>{totalPoints}</Text>
        </Text>
      </View>

      {coupons.map((coupon) => {
        const canRedeem = totalPoints >= coupon.pointsRequired;
        return (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            canRedeem={canRedeem}
            redeemLabel={t('redeem')}
            disabledLabel={t('notEnoughPoints')}
            onRedeem={() => handleRedeem(coupon.pointsRequired)}
          />
        );
      })}
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: palette.text,
  },
  pointsLabel: {
    color: palette.muted,
    fontWeight: '600',
    fontSize: 16,
  },
  pointsValue: {
    color: palette.primary,
    fontWeight: '800',
    fontSize: 22,
  },
});
