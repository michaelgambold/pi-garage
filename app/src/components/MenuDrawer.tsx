import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Text, Menu, Icon, Divider, useTheme } from 'react-native-paper';
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
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Menu
        </Text>

        {/* Config Dropdown */}
        <View style={styles.dropdownContainer}>
          <Menu
            visible={dropdownVisible}
            onDismiss={() => setDropdownVisible(false)}
            anchor={
              <Pressable
                style={[styles.dropdownButton, { borderBottomColor: theme.colors.outline }]}
                onPress={() => setDropdownVisible(true)}
                accessibilityRole="button"
                accessibilityLabel="Select Config"
              >
                <Text style={styles.dropdownLabel}>
                  {currentConfig ? currentConfig.name : 'Select Config'}
                </Text>
                <Icon
                  source="menu-down"
                  size={24}
                  color={theme.colors.onSurfaceVariant}
                />
              </Pressable>
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

        <Text variant="labelSmall" style={[styles.versionText, { color: theme.colors.onSurfaceVariant }]}>
          {appVersion || ''}
        </Text>
      </View>

      <Divider />

      <View style={styles.menuItems}>
        <Pressable
          style={styles.menuItem}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('Configs' as never);
          }}
          accessibilityRole="button"
          accessibilityLabel="Configs"
        >
          <Text style={styles.menuItemTitle}>Configs</Text>
        </Pressable>
        <Pressable
          style={styles.menuItem}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('AuditLog' as never);
          }}
          accessibilityRole="button"
          accessibilityLabel="Audit Log"
        >
          <Text style={styles.menuItemTitle}>Audit Log</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '400',
    marginBottom: 8,
  },
  dropdownContainer: {
    marginTop: 4,
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingVertical: 6,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: '400',
  },
  versionText: {
    marginTop: 8,
    fontSize: 12,
  },
  menuItems: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '400',
  },
});
