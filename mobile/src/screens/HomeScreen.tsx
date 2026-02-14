import { ScrollView, StyleSheet } from 'react-native';
import { Appbar, Surface } from 'react-native-paper';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export default function HomeScreen() {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    // setLoading(true);
    const response = await fetch(`${API_URL}/get_transactions?id=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    if (response.ok) {
      console.log('TransactionList response: ' + data);
      setTransactions(data);
    } else {
      console.error('Something happened fetching transactions');
    }
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
          <TransactionForm fetchTransactions={fetchTransactions} />

          <TransactionList transactions={transactions} />
        </Surface>
      </ScrollView>
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
