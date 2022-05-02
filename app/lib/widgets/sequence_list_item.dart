import 'package:flutter/material.dart';
import '../models/sequence_object.dart';

class SequenceListItem extends StatefulWidget {
  SequenceListItem(
      {Key? key, required this.sequenceObject, required this.onRemoveHandler})
      : super(key: key);

  final SequenceObject sequenceObject;
  final Function(int) onRemoveHandler;

  @override
  State<SequenceListItem> createState() => _SequenceListItemState();
}

class _SequenceListItemState extends State<SequenceListItem> {
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
                              items: ['on', 'off'].map((value) {
                                return DropdownMenuItem(
                                  child: Text(value),
                                  value: value,
                                );
                              }).toList(),
                              onChanged: (value) => print(value)))
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
                                    child: Text('Relay 1'), value: 'relay1'),
                                DropdownMenuItem(
                                    child: Text('Relay 2'), value: 'relay2'),
                                DropdownMenuItem(
                                    child: Text('Relay 3'), value: 'relay3'),
                                DropdownMenuItem(
                                    child: Text('Digital Output 1'),
                                    value: 'digitalOutput1'),
                                DropdownMenuItem(
                                    child: Text('Digital Output 2'),
                                    value: 'digitalOutput2'),
                                DropdownMenuItem(
                                    child: Text('Ditital Output 3'),
                                    value: 'digitalOutput3')
                              ],
                              onChanged: (value) => print(value)))
                    ],
                  ),
                  Row(
                    children: [
                      const Expanded(child: Text('Duration (ms)')),
                      Expanded(
                          flex: 2,
                          child: TextField(
                            keyboardType: TextInputType.number,
                            onChanged: (value) => print(value),
                          ))
                    ],
                  ),
                ])),
            // technically column 2
            Flexible(
                flex: 0,
                child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      minimumSize: Size.zero,
                      padding: EdgeInsets.zero,
                    ),
                    onPressed: () => widget.onRemoveHandler(0),
                    child: const Icon(Icons.clear))),
          ],
        ),
      ),
    );
  }
}
