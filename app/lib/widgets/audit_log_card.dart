import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import "../models/audit_log.dart";

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