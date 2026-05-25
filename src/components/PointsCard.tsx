import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing } from '@/src/theme';

type Props = {
  points: number;
  code: string;
  title: string;
  caption: string;
  codeLabel: string;
};

export const PointsCard: React.FC<Props> = ({ points, code, title, caption, codeLabel }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headline}>{title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Shell</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>{caption}</Text>
      <View style={styles.pointsRow}>
        <Text style={styles.pointsLabel}>Pts</Text>
        <Text style={styles.pointsValue}>{points}</Text>
      </View>
      <View style={styles.codeRow}>
        <Text style={styles.codeLabel}>{codeLabel}</Text>
        <Text style={styles.codeValue}>{code}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: palette.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  badgeText: {
    color: palette.text,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.muted,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  headline: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '800',
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  pointsLabel: {
    color: palette.muted,
    fontWeight: '600',
    letterSpacing: 1,
  },
  pointsValue: {
    color: palette.primary,
    fontWeight: '900',
    fontSize: 40,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  codeLabel: {
    color: palette.muted,
    letterSpacing: 1,
    fontWeight: '700',
  },
  codeValue: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
