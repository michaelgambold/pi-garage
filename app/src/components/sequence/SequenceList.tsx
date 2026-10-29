import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SequenceObject } from '../../types/sequence';
import { SequenceListItem } from './SequenceListItem';

interface SequenceListProps {
  sequenceObjects: SequenceObject[];
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, updated: SequenceObject) => void;
}

export const SequenceList: React.FC<SequenceListProps> = ({
  sequenceObjects,
  onRemoveItem,
  onUpdateItem,
}) => {
  return (
    <View style={styles.container}>
      {sequenceObjects.map((item, index) => (
        <SequenceListItem
          key={`sequence-${index}`}
          sequenceObject={item}
          onChanged={(updated) => onUpdateItem(index, updated)}
          onRemove={() => onRemoveItem(index)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
});
