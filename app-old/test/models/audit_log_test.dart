import 'package:flutter_test/flutter_test.dart';
import 'package:pi_garage/models/audit_log.dart';

void main() {
  test('From JSON', () {
    const json = {'timestamp': '2023-01-02T00:01:02Z', 'detail': 'Some Detail'};

    final auditLog = AuditLog.fromJson(json);

    expect(auditLog.timestamp, equals(DateTime.utc(2023, 1, 2, 0, 1, 2)));
    expect(auditLog.detail, equals('Some Detail'));
  });
}
