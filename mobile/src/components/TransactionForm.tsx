import React, { useState } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import MoneyInput from './MoneyInput';
import Constants from 'expo-constants';
import { useSnackbar } from '../providers/SnackbarProvider';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const TransactionForm = () => {
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  // const [date, setDate] = useState(new Date()); // State for eventual datepicker
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const validateForm = () => {
    if (!category.trim()) {
      Keyboard.dismiss();
      showSnackbar('Category is required');
      return false;
    }
    if (!amount || parseFloat(amount) <= 0) {
      // don't allow for negative amounts just yet.
      Keyboard.dismiss();
      showSnackbar('Amount must be greater than 0');
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    Keyboard.dismiss();

    try {
      const transaction = {
        user_id: 1, // Hardcode for now
        type, // default to expense
        category,
        amount: parseFloat(amount),
        description,
        transaction_date: new Date(), // default to now, add timestamp picker later.
      };

      const response = await fetch(`${API_URL}/create_transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(transaction),
      });

      const data = await response.json();

      // make helper function for printing error objects.. or just watch logs
      // console.log('response: ' + JSON.stringify(data, null, 2));
      if (response.ok) {
        setCategory('');
        setAmount('');
        setDescription('');
        showSnackbar('Transaction saved');
      } else {
        // Handle validation errors
        let error = data.message || 'Failed to save transaction';
        if (data.errors) {
          // Chain all error messages together. 
          error = Object.values(data.errors).flat().join(', ');
        }
        showSnackbar(error);
      }
    } catch (error) {
      // Network errors, JSON parse errors, etc.
      showSnackbar('Network error. Please try again.');
    }

    setLoading(false);
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
        loading={loading}
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
