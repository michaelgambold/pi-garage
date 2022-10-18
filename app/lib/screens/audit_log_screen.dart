import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../models/audit_log.dart';
import '../repositories/audit_log_repository.dart';
import '../widgets/audit_log_card.dart';

class AuditLogScreen extends StatefulWidget {
  const AuditLogScreen({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<AuditLogScreen> createState() => _AuditLogScreenState();
}

class _AuditLogScreenState extends State<AuditLogScreen> {
  final _auditLogRepository = AuditLogRepository();
  List<AuditLog> _auditLogs = [];

  @override
  void initState() {
    super.initState();
    _refresh();
  }

  Future<void> _refresh() async {
    _auditLogRepository
        .findAuditLogs()
        .then((value) => setState(() => _auditLogs = value));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text(widget.title),
        ),
        body: Container(
            padding: const EdgeInsets.all(8.0),
            child: RefreshIndicator(
                onRefresh: () => _refresh(),
                child: ListView(
                  children: [
                    for (var log in _auditLogs) AuditLogCard(auditLog: log)
                  ],
                ))));
  }
}
