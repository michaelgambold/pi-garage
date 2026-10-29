import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, TextInput, IconButton, useTheme } from 'react-native-paper';
import { SequenceObject, SequenceAction, SequenceTarget } from '../../types/sequence';
import { DropdownField } from '../DropdownField';

interface SequenceListItemProps {
  sequenceObject: SequenceObject;
  onChanged: (updated: SequenceObject) => void;
  onRemove: () => void;
}

const ACTION_OPTIONS: { label: string; value: SequenceAction }[] = [
  { label: 'On', value: 'on' },
  { label: 'Off', value: 'off' },
  { label: 'High', value: 'high' },
  { label: 'Low', value: 'low' },
];

const TARGET_OPTIONS: { label: string; value: SequenceTarget }[] = [
  { label: 'Relay 1', value: 'relay1' },
  { label: 'Relay 2', value: 'relay2' },
  { label: 'Relay 3', value: 'relay3' },
  { label: 'Digital Output 1', value: 'digitalOutput1' },
  { label: 'Digital Output 2', value: 'digitalOutput2' },
  { label: 'Digital Output 3', value: 'digitalOutput3' },
];

export const SequenceListItem: React.FC<SequenceListItemProps> = ({
  sequenceObject,
  onChanged,
  onRemove,
}) => {
  const theme = useTheme();

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]} mode="elevated">
      <View style={styles.row}>
        <View style={styles.formColumn}>
          {/* Action Dropdown */}
          <DropdownField<SequenceAction>
            label="Action"
            value={sequenceObject.action}
            options={ACTION_OPTIONS}
            onSelect={(action) => onChanged({ ...sequenceObject, action })}
          />

          {/* Target Dropdown */}
          <DropdownField<SequenceTarget>
            label="Target"
            value={sequenceObject.target}
            options={TARGET_OPTIONS}
            onSelect={(target) => onChanged({ ...sequenceObject, target })}
          />

          {/* Duration Input */}
          <TextInput
            label="Duration (ms)"
            mode="flat"
            underlineColor={theme.colors.outline}
            activeUnderlineColor={theme.colors.primary}
            keyboardType="numeric"
            value={String(sequenceObject.duration || 0)}
            onChangeText={(text) => {
              const cleaned = text.replace(/[^0-9]/g, '');
              const parsed = cleaned ? parseInt(cleaned, 10) : 0;
              onChanged({ ...sequenceObject, duration: parsed });
            }}
            style={styles.input}
            contentStyle={styles.inputContent}
          />
        </View>

        {/* Remove Button */}
        <View style={styles.actionColumn}>
          <IconButton
            icon="close"
            size={18}
            containerColor="#9E9E9E"
            iconColor="#FFFFFF"
            mode="contained"
            onPress={onRemove}
            style={styles.removeButton}
            accessibilityLabel="Remove Sequence Step"
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  formColumn: {
    flex: 1,
    gap: 8,
  },
  input: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  inputContent: {
    paddingHorizontal: 0,
  },
  actionColumn: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    margin: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
