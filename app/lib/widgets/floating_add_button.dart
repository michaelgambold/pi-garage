import 'package:flutter/material.dart';
import 'package:flutter/src/foundation/key.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter/src/widgets/placeholder.dart';

class FloatingAddButton extends StatelessWidget {
  const FloatingAddButton({Key? key, required this.onPressed})
      : super(key: key);

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Positioned(
        bottom: 30,
        right: 20,
        child: FloatingActionButton(
          onPressed: () => onPressed(),
          child: const Icon(Icons.add),
        ));
  }
}
