import 'package:flutter/material.dart';

class DoorSettingsScreen extends StatefulWidget {
  const DoorSettingsScreen({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<DoorSettingsScreen> createState() => _DoorSettingsScreenState();
}

class _DoorSettingsScreenState extends State<DoorSettingsScreen> {
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
