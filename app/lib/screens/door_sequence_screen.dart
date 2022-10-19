import 'package:flutter/material.dart';

import '../models/sequence_object.dart';
import '../repositories/door_repository.dart';
import '../widgets/sequence_list.dart';

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
  final GlobalKey<ScaffoldMessengerState> _scaffoldMessengerKey =
      GlobalKey<ScaffoldMessengerState>();
  List<SequenceObject> _sequence = [];

  @override
  void initState() {
    super.initState();
    _refresh();
  }

  Future<void> _refresh() async {
    try {
      final sequence = await _doorRepository.findDoorSequence(widget.doorId);
      setState(() {
        _sequence = sequence;
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
    setState(() => {_sequence.add(const SequenceObject('on', 1000, 'relay1'))});
  }

  void _handleRemoveItem(int index) {
    setState(() {
      _sequence.removeAt(index);
    });
  }

  void _handleUpdateItem(int index, SequenceObject sequenceObject) {
    setState(() {
      _sequence[index] = sequenceObject;
    });
  }

  void _save() async {
    try {
      await _doorRepository.updateDoorSequence(widget.doorId, _sequence);
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
    return ScaffoldMessenger(
        key: _scaffoldMessengerKey,
        child: Scaffold(
            appBar: AppBar(
              title: Text(widget.title),
            ),
            body: Container(
                padding: const EdgeInsets.all(8.0),
                child: Stack(children: [
                  RefreshIndicator(
                    child: ListView(
                      children: [
                        SequenceList(
                          sequence: _sequence,
                          handleRemoveItem: _handleRemoveItem,
                          handleUpdateItem: _handleUpdateItem,
                        ),
                        ElevatedButton(
                            style: ElevatedButton.styleFrom(
                                minimumSize: const Size.fromHeight(40)),
                            onPressed: () => _save(),
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
                      child: FloatingActionButton(
                        onPressed: () {
                          _addSequenceObject();
                        },
                        child: const Icon(Icons.add),
                      ))
                ]))));
  }
}
