import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, DefaultTheme, createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ExchangeCouponsScreen } from '@/src/screens/ExchangeCouponsScreen';
import { HomeScreen } from '@/src/screens/HomeScreen';
import { LoginScreen } from '@/src/screens/LoginScreen';
import { PromotionsScreen } from '@/src/screens/PromotionsScreen';
import { RegisterScreen } from '@/src/screens/RegisterScreen';
import { SettingsScreen } from '@/src/screens/SettingsScreen';
import { useAuth } from '@/src/context/AuthContext';
import { useTranslation } from '@/src/i18n';
import { palette } from '@/src/theme';
import {
  AppStackParamList,
  AuthStackParamList,
  MainTabParamList,
  RootStackParamList,
} from '@/src/navigation/types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.background,
    primary: palette.primary,
    card: '#fff',
    text: palette.text,
  },
};

const AuthStackScreen = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const TabsNavigator = () => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShadowVisible: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.muted,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t('appTitle'),
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Promotions"
        component={PromotionsScreen}
        options={{
          title: t('promotionsTitle'),
          tabBarIcon: ({ color, size }) => <Ionicons name="pricetags" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Exchange"
        component={ExchangeCouponsScreen}
        options={{
          title: t('exchangeTitle'),
          tabBarIcon: ({ color, size }) => <Ionicons name="gift" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const AppStackScreen = () => {
  const { t } = useTranslation();
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="MainTabs"
        component={TabsNavigator}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t('settings') }}
      />
    </AppStack.Navigator>
  );
};

export const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={palette.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme} ref={navigationRef}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <RootStack.Screen name="App" component={AppStackScreen} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthStackScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
