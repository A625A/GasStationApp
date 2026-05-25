import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Avatar } from '@/src/components/Avatar';
import { Input } from '@/src/components/Input';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { useAuth } from '@/src/context/AuthContext';
import { useTranslation } from '@/src/i18n';
import { palette, spacing } from '@/src/theme';
import { AuthStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');

  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/i;

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      setEmailError(t('fillRequired'));
      return false;
    }
    if (!emailRegex.test(value.trim())) {
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

  const onSubmit = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    setSubmitting(true);
    setFormError('');
    const result = await login(email, password);
    setSubmitting(false);
    if (!result.success) {
      if (result.message === 'network') {
        setFormError(t('networkError'));
      } else if (result.message === 'invalidCredentials') {
        setFormError(t('invalidCredentials'));
      } else {
        setFormError(result.message ? `${t('serverError')} (${result.message})` : t('serverError'));
      }
      return;
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Avatar size={72} fallbackLabel="S" />
        <View>
          <Text style={styles.title}>{t('loginTitle')}</Text>
          <Text style={styles.subtitle}>{t('loginSubtitle')}</Text>
        </View>
      </View>

      <Input
        label={t('email')}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (emailError) validateEmail(text);
        }}
        onBlur={() => validateEmail(email)}
        placeholder="customer@shell.com"
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
      {formError ? <Text style={styles.error}>{formError}</Text> : null}

      <PrimaryButton
        title={t('loginButton')}
        onPress={onSubmit}
        loading={submitting}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t('registerCta')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footerLink}>{t('createAccount')}</Text>
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
