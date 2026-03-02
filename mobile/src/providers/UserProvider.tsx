import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { Portal, Snackbar } from 'react-native-paper';
import { useSnackbar } from './SnackbarProvider';

interface User {
  id: number;
  email: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  // Later: setUser, logout, token
}

const DEV_DEFAULT_USER: User = { id: 1, email: 'testing' };
const UserContext = createContext<UserContextType | null>(null);

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const { showSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // On mount, check for token
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const token: string | null = await AsyncStorage.getItem('auth_token');
        if (token) {
          //Use existing token to fetch user data
          const API_URL = 'placehold';
          const response = await fetch(`${API_URL}/api/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          });
          const data = await response.json();
          if (response.ok) {
            setUser(data);
          } else {
            console.error('Issue fetching user.');
          }
        } else {
          setUser(DEV_DEFAULT_USER);
        }
      } catch (error) {
        showSnackbar('Error fetching user: ' + error);
      }
      setIsLoading(false);
    }
    authenticateUser();
  }, []);

  return (
    <Portal>
      <UserContext.Provider value={{ user, isLoading }}>
        {children}
      </UserContext.Provider>
    </Portal>
  )
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be within the userProvider');
  }
  return context;
}
