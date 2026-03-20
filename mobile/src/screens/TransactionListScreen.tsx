import { ScrollView, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import TransactionList from '../components/TransactionList';
import { useCallback, useState } from 'react';
import { useSnackbar } from '../providers/SnackbarProvider';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../providers/UserProvider';
import { getJson } from '../api/api';

export default function TransactionListScreen() {
  const { user } = useUser();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { showSnackbar } = useSnackbar();

  useFocusEffect(
    useCallback(() => {
      const fetchTransactions = async () => {
        setLoading(true);
        try {
          const data = await getJson(`transactions?id=${user.id}`);

          setTransactions(data);
        } catch (error) {
          showSnackbar(error instanceof Error ? error.message : 'Network error, please try again.');
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
