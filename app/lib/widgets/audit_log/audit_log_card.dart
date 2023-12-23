import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

import '../../models/audit_log.dart';

class AuditLogCard extends StatelessWidget {
  const AuditLogCard({Key? key, required this.auditLog}) : super(key: key);

  final AuditLog auditLog;

  @override
  Widget build(BuildContext context) {
    return Card(
        child: ListTile(
      title: Text(DateFormat('d MMM y hh:mm:ss a')
          .format(auditLog.timestamp.toLocal())),
      subtitle: Text(auditLog.detail),
    ));
  }
}

@widgetbook.UseCase(name: 'default', type: AuditLogCard)
Widget defaultUseCase(BuildContext context) {
  var auditLog = AuditLog(
      timestamp: DateTime.now(), detail: 'Some detail about the audit log');

  return AuditLogCard(auditLog: auditLog);
}
