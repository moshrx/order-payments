import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { OrdersProvider } from '@/features/orders/orders-provider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { isCustomerBuild } from '@/lib/variant';

export default function RootLayout() {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const base = isDark ? DarkTheme : DefaultTheme;

  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider value={navigationTheme}>
        <OrdersProvider>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
            {isCustomerBuild ? (
              // The customer build registers no /client route at all, so a deep
              // link into the admin screens has nowhere to land.
              <>
                {/* index redirects straight to /view; it still has to be a
                    registered screen for the navigator to mount it. */}
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="view/index" options={{ headerShown: false }} />
                <Stack.Screen name="view/[id]" options={{ title: 'Order details' }} />
              </>
            ) : (
              <>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                {/* client/_layout.tsx owns its own header stack. */}
                <Stack.Screen name="client" options={{ headerShown: false }} />
                <Stack.Screen name="view/index" options={{ title: 'Orders' }} />
                <Stack.Screen name="view/[id]" options={{ title: 'Order details' }} />
              </>
            )}
          </Stack>
        </OrdersProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
