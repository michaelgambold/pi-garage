import 'package:flutter_test/flutter_test.dart';
import 'package:pi_garage/models/config.dart';

void main() {
  test('From JSON', () {
    const json = {
      'id': 'b234baa5-1f77-44d9-8fbc-4254b4842c14',
      'name': 'Config 1',
      'fqdn': 'http://localhost',
      'apiKey': 'abc123'
    };

    final config = Config.fromJson(json);

    expect(config.id, equals('b234baa5-1f77-44d9-8fbc-4254b4842c14'));
    expect(config.name, equals('Config 1'));
    expect(config.fqdn, equals('http://localhost'));
    expect(config.apiKey, equals('abc123'));
  });

  test('To JSON', () {
    const config = Config('b234baa5-1f77-44d9-8fbc-4254b4842c14', 'Config 1',
        'http://localhost', 'abc123');

    final json = config.toJson();

    expect(
        json,
        equals({
          'id': 'b234baa5-1f77-44d9-8fbc-4254b4842c14',
          'name': 'Config 1',
          'fqdn': 'http://localhost',
          'apiKey': 'abc123'
        }));
  });
}
