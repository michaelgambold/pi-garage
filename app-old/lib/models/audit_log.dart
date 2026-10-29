class AuditLog {
  final DateTime timestamp;
  final String detail;

  const AuditLog({
    required this.timestamp,
    required this.detail,
  });

  AuditLog.fromJson(Map<String, dynamic> json)
      : timestamp = DateTime.parse(json['timestamp']),
        detail = json['detail'];
}
