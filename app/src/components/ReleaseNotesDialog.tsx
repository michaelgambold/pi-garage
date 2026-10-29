import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Portal, Dialog, Paragraph, Button, Text } from 'react-native-paper';

interface ReleaseNotesDialogProps {
  visible: boolean;
  onDismiss: () => void;
}

export const ReleaseNotesDialog: React.FC<ReleaseNotesDialogProps> = ({
  visible,
  onDismiss,
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Release Notes</Dialog.Title>
        <Dialog.Content>
          <View style={styles.content}>
            <Text variant="titleMedium" style={styles.bold}>
              Version 4
            </Text>
            <Paragraph style={styles.paragraph}>
              Migrate to React Native with Material Design 3.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              Backend services should be updated to major version 4.
            </Paragraph>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Dismiss</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: 4,
  },
  bold: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 8,
  },
});
