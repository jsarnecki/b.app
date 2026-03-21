import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Button, Surface, IconButton, TextInput, ActivityIndicator } from 'react-native-paper';
import { useSnackbar } from '../../providers/SnackbarProvider';
import { deleteJson, getJson, postJson } from '../../api/api';

interface Category {
  id: number;
  name: string;
}

interface Props {
  onFocus?: () => void;
}

export default function CategorySettings({ onFocus }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number>(0);
  const { showSnackbar } = useSnackbar();

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getJson('categories');
      setCategories(data);
    } catch {
      showSnackbar('Failed to load categories');
    }
  }, []);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAdd = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    setAdding(true);
    try {
      await postJson('categories', { name: trimmed });
      setNewCategoryName('');
      setShowInput(false);
      await fetchCategories();
      showSnackbar('Category added');
    } catch {
      showSnackbar('Failed to create category');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteJson(`categories/${id}`)
      await fetchCategories();
      showSnackbar('Category deleted');
    } catch {
      showSnackbar('Failed to delete category');
    } finally {
      setDeletingId(0);
    }
  };

  return (
    <View>
      <View style={styles.header}>
        <Text variant="titleMedium">Categories</Text>
        <Button
          mode="text"
          icon="plus"
          onPress={() => setShowInput((v) => !v)}
        >
          Add
        </Button>
      </View>

      {showInput && (
        <View style={styles.inputRow}>
          <TextInput
            mode="outlined"
            label="Category name"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            style={styles.input}
            autoFocus
          />
          <Button
            mode="contained"
            onPress={handleAdd}
            loading={adding}
            disabled={adding || !newCategoryName.trim()}
            style={styles.saveButton}
          >
            Save
          </Button>
        </View>
      )}

      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        scrollEnabled={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isDeleting = deletingId === item.id;
          return (
            <Surface style={styles.card} elevation={1}>
              <IconButton icon="drag" size={18} style={styles.dragHandle} />
              <Text style={styles.categoryName}>{item.name}</Text>
              {isDeleting ? (
                <ActivityIndicator size={18} style={styles.deleteAction} />
              ) : (
                <IconButton
                  icon="delete-outline"
                  size={18}
                  style={styles.deleteAction}
                  onPress={() => handleDelete(item.id)}
                />
              )}
            </Surface>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>No categories yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  input: { flex: 1 },
  saveButton: { marginTop: 6 },
  list: { gap: 8 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  dragHandle: { opacity: 0.3 },
  categoryName: { flex: 1 },
  deleteAction: { margin: 0 },
  empty: { textAlign: 'center', marginTop: 16, opacity: 0.5 },
});
