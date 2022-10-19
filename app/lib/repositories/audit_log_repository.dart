import 'dart:convert';

import '../models/audit_log.dart';
import '../services/local_storage_service.dart';
import '../services/http_service.dart';

class AuditLogRepository {
  final _httpService = HttpService();
  final _localStorageService = LocalStorageService.instance;

  Future<List<AuditLog>> findAuditLogs() async {
    var apiKey = await _localStorageService.getStringValue('global_api_key');
    var fqdn = await _localStorageService.getStringValue('global_fqdn');

    var headers = <String, String>{'x-api-key': apiKey};

    var res =
        await _httpService.get(Uri.parse('$fqdn/api/v1/audit-logs'), headers);

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
