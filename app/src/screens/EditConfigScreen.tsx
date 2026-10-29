import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, HelperText, Snackbar, useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList, RootStackRouteProp } from '../navigation/types';
import { Config } from '../types/config';
import { useCurrentConfig } from '../context/CurrentConfigContext';
import { ConfigRepository } from '../repositories/configRepository';
import { useSnackbar } from '../hooks/useSnackbar';
import { HttpService } from '../services/httpService';
import { AppVersionService } from '../services/appVersionService';
import { Layout } from '../components/Layout';

export const EditConfigScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RootStackRouteProp<'EditConfig'>>();
  const { configId } = route.params;

  const { currentConfig, reloadCurrentConfig, reloadConfigs } = useCurrentConfig();
  const configRepo = React.useMemo(() => new ConfigRepository(), []);
  const httpService = React.useMemo(() => new HttpService(), []);
  const appVersionService = React.useMemo(() => new AppVersionService(), []);

  const [config, setConfig] = useState<Config | null>(null);
  const [name, setName] = useState('');
  const [fqdn, setFqdn] = useState('');
  const [apiKey, setApiKey] = useState('');

  const [nameError, setNameError] = useState('');
  const [fqdnError, setFqdnError] = useState('');

  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showSnackbar, snackbarProps } = useSnackbar();

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



  const handleTestConnection = async () => {
    if (!fqdn.trim()) {
      showSnackbar('FQDN required', true);
      return;
    }

    setTesting(true);
    const cleanFqdn = fqdn.trim().replace(/\/+$/, '');
    const clientVersion = appVersionService.getApiClientVersion();
    const headers: Record<string, string> = {
      'x-client-version': clientVersion,
    };
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
      await reloadConfigs();
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
            mode="flat"
            underlineColor={theme.colors.outline}
            activeUnderlineColor={theme.colors.primary}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (nameError) setNameError('');
            }}
            error={!!nameError}
            style={styles.input}
            contentStyle={styles.inputContent}
          />
          {!!nameError && <HelperText type="error">{nameError}</HelperText>}

          <TextInput
            label="FQDN"
            mode="flat"
            underlineColor={theme.colors.outline}
            activeUnderlineColor={theme.colors.primary}
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
            contentStyle={styles.inputContent}
          />
          {!!fqdnError && <HelperText type="error">{fqdnError}</HelperText>}

          <TextInput
            label="API Key"
            mode="flat"
            underlineColor={theme.colors.outline}
            activeUnderlineColor={theme.colors.primary}
            value={apiKey}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setApiKey}
            style={styles.input}
            contentStyle={styles.inputContent}
          />
        </View>

        <View style={styles.buttons}>
          <Button
            mode="contained"
            onPress={handleTestConnection}
            loading={testing}
            disabled={testing || saving}
            buttonColor="#9E9E9E"
            textColor="#FFFFFF"
            style={styles.pillButton}
            labelStyle={styles.buttonLabel}
          >
            Test
          </Button>

          <Button
            mode="contained"
            onPress={handleSave}
            loading={saving}
            disabled={testing || saving}
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
  input: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  inputContent: {
    paddingHorizontal: 0,
  },
  buttons: {
    gap: 12,
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
