import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Button, Menu, IconButton, Text, Snackbar, useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList, RootStackRouteProp } from '../navigation/types';
import { DoorRepository } from '../repositories/doorRepository';
import { useSnackbar } from '../hooks/useSnackbar';
import { Layout } from '../components/Layout';

export const OverrideDoorStateScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RootStackRouteProp<'OverrideDoorState'>>();
  const { doorId } = route.params;

  const doorRepository = React.useMemo(() => new DoorRepository(), []);
  const { showSnackbar, snackbarProps } = useSnackbar();

  const [stateValue, setStateValue] = useState<'open' | 'closed'>('open');
  const [menuVisible, setMenuVisible] = useState(false);
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
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Pressable
                style={[styles.dropdownContainer, { borderBottomColor: theme.colors.outline }]}
                onPress={() => setMenuVisible(true)}
                accessibilityRole="button"
                accessibilityLabel="Select State"
              >
                <View style={styles.dropdownTextWrapper}>
                  <Text style={[styles.fieldLabel, { color: theme.colors.onSurfaceVariant }]}>State</Text>
                  <Text style={styles.fieldValue}>{stateValue === 'open' ? 'Open' : 'Closed'}</Text>
                </View>
                <IconButton
                  icon="menu-down"
                  size={24}
                  iconColor={theme.colors.onSurfaceVariant}
                  style={styles.dropdownIcon}
                />
              </Pressable>
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
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingVertical: 4,
  },
  dropdownTextWrapper: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '400',
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 2,
  },
  dropdownIcon: {
    margin: 0,
    width: 24,
    height: 24,
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
