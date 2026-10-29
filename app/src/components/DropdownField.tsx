import React, { useState } from 'react';
import { View, StyleSheet, Pressable, StyleProp, ViewStyle } from 'react-native';
import { Menu, Text, IconButton, useTheme } from 'react-native-paper';

export interface DropdownOption<T = string> {
  label: string;
  value: T;
}

export interface DropdownFieldProps<T = string> {
  label: string;
  value: T;
  options: DropdownOption<T>[];
  onSelect: (value: T) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function DropdownField<T = string>({
  label,
  value,
  options,
  onSelect,
  disabled = false,
  style,
  accessibilityLabel,
}: DropdownFieldProps<T>): React.ReactElement {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : String(value);

  const labelColor = disabled ? theme.colors.surfaceDisabled : theme.colors.onSurfaceVariant;
  const textColor = disabled ? theme.colors.surfaceDisabled : theme.colors.onSurface;
  const iconColor = disabled ? theme.colors.surfaceDisabled : theme.colors.onSurfaceVariant;
  const borderColor = disabled ? theme.colors.surfaceDisabled : theme.colors.outline;

  return (
    <View style={style}>
      <Menu
        visible={visible && !disabled}
        onDismiss={() => setVisible(false)}
        contentStyle={menuWidth ? { width: menuWidth } : undefined}
        anchor={
          <Pressable
            style={[styles.container, { borderBottomColor: borderColor }]}
            onPress={() => !disabled && setVisible(true)}
            onLayout={(e) => setMenuWidth(e.nativeEvent.layout.width)}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel || `Select ${label}`}
            disabled={disabled}
          >
            <View style={styles.textWrapper}>
              <Text style={[styles.fieldLabel, { color: labelColor }]}>{label}</Text>
              <Text style={[styles.fieldValue, { color: textColor }]}>{displayLabel}</Text>
            </View>
            <IconButton
              icon="menu-down"
              size={24}
              iconColor={iconColor}
              style={styles.dropdownIcon}
              disabled={disabled}
            />
          </Pressable>
        }
      >
        {options.map((opt) => (
          <Menu.Item
            key={String(opt.value)}
            onPress={() => {
              setVisible(false);
              onSelect(opt.value);
            }}
            title={opt.label}
            style={menuWidth ? { width: menuWidth, maxWidth: menuWidth } : undefined}
          />
        ))}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingVertical: 4,
  },
  textWrapper: {
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
});
