import 'package:flutter/material.dart';

import '../models/audit_log.dart';
import '../repositories/audit_log_repository.dart';
import '../widgets/audit_log/audit_log_list.dart';
import '../widgets/layout.dart';

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
    try {
      var auditLogs = await _auditLogRepository.findAuditLogs();
      setState(() => _auditLogs = auditLogs);
    } catch (e) {
      setState(() {
        _auditLogs = [];
      });
      rethrow;
    }
  }

  @override
  Widget build(BuildContext context) {
    var scaffoldMessenger = ScaffoldMessenger.of(context);

    return Layout(
        title: widget.title,
        child: RefreshIndicator(
            onRefresh: () async {
              try {
                await _refresh();
              } catch (e) {
                scaffoldMessenger.clearSnackBars();
                scaffoldMessenger.showSnackBar(SnackBar(
                    backgroundColor: Colors.red, content: Text(e.toString())));
              }
            },
            child: AuditLogList(
              auditLogs: _auditLogs,
            )));
  }
}
