import 'package:flutter/material.dart';
import '../models/door.dart';

class DoorListItem extends StatelessWidget {
  const DoorListItem({Key? key, required this.door}) : super(key: key);

  final Door door;

  handleDoorIconPressed() {
    print('handle door pressed');
  }

  @override
  Widget build(BuildContext context) {
    handleMenuClick(String value) {
      switch (value) {
        case 'Settings':
          Navigator.pushNamed(context, '/doors/${door.id.toString()}/settings');
          break;
        case 'Sequence':
          Navigator.pushNamed(context, '/doors/${door.id.toString()}/sequence');
          break;
      }
    }

    return Container(
      padding: const EdgeInsets.all(8.0),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        IconButton(
          onPressed: !door.isEnabled ? null : () => handleDoorIconPressed(),
          icon: const Icon(Icons.garage),
          iconSize: 50,
        ),
        Text('${door.label} (${door.state})'),
        PopupMenuButton<String>(
          icon: const Icon(Icons.more_vert),
          onSelected: handleMenuClick,
          itemBuilder: (BuildContext context) {
            return {
              'Settings',
              'Sequence',
            }.map((String choice) {
              return PopupMenuItem<String>(
                value: choice,
                child: Text(choice),
              );
            }).toList();
          },
        ),
      ]),
    );
  }
}
