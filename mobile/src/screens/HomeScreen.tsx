import { ScrollView, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import TransactionForm from '../components/TransactionForm';


export default function HomeScreen() {

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
        <Surface style={styles.surface} elevation={1}>
          <TransactionForm />
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
