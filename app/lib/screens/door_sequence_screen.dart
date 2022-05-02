import 'package:flutter/material.dart';

import '../models/sequence_object.dart';
import '../repositories/door_repository.dart';
import '../widgets/sequence_list.dart';

class DoorSequenceScreen extends StatefulWidget {
  const DoorSequenceScreen(
      {Key? key, required this.title, required this.doorId})
      : super(key: key);

  final String title;
  final int doorId;

  @override
  State<DoorSequenceScreen> createState() => _DoorSequenceScreenState();
}

class _DoorSequenceScreenState extends State<DoorSequenceScreen> {
  final _doorRepository = DoorRepository();
  List<SequenceObject> _sequence = [];

  @override
  void initState() {
    super.initState();
    _doorRepository
        .findDoorSequence(widget.doorId)
        .then((value) => setState(() {
              _sequence = value;
            }));
  }

  void save() {
    return;
  }

  @override
  Widget build(BuildContext context) {
    print(_sequence);
    return Scaffold(
        appBar: AppBar(
          title: Text(widget.title),
          actions: <Widget>[
            IconButton(
              icon: const Icon(Icons.settings),
              tooltip: 'Global Settings',
              onPressed: () {
                Navigator.pushNamed(context, '/settings');
              },
            ),
          ],
        ),
        body: Container(
            child: Column(children: [
          Center(
              child: SequenceList(
            sequence: _sequence,
          )),
          ElevatedButton(onPressed: () => save(), child: Text('Save')),
          FloatingActionButton(
            onPressed: null,
            child: Icon(Icons.add),
          )
        ])));
  }
}
