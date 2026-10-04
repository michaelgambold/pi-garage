import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Menu, Snackbar, useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList, RootStackRouteProp } from '../navigation/types';
import { DoorRepository } from '../repositories/doorRepository';
import { Layout } from '../components/Layout';

export const OverrideDoorStateScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RootStackRouteProp<'OverrideDoorState'>>();
  const { doorId } = route.params;

  const doorRepository = React.useMemo(() => new DoorRepository(), []);

  const [stateValue, setStateValue] = useState<'open' | 'closed'>('open');
  const [menuVisible, setMenuVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarColor, setSnackbarColor] = useState<string | undefined>(undefined);

  const showSnackbar = (message: string, isError = false) => {
    setSnackbarMessage(message);
    setSnackbarColor(isError ? '#D32F2F' : undefined);
  };

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
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                icon="menu-down"
                contentStyle={styles.buttonContent}
                style={[styles.dropdownButton, { borderColor: theme.colors.outline }]}
                onPress={() => setMenuVisible(true)}
              >
                {`State: ${stateValue === 'open' ? 'Open' : 'Closed'}`}
              </Button>
            }
          >
            <Menu.Item
              onPress={() => {
                setStateValue('open');
                setMenuVisible(false);
              }}
              title="Open"
            />
            <Menu.Item
              onPress={() => {
                setStateValue('closed');
                setMenuVisible(false);
              }}
              title="Closed"
            />
          </Menu>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={saving}
            disabled={saving}
            style={styles.saveButton}
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
  dropdownButton: {
    borderRadius: 8,
  },
  buttonContent: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    marginBottom: 8,
  },
  saveButton: {
    borderRadius: 8,
  },
});
