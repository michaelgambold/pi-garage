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
      required this.onDoorSettingsClicked,
      required this.onOverrideDoorStateClicked})
      : super(key: key);

  final List<Door> doors;

  final AsyncValueSetter<int> onDoorIconClicked;
  final ValueSetter<int> onDoorSequenceClicked;
  final ValueSetter<int> onDoorSettingsClicked;
  final ValueSetter<int> onOverrideDoorStateClicked;

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: doors
          .map((door) => DoorListItem(
                door: door,
                onDoorIconClicked: () => onDoorIconClicked(door.id),
                onSequenceClicked: () => onDoorSequenceClicked(door.id),
                onSettingsClicked: () => onDoorSettingsClicked(door.id),
                onOverrideStateClicked: () => onOverrideDoorStateClicked(door.id),
              ))
          .toList(),
    );
  }
}

@widgetbook.UseCase(name: 'default', type: DoorList)
Widget defaultUseCase(BuildContext context) {
  Future<void> handleDoorIconClicked(int doorId) async {
    // ignore: avoid_print
    print("Door $doorId icon clicked");
  }

  void handleDoorSequenceClicked(int doorId) {
    // ignore: avoid_print
    print("Door $doorId sequence clicked");
  }

  void handleDoorSettingsClicked(int doorId) {
    // ignore: avoid_print
    print("Door $doorId settings clicked");
  }
  
  void handleOverrideDoorStateClicked(int doorId) {
    // ignore: avoid_print
    print("Door $doorId override state clicked");
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
    onOverrideDoorStateClicked: handleOverrideDoorStateClicked,
  );
}
