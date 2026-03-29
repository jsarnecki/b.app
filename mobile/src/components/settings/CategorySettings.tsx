import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
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
import { Category } from '../../types/category';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectAllCategories } from '../../store/slices/categoriesSlice';
import { addCategory, deleteCategory, fetchCategories } from '../../api/endpoints/categoriesApi';

export default function CategorySettings() {
  const dispatch = useAppDispatch();

  const categoryFetch = useAppSelector(state => state.categories.fetchStatus);
  const categoryAdding = useAppSelector(state => state.categories.mutating);
  const error = useAppSelector(state => state.categories.error);
  const categories = useAppSelector(selectAllCategories);

  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const { showSnackbar } = useSnackbar();

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

  const handleBulkDelete = () => {
    // TODO how to get error message? Or will it automatically happen in useEffect?
    Promise.all([...selectedIds].map((id) => dispatch(deleteCategory(id))));

    exitEditMode();
    showSnackbar(
      selectedIds.size === 1
        ? 'Category deleted'
        : `${selectedIds.size} categories deleted`
    );
  };

  const handleAdd = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    Keyboard.dismiss();

    const result = await dispatch(addCategory(trimmed));
    if (!addCategory.fulfilled.match(result)) {
      showSnackbar(result.payload as string);
      return;
    }

    showSnackbar('Category added');
    setNewCategoryName('');
    setModalVisible(false);
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
              <IconButton
                icon="delete-outline"
                size={20}
                onPress={handleBulkDelete}
              />
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
        activeOpacity={editMode ? 0.4 : 1}
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
          <TextInput
            mode="outlined"
            label="New Category"
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
              loading={categoryAdding}
              disabled={categoryAdding || !newCategoryName.trim()}
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
  modalInput: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});
