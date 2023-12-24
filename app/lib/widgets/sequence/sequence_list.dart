import 'package:flutter/material.dart';
import 'package:collection/collection.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

import '../../models/sequence_object.dart';
import './sequence_list_item.dart';

class SequenceList extends StatelessWidget {
  const SequenceList(
      {Key? key,
      required this.sequenceObjects,
      required this.onRemoveItem,
      required this.onUpdateItem})
      : super(key: key);

  final List<SequenceObject> sequenceObjects;

  final ValueSetter<int> onRemoveItem;
  final Function(int, SequenceObject) onUpdateItem;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: sequenceObjects
          .mapIndexed((index, sequenceObject) => SequenceListItem(
                sequenceObject: sequenceObject,
                onChanged: (sequenceObject) =>
                    onUpdateItem(index, sequenceObject),
                onRemove: () => onRemoveItem(index),
              ))
          .toList(),
    );
  }
}

@widgetbook.UseCase(name: 'default', type: SequenceList)
Widget defaultUseCase(BuildContext context) {
  List<SequenceObject> sequenceObjects = [
    const SequenceObject(action: 'on', duration: 1000, target: "relay1"),
    const SequenceObject(action: 'off', duration: 1000, target: "relay1"),
  ];

  void handleOnRemoveItem(int index) {
    // ignore: avoid_print
    print("Remove item: $index");
  }

  void handleOnUpdateItem(int index, SequenceObject sequenceObject) {
    // ignore: avoid_print
    print("Update item: $index, value: ${sequenceObject.toJson()}");
  }

  return SequenceList(
    onRemoveItem: handleOnRemoveItem,
    onUpdateItem: handleOnUpdateItem,
    sequenceObjects: sequenceObjects,
  );
}
