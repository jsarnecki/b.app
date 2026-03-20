import React, { useState } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import MoneyInput from './MoneyInput';
import { useSnackbar } from '../providers/SnackbarProvider';
import { useUser } from '../providers/UserProvider';
import { postJson } from '../api/api';

const TransactionForm = () => {
  const { user, isLoading: userLoading } = useUser();

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
        user_id: user.id,
        type, // default to expense
        category,
        amount: parseFloat(amount),
        description,
        transaction_date: new Date(), // default to now, add timestamp picker later.
      };

      await postJson('transactions', transaction);

      setCategory('');
      setAmount('');
      setDescription('');
      showSnackbar('Transaction saved');
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : 'Network error, please try again.');
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
