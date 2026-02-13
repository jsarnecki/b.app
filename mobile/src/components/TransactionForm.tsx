import React, { useState } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import MoneyInput from './MoneyInput';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const TransactionForm: React.FC = () => {
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async () => {
    Keyboard.dismiss();

    try {

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

      const response = await fetch(`${API_URL}/create_transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      console.log('Submitting:', transaction);
      const data = await response.json();

      if (response.ok) {
        setCategory('');
        setAmount('');
        setDescription('');

      } else {
        console.error('Response not ok.');
      }
    } catch (error) {
      console.error('Caught error:' + error);
    }
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
