import 'package:flutter/material.dart';
import '../models/sequence_object.dart';

class SequenceListItem extends StatefulWidget {
  const SequenceListItem(
      {Key? key,
      required this.sequenceObject,
      required this.onRemoveHandler,
      required this.index,
      required this.onUpdateHandler})
      : super(key: key);

  final SequenceObject sequenceObject;
  final int index;
  final Function(int) onRemoveHandler;
  final Function(int, SequenceObject) onUpdateHandler;

  @override
  State<SequenceListItem> createState() => _SequenceListItemState();
}

class _SequenceListItemState extends State<SequenceListItem> {
  final _durationController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _durationController.text = widget.sequenceObject.duration.toString();
  }

  @override
  void dispose() {
    super.dispose();
    _durationController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Container(
        padding: const EdgeInsets.all(8.0),
        child: Row(
          children: [
            // techically column 1
            Expanded(
                flex: 2,
                child: Column(children: [
                  Row(
                    children: [
                      const Expanded(child: Text('Action')),
                      Expanded(
                          flex: 2,
                          child: DropdownButton(
                              alignment: Alignment.centerRight,
                              value: widget.sequenceObject.action,
                              items: ['on', 'off', 'high', 'low'].map((value) {
                                return DropdownMenuItem(
                                  value: value,
                                  child: Text(value),
                                );
                              }).toList(),
                              onChanged: (value) => widget.onUpdateHandler(
                                  widget.index,
                                  SequenceObject(
                                      value.toString(),
                                      int.parse(_durationController.text),
                                      widget.sequenceObject.target))))
                    ],
                  ),
                  Row(
                    children: [
                      const Expanded(child: Text('Target')),
                      Expanded(
                          flex: 2,
                          child: DropdownButton(
                              alignment: Alignment.centerRight,
                              value: widget.sequenceObject.target,
                              items: const [
                                DropdownMenuItem(
                                    value: 'relay1', child: Text('Relay 1')),
                                DropdownMenuItem(
                                    value: 'relay2', child: Text('Relay 2')),
                                DropdownMenuItem(
                                    value: 'relay3', child: Text('Relay 3')),
                                DropdownMenuItem(
                                    value: 'digitalOutput1',
                                    child: Text('Digital Output 1')),
                                DropdownMenuItem(
                                    value: 'digitalOutput2',
                                    child: Text('Digital Output 2')),
                                DropdownMenuItem(
                                    value: 'digitalOutput3',
                                    child: Text('Digital Output 3'))
                              ],
                              onChanged: (value) => widget.onUpdateHandler(
                                  widget.index,
                                  SequenceObject(
                                      widget.sequenceObject.action,
                                      int.parse(_durationController.text),
                                      value.toString()))))
                    ],
                  ),
                  Row(
                    children: [
                      const Expanded(child: Text('Duration (ms)')),
                      Expanded(
                          flex: 2,
                          child: TextField(
                            keyboardType: TextInputType.number,
                            controller: _durationController,
                            onChanged: (value) => widget.onUpdateHandler(
                                widget.index,
                                SequenceObject(
                                    widget.sequenceObject.action,
                                    int.tryParse(_durationController.text) ?? 0,
                                    widget.sequenceObject.target)),
                          ))
                    ],
                  ),
                ])),
            // technically column 2
            Flexible(
                flex: 0,
                child: FilledButton(
                    style: FilledButton.styleFrom(
                        minimumSize: Size.zero,
                        padding: EdgeInsets.zero,
                        backgroundColor: Colors.grey),
                    onPressed: () => widget.onRemoveHandler(widget.index),
                    child: const Icon(Icons.clear))),
          ],
        ),
      ),
    );
  }
}
