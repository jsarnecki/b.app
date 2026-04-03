import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { TextInput, Button } from 'react-native-paper';
import MoneyInput from './MoneyInput';
import { useSnackbar } from '../providers/SnackbarProvider';
import { Category } from '../types/category';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectAllCategories } from '../store/slices/categoriesSlice';
import { addTransaction } from '../api/endpoints/transactionsApi';
import { fetchCategories } from '../api/endpoints/categoriesApi';

const TransactionForm = () => {
  const { showSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();

  const categories = useAppSelector(selectAllCategories);
  const categoryFetch = useAppSelector(state => state.categories.fetchStatus);
  const error = useAppSelector(state => state.categories.error);
  const transactionMutating = useAppSelector(state => state.transactions.mutating);

  // TODO switch to Formik or similar for form state
  // const [date, setDate] = useState(new Date()); // State for eventual datepicker
  const [type, setType] = useState<'expense' | 'refund'>('expense');
  const [category, setCategory] = useState<Category | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (categoryFetch === 'idle') {
      dispatch(fetchCategories());
    }
  }, [categoryFetch]);

  useEffect(() => {
    if (categoryFetch === 'failed' && error) {
      showSnackbar(error);
    }
  }, [categoryFetch, error]);

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

    Keyboard.dismiss();

    try {
      const result = await dispatch(addTransaction({
        type, // default to expense
        category_id: category.id,
        amount: amount,
        description,
        transaction_date: new Date(), // default to now, add timestamp picker later.
      }));

      if (!addTransaction.fulfilled.match(result)) {
        showSnackbar(result.payload as string);
        return;
      }

      showSnackbar('Transaction saved')
      setCategory(null);
      setAmount('');
      setDescription('');
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : 'Network error, please try again.');
    }
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
        loading={transactionMutating}
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
