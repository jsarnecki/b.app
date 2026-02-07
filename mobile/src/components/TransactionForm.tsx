import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import MoneyInput from './MoneyInput';

const TransactionForm: React.FC = () => {
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async () => {
    const currentDate = new Intl.DateTimeFormat('en', {
      dateStyle: 'short',
      timeStyle: 'short',
      hour12: false
    }).format(new Date());

    // needs validation
    const transaction = {
      user_id: 1, // Hardcode for now
      type,
      category,
      amount: parseFloat(amount),
      description,
      transaction_date: date,
      justDate: currentDate
    };

    console.log('Submitting:', transaction);
    // api call...
  };

  return (
    <View style={styles.form}>
      <TextInput
        label="Category"
        value={category}
        onChangeText={setCategory}
        mode="outlined"
        style={styles.input}
      />

      <MoneyInput
        value={amount}
        onChangeAmount={setAmount}
      />

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.button}
      >
        Add Transaction
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 12,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
  },
});

export default TransactionForm;
