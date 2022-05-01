import 'package:flutter/material.dart';
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
  final _doorRepository = DoorRepository();
  final _labelController = TextEditingController(text: '');
  bool _isEnabled = false;

  @override
  void initState() {
    super.initState();
    _doorRepository.findDoor(widget.doorId).then((value) {
      _labelController.text = value.label;

      setState(
        () {
          _isEnabled = value.isEnabled;
        },
      );
    });
  }

  @override
  void dispose() {
    _labelController.dispose();
    super.dispose();
  }

  save() {
    _doorRepository.updateDoor(
        widget.doorId,
        UpdateDoor(
          isEnabled: _isEnabled,
          label: _labelController.text,
        ));
  }

  @override
  Widget build(BuildContext context) {
    print('door settings screen: ' + widget.doorId.toString());
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
        body: Center(
            child: Column(
          children: [
            TextFormField(
              decoration: const InputDecoration(hintText: 'Label'),
              controller: _labelController,
              // onSaved: (value) {
              //   print('onSaved: $value');
              // },
              onChanged: (value) {
                _labelController.text = value;
              },
            ),
            CheckboxListTile(
              title: const Text('Enabled'),
              // decoration: const InputDecoration(hintText: 'API Key'),
              // initialValue: door?.label,
              // onSaved: (value) {
              //   print(value);
              // },
              onChanged: (value) {
                setState(() {
                  _isEnabled = value ?? _isEnabled;
                });
              },
              value: _isEnabled,
            ),
            ElevatedButton(
              onPressed: () async {
                // Validate will return true if the form is valid, or false if
                // the form is invalid.
                // if (_formKey.currentState!.validate()) {
                // _formKey.currentState!.save();
                ScaffoldMessenger.of(context).clearSnackBars();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Settings Saved'),
                  ),
                );
                // }
              },
              child: const Text('Save'),
            ),
          ],
        )));
  }
}
