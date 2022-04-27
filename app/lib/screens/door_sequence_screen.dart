import 'package:flutter/material.dart';

class DoorSequenceScreen extends StatefulWidget {
  const DoorSequenceScreen({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<DoorSequenceScreen> createState() => _DoorSequenceScreenState();
}

class _DoorSequenceScreenState extends State<DoorSequenceScreen> {
  @override
  Widget build(BuildContext context) {
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
        body: Center(child: Text('hi')));
  }
}
