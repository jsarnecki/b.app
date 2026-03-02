import { createContext, useContext, useState } from 'react';
import { Portal, Snackbar } from 'react-native-paper';

interface SnackbarContextType {
  showSnackbar: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export default function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const showSnackbar = (msg: string) => {
    setMessage(msg);
    setVisible(true);
  };

  return (
    <Portal>
      <SnackbarContext.Provider value={{ showSnackbar }}>
        {children}
        <Snackbar
          visible={visible}
          onDismiss={() => setVisible(false)}
          duration={3000}
          action={{
            label: 'Dismiss',
            onPress: () => setVisible(false),
          }}
        // wrapperStyle={{ top: 0, bottom: 'auto' }}
        >
          {message}
        </Snackbar>
      </SnackbarContext.Provider>
    </Portal>
  )
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}
