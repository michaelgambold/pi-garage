import 'package:flutter/material.dart';

import '../services/app_version_service.dart';

class MenuDrawer extends StatefulWidget {
  const MenuDrawer({Key? key}) : super(key: key);

  @override
  State<MenuDrawer> createState() => _MenuDrawerState();
}

class _MenuDrawerState extends State<MenuDrawer> {
  final _appVersionService = AppVersionService();
  String _appVersion = '';

  @override
  void initState() {
    super.initState();

    _appVersionService.getAppVersion().then((value) => setState(() {
          _appVersion = value;
        }));
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
              decoration: const BoxDecoration(
                color: Colors.blue,
              ),
              child: Column(children: [
                const Text(
                  "Menu",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                  ),
                ),
                Text(
                  _appVersion,
                  style: const TextStyle(
                    color: Colors.white54,
                    fontSize: 10,
                  ),
                )
              ])),
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
