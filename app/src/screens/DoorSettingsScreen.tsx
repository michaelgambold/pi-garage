import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Switch, Text, Snackbar, useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList, RootStackRouteProp } from '../navigation/types';
import { DoorRepository } from '../repositories/doorRepository';
import { Layout } from '../components/Layout';
import { MOCK_DOORS } from '../fixtures/mockData';

export const DoorSettingsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RootStackRouteProp<'DoorSettings'>>();
  const { doorId } = route.params;

  const doorRepository = React.useMemo(() => new DoorRepository(), []);

  const [label, setLabel] = useState('');
  const [openDuration, setOpenDuration] = useState('0');
  const [closeDuration, setCloseDuration] = useState('0');
  const [isEnabled, setIsEnabled] = useState(false);

  const [saving, setSaving] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarColor, setSnackbarColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    doorRepository
      .findDoor(doorId)
      .then((door) => {
        setLabel(door.label);
        setOpenDuration(String(door.openDuration));
        setCloseDuration(String(door.closeDuration));
        setIsEnabled(door.isEnabled);
      })
      .catch(() => {
        // Fallback for mock/fixture mode
        const mock = MOCK_DOORS.find((d) => d.id === doorId) || MOCK_DOORS[0];
        setLabel(mock.label);
        setOpenDuration(String(mock.openDuration));
        setCloseDuration(String(mock.closeDuration));
        setIsEnabled(mock.isEnabled);
      });
  }, [doorId, doorRepository]);

  const showSnackbar = (message: string, isError = false) => {
    setSnackbarMessage(message);
    setSnackbarColor(isError ? '#D32F2F' : undefined);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await doorRepository.updateDoor(doorId, {
        label: label.trim(),
        isEnabled,
        openDuration: parseInt(openDuration, 10) || 0,
        closeDuration: parseInt(closeDuration, 10) || 0,
      });
      showSnackbar('Settings Saved');
    } catch (e: any) {
      showSnackbar(e?.message || 'Failed to save settings', true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title={`Door ${doorId} Settings`} onBack={() => navigation.goBack()}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.form}>
          <View style={styles.switchRow}>
            <Text variant="titleMedium">Enabled</Text>
            <Switch
              value={isEnabled}
              onValueChange={setIsEnabled}
              color={theme.colors.primary}
            />
          </View>

          <TextInput
            label="Label"
            mode="outlined"
            value={label}
            onChangeText={setLabel}
            style={styles.input}
          />

          <TextInput
            label="Open Duration (ms)"
            mode="outlined"
            keyboardType="numeric"
            value={openDuration}
            onChangeText={(text) => setOpenDuration(text.replace(/[^0-9]/g, ''))}
            style={styles.input}
          />

          <TextInput
            label="Close Duration (ms)"
            mode="outlined"
            keyboardType="numeric"
            value={closeDuration}
            onChangeText={(text) => setCloseDuration(text.replace(/[^0-9]/g, ''))}
            style={styles.input}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={saving}
            disabled={saving}
            style={styles.button}
          >
            Save
          </Button>
        </View>

        <Snackbar
          visible={!!snackbarMessage}
          onDismiss={() => setSnackbarMessage(null)}
          duration={3000}
          style={snackbarColor ? { backgroundColor: snackbarColor } : undefined}
        >
          {snackbarMessage || ''}
        </Snackbar>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  form: {
    gap: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  input: {
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    marginTop: 24,
  },
  button: {
    borderRadius: 8,
  },
});
