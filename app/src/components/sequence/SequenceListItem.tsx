import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, TextInput, Menu, Button, IconButton, useTheme } from 'react-native-paper';
import { SequenceObject, SequenceAction, SequenceTarget } from '../../types/sequence';

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
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [targetMenuVisible, setTargetMenuVisible] = useState(false);

  const selectedActionLabel =
    ACTION_OPTIONS.find((o) => o.value === sequenceObject.action)?.label || sequenceObject.action;

  const selectedTargetLabel =
    TARGET_OPTIONS.find((o) => o.value === sequenceObject.target)?.label || sequenceObject.target;

  return (
    <Card style={styles.card} mode="elevated">
      <View style={styles.row}>
        <View style={styles.formColumn}>
          {/* Action Dropdown */}
          <Menu
            visible={actionMenuVisible}
            onDismiss={() => setActionMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                icon="menu-down"
                contentStyle={styles.buttonContent}
                style={styles.dropdown}
                onPress={() => setActionMenuVisible(true)}
              >
                {`Action: ${selectedActionLabel}`}
              </Button>
            }
          >
            {ACTION_OPTIONS.map((option) => (
              <Menu.Item
                key={option.value}
                onPress={() => {
                  setActionMenuVisible(false);
                  onChanged({ ...sequenceObject, action: option.value });
                }}
                title={option.label}
              />
            ))}
          </Menu>

          {/* Target Dropdown */}
          <Menu
            visible={targetMenuVisible}
            onDismiss={() => setTargetMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                icon="menu-down"
                contentStyle={styles.buttonContent}
                style={styles.dropdown}
                onPress={() => setTargetMenuVisible(true)}
              >
                {`Target: ${selectedTargetLabel}`}
              </Button>
            }
          >
            {TARGET_OPTIONS.map((option) => (
              <Menu.Item
                key={option.value}
                onPress={() => {
                  setTargetMenuVisible(false);
                  onChanged({ ...sequenceObject, target: option.value });
                }}
                title={option.label}
              />
            ))}
          </Menu>

          {/* Duration Input */}
          <TextInput
            label="Duration (ms)"
            mode="outlined"
            keyboardType="numeric"
            value={String(sequenceObject.duration || 0)}
            onChangeText={(text) => {
              const cleaned = text.replace(/[^0-9]/g, '');
              const parsed = cleaned ? parseInt(cleaned, 10) : 0;
              onChanged({ ...sequenceObject, duration: parsed });
            }}
            style={styles.input}
          />
        </View>

        {/* Remove Button */}
        <View style={styles.actionColumn}>
          <IconButton
            icon="close"
            size={20}
            mode="contained-tonal"
            containerColor={theme.colors.surfaceVariant}
            iconColor={theme.colors.onSurfaceVariant}
            onPress={onRemove}
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
  buttonContent: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  dropdown: {
    borderRadius: 8,
  },
  input: {
    backgroundColor: 'transparent',
  },
  actionColumn: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
