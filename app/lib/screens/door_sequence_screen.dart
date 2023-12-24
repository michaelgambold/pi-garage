import 'package:flutter/material.dart';

import '../models/sequence_object.dart';
import '../repositories/door_repository.dart';
import '../widgets/layout.dart';
import '../widgets/sequence/sequence_list.dart';

class DoorSequenceScreen extends StatefulWidget {
  const DoorSequenceScreen(
      {Key? key, required this.title, required this.doorId})
      : super(key: key);

  final String title;
  final int doorId;

  @override
  State<DoorSequenceScreen> createState() => _DoorSequenceScreenState();
}

class _DoorSequenceScreenState extends State<DoorSequenceScreen> {
  final _doorRepository = DoorRepository();
  final _scaffoldMessengerKey = GlobalKey<ScaffoldMessengerState>();
  List<SequenceObject> _sequenceObjects = [];

  @override
  void initState() {
    super.initState();
    _refresh();
  }

  Future<void> _refresh() async {
    try {
      final sequenceObjects =
          await _doorRepository.findDoorSequence(widget.doorId);
      setState(() {
        _sequenceObjects = sequenceObjects;
      });
    } catch (e) {
      _scaffoldMessengerKey.currentState?.clearSnackBars();
      _scaffoldMessengerKey.currentState?.showSnackBar(
        SnackBar(
          content: Text(e.toString()),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _addSequenceObject() {
    setState(() => _sequenceObjects.add(
        const SequenceObject(action: 'on', duration: 1000, target: 'relay1')));
  }

  void _handleRemoveItem(int index) {
    setState(() {
      _sequenceObjects.removeAt(index);
    });
  }

  void _handleUpdateItem(int index, SequenceObject sequenceObject) {
    setState(() {
      _sequenceObjects[index] = sequenceObject;
    });
  }

  Future<void> _save() async {
    try {
      await _doorRepository.updateDoorSequence(widget.doorId, _sequenceObjects);

      _scaffoldMessengerKey.currentState?.clearSnackBars();
      _scaffoldMessengerKey.currentState?.showSnackBar(
        const SnackBar(
          content: Text('Sequence Saved'),
        ),
      );
    } catch (e) {
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
        scaffoldMessangerKey: _scaffoldMessengerKey,
        title: widget.title,
        child: Stack(children: [
          RefreshIndicator(
            child: ListView(
              children: [
                SequenceList(
                  sequenceObjects: _sequenceObjects,
                  onRemoveItem: _handleRemoveItem,
                  onUpdateItem: _handleUpdateItem,
                ),
                FilledButton(
                    style: FilledButton.styleFrom(
                        minimumSize: const Size.fromHeight(40)),
                    onPressed: () async {
                      await _save();
                    },
                    child: const Text('Save')),
              ],
            ),
            onRefresh: () async {
              await _refresh();
            },
          ),
          Positioned(
              bottom: 30,
              right: 20,
              child: FilledButton(
                onPressed: () {
                  _addSequenceObject();
                },
                child: const Icon(Icons.add),
              ))
        ]));
  }
}
