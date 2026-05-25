import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/src/context/AuthContext';
import { AppNavigator } from '@/src/navigation/AppNavigator';
import { checkForNewPromotions, registerNotificationResponseHandler } from '@/src/notifications';

export default function App() {
  useEffect(() => {
    checkForNewPromotions();
    const subscription = registerNotificationResponseHandler();
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
