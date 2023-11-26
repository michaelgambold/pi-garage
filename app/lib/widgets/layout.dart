import 'package:flutter/material.dart';

class Layout extends StatelessWidget {
  const Layout(
      {Key? key,
      required this.title,
      required this.child,
      this.drawer,
      this.scaffoldMessangerKey})
      : super(key: key);

  final String title;
  final Widget child;
  final Widget? drawer;
  final Key? scaffoldMessangerKey;

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
        key: scaffoldMessangerKey,
        child: Scaffold(
            appBar: AppBar(
              title: Text(title),
            ),
            drawer: drawer,
            body: Container(
                padding: const EdgeInsets.fromLTRB(8, 0, 8, 20),
                child: child)));
  }
}
