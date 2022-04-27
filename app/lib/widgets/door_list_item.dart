import 'package:flutter/material.dart';

import '../models/door.dart';

class DoorListItem extends StatefulWidget {
  const DoorListItem({Key? key, required this.door}) : super(key: key);

  final Door door;

  @override
  State<DoorListItem> createState() => _DoorListItemState();
}

class _DoorListItemState extends State<DoorListItem> {
  handleMenuClick(String value) {
    switch (value) {
      case 'Settings':
        print('navigate to door settings');
        break;
      case 'Sequences':
        print('navigate to sequences');
        break;
      case 'Enable':
        print('enable door');
        break;
      case 'Disable':
        print('disable door');
        break;
    }
  }

  handleDoorIconPressed() {
    print('hi');
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      // color: Colors.red,
      padding: EdgeInsets.all(8.0),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        IconButton(
          onPressed:
              !widget.door.isEnabled ? null : () => handleDoorIconPressed(),
          icon: const Icon(Icons.garage),
          iconSize: 50,
        ),
        Text(widget.door.label),
        PopupMenuButton<String>(
          icon: Icon(Icons.more_vert),
          onSelected: handleMenuClick,
          itemBuilder: (BuildContext context) {
            return {'Settings', 'Sequences', 'Enable', 'Disable'}
                .map((String choice) {
              return PopupMenuItem<String>(
                value: choice,
                child: Text(choice),
              );
            }).toList();
          },
        ),
      ]),
    );
    // Column(
    //     mainAxisAlignment: MainAxisAlignment.center,
    //     children: const <Widget>[
    //       Text("Door 1"),
    //       IconButton(
    //         icon: Icon(Icons.volume_up),
    //         tooltip: 'Increase volume by 10',
    //         onPressed: null,
    //       ),
    //     ]);
  }
}
