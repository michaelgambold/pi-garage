import React from 'react';
import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Config } from '../../types/config';
import { ConfigListItem } from './ConfigListItem';

interface ConfigListProps {
  configs: Config[];
  refreshing?: boolean;
  onRefresh?: () => void;
  onEditConfig: (config: Config) => void;
  onRemoveConfig: (config: Config) => void;
}

export const ConfigList: React.FC<ConfigListProps> = ({
  configs,
  refreshing = false,
  onRefresh,
  onEditConfig,
  onRemoveConfig,
}) => {
  return (
    <FlatList
      data={configs}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      alwaysBounceVertical={true}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      renderItem={({ item }) => (
        <ConfigListItem
          config={item}
          onEdit={() => onEditConfig(item)}
          onRemove={() => onRemoveConfig(item)}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 4,
    paddingBottom: 80,
    flexGrow: 1,
  },
});
