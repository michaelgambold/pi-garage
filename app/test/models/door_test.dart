import 'package:flutter_test/flutter_test.dart';
import 'package:pi_garage/models/door.dart';

void main() {
  test('From JSON', () {
    const json = {
      'id': 1,
      'isEnabled': true,
      'label': 'Door Label',
      'state': "open"
    };

    final door = Door.fromJson(json);

    expect(door.id, equals(1));
    expect(door.isEnabled, equals(true));
    expect(door.label, equals('Door Label'));
    expect(door.state, equals('open'));
  });
}
