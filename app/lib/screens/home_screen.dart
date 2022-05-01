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

  _HomeScreenState() {
    print('home screen constructor');
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

    _timer = Timer.periodic(const Duration(seconds: 5), (timer) {
      refreshDoors();
    });
  }

  @override
  void dispose() {
    super.dispose();
    print('dispose');
    _timer.cancel();
  }

  @override
  void didUpdateWidget(covariant HomeScreen oldWidget) {
    // TODO: implement didUpdateWidget
    super.didUpdateWidget(oldWidget);
    print('did update widget');
  }

  // List<Door> doors = [
  //   const Door(id: 1, label: 'Door 1', isEnabled: true, state: 'open'),
  //   const Door(id: 2, label: 'Door 2', isEnabled: true, state: 'closed'),
  //   const Door(id: 3, label: 'Door 3', isEnabled: false, state: 'closed')
  // ];

  @override
  Widget build(BuildContext context) {
    print('home screen build');
    // _doorRepository.findAllDoors().then((value) => print(jsonEncode(value)));
    // print(jsonEncode(_doors));
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
