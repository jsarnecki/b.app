import { ScrollView, StyleSheet } from 'react-native';
import { Appbar, Surface } from 'react-native-paper';
import TransactionForm from '../components/TransactionForm';

import TransactionList from '../components/TransactionList';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { useSnackbar } from '../providers/SnackbarProvider';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export default function HomeScreen() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { showSnackbar } = useSnackbar();

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
        <Surface style={styles.surface} elevation={1}>
          <TransactionForm
            // fetchTransactions={fetchTransactions}
            onSuccess={showSnackbar}
            onError={showSnackbar}
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
