import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import SnackbarProvider from './src/providers/SnackbarProvider';
import UserProvider from './src/providers/UserProvider';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <SnackbarProvider>
          <UserProvider>
            <AppNavigator />
          </UserProvider>
        </SnackbarProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
