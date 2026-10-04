import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { io, Socket } from 'socket.io-client';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import { Door } from '../types/door';
import { Config } from '../types/config';
import { useCurrentConfig } from '../context/CurrentConfigContext';
import { DoorRepository } from '../repositories/doorRepository';
import { AppVersionService } from '../services/appVersionService';
import { LocalStorageService } from '../services/localStorageService';
import { Layout } from '../components/Layout';
import { DoorList } from '../components/door/DoorList';
import { ReleaseNotesDialog } from '../components/ReleaseNotesDialog';
import { MOCK_DOORS } from '../fixtures/mockData';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { currentConfig } = useCurrentConfig();

  const [doors, setDoors] = useState<Door[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showReleaseNotes, setShowReleaseNotes] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarColor, setSnackbarColor] = useState<string | undefined>(undefined);

  const socketRef = useRef<Socket | null>(null);
  const prevConfigRef = useRef<Config | null>(null);

  const appVersionService = useRef(new AppVersionService()).current;
  const localStorageService = useRef(LocalStorageService.instance).current;
  const doorRepository = useRef(new DoorRepository()).current;

  const showSnackbar = (message: string, isError = false) => {
    setSnackbarMessage(message);
    setSnackbarColor(isError ? '#D32F2F' : undefined);
  };

  const checkToShowReleaseNotes = useCallback(async () => {
    try {
      const appVersion = await appVersionService.getAppVersion();
      const key = `viewed-release-notes-v${appVersion}`;
      const viewed = await localStorageService.getBooleanValue(key);
      if (!viewed) {
        setShowReleaseNotes(true);
      }
    } catch {
      // Ignore version check error
    }
  }, [appVersionService, localStorageService]);

  const dismissReleaseNotes = async () => {
    try {
      const appVersion = await appVersionService.getAppVersion();
      const key = `viewed-release-notes-v${appVersion}`;
      await localStorageService.setBooleanValue(key, true);
    } finally {
      setShowReleaseNotes(false);
    }
  };

  const connectSocket = useCallback(async (config: Config) => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // Fixture mode for mock testing
    if (config.fqdn === 'mock' || config.id === 'mock-config-1') {
      setDoors(MOCK_DOORS);
      setRefreshing(false);
      return;
    }

    try {
      const clientVersion = appVersionService.getApiClientVersion();
      const cleanFqdn = config.fqdn.replace(/\/+$/, '');

      const socket = io(`${cleanFqdn}/doors`, {
        transports: ['websocket'],
        extraHeaders: {
          'x-api-key': config.apiKey || '',
          'x-client-version': clientVersion,
        },
      });

      socket.on('connect', () => {
        socket.emit('doors:list');
      });

      socket.on('doors:list', (data: Door[]) => {
        setDoors(data || []);
        setRefreshing(false);
      });

      socket.on('connect_error', (err: any) => {
        setRefreshing(false);
        setDoors([]);
        showSnackbar(err?.message || 'WebSocket connection error', true);
      });

      socket.on('error', (err: any) => {
        setRefreshing(false);
        showSnackbar(typeof err === 'string' ? err : err?.message || 'WebSocket error', true);
      });

      socketRef.current = socket;
    } catch (e: any) {
      setRefreshing(false);
      showSnackbar(e?.message || 'Failed to initialize connection', true);
    }
  }, [appVersionService]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    if (currentConfig) {
      connectSocket(currentConfig);
    } else {
      setDoors([]);
      setRefreshing(false);
    }
  }, [currentConfig, connectSocket]);

  useEffect(() => {
    checkToShowReleaseNotes();
  }, [checkToShowReleaseNotes]);

  useEffect(() => {
    const prev = prevConfigRef.current;
    const changed =
      !prev ||
      !currentConfig ||
      prev.id !== currentConfig.id ||
      prev.fqdn !== currentConfig.fqdn ||
      prev.apiKey !== currentConfig.apiKey;

    if (changed) {
      prevConfigRef.current = currentConfig;
      refresh();
    }
  }, [currentConfig, refresh]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const handleDoorIconClicked = async (doorId: number) => {
    try {
      ReactNativeHapticFeedback.trigger('impactMedium');
      await doorRepository.changeDoorState(doorId, 'toggle');
    } catch (e: any) {
      showSnackbar(e?.message || 'Failed to toggle door', true);
    }
  };

  const handleDoorSequenceClicked = (doorId: number) => {
    navigation.navigate('DoorSequence', { doorId, title: `Door ${doorId} Sequence` });
  };

  const handleDoorSettingsClicked = (doorId: number) => {
    navigation.navigate('DoorSettings', { doorId, title: `Door ${doorId} Settings` });
  };

  const handleOverrideDoorStateClicked = (doorId: number) => {
    navigation.navigate('OverrideDoorState', { doorId, title: `Door ${doorId} Override State` });
  };

  return (
    <Layout
      title="Pi Garage"
      onOpenDrawer={() => navigation.openDrawer()}
    >
      <View style={styles.container}>
        <DoorList
          doors={doors}
          refreshing={refreshing}
          onRefresh={refresh}
          onDoorIconClicked={handleDoorIconClicked}
          onDoorSequenceClicked={handleDoorSequenceClicked}
          onDoorSettingsClicked={handleDoorSettingsClicked}
          onOverrideDoorStateClicked={handleOverrideDoorStateClicked}
        />

        <ReleaseNotesDialog
          visible={showReleaseNotes}
          onDismiss={dismissReleaseNotes}
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
});
