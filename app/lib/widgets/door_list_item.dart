import 'package:flutter/material.dart';

import '../models/door.dart';

class DoorListItem extends StatefulWidget {
  const DoorListItem({Key? key, required this.door}) : super(key: key);

  final Door door;

  @override
  State<DoorListItem> createState() => _DoorListItemState();
}

class _DoorListItemState extends State<DoorListItem> {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.red,
      padding: EdgeInsets.all(8.0),
      child: Row(children: [
        Expanded(
          child: Text('hi'),
          flex: 1,
        )
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
