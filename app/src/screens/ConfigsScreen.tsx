import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { FAB, Snackbar } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Config } from '../types/config';
import { useCurrentConfig } from '../context/CurrentConfigContext';
import { ConfigRepository } from '../repositories/configRepository';
import { Layout } from '../components/Layout';
import { ConfigList } from '../components/config/ConfigList';
import { generateUuid } from '../utils/uuid';

export const ConfigsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { configs, reloadConfigs } = useCurrentConfig();
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const configRepo = React.useMemo(() => new ConfigRepository(), []);

  useFocusEffect(
    useCallback(() => {
      reloadConfigs();
    }, [reloadConfigs])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await reloadConfigs();
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddPressed = async () => {
    try {
      const newConfig: Config = {
        id: generateUuid(),
        name: 'New Config',
        fqdn: '',
        apiKey: null,
      };
      await configRepo.addConfig(newConfig);
      await reloadConfigs();
    } catch (e: any) {
      setSnackbarMessage(e?.message || 'Failed to add config');
    }
  };

  const handleRemoveConfig = async (config: Config) => {
    try {
      await configRepo.removeConfig(config.id);
      await reloadConfigs();
    } catch (e: any) {
      setSnackbarMessage(e?.message || 'Failed to remove config');
    }
  };

  const handleEditConfig = (config: Config) => {
    navigation.navigate('EditConfig', { configId: config.id, title: 'Edit Config' });
  };

  return (
    <Layout title="Configs" onBack={() => navigation.goBack()}>
      <View style={styles.container}>
        <ConfigList
          configs={configs}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onEditConfig={handleEditConfig}
          onRemoveConfig={handleRemoveConfig}
        />

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={handleAddPressed}
          accessibilityLabel="Add New Configuration"
        />

        <Snackbar
          visible={!!snackbarMessage}
          onDismiss={() => setSnackbarMessage(null)}
          duration={3000}
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
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
