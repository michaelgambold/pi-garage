import 'package:flutter/material.dart';

class MenuDrawer extends StatelessWidget {
  const MenuDrawer({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          const DrawerHeader(child: Text("Menu")),
          // ListTile(
          //   title: const Text("Home"),
          //   onTap: () {
          //     Navigator.of(context).pop();
          //     Navigator.pushNamed(context, '/');
          //   },
          // ),
          ListTile(
            title: const Text("Global Settings"),
            onTap: () {
              Navigator.of(context).pop();
              Navigator.pushNamed(context, '/settings');
            },
          ),
          ListTile(
            title: const Text("Audit Log"),
            onTap: () {
              Navigator.of(context).pop();
              Navigator.pushNamed(context, '/audit-log');
            },
          )
        ],
      ),
    );
  }
}
