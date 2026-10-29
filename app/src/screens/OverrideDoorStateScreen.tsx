import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList, RootStackRouteProp } from '../navigation/types';
import { DoorRepository } from '../repositories/doorRepository';
import { useSnackbar } from '../hooks/useSnackbar';
import { Layout } from '../components/Layout';
import { DropdownField } from '../components/DropdownField';

export const OverrideDoorStateScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RootStackRouteProp<'OverrideDoorState'>>();
  const doorId = route.params?.doorId ?? 1;

  const doorRepository = React.useMemo(() => new DoorRepository(), []);
  const { showSnackbar, snackbarProps } = useSnackbar();

  const [stateValue, setStateValue] = useState<'open' | 'closed'>('open');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await doorRepository.overrideDoorState(doorId, stateValue);
      showSnackbar('State Overridden');
    } catch (e: any) {
      showSnackbar(e?.message || 'Failed to override state', true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title={`Door ${doorId} Override State`} onBack={() => navigation.goBack()}>
      <View style={styles.container}>
        <View style={styles.form}>
          <DropdownField<'open' | 'closed'>
            label="State"
            value={stateValue}
            options={[
              { label: 'Open', value: 'open' },
              { label: 'Closed', value: 'closed' },
            ]}
            onSelect={(val) => setStateValue(val)}
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
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  form: {
    paddingVertical: 8,
  },
  buttonContainer: {
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
