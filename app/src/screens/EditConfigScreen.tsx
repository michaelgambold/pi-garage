import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, HelperText, Snackbar, useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList, RootStackRouteProp } from '../navigation/types';
import { Config } from '../types/config';
import { useCurrentConfig } from '../context/CurrentConfigContext';
import { ConfigRepository } from '../repositories/configRepository';
import { HttpService } from '../services/httpService';
import { Layout } from '../components/Layout';

export const EditConfigScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RootStackRouteProp<'EditConfig'>>();
  const { configId } = route.params;

  const { currentConfig, reloadCurrentConfig } = useCurrentConfig();
  const configRepo = React.useMemo(() => new ConfigRepository(), []);
  const httpService = React.useMemo(() => new HttpService(), []);

  const [config, setConfig] = useState<Config | null>(null);
  const [name, setName] = useState('');
  const [fqdn, setFqdn] = useState('');
  const [apiKey, setApiKey] = useState('');

  const [nameError, setNameError] = useState('');
  const [fqdnError, setFqdnError] = useState('');

  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarColor, setSnackbarColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    configRepo.findConfig(configId).then((found) => {
      if (found) {
        setConfig(found);
        setName(found.name);
        setFqdn(found.fqdn);
        setApiKey(found.apiKey || '');
      }
    });
  }, [configId, configRepo]);

  const showSnackbar = (message: string, isError = false) => {
    setSnackbarMessage(message);
    setSnackbarColor(isError ? '#D32F2F' : undefined);
  };

  const handleTestConnection = async () => {
    if (!fqdn.trim()) {
      showSnackbar('FQDN required', true);
      return;
    }

    setTesting(true);
    const cleanFqdn = fqdn.trim().replace(/\/+$/, '');
    const headers: Record<string, string> = {};
    if (apiKey.trim()) {
      headers['x-api-key'] = apiKey.trim();
    }

    try {
      const res = await httpService.get(`${cleanFqdn}/test`, headers);
      if (res.statusCode === 200) {
        showSnackbar('Test Successful');
      } else if (res.statusCode === 401) {
        showSnackbar('API key required', true);
      } else {
        showSnackbar('Test Failed', true);
      }
    } catch (e: any) {
      showSnackbar(e?.message || 'Test Failed', true);
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    let hasError = false;
    if (!name.trim()) {
      setNameError('A name is required');
      hasError = true;
    } else {
      setNameError('');
    }

    if (!fqdn.trim()) {
      setFqdnError('A FQDN is required');
      hasError = true;
    } else {
      setFqdnError('');
    }

    if (hasError || !config) return;

    setSaving(true);
    try {
      const updatedConfig: Config = {
        ...config,
        name: name.trim(),
        fqdn: fqdn.trim(),
        apiKey: apiKey.trim() ? apiKey.trim() : null,
      };

      await configRepo.updateConfig(updatedConfig);
      if (currentConfig?.id === config.id) {
        await reloadCurrentConfig();
      }
      showSnackbar('Settings Saved');
    } catch (e: any) {
      showSnackbar(e?.message || 'Failed to save settings', true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Edit Config" onBack={() => navigation.goBack()}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.form}>
          <TextInput
            label="Name"
            mode="outlined"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (nameError) setNameError('');
            }}
            error={!!nameError}
            style={styles.input}
          />
          {!!nameError && <HelperText type="error">{nameError}</HelperText>}

          <TextInput
            label="FQDN"
            mode="outlined"
            value={fqdn}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            onChangeText={(text) => {
              setFqdn(text);
              if (fqdnError) setFqdnError('');
            }}
            error={!!fqdnError}
            style={styles.input}
          />
          {!!fqdnError && <HelperText type="error">{fqdnError}</HelperText>}

          <TextInput
            label="API Key"
            mode="outlined"
            value={apiKey}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setApiKey}
            style={styles.input}
          />
        </View>

        <View style={styles.buttons}>
          <Button
            mode="contained-tonal"
            onPress={handleTestConnection}
            loading={testing}
            disabled={testing || saving}
            style={styles.button}
          >
            Test
          </Button>

          <Button
            mode="contained"
            onPress={handleSave}
            loading={saving}
            disabled={testing || saving}
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
    gap: 12,
  },
  input: {
    backgroundColor: 'transparent',
  },
  buttons: {
    gap: 12,
    marginTop: 24,
  },
  button: {
    borderRadius: 8,
  },
});
