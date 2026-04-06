import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { useSnackbar } from './SnackbarProvider';
import { getJson } from '../api/api';
import { User, UserContextType } from '../types/user';

const DEV_DEFAULT_USER: User = { id: 1, email: 'testing' };
const UserContext = createContext<UserContextType | null>(null);

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const { showSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const token: string | null = await AsyncStorage.getItem('auth_token');
        if (token) {
          const data = await getJson('api/me'); //Use existing token to fetch user data
          setUser(data);
        } else {
          setUser(DEV_DEFAULT_USER);
        }
      } catch (error) {
        showSnackbar(error instanceof Error ? error.message : 'Issue fetching user.');
      }
      setIsLoading(false);
    }
    authenticateUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be within the userProvider');
  }
  return context;
}
