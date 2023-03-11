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

    expect(door.id, 1);
    expect(door.isEnabled, true);
    expect(door.label, 'Door Label');
    expect(door.state, 'open');
  });
}
