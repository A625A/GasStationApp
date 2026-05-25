import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing } from '@/src/theme';
import { Promotion } from '@/src/types';

type Props = {
  promotion: Promotion;
  canRedeem: boolean;
  missingPoints?: number;
  pointsLabel: string;
  expiresLabel: string;
  badgeText: string;
};

export const PromotionCard: React.FC<Props> = ({
  promotion,
  canRedeem,
  missingPoints,
  pointsLabel,
  expiresLabel,
  badgeText,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{promotion.title}</Text>
          <Text style={styles.description}>{promotion.description}</Text>
        </View>
        <View style={[styles.badge, canRedeem ? styles.badgeReady : styles.badgeMuted]}>
          <Text style={[styles.badgeText, !canRedeem && styles.badgeTextMuted]}>
            {badgeText}
          </Text>
        </View>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{pointsLabel}</Text>
        <Text style={styles.meta}>{expiresLabel}</Text>
      </View>
      {!canRedeem && missingPoints ? (
        <Text style={styles.missing}>{missingPoints} pts</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    color: palette.text,
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  description: {
    color: palette.muted,
    lineHeight: 20,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  badgeReady: {
    backgroundColor: palette.secondary,
  },
  badgeMuted: {
    backgroundColor: '#F3F4F6',
  },
  badgeText: {
    fontWeight: '700',
    color: palette.text,
  },
  badgeTextMuted: {
    color: palette.muted,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    color: palette.muted,
    fontWeight: '600',
  },
  missing: {
    color: palette.danger,
    fontWeight: '600',
  },
});
