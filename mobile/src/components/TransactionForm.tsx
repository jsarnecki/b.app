import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { TextInput, Button } from 'react-native-paper';
import MoneyInput from './MoneyInput';
import { useSnackbar } from '../providers/SnackbarProvider';
import { getJson, postJson } from '../api/api';
import { useFocusEffect } from '@react-navigation/native';

// let's think about creating types directory.
interface Category {
  id: number;
  name: string;
  user_id: number;
  // timestamps
}

const TransactionForm = () => {
  const { showSnackbar } = useSnackbar();

  // const [date, setDate] = useState(new Date()); // State for eventual datepicker
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState<Category | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const getCategories = async () => {
    try {
      const data = await getJson('categories');
      setCategories(data);
    } catch {
      showSnackbar('Issue fetching categories for menu');
    }
  };

  useFocusEffect(
    useCallback(() => {
      getCategories();
    }, [])
  );

  const validateForm = () => {
    if (!category) {
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
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    Keyboard.dismiss();

    try {
      const transaction = {
        type, // default to expense
        category_id: category.id,
        amount: parseFloat(amount),
        description,
        transaction_date: new Date(), // default to now, add timestamp picker later.
      };

      await postJson('transactions', transaction);

      setCategory(null);
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
      <Dropdown
        mode="modal"
        data={categories.map((c) => ({ label: c.name, value: c.id }))}
        labelField="label"
        valueField="value"
        placeholder="Category"
        value={category?.id ?? null}
        onChange={(item) => {
          const found = categories.find((c) => c.id === item.value) ?? null;
          setCategory(found);
        }}
        style={styles.dropdown}
        placeholderStyle={styles.dropdownPlaceholder}
        selectedTextStyle={styles.dropdownSelectedText}
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
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
  },
  dropdownPlaceholder: {
    color: 'gray',
  },
  dropdownSelectedText: {
    fontSize: 16,
  },
});

export default TransactionForm;
