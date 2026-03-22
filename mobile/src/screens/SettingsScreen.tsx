import React, { useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import CategorySettings from '../components/settings/CategorySettings';

export default function SettingsScreen() {
  // Future children can hook into this focus effect with a ref or callback being passed down
  useFocusEffect(
    useCallback(() => { }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CategorySettings />
      <Divider style={styles.divider} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  divider: { marginVertical: 24 },
});
