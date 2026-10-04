import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { AuditLog } from '../../types/auditLog';
import { AuditLogCard } from './AuditLogCard';

interface AuditLogListProps {
  auditLogs: AuditLog[];
}

export const AuditLogList: React.FC<AuditLogListProps> = ({ auditLogs }) => {
  return (
    <FlatList
      data={auditLogs}
      keyExtractor={(item, index) => `${item.timestamp}-${index}`}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => <AuditLogCard auditLog={item} />}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 4,
  },
});
