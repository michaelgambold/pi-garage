import 'package:flutter/material.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

import '../../models/door.dart';

class DoorListItem extends StatelessWidget {
  const DoorListItem(
      {Key? key,
      required this.door,
      required this.onDoorIconClicked,
      required this.onSettingsClicked,
      required this.onSequenceClicked,
      required this.onOverrideStateClicked})
      : super(key: key);

  final Door door;
  final Future<void> Function() onDoorIconClicked;
  final VoidCallback onSettingsClicked;
  final VoidCallback onSequenceClicked;
  final VoidCallback onOverrideStateClicked;

  handleMenuClick(String value) {
    switch (value) {
      case 'Settings':
        onSettingsClicked();
        break;
      case 'Sequence':
        onSequenceClicked();
        break;
      case 'Override State':
        onOverrideStateClicked();
        break;
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
        const PopupMenuItem(value: "Override State", child: Text("Override State")),
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
    // ignore: avoid_print
    print("Handle door icon clicked");
  }

  void handleSettingsClicked() {
    // ignore: avoid_print
    print("Handle settings clicked");
  }

  void handleSequenceClicked() {
    // ignore: avoid_print
    print("Handle sequence clicked");
  }

  void handleOverrideStateClicked() {
    // ignore: avoid_print
    print("Handle override state clicked");
  }

  return DoorListItem(
    door: door,
    onDoorIconClicked: handleDoorIconClicked,
    onSequenceClicked: handleSequenceClicked,
    onSettingsClicked: handleSettingsClicked,
    onOverrideStateClicked: handleOverrideStateClicked,
  );
}
