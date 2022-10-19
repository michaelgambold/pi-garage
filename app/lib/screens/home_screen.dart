import 'dart:async';

import 'package:flutter/material.dart';

import '../models/door.dart';
import '../repositories/door_repository.dart';
import '../widgets/door_list.dart';
import '../widgets/menu_drawer.dart';

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
    try {
      final doors = await _doorRepository.findAllDoors();
      setState(() => _doors = doors);
    } catch (e) {
      setState(() {
        _doors = [];
      });
      rethrow;
    }
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
      ),
      drawer: const MenuDrawer(),
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
