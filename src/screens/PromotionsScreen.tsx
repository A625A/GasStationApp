import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PromotionCard } from '@/src/components/PromotionCard';
import { Screen } from '@/src/components/Screen';
import { useAuth } from '@/src/context/AuthContext';
import { useTranslation } from '@/src/i18n';
import { promotions as fallbackPromotions } from '@/src/services/mockData';
import { getPromotions } from '@/src/services/promotions';
import { palette, spacing } from '@/src/theme';
import { Promotion } from '@/src/types';

export const PromotionsScreen: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const totalPoints = user?.points ?? 0;
  const [items, setItems] = useState<Promotion[]>(fallbackPromotions);

  useEffect(() => {
    const load = async () => {
      const response = await getPromotions();
      setItems(response);
    };
    load();
  }, []);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>{t('promotionsTitle')}</Text>
        <Text style={styles.points}>{t('yourPoints')}: {totalPoints}</Text>
      </View>

      {items.map((promotion) => {
        const canRedeem = promotion.pointsRequired === 0 || totalPoints >= promotion.pointsRequired;
        const missing = promotion.pointsRequired - totalPoints;
        const pointsLabel = t('pointsRequired', { points: promotion.pointsRequired });
        const expiresLabel = t('expires', {
          date: new Date(promotion.expiration).toLocaleDateString(),
        });
        const badgeText = canRedeem
          ? t('canRedeem')
          : t('missingPoints', { points: Math.max(0, missing) });
        return (
          <PromotionCard
            key={promotion.id}
            promotion={promotion}
            canRedeem={canRedeem}
            missingPoints={!canRedeem ? Math.max(0, missing) : undefined}
            pointsLabel={pointsLabel}
            expiresLabel={expiresLabel}
            badgeText={badgeText}
          />
        );
      })}
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: palette.text,
  },
  points: {
    color: palette.primary,
    fontWeight: '700',
  },
});
