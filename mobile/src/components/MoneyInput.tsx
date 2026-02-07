import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';

interface MoneyInputProps {
  value: string;
  onChangeAmount: (amount: string) => void;
  label?: string;
}

const MoneyInput: React.FC<MoneyInputProps> = ({
  value,
  onChangeAmount,
  label = "Amount"
}) => {
  const handleChange = (text: string) => {
    // Remove non-numeric characters except decimal
    const cleaned = text.replace(/[^0-9.]/g, '');

    // Prevent multiple decimals
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return;
    }

    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return;
    }

    onChangeAmount(cleaned);
  };

  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={handleChange}
      keyboardType="decimal-pad"
      mode="outlined"
      left={<TextInput.Affix text="$" />}
    />
  );
};

export default MoneyInput;
