import 'package:flutter/material.dart';
import '../models/door.dart';
import '../repositories/door_repository.dart';

class DoorListItem extends StatefulWidget {
  const DoorListItem({Key? key, required this.door}) : super(key: key);
  final Door door;

  @override
  State<DoorListItem> createState() => _DoorListItemState();
}

class _DoorListItemState extends State<DoorListItem> {
  final _doorRepository = DoorRepository();

  _handleDoorIconPressed() {
    _doorRepository.changeDoorState(widget.door.id, 'toggle');
  }

  @override
  Widget build(BuildContext context) {
    handleMenuClick(String value) {
      switch (value) {
        case 'Settings':
          Navigator.pushNamed(
              context, '/doors/${widget.door.id.toString()}/settings');
          break;
        case 'Sequence':
          Navigator.pushNamed(
              context, '/doors/${widget.door.id.toString()}/sequence');
          break;
      }
    }

    return Container(
      child: Card(
          child:
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        IconButton(
          onPressed:
              !widget.door.isEnabled ? null : () => _handleDoorIconPressed(),
          icon: const Icon(Icons.garage),
          iconSize: 50,
        ),
        Text('${widget.door.label} (${widget.door.state})'),
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
      ])),
    );
  }
}
