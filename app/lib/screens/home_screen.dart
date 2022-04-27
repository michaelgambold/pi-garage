import 'package:flutter/material.dart';

import '../models/door.dart';
import '../widgets/door_list.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Door> doors = [
    Door(1, 'Door 1', true, 'open'),
    Door(2, 'Door 2', true, 'closed'),
    Door(3, 'Door 3', false, 'closed')
  ];

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
      body: Center(child: DoorList(doors: doors)),
    );
  }
}
