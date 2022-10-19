import 'dart:async';

import 'package:flutter/material.dart';

import '../models/door.dart';
import '../repositories/door_repository.dart';
import '../widgets/door_list.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _doorRepository = DoorRepository();
  List<Door> _doors = [];

  Future<void> _refreshDoors() async {
    await _doorRepository
        .findAllDoors()
        .then((value) => setState(() => _doors = value));
  }

  @override
  void initState() {
    super.initState();
    _refreshDoors();
  }

  @override
  Widget build(BuildContext context) {
    var scaffoldMessenger = ScaffoldMessenger.of(context);

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
          padding: const EdgeInsets.all(8.0),
          child: Stack(children: [
            RefreshIndicator(
                onRefresh: () async {
                  try {
                    await _refreshDoors();
                  } catch (e) {
                    scaffoldMessenger.clearSnackBars();
                    scaffoldMessenger.showSnackBar(SnackBar(
                        backgroundColor: Colors.red,
                        content: Text(e.toString())));
                  }
                },
                child: ListView(children: [DoorList(doors: _doors)]))
          ])),
    );
  }
}
