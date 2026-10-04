import 'package:flutter/material.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

class FloatingAddButton extends StatelessWidget {
  const FloatingAddButton({Key? key, required this.onPressed})
      : super(key: key);

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Positioned(
        bottom: 30,
        right: 20,
        child: FilledButton(
          onPressed: () => onPressed(),
          child: const Icon(Icons.add),
        ));
  }
}

@widgetbook.UseCase(name: 'default', type: FloatingAddButton)
Widget defaultUseCase(BuildContext context) {
  return FloatingAddButton(onPressed: () => {});
}
