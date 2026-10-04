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
              Version 3
            </Text>
            <Paragraph style={styles.paragraph}>
              This major release deprecates Android 4.4 (Kit Kat).
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              Backend services should be updated to major version 3.
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
