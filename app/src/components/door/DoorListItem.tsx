import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, IconButton, Text, Menu, useTheme } from 'react-native-paper';
import { Door } from '../../types/door';

interface DoorListItemProps {
  door: Door;
  onDoorIconClicked: () => void | Promise<void>;
  onSettingsClicked: () => void;
  onSequenceClicked: () => void;
  onOverrideStateClicked: () => void;
}

export const DoorListItem: React.FC<DoorListItemProps> = ({
  door,
  onDoorIconClicked,
  onSettingsClicked,
  onSequenceClicked,
  onOverrideStateClicked,
}) => {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <Card style={styles.card} mode="elevated">
      <View style={styles.cardRow}>
        <IconButton
          icon="garage"
          size={48}
          iconColor={door.isEnabled ? theme.colors.primary : theme.colors.surfaceDisabled}
          disabled={!door.isEnabled}
          onPress={onDoorIconClicked}
          style={styles.doorIcon}
          accessibilityLabel={`Toggle ${door.label}`}
        />

        <Text variant="titleMedium" style={styles.label}>
          {`${door.label} (${door.state})`}
        </Text>

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              size={24}
              onPress={() => setMenuVisible(true)}
              accessibilityLabel={`Options for ${door.label}`}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              onSettingsClicked();
            }}
            title="Settings"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              onSequenceClicked();
            }}
            title="Sequence"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              onOverrideStateClicked();
            }}
            title="Override State"
          />
        </Menu>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    borderRadius: 12,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  doorIcon: {
    margin: 0,
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '500',
  },
});
