import 'package:app/widgets/sequence_list_item.dart';
import 'package:flutter/material.dart';

import '../models/sequence_object.dart';

class SequenceList extends StatefulWidget {
  const SequenceList({Key? key, required this.sequence}) : super(key: key);

  final List<SequenceObject> sequence;

  @override
  State<SequenceList> createState() => _SequenceListState();
}

class _SequenceListState extends State<SequenceList> {
  void _removeItem(int index) {
    print('removing at index $index');
  }

  @override
  Widget build(BuildContext context) {
    return Container(
        child: Column(
      children: widget.sequence
          .map((sequenceObject) => SequenceListItem(
                sequenceObject: sequenceObject,
                onRemoveHandler: _removeItem,
              ))
          .toList(),
    ));
  }
}
