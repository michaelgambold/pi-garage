import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Card, TextInput, Menu, IconButton, Text, useTheme } from 'react-native-paper';
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
    <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]} mode="elevated">
      <View style={styles.row}>
        <View style={styles.formColumn}>
          {/* Action Dropdown */}
          <Menu
            visible={actionMenuVisible}
            onDismiss={() => setActionMenuVisible(false)}
            anchor={
              <Pressable
                style={[styles.dropdownContainer, { borderBottomColor: theme.colors.outline }]}
                onPress={() => setActionMenuVisible(true)}
                accessibilityRole="button"
                accessibilityLabel="Select Action"
              >
                <View style={styles.dropdownTextWrapper}>
                  <Text style={[styles.fieldLabel, { color: theme.colors.onSurfaceVariant }]}>Action</Text>
                  <Text style={styles.fieldValue}>{selectedActionLabel}</Text>
                </View>
                <IconButton
                  icon="menu-down"
                  size={24}
                  iconColor={theme.colors.onSurfaceVariant}
                  style={styles.dropdownIcon}
                />
              </Pressable>
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
              <Pressable
                style={[styles.dropdownContainer, { borderBottomColor: theme.colors.outline }]}
                onPress={() => setTargetMenuVisible(true)}
                accessibilityRole="button"
                accessibilityLabel="Select Target"
              >
                <View style={styles.dropdownTextWrapper}>
                  <Text style={[styles.fieldLabel, { color: theme.colors.onSurfaceVariant }]}>Target</Text>
                  <Text style={styles.fieldValue}>{selectedTargetLabel}</Text>
                </View>
                <IconButton
                  icon="menu-down"
                  size={24}
                  iconColor={theme.colors.onSurfaceVariant}
                  style={styles.dropdownIcon}
                />
              </Pressable>
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
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingVertical: 4,
  },
  dropdownTextWrapper: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '400',
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 2,
  },
  dropdownIcon: {
    margin: 0,
    width: 24,
    height: 24,
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
