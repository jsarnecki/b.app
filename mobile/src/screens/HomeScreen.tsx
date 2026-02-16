import { ScrollView, StyleSheet } from 'react-native';
import { Appbar, Snackbar, Surface } from 'react-native-paper';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export default function HomeScreen() {
  const [transactions, setTransactions] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const showMessage = (message: string) => {
    setSnackbarVisible(true);
    setSnackbarMessage(message);
  }

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/get_transactions?id=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      if (response.ok) {
        setTransactions(data);
      } else {
        console.error('Something happened fetching transactions');
      }
    } catch (error) {
      showMessage(`Error fetching transactions: ${error}`)
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="b.app" />
      </Appbar.Header>

      <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
        <Surface style={styles.surface} elevation={1}>
          <TransactionForm
            fetchTransactions={fetchTransactions}
            onSuccess={showMessage}
            onError={showMessage}
          />

          <TransactionList transactions={transactions} />
        </Surface>
      </ScrollView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
});
