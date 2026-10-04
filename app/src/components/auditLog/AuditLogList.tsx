import React from 'react';
import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import { AuditLog } from '../../types/auditLog';
import { AuditLogCard } from './AuditLogCard';

interface AuditLogListProps {
  auditLogs: AuditLog[];
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const AuditLogList: React.FC<AuditLogListProps> = ({
  auditLogs,
  refreshing = false,
  onRefresh,
}) => {
  return (
    <FlatList
      data={auditLogs}
      keyExtractor={(item, index) => `${item.timestamp}-${index}`}
      contentContainerStyle={styles.listContent}
      alwaysBounceVertical={true}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      renderItem={({ item }) => <AuditLogCard auditLog={item} />}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 4,
    flexGrow: 1,
  },
});
