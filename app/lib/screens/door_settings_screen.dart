import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../models/update_door.dart';
import '../repositories/door_repository.dart';

class DoorSettingsScreen extends StatefulWidget {
  const DoorSettingsScreen(
      {Key? key, required this.title, required this.doorId})
      : super(key: key);

  final String title;
  final int doorId;

  @override
  State<DoorSettingsScreen> createState() => _DoorSettingsScreenState();
}

class _DoorSettingsScreenState extends State<DoorSettingsScreen> {
  final GlobalKey<ScaffoldMessengerState> _scaffoldMessengerKey =
      GlobalKey<ScaffoldMessengerState>();
  final _doorRepository = DoorRepository();

  final _labelController = TextEditingController(text: '');
  final _openDoorDurationController = TextEditingController(text: '0');
  final _closeDoorDurationController = TextEditingController(text: '0');
  bool _isEnabled = false;

  @override
  void initState() {
    super.initState();

    _doorRepository.findDoor(widget.doorId).then((value) {
      _labelController.text = value.label;
      _openDoorDurationController.text = value.openDuration.toString();
      _closeDoorDurationController.text = value.closeDuration.toString();
      setState(
        () {
          _isEnabled = value.isEnabled;
        },
      );
    }).catchError((e) {
      _scaffoldMessengerKey.currentState?.clearSnackBars();
      _scaffoldMessengerKey.currentState?.showSnackBar(
        SnackBar(
          backgroundColor: Colors.red,
          content: Text(e.toString()),
        ),
      );
    });
  }

  @override
  void dispose() {
    _labelController.dispose();
    super.dispose();
  }

  _save() async {
    try {
      await _doorRepository.updateDoor(
          widget.doorId,
          UpdateDoor(
              isEnabled: _isEnabled,
              label: _labelController.text,
              openDuration: int.parse(_openDoorDurationController.text),
              closeDuration: int.parse(_closeDoorDurationController.text)));

      _scaffoldMessengerKey.currentState?.clearSnackBars();
      _scaffoldMessengerKey.currentState?.showSnackBar(
        const SnackBar(
          content: Text('Settings Saved'),
        ),
      );
    } catch (e) {
      _scaffoldMessengerKey.currentState?.clearSnackBars();
      _scaffoldMessengerKey.currentState?.showSnackBar(
        SnackBar(
          backgroundColor: Colors.red,
          content: Text(e.toString()),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
        key: _scaffoldMessengerKey,
        child: Scaffold(
            appBar: AppBar(
              title: Text(widget.title),
            ),
            body: Container(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  children: [
                    CheckboxListTile(
                      contentPadding: EdgeInsets.zero,
                      title: const Text('Enabled'),
                      onChanged: (value) {
                        setState(() {
                          _isEnabled = value ?? _isEnabled;
                        });
                      },
                      value: _isEnabled,
                    ),
                    TextFormField(
                      decoration: const InputDecoration(labelText: 'Label'),
                      controller: _labelController,
                    ),
                    TextFormField(
                      controller: _openDoorDurationController,
                      decoration: const InputDecoration(
                          labelText: "Open Duration (ms)"),
                      keyboardType: TextInputType.number,
                      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                    ),
                    TextFormField(
                      controller: _closeDoorDurationController,
                      decoration: const InputDecoration(
                          labelText: "Close Duration (ms)"),
                      keyboardType: TextInputType.number,
                      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                    ),
                    const Spacer(),
                    FilledButton(
                      style: FilledButton.styleFrom(
                          minimumSize: const Size.fromHeight(40)),
                      onPressed: _save,
                      child: const Text('Save'),
                    ),
                  ],
                ))));
  }
}
