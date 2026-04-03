import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Text } from 'react-native-paper';
import { Transaction, TransactionListProps } from '../types/transaction';

const TransactionList = ({ transactions, onDelete, isLoading }: TransactionListProps) => {
  // TODO add overlay when loading for better UX
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: string) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No transactions yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {transactions.map((transaction) => (
        <List.Item
          key={transaction.id}
          title={transaction.description}
          description={formatDate(transaction.transaction_date)}
          right={() => (
            <Text style={styles.amount}>
              {formatAmount(transaction.amount)}
            </Text>
          )}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});

export default TransactionList;
