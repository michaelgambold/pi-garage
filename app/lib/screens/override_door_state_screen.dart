import 'package:flutter/material.dart';

import '../repositories/door_repository.dart';
import '../widgets/layout.dart';

class OverrideDoorStateScreen extends StatefulWidget {
  const OverrideDoorStateScreen({Key? key, required this.title, required this.doorId}) : super(key: key);

  final String title;
  final int doorId;

  @override
  State<OverrideDoorStateScreen> createState() => _OverrideDoorStateScreenState();
}

class _OverrideDoorStateScreenState extends State<OverrideDoorStateScreen> {
  final _doorRepository = DoorRepository();
  final GlobalKey<ScaffoldMessengerState> _scaffoldMessengerKey =
      GlobalKey<ScaffoldMessengerState>();

  List<DropdownMenuItem> items = [
    const DropdownMenuItem(value: 'open', child: Text('Open')),
    const DropdownMenuItem(value: 'closed', child: Text('Closed')),
  ];
  String dropdownValue = 'open';
  

  Future<void> _save() async {
    try {
      await _doorRepository.overrideDoorState(widget.doorId, dropdownValue);
      _scaffoldMessengerKey.currentState?.clearSnackBars();
      _scaffoldMessengerKey.currentState?.showSnackBar(
        const SnackBar(
          content: Text('State Overridden'),
        ),
      );
    } catch (e) {
      print(e);
      _scaffoldMessengerKey.currentState?.clearSnackBars();
      _scaffoldMessengerKey.currentState?.showSnackBar(
        SnackBar(
          content: Text(e.toString()),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Layout(
      title: widget.title,
      scaffoldMessangerKey: _scaffoldMessengerKey,
      child: Column(
        children: [
          DropdownButtonFormField(
            decoration: const InputDecoration(
              labelText: 'State',
            ),
            items: items,
            value: dropdownValue,
            onChanged: (value) {
              setState(() {
                dropdownValue = value.toString();
              });
            }
          ),
          const Spacer(),
          FilledButton(
            style: FilledButton.styleFrom(
              minimumSize: const Size.fromHeight(40)),
              onPressed: _save,
              child: const Text('Save'),
            ),
        ],
        )
      );
  }
}