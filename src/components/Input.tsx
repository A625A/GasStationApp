import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { palette, radius, spacing } from '@/src/theme';

type Props = {
  label: string;
  hint?: string;
  error?: string;
} & TextInputProps;

export const Input: React.FC<Props> = ({ label, hint, error, style, ...rest }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={palette.muted}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
  },
  label: {
    color: palette.text,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    color: palette.text,
    backgroundColor: palette.card,
  },
  hint: {
    marginTop: spacing.xs / 2,
    color: palette.muted,
    fontSize: 12,
  },
  error: {
    marginTop: spacing.xs / 2,
    color: palette.danger,
    fontSize: 12,
  },
});
