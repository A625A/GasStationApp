import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { Avatar } from '@/src/components/Avatar';
import { Input } from '@/src/components/Input';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { useAuth } from '@/src/context/AuthContext';
import { useTranslation } from '@/src/i18n';
import { palette, radius, spacing } from '@/src/theme';
import { Language } from '@/src/types';

export const SettingsScreen: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { t, language } = useTranslation();

  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | undefined>(user?.profilePicture);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(user?.language ?? language);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setProfilePicture(user.profilePicture);
      setSelectedLanguage(user.language);
    }
  }, [user]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow photo access to update your profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const onSave = async () => {
    if (!user) return;
    setSaving(true);
    const updates = {
      username,
      email,
      profilePicture,
      language: selectedLanguage,
      ...(password ? { password } : {}),
    };
    const result = await updateProfile(updates);
    setSaving(false);
    if (!result.success) {
      if (result.message === 'emailInUse') {
        Alert.alert(t('settingsTitle'), t('emailInUse'));
      } else {
        Alert.alert(t('settingsTitle'), t('fillRequired'));
      }
      return;
    }
    setPassword('');
    Alert.alert(t('settingsTitle'), t('updateSuccess'));
  };

  const onLogout = async () => {
    await logout();
  };

  return (
    <Screen>
      <Text style={styles.title}>{t('settingsTitle')}</Text>

      <View style={styles.row}>
        <Avatar uri={profilePicture} fallbackLabel={username} size={72} />
        <View style={styles.photoActions}>
          <PrimaryButton title={t('pickImage')} onPress={pickImage} variant="secondary" />
          {profilePicture ? (
            <TouchableOpacity onPress={() => setProfilePicture(undefined)}>
              <Text style={styles.removeText}>{t('removeImage')}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <Input
        label={t('nameLabel')}
        value={username}
        onChangeText={setUsername}
        placeholder={t('username')}
      />
      <Input
        label={t('emailLabel')}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="customer@shell.com"
      />
      <Input
        label={t('passwordLabel')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
        hint={t('optional')}
      />

      <View style={styles.languageBlock}>
        <Text style={styles.sectionLabel}>{t('languageLabel')}</Text>
        <View style={styles.languageRow}>
          {(['es', 'en'] as Language[]).map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.languageChip,
                selectedLanguage === lang && styles.languageChipActive,
              ]}
              onPress={() => setSelectedLanguage(lang)}>
              <Text
                style={[
                  styles.languageText,
                  selectedLanguage === lang && styles.languageTextActive,
                ]}>
                {lang === 'es' ? t('spanish') : t('english')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <PrimaryButton
        title={t('saveChanges')}
        onPress={onSave}
        loading={saving}
      />

      <TouchableOpacity style={styles.logout} onPress={onLogout}>
        <Text style={styles.logoutText}>{t('logout')}</Text>
      </TouchableOpacity>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: palette.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  photoActions: {
    gap: spacing.xs,
  },
  removeText: {
    color: palette.danger,
    fontWeight: '700',
  },
  languageBlock: {
    gap: spacing.sm,
  },
  sectionLabel: {
    color: palette.text,
    fontWeight: '700',
  },
  languageRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  languageChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
  },
  languageChipActive: {
    backgroundColor: palette.secondary,
    borderColor: palette.secondary,
  },
  languageText: {
    color: palette.text,
    fontWeight: '600',
  },
  languageTextActive: {
    color: palette.text,
  },
  logout: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  logoutText: {
    color: palette.danger,
    fontWeight: '700',
  },
});
