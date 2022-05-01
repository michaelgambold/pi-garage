import 'package:flutter/material.dart';
import '../models/door.dart';
// import '../repositories//door_repository.dart';

class DoorListItem extends StatefulWidget {
  const DoorListItem({Key? key, required this.door}) : super(key: key);

  final Door door;

  @override
  State<DoorListItem> createState() => _DoorListItemState();
}

class _DoorListItemState extends State<DoorListItem> {
  // DoorRepository _doorRepository = DoorRepository();

  // _DoorListItemState() {

  // }

  handleDoorIconPressed() {
    print('handle door pressed');
  }

  @override
  Widget build(BuildContext context) {
    handleMenuClick(String value) {
      switch (value) {
        case 'Settings':
          Navigator.pushNamed(
              context, '/doors/' + widget.door.id.toString() + '/settings');
          break;
        case 'Sequence':
          Navigator.pushNamed(
              context, '/doors/' + widget.door.id.toString() + '/sequence');
          break;
      }
    }

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
