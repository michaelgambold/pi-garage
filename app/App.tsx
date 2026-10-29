import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PaperProvider, Text, ActivityIndicator } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { lightTheme } from './src/theme';
import { CurrentConfigProvider } from './src/context/CurrentConfigContext';
import { MigrationService } from './src/services/migrationService';
import { RootNavigator } from './src/navigation/RootNavigator';

function App(): React.JSX.Element {
  const [initialized, setInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        const migrationService = new MigrationService();
        await migrationService.runAll();
        setInitialized(true);
      } catch (err: any) {
        setInitError(err?.message || String(err));
      }
    };

    initApp();
  }, []);

  if (initError) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="headlineSmall" style={styles.errorText}>
          {initError}
        </Text>
      </View>
    );
  }

  if (!initialized) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={lightTheme}>
        <CurrentConfigProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </CurrentConfigProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: '#BA1A1A',
    textAlign: 'center',
  },
});

export default App;
