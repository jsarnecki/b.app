import { ScrollView, StyleSheet } from 'react-native';
import { Appbar, Surface } from 'react-native-paper';
import TransactionList from '../components/TransactionList';
import { useCallback, useState } from 'react';
import Constants from 'expo-constants';
import { useSnackbar } from '../providers/SnackbarProvider';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export default function TransactionListScreen() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { showSnackbar } = useSnackbar();

  useFocusEffect(
    useCallback(() => {
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
          showSnackbar(`Error fetching transactions: ${error}`)
        }
        setLoading(false);
      }
      fetchTransactions();
    }, [])
  );

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
        <Surface style={styles.surface} elevation={1}>
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
