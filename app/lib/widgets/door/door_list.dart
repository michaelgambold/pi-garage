import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

import '../../models/door.dart';
import './door_list_item.dart';

class DoorList extends StatelessWidget {
  const DoorList(
      {Key? key,
      required this.doors,
      required this.onDoorIconClicked,
      required this.onDoorSequenceClicked,
      required this.onDoorSettingsClicked})
      : super(key: key);

  final List<Door> doors;

  final AsyncValueSetter<int> onDoorIconClicked;
  final ValueSetter<int> onDoorSequenceClicked;
  final ValueSetter<int> onDoorSettingsClicked;

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: doors
          .map((door) => DoorListItem(
                door: door,
                onDoorIconClicked: () => onDoorIconClicked(door.id),
                onSequenceClicked: () => onDoorSequenceClicked(door.id),
                onSettingsClicked: () => onDoorSettingsClicked(door.id),
              ))
          .toList(),
    );
  }
}

@widgetbook.UseCase(name: 'default', type: DoorList)
Widget defaultUseCase(BuildContext context) {
  Future<void> handleDoorIconClicked(int doorId) async {
    print("Door $doorId icon clicked");
  }

  void handleDoorSequenceClicked(int doorId) {
    print("Door $doorId sequence clicked");
  }

  void handleDoorSettingsClicked(int doorId) {
    print("Door $doorId settings clicked");
  }

  List<Door> doors = [];

  for (var i = 0; i < 3; i++) {
    doors.add(Door(
        closeDuration: 20000,
        id: i,
        isEnabled: i % 2 == 0,
        label: "Door ${i + 1}",
        openDuration: 20000,
        state: "open"));
  }

  return DoorList(
    doors: doors,
    onDoorIconClicked: handleDoorIconClicked,
    onDoorSequenceClicked: handleDoorSequenceClicked,
    onDoorSettingsClicked: handleDoorSettingsClicked,
  );
}
