import 'package:flutter/material.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

import '../../models/door.dart';

class DoorListItem extends StatelessWidget {
  const DoorListItem(
      {Key? key,
      required this.door,
      required this.onDoorIconClicked,
      required this.onSettingsClicked,
      required this.onSequenceClicked})
      : super(key: key);

  final Door door;
  final Future<void> Function() onDoorIconClicked;
  final VoidCallback onSettingsClicked;
  final VoidCallback onSequenceClicked;

  handleMenuClick(String value) {
    switch (value) {
      case 'Settings':
        onSettingsClicked();
        break;
      case 'Sequence':
        onSequenceClicked();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
        child:
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      IconButton(
        highlightColor: Colors.blue,
        onPressed: !door.isEnabled ? null : () => onDoorIconClicked(),
        icon: const Icon(Icons.garage),
        iconSize: 50,
      ),
      Text('${door.label} (${door.state})'),
      _Menu(
        onMenuItemClicked: handleMenuClick,
      )
    ]));
  }
}

class _Menu extends StatelessWidget {
  const _Menu({Key? key, required this.onMenuItemClicked}) : super(key: key);

  final ValueSetter<String> onMenuItemClicked;

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<String>(
      icon: const Icon(Icons.more_vert),
      onSelected: onMenuItemClicked,
      itemBuilder: (BuildContext context) => [
        const PopupMenuItem(value: "Settings", child: Text("Settings")),
        const PopupMenuItem(value: "Sequence", child: Text("Sequence")),
      ],
    );
  }
}

@widgetbook.UseCase(name: 'default', type: DoorListItem)
Widget defaultUseCase(BuildContext context) {
  var door = const Door(
      closeDuration: 20000,
      id: 1,
      isEnabled: true,
      label: "Door 1",
      openDuration: 20000,
      state: "open");

  Future<void> handleDoorIconClicked() async {
    print("Handle door icon clicked");
  }

  void handleSettingsClicked() {
    print("Handle settings clicked");
  }

  void handleSequenceClicked() {
    print("Handle sequence clicked");
  }

  return DoorListItem(
    door: door,
    onDoorIconClicked: handleDoorIconClicked,
    onSequenceClicked: handleSequenceClicked,
    onSettingsClicked: handleSettingsClicked,
  );
}
