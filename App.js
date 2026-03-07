import './global.css';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, SpaceMono_400Regular } from '@expo-google-fonts/space-mono';
import { HomeScreen } from './screens/HomeScreen';

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceMono_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <HomeScreen />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
