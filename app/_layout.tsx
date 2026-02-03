import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from '../contexts/GameContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { theme } from '../constants/theme';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <GameProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.background },
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen 
                name="game" 
                options={{ 
                  presentation: 'fullScreenModal',
                  animation: 'fade',
                }} 
              />
              <Stack.Screen 
                name="shop" 
                options={{ 
                  presentation: 'modal',
                  animation: 'slide_from_bottom',
                }} 
              />
              <Stack.Screen 
                name="leaderboard" 
                options={{ 
                  animation: 'slide_from_right',
                }} 
              />
              <Stack.Screen 
                name="complete" 
                options={{ 
                  presentation: 'transparentModal',
                  animation: 'fade',
                }} 
              />
            </Stack>
          </GameProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
