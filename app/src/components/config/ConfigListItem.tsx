import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, List, IconButton, Menu, useTheme } from 'react-native-paper';
import { Config } from '../../types/config';

interface ConfigListItemProps {
  config: Config;
  onEdit: () => void;
  onRemove: () => void;
}

export const ConfigListItem: React.FC<ConfigListItemProps> = ({
  config,
  onEdit,
  onRemove,
}) => {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <Card style={styles.card} mode="elevated">
      <List.Item
        title={config.name}
        description={config.fqdn}
        titleStyle={styles.title}
        right={() => (
          <View style={styles.menuAnchor}>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  size={24}
                  onPress={() => setMenuVisible(true)}
                  accessibilityLabel={`Options for ${config.name}`}
                />
              }
            >
              <Menu.Item
                onPress={() => {
                  setMenuVisible(false);
                  onEdit();
                }}
                title="Edit"
              />
              <Menu.Item
                onPress={() => {
                  setMenuVisible(false);
                  onRemove();
                }}
                title="Remove"
                titleStyle={{ color: theme.colors.error }}
              />
            </Menu>
          </View>
        )}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    borderRadius: 12,
  },
  title: {
    fontWeight: '500',
  },
  menuAnchor: {
    justifyContent: 'center',
  },
});
