import { Stack } from 'expo-router';

/** Order management screens. The app is single-user, so nothing here is gated. */
export default function ClientLayout() {
  return (
    <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="index" options={{ title: 'Order history' }} />
      <Stack.Screen name="new" options={{ title: 'New order', presentation: 'modal' }} />
      <Stack.Screen name="[id]" options={{ title: 'Order details' }} />
    </Stack>
  );
}
