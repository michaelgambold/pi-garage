import 'package:flutter/material.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

import '../../models/audit_log.dart';
import 'audit_log_card.dart';

class AuditLogList extends StatelessWidget {
  const AuditLogList({Key? key, required this.auditLogs}) : super(key: key);

  final List<AuditLog> auditLogs;

  @override
  Widget build(BuildContext context) {
    return ListView(
        children: auditLogs
            .map((auditLog) => AuditLogCard(
                  auditLog: auditLog,
                ))
            .toList());
  }
}

@widgetbook.UseCase(name: 'default', type: AuditLogList)
Widget defaultUseCase(BuildContext context) {
  List<AuditLog> auditLogs = [];

  for (var i = 0; i < 20; i++) {
    auditLogs.add(AuditLog(
        timestamp: DateTime.now(),
        detail: 'Some detail about the audit log #${i + 1}'));
  }

  return AuditLogList(auditLogs: auditLogs);
}
