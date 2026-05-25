import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { palette, radius } from '@/src/theme';

type Props = {
  uri?: string;
  size?: number;
  fallbackLabel?: string;
};

export const Avatar: React.FC<Props> = ({ uri, size = 60, fallbackLabel }) => {
  if (uri) {
    return <Image source={{ uri }} style={[styles.image, { width: size, height: size }]} />;
  }

  return (
    <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={styles.initials}>{fallbackLabel?.slice(0, 1).toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 999,
    borderWidth: 2,
    borderColor: palette.secondary,
    backgroundColor: palette.card,
  },
  placeholder: {
    backgroundColor: '#F3F4F6',
    borderColor: palette.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: palette.text,
    fontWeight: '700',
  },
});
