import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Text, Menu, Button, List, Divider, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCurrentConfig } from '../context/CurrentConfigContext';
import { AppVersionService } from '../services/appVersionService';

export const MenuDrawer: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
  const theme = useTheme();
  const { currentConfig, configs, setCurrentConfig } = useCurrentConfig();
  const [appVersion, setAppVersion] = useState<string>('');
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  useEffect(() => {
    new AppVersionService().getAppVersion().then(setAppVersion);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface }]} edges={['top', 'bottom', 'left']}>
      <View style={[styles.header, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Menu
        </Text>

        {/* Config Dropdown */}
        <View style={styles.dropdownContainer}>
          <Menu
            visible={dropdownVisible}
            onDismiss={() => setDropdownVisible(false)}
            anchor={
              <Button
                mode="outlined"
                icon="menu-down"
                contentStyle={styles.buttonContent}
                style={[styles.dropdownButton, { borderColor: theme.colors.outline }]}
                onPress={() => setDropdownVisible(true)}
              >
                {currentConfig ? currentConfig.name : 'Select Config'}
              </Button>
            }
          >
            {configs.map((config) => (
              <Menu.Item
                key={config.id}
                onPress={() => {
                  setDropdownVisible(false);
                  setCurrentConfig(config.id);
                }}
                title={config.name}
              />
            ))}
          </Menu>
        </View>

        <Text variant="labelSmall" style={styles.versionText}>
          {appVersion ? `v${appVersion}` : ''}
        </Text>
      </View>

      <Divider />

      <View style={styles.menuItems}>
        <List.Item
          title="Configs"
          left={(props) => <List.Icon {...props} icon="cog-outline" />}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('Configs' as never);
          }}
        />
        <List.Item
          title="Audit Log"
          left={(props) => <List.Icon {...props} icon="history" />}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('AuditLog' as never);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontWeight: '500',
    marginBottom: 8,
  },
  dropdownContainer: {
    marginVertical: 8,
  },
  dropdownButton: {
    borderRadius: 8,
  },
  buttonContent: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  versionText: {
    marginTop: 8,
    opacity: 0.7,
  },
  menuItems: {
    flex: 1,
    paddingTop: 8,
  },
});
