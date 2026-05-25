import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing } from '@/src/theme';
import { Coupon } from '@/src/types';
import { PrimaryButton } from './PrimaryButton';

type Props = {
  coupon: Coupon;
  canRedeem: boolean;
  onRedeem: () => void;
  redeemLabel: string;
  disabledLabel: string;
};

export const CouponCard: React.FC<Props> = ({
  coupon,
  canRedeem,
  onRedeem,
  redeemLabel,
  disabledLabel,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{coupon.title}</Text>
        <Text style={styles.points}>{coupon.pointsRequired} pts</Text>
      </View>
      <Text style={styles.description}>{coupon.description}</Text>
      <PrimaryButton
        title={canRedeem ? redeemLabel : disabledLabel}
        onPress={onRedeem}
        disabled={!canRedeem}
      />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 16,
  },
  points: {
    color: palette.primary,
    fontWeight: '800',
  },
  description: {
    color: palette.muted,
    lineHeight: 20,
  },
});
