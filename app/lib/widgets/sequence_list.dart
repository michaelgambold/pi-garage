import 'package:flutter/material.dart';
import 'package:collection/collection.dart';

import '../models/sequence_object.dart';
import '../widgets/sequence_list_item.dart';

class SequenceList extends StatefulWidget {
  const SequenceList(
      {Key? key,
      required this.sequenceObjects,
      required this.handleRemoveItem,
      required this.handleUpdateItem})
      : super(key: key);

  final List<SequenceObject> sequenceObjects;
  final Function(int) handleRemoveItem;
  final Function(int, SequenceObject) handleUpdateItem;

  @override
  State<SequenceList> createState() => _SequenceListState();
}

class _SequenceListState extends State<SequenceList> {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: widget.sequenceObjects
          .mapIndexed((index, sequenceObject) => SequenceListItem(
              sequenceObject: sequenceObject,
              index: index,
              onRemoveHandler: widget.handleRemoveItem,
              onUpdateHandler: widget.handleUpdateItem))
          .toList(),
    );
  }
}
