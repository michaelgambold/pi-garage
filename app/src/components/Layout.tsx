import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
  onOpenDrawer?: () => void;
  onBack?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const Layout: React.FC<LayoutProps> = ({
  title,
  children,
  onOpenDrawer,
  onBack,
  style,
}) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['left', 'right', 'bottom']}>
      <Appbar.Header mode="center-aligned" elevated style={{ backgroundColor: theme.colors.surface }}>
        {onOpenDrawer && (
          <Appbar.Action
            icon="menu"
            accessibilityLabel="Open Menu"
            onPress={onOpenDrawer}
          />
        )}
        {onBack && (
          <Appbar.BackAction
            accessibilityLabel="Go Back"
            onPress={onBack}
          />
        )}
        <Appbar.Content
          title={title}
          titleStyle={{ fontWeight: '500', textAlign: 'center' }}
        />
      </Appbar.Header>

      <View style={[styles.body, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 20,
  },
});
