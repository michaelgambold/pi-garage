import 'package:flutter/material.dart';

import '../models/door.dart';
import 'door_list_item.dart';

class DoorList extends StatefulWidget {
  const DoorList({Key? key, required this.doors}) : super(key: key);

  final List<Door> doors;

  @override
  State<DoorList> createState() => _DoorListState();
}

class _DoorListState extends State<DoorList> {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.green,
      child: Column(
        mainAxisSize: MainAxisSize.max,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: widget.doors
            .map((door) => DoorListItem(
                  door: door,
                ))
            .toList(),
      ),
    );
  }
}
