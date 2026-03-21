import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Text,
  Surface,
  IconButton,
  Checkbox,
  Modal,
  Portal,
  TextInput,
  Button,
  ActivityIndicator,
} from 'react-native-paper';
import { useSnackbar } from '../../providers/SnackbarProvider';
import { deleteJson, getJson, postJson } from '../../api/api';

type Category = {
  id: number;
  name: string;
};

export default function CategorySettings() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { showSnackbar } = useSnackbar();

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getJson('categories');
      setCategories(data);
    } catch {
      showSnackbar('Failed to load categories');
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const exitEditMode = () => {
    setEditMode(false);
    setSelectedIds(new Set());
  };

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    setDeleting(true);
    try {
      await Promise.all([...selectedIds].map((id) => deleteJson(`categories/${id}`)));
      await fetchCategories();
      exitEditMode();
      showSnackbar(
        selectedIds.size === 1
          ? 'Category deleted'
          : `${selectedIds.size} categories deleted`
      );
    } catch {
      showSnackbar('Failed to delete categories');
    } finally {
      setDeleting(false);
    }
  };

  const handleAdd = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    setAdding(true);
    try {
      await postJson('categories', { name: trimmed });
      setNewCategoryName('');
      setModalVisible(false);
      await fetchCategories();
      showSnackbar('Category added');
    } catch {
      showSnackbar('Failed to create category');
    } finally {
      setAdding(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text variant="titleSmall" style={styles.headerTitle}>
        Categories
      </Text>
      <View style={styles.headerActions}>
        {editMode ? (
          <>
            <IconButton
              icon="plus"
              size={20}
              onPress={() => setModalVisible(true)}
            />
            {selectedIds.size > 0 && (
              deleting ? (
                <ActivityIndicator size={20} style={styles.deleteLoader} />
              ) : (
                <IconButton
                  icon="delete-outline"
                  size={20}
                  onPress={handleBulkDelete}
                />
              )
            )}
            <IconButton
              icon="close"
              size={20}
              onPress={exitEditMode}
            />
          </>
        ) : (
          <IconButton
            icon="pencil-outline"
            size={20}
            onPress={() => setEditMode(true)}
          />
        )}
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: Category }) => {
    const isSelected = selectedIds.has(item.id);

    return (
      <TouchableOpacity
        onPress={() => editMode && toggleSelected(item.id)}
        activeOpacity={editMode ? 0.6 : 1}
        style={styles.itemRow}
      >
        {editMode && (
          <Checkbox
            status={isSelected ? 'checked' : 'unchecked'}
            onPress={() => toggleSelected(item.id)}
          />
        )}
        <Text style={styles.itemName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Surface style={styles.container} elevation={1}>
        {renderHeader()}
        <View style={styles.divider} />
        <FlatList
          data={categories}
          keyExtractor={(item) => String(item.id)}
          scrollEnabled={false}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.empty}>No categories yet.</Text>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </Surface>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
            setNewCategoryName('');
          }}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleMedium" style={styles.modalTitle}>
            New Category
          </Text>
          <TextInput
            mode="outlined"
            label="Category name"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            autoFocus
            style={styles.modalInput}
          />
          <View style={styles.modalActions}>
            <Button
              onPress={() => {
                setModalVisible(false);
                setNewCategoryName('');
              }}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleAdd}
              loading={adding}
              disabled={adding || !newCategoryName.trim()}
            >
              Save
            </Button>
          </View>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
  },
  headerTitle: {
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteLoader: {
    marginHorizontal: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  itemName: {
    flex: 1,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginLeft: 16,
  },
  empty: {
    textAlign: 'center',
    padding: 24,
    opacity: 0.5,
  },
  modal: {
    margin: 24,
    borderRadius: 12,
    padding: 24,
    backgroundColor: 'white',
  },
  modalTitle: {
    marginBottom: 16,
  },
  modalInput: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});
