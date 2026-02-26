import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import HomeScreen from './src/screens/HomeScreen';
import AppNavigator from './src/navigation/AppNavigator';
import SnackbarProvider from './src/providers/SnackbarProvider';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider >
        <SnackbarProvider>
          <AppNavigator />
        </SnackbarProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
