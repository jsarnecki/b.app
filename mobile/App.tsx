import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import HomeScreen from './src/screens/HomeScreen';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider >
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
