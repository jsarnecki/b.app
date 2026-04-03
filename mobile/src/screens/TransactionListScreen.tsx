import { ScrollView, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import TransactionList from '../components/TransactionList';
import { useEffect } from 'react';
import { useSnackbar } from '../providers/SnackbarProvider';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectAllTransactions } from '../store/slices/transactionsSlice';
import { deleteTransaction, fetchTransactions } from '../api/endpoints/transactionsApi';

export default function TransactionListScreen() {
  const { showSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();

  const transactions = useAppSelector(selectAllTransactions);
  const transFetch = useAppSelector(state => state.transactions.fetchStatus);
  const error = useAppSelector(state => state.transactions.error);
  useEffect(() => {
    if (transFetch === 'idle') {
      dispatch(fetchTransactions());
    }
  }, [transFetch]);

  useEffect(() => {
    if (transFetch === 'failed' && error) {
      showSnackbar(error);
    }
  }, [transFetch, error]);

  const handleDelete = (id: number) => {
    dispatch(deleteTransaction(id));
    // TODO add snackbar for delete success when delete route built
  }

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
        <Surface style={styles.surface} elevation={1}>
          <TransactionList
            transactions={transactions}
            onDelete={handleDelete}
            isLoading={transFetch === 'loading'}
          />
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
