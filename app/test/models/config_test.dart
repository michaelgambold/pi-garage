import 'package:flutter_test/flutter_test.dart';
import 'package:pi_garage/models/config.dart';

void main() {
  test('From JSON', () {
    const json = {
      'name': 'Config 1',
      'fqdn': 'http://localhost',
      'apiKey': 'abc123'
    };

    final config = Config.fromJson(json);

    expect(config.apiKey, equals('abc123'));
    expect(config.fqdn, equals('http://localhost'));
    expect(config.name, equals('abc123'));
  });

  test('To JSON', () {
    const config = Config('Config 1', 'http://localhost', 'abc123');

    final json = config.toJson();

    expect(
        json,
        equals({
          'name': 'Config 1',
          'fqdn': 'http://localhost',
          'apiKey': 'abc123'
        }));
  });
}
