import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/types';
import { AuditLog } from '../types/auditLog';
import { AuditLogRepository } from '../repositories/auditLogRepository';
import { Layout } from '../components/Layout';
import { AuditLogList } from '../components/auditLog/AuditLogList';
import { MOCK_AUDIT_LOGS } from '../fixtures/mockData';
import { useSnackbar } from '../hooks/useSnackbar';

export const AuditLogScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const auditLogRepository = React.useMemo(() => new AuditLogRepository(), []);
  const { snackbarProps } = useSnackbar();

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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
        <AuditLogList
          auditLogs={auditLogs}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />

        <Snackbar
          key={snackbarProps.key}
          visible={snackbarProps.visible}
          onDismiss={snackbarProps.onDismiss}
          duration={snackbarProps.duration}
          style={snackbarProps.style}
        >
          {snackbarProps.children}
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
