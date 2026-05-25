import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { palette, radius, spacing } from '@/src/theme';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
};

export const PrimaryButton: React.FC<Props> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
}) => {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'secondary' ? styles.secondary : styles.primary,
        (pressed || loading) && styles.pressed,
        isDisabled && styles.disabled,
      ]}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.xs,
  },
  primary: {
    backgroundColor: palette.primary,
  },
  secondary: {
    backgroundColor: palette.secondary,
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
