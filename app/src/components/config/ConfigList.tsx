import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Config } from '../../types/config';
import { ConfigListItem } from './ConfigListItem';

interface ConfigListProps {
  configs: Config[];
  onEditConfig: (config: Config) => void;
  onRemoveConfig: (config: Config) => void;
}

export const ConfigList: React.FC<ConfigListProps> = ({
  configs,
  onEditConfig,
  onRemoveConfig,
}) => {
  return (
    <FlatList
      data={configs}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
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
  },
});
