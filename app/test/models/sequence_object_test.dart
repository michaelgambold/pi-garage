import 'package:flutter_test/flutter_test.dart';
import 'package:pi_garage/models/sequence_object.dart';

void main() {
  test('From JSON', () {
    const json = {'action': 'toggle', 'duration': 1000, 'target': "relay1"};

    final sequenceObject = SequenceObject.fromJson(json);

    expect(sequenceObject.action, equals('toggle'));
    expect(sequenceObject.duration, equals(1000));
    expect(sequenceObject.target, equals('relay1'));
  });

  test('To JSON', () {
    const sequenceObject = SequenceObject('toggle', 1000, 'relay1');

    final json = sequenceObject.toJson();

    expect(json,
        equals({'action': 'toggle', 'duration': 1000, 'target': 'relay1'}));
  });
}
