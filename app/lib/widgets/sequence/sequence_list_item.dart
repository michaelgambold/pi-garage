import 'package:flutter/material.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

import '../../models/sequence_object.dart';

class SequenceListItem extends StatelessWidget {
  const SequenceListItem(
      {Key? key,
      required this.sequenceObject,
      required this.onChanged,
      required this.onRemove})
      : super(key: key);

  final SequenceObject sequenceObject;
  final void Function(SequenceObject sequenceObject) onChanged;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    return Card(
        child: Container(
      padding: const EdgeInsets.all(8.0),
      child: Row(children: [
        _FormColumn(sequenceObject: sequenceObject, onChanged: onChanged),
        _ActionColumn(onRemove: onRemove)
      ]),
    ));
  }
}

class _FormColumn extends StatelessWidget {
  const _FormColumn(
      {Key? key, required this.sequenceObject, required this.onChanged})
      : super(key: key);

  final SequenceObject sequenceObject;
  final void Function(SequenceObject sequenceObject) onChanged;

  void handleActionChanged(String value) {
    var newSequenceObject = SequenceObject(
        action: value,
        duration: sequenceObject.duration,
        target: sequenceObject.target);

    onChanged(newSequenceObject);
  }

  void handleTargetChanged(String value) {
    var newSequenceObject = SequenceObject(
        action: sequenceObject.action,
        duration: sequenceObject.duration,
        target: value);

    onChanged(newSequenceObject);
  }

  void handleDurationChanged(int value) {
    var newSequenceObject = SequenceObject(
        action: sequenceObject.action,
        duration: value,
        target: sequenceObject.target);

    onChanged(newSequenceObject);
  }

  @override
  Widget build(BuildContext context) {
    return Expanded(
        child: Column(
      children: [
        _ActionDropdown(
          value: sequenceObject.action,
          onChanged: handleActionChanged,
        ),
        _TargetDropdown(
          value: sequenceObject.target,
          onChanged: handleTargetChanged,
        ),
        _DurationTextField(
          value: sequenceObject.duration,
          onChanged: handleDurationChanged,
        )
      ],
    ));
  }
}

class _ActionDropdown extends StatelessWidget {
  const _ActionDropdown(
      {Key? key, required this.value, required this.onChanged})
      : super(key: key);

  final String value;
  final ValueSetter<String> onChanged;

  void handleOnChanged(value) {
    onChanged(value.toString());
  }

  @override
  Widget build(BuildContext context) {
    List<DropdownMenuItem> items = [];

    items.add(const DropdownMenuItem(value: 'on', child: Text("On")));
    items.add(const DropdownMenuItem(value: 'off', child: Text("Off")));
    items.add(const DropdownMenuItem(value: 'high', child: Text("High")));
    items.add(const DropdownMenuItem(value: 'low', child: Text("Low")));

    return DropdownButtonFormField(
        decoration: const InputDecoration(labelText: "Action"),
        items: items,
        value: value,
        onChanged: handleOnChanged);
  }
}

class _TargetDropdown extends StatelessWidget {
  const _TargetDropdown(
      {Key? key, required this.value, required this.onChanged})
      : super(key: key);

  final String value;
  final ValueSetter<String> onChanged;

  void handleOnChanged(value) {
    onChanged(value.toString());
  }

  @override
  Widget build(BuildContext context) {
    List<DropdownMenuItem> items = [];

    items.add(const DropdownMenuItem(value: 'relay1', child: Text("Relay 1")));
    items.add(const DropdownMenuItem(value: 'relay2', child: Text("Relay 2")));
    items.add(const DropdownMenuItem(value: 'relay3', child: Text("Relay 3")));
    items.add(const DropdownMenuItem(
        value: 'digitalOutput1', child: Text("Digital Output 1")));
    items.add(const DropdownMenuItem(
        value: 'digitalOutput2', child: Text("Digital Output 2")));
    items.add(const DropdownMenuItem(
        value: 'digitalOutput3', child: Text("Digital Output 3")));

    return DropdownButtonFormField(
        decoration: const InputDecoration(labelText: "Target"),
        items: items,
        value: value,
        onChanged: handleOnChanged);
  }
}

class _DurationTextField extends StatelessWidget {
  const _DurationTextField(
      {Key? key, required this.value, required this.onChanged})
      : super(key: key);

  final int value;
  final ValueSetter<int> onChanged;

  void handleChanged(String value) {
    if (value.isEmpty) {
      onChanged(0);
      return;
    }

    onChanged(int.parse(value));
  }

  @override
  Widget build(BuildContext context) {
    var controller = TextEditingController(text: value.toString());

    return TextField(
      keyboardType: TextInputType.number,
      decoration: const InputDecoration(labelText: "Duration (ms)"),
      controller: controller,
      onChanged: handleChanged,
    );
  }
}

class _ActionColumn extends StatelessWidget {
  const _ActionColumn({Key? key, required this.onRemove}) : super(key: key);

  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: const EdgeInsets.only(left: 8.0),
        child: Column(children: [
          FilledButton(
              style: FilledButton.styleFrom(
                  minimumSize: Size.zero,
                  padding: EdgeInsets.zero,
                  backgroundColor: Colors.grey),
              onPressed: onRemove,
              child: const Icon(Icons.clear))
        ]));
  }
}

@widgetbook.UseCase(name: 'default', type: SequenceListItem)
Widget defaultUseCase(BuildContext context) {
  var sequenceObject =
      SequenceObject(action: "on", duration: 10000, target: "relay1");

  void handleOnChanged(SequenceObject sequenceObject) {
    print(sequenceObject.toJson());
    sequenceObject = sequenceObject;
  }

  void handleOnRemove() {
    print("On Remove");
  }

  return SequenceListItem(
    sequenceObject: sequenceObject,
    onChanged: handleOnChanged,
    onRemove: handleOnRemove,
  );
}
