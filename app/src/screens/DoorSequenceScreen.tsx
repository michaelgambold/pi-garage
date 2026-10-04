import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Button, FAB, Snackbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList, RootStackRouteProp } from '../navigation/types';
import { SequenceObject } from '../types/sequence';
import { DoorRepository } from '../repositories/doorRepository';
import { Layout } from '../components/Layout';
import { SequenceList } from '../components/sequence/SequenceList';
import { MOCK_SEQUENCE } from '../fixtures/mockData';

export const DoorSequenceScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RootStackRouteProp<'DoorSequence'>>();
  const { doorId } = route.params;

  const doorRepository = React.useMemo(() => new DoorRepository(), []);

  const [sequenceObjects, setSequenceObjects] = useState<SequenceObject[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarColor, setSnackbarColor] = useState<string | undefined>(undefined);

  const showSnackbar = (message: string, isError = false) => {
    setSnackbarMessage(message);
    setSnackbarColor(isError ? '#D32F2F' : undefined);
  };

  const loadSequence = useCallback(async () => {
    try {
      const data = await doorRepository.findDoorSequence(doorId);
      setSequenceObjects(data);
    } catch {
      // Fallback for mock/fixture mode
      setSequenceObjects(MOCK_SEQUENCE);
    } finally {
      setRefreshing(false);
    }
  }, [doorId, doorRepository]);

  useEffect(() => {
    loadSequence();
  }, [loadSequence]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadSequence();
  };

  const handleAddSequenceObject = () => {
    setSequenceObjects((prev) => [
      ...prev,
      { action: 'on', duration: 1000, target: 'relay1' },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setSequenceObjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, updated: SequenceObject) => {
    setSequenceObjects((prev) => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await doorRepository.updateDoorSequence(doorId, sequenceObjects);
      showSnackbar('Sequence Saved');
    } catch (e: any) {
      showSnackbar(e?.message || 'Failed to save sequence', true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title={`Door ${doorId} Sequence`} onBack={() => navigation.goBack()}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <SequenceList
            sequenceObjects={sequenceObjects}
            onRemoveItem={handleRemoveItem}
            onUpdateItem={handleUpdateItem}
          />

          <Button
            mode="contained"
            onPress={handleSave}
            loading={saving}
            disabled={saving}
            style={styles.saveButton}
          >
            Save
          </Button>
        </ScrollView>

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={handleAddSequenceObject}
          accessibilityLabel="Add Sequence Step"
        />

        <Snackbar
          visible={!!snackbarMessage}
          onDismiss={() => setSnackbarMessage(null)}
          duration={3000}
          style={snackbarColor ? { backgroundColor: snackbarColor } : undefined}
        >
          {snackbarMessage || ''}
        </Snackbar>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  saveButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
