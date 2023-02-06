import 'dart:convert';

import '../models/audit_log.dart';
import '../services/api_service.dart';

class AuditLogRepository {
  final _apiService = ApiService();

  Future<List<AuditLog>> findAuditLogs() async {
    var res = await _apiService.get('/api/v1/audit-logs');

    if (res.statusCode == 200) {
      List<dynamic> body = jsonDecode(res.body);
      return body
          .map(
            (dynamic item) => AuditLog.fromJson(item),
          )
          .toList();
    }

    throw Exception(res.reasonPhrase);
  }
}
