import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Door } from '../../types/door';
import { DoorListItem } from './DoorListItem';

interface DoorListProps {
  doors: Door[];
  onDoorIconClicked: (doorId: number) => void | Promise<void>;
  onDoorSequenceClicked: (doorId: number) => void;
  onDoorSettingsClicked: (doorId: number) => void;
  onOverrideDoorStateClicked: (doorId: number) => void;
}

export const DoorList: React.FC<DoorListProps> = ({
  doors,
  onDoorIconClicked,
  onDoorSequenceClicked,
  onDoorSettingsClicked,
  onOverrideDoorStateClicked,
}) => {
  return (
    <FlatList
      data={doors}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <DoorListItem
          door={item}
          onDoorIconClicked={() => onDoorIconClicked(item.id)}
          onSequenceClicked={() => onDoorSequenceClicked(item.id)}
          onSettingsClicked={() => onDoorSettingsClicked(item.id)}
          onOverrideStateClicked={() => onOverrideDoorStateClicked(item.id)}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 4,
  },
});
