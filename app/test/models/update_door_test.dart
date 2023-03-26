import 'package:flutter_test/flutter_test.dart';
import 'package:pi_garage/models/update_door.dart';

void main() {
  test('To JSON', () {
    const updateDoor = UpdateDoor(label: 'Door Label', isEnabled: true);

    final json = updateDoor.toJson();

    expect(json, equals({'label': 'Door Label', 'isEnabled': true}));
  });
}
