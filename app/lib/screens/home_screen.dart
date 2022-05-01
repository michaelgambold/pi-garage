import 'dart:async';
import 'dart:convert';

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
  late DoorRepository _doorRepository;
  List<Door> _doors = [];
  late Timer _timer;
  static const int _updateInterval = 10;

  _HomeScreenState() {
    _doorRepository = DoorRepository();
  }

  void refreshDoors() {
    _doorRepository
        .findAllDoors()
        .then((value) => setState(() => _doors = value));
  }

  @override
  void initState() {
    super.initState();
    refreshDoors();

    _timer = Timer.periodic(const Duration(seconds: _updateInterval), (timer) {
      refreshDoors();
    });
  }

  @override
  void dispose() {
    super.dispose();
    _timer.cancel();
  }

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
      body: Center(child: DoorList(doors: _doors)),
    );
  }
}
