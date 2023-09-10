import 'package:flutter/material.dart';

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
