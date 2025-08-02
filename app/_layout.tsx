import { AuthProvider } from '@/contexts/AuthContext';
import { TagProvider } from '@/contexts/TagContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { TradeProvider } from '@/contexts/TradeContext';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading time
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return <CustomSplashScreen />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <TagProvider>
          <TradeProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="navigation" />
            </Stack>
          </TradeProvider>
        </TagProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function CustomSplashScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <View style={{
      flex: 1,
      backgroundColor: isDark ? '#18181b' : '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Image
        source={isDark ? require('../assets/images/splash-icon-dark.png') : require('../assets/images/splash-icon.png')}
        style={{
          width: 120,
          height: 120,
          marginBottom: 20,
        }}
        resizeMode="contain"
      />
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        color: isDark ? '#ffffff' : '#000000',
        marginBottom: 8,
      }}>
        VesTrade
      </Text>
      <Text style={{
        fontSize: 16,
        color: isDark ? '#9ca3af' : '#6b7280',
      }}>
        Your Trading Journal
      </Text>
    </View>
  );
}
