import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Avatar } from '@/src/components/Avatar';
import { Input } from '@/src/components/Input';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { useAuth } from '@/src/context/AuthContext';
import { useTranslation } from '@/src/i18n';
import { palette, spacing } from '@/src/theme';
import { AuthStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register } = useAuth();
  const { t } = useTranslation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [formError, setFormError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateUsername = (value: string) => {
    if (!value.trim()) {
      setUsernameError(t('fillRequired'));
      return false;
    }
    setUsernameError('');
    return true;
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      setEmailError(t('fillRequired'));
      return false;
    }
    const pattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/i;
    if (!pattern.test(value.trim())) {
      setEmailError(t('invalidEmail'));
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError(t('fillRequired'));
      return false;
    }
    if (value.length < 8) {
      setPasswordError(t('passwordLength'));
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirm = (value: string) => {
    if (!value) {
      setConfirmError(t('fillRequired'));
      return false;
    }
    if (value !== password) {
      setConfirmError(t('passwordMismatch'));
      return false;
    }
    setConfirmError('');
    return true;
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'We need access to your photos to set a profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const onSubmit = async () => {
    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = validateConfirm(confirmPassword);
    if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
      return;
    }
    setFormError('');
    setSubmitting(true);
    const result = await register({ username, email, password, profilePicture });
    setSubmitting(false);
    if (!result.success) {
      if (result.message === 'emailInUse') {
        setEmailError(t('emailInUse'));
      } else if (result.message === 'network') {
        setFormError(t('networkError'));
      } else if (result.message === 'invalidCredentials') {
        setFormError(t('invalidCredentials'));
      } else {
        setFormError(result.message ? `${t('serverError')} (${result.message})` : t('serverError'));
      }
      return;
    }
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmError('');
    setFormError('');
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Avatar uri={profilePicture} fallbackLabel={username || 'S'} size={72} />
        <View>
          <Text style={styles.title}>{t('createAccountTitle')}</Text>
          <Text style={styles.subtitle}>{t('createAccountSubtitle')}</Text>
        </View>
      </View>

      <View style={styles.photoRow}>
        <PrimaryButton
          title={t('pickImage')}
          onPress={pickImage}
          variant="secondary"
        />
        {profilePicture ? (
          <TouchableOpacity onPress={() => setProfilePicture(undefined)}>
            <Text style={styles.removeText}>{t('removeImage')}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.optional}>{t('optional')}</Text>
        )}
      </View>

      <Input
        label={t('username')}
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          if (usernameError) validateUsername(text);
        }}
        onBlur={() => validateUsername(username)}
        placeholder="Cliente Shell"
        error={usernameError}
      />
      <Input
        label={t('email')}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (emailError) validateEmail(text);
        }}
        onBlur={() => validateEmail(email)}
        placeholder="cliente@shell.com"
        keyboardType="email-address"
        autoCapitalize="none"
        error={emailError}
      />
      <Input
        label={t('password')}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (passwordError) validatePassword(text);
        }}
        onBlur={() => validatePassword(password)}
        secureTextEntry
        placeholder="••••••••"
        error={passwordError}
      />
      <Input
        label={t('confirmPassword')}
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (confirmError) validateConfirm(text);
        }}
        onBlur={() => validateConfirm(confirmPassword)}
        secureTextEntry
        placeholder="••••••••"
        error={confirmError}
      />
      {formError ? <Text style={styles.error}>{formError}</Text> : null}

      <PrimaryButton
        title={t('registerButton')}
        onPress={onSubmit}
        loading={submitting}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t('alreadyHaveAccount')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>{t('loginButton')}</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: palette.text,
  },
  subtitle: {
    color: palette.muted,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  optional: {
    color: palette.muted,
  },
  removeText: {
    color: palette.danger,
    fontWeight: '700',
  },
  error: {
    color: palette.danger,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  footerText: {
    color: palette.muted,
  },
  footerLink: {
    color: palette.primary,
    fontWeight: '700',
  },
});
