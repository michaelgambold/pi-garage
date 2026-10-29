import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { TextInput, Button, Checkbox, Text, Snackbar, useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList, RootStackRouteProp } from '../navigation/types';
import { DoorRepository } from '../repositories/doorRepository';
import { Layout } from '../components/Layout';
import { MOCK_DOORS } from '../fixtures/mockData';
import { useSnackbar } from '../hooks/useSnackbar';

export const DoorSettingsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RootStackRouteProp<'DoorSettings'>>();
  const { doorId } = route.params;

  const doorRepository = React.useMemo(() => new DoorRepository(), []);
  const { showSnackbar, snackbarProps } = useSnackbar();

  const [label, setLabel] = useState('');
  const [openDuration, setOpenDuration] = useState('0');
  const [closeDuration, setCloseDuration] = useState('0');
  const [isEnabled, setIsEnabled] = useState(false);

  const [saving, setSaving] = useState(false);

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
          <Pressable
            style={styles.checkboxRow}
            onPress={() => setIsEnabled(!isEnabled)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isEnabled }}
          >
            <Text style={styles.checkboxLabel}>Enabled</Text>
            <Checkbox.Android
              status={isEnabled ? 'checked' : 'unchecked'}
              onPress={() => setIsEnabled(!isEnabled)}
              color="#0061A4"
            />
          </Pressable>

          <TextInput
            label="Label"
            mode="flat"
            underlineColor={theme.colors.outline}
            activeUnderlineColor={theme.colors.primary}
            value={label}
            onChangeText={setLabel}
            style={styles.input}
            contentStyle={styles.inputContent}
          />

          <TextInput
            label="Open Duration (ms)"
            mode="flat"
            underlineColor={theme.colors.outline}
            activeUnderlineColor={theme.colors.primary}
            keyboardType="numeric"
            value={openDuration}
            onChangeText={(text) => setOpenDuration(text.replace(/[^0-9]/g, ''))}
            style={styles.input}
            contentStyle={styles.inputContent}
          />

          <TextInput
            label="Close Duration (ms)"
            mode="flat"
            underlineColor={theme.colors.outline}
            activeUnderlineColor={theme.colors.primary}
            keyboardType="numeric"
            value={closeDuration}
            onChangeText={(text) => setCloseDuration(text.replace(/[^0-9]/g, ''))}
            style={styles.input}
            contentStyle={styles.inputContent}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={saving}
            disabled={saving}
            buttonColor="#0061A4"
            textColor="#FFFFFF"
            style={styles.pillButton}
            labelStyle={styles.buttonLabel}
          >
            Save
          </Button>
        </View>

        <Snackbar
          key={snackbarProps.key}
          visible={snackbarProps.visible}
          onDismiss={snackbarProps.onDismiss}
          duration={snackbarProps.duration}
          style={snackbarProps.style}
        >
          {snackbarProps.children}
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
    gap: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '400',
  },
  input: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  inputContent: {
    paddingHorizontal: 0,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 8,
  },
  pillButton: {
    borderRadius: 24,
    minHeight: 44,
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
});
