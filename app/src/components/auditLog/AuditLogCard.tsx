import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, List } from 'react-native-paper';
import { format, parseISO } from 'date-fns';
import { AuditLog } from '../../types/auditLog';

interface AuditLogCardProps {
  auditLog: AuditLog;
}

export const AuditLogCard: React.FC<AuditLogCardProps> = ({ auditLog }) => {
  let formattedDate = auditLog.timestamp;
  try {
    const parsedDate = parseISO(auditLog.timestamp);
    if (!isNaN(parsedDate.getTime())) {
      formattedDate = format(parsedDate, 'd MMM yyyy hh:mm:ss a');
    }
  } catch {
    formattedDate = auditLog.timestamp;
  }

  return (
    <Card style={styles.card} mode="elevated">
      <List.Item
        title={formattedDate}
        description={auditLog.detail}
        titleStyle={styles.title}
        descriptionNumberOfLines={4}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    borderRadius: 12,
  },
  title: {
    fontWeight: '500',
  },
});
