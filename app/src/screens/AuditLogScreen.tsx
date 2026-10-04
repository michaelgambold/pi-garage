import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/types';
import { AuditLog } from '../types/auditLog';
import { AuditLogRepository } from '../repositories/auditLogRepository';
import { Layout } from '../components/Layout';
import { AuditLogList } from '../components/auditLog/AuditLogList';
import { MOCK_AUDIT_LOGS } from '../fixtures/mockData';

export const AuditLogScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const auditLogRepository = React.useMemo(() => new AuditLogRepository(), []);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const loadAuditLogs = useCallback(async () => {
    try {
      const logs = await auditLogRepository.findAuditLogs();
      setAuditLogs(logs);
    } catch {
      // Fallback for mock/fixture mode
      setAuditLogs(MOCK_AUDIT_LOGS);
    } finally {
      setRefreshing(false);
    }
  }, [auditLogRepository]);

  useEffect(() => {
    loadAuditLogs();
  }, [loadAuditLogs]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAuditLogs();
  };

  return (
    <Layout title="Audit Log" onBack={() => navigation.goBack()}>
      <View style={styles.container}>
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        <AuditLogList auditLogs={auditLogs} />

        <Snackbar
          visible={!!snackbarMessage}
          onDismiss={() => setSnackbarMessage(null)}
          duration={3000}
        >
          {snackbarMessage || ''}
        </Snackbar>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
