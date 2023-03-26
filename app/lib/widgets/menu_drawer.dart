import 'package:flutter/material.dart';
import 'package:pi_garage/models/config.dart';
import 'package:pi_garage/repositories/config_repository.dart';
import 'package:pi_garage/widgets/config_dropdown.dart';

import '../services/app_version_service.dart';

class MenuDrawer extends StatefulWidget {
  const MenuDrawer({Key? key}) : super(key: key);

  @override
  State<MenuDrawer> createState() => _MenuDrawerState();
}

class _MenuDrawerState extends State<MenuDrawer> {
  final _appVersionService = AppVersionService();
  final _configRepository = ConfigRepository();
  final _appVersionTextSize = 12.0;

  String _appVersion = '';
  List<Config> _configs = [];
  Config? _currentConfig;

  @override
  void initState() {
    super.initState();

    _appVersionService.getAppVersion().then((value) => setState(() {
          _appVersion = value;
        }));
    _configRepository.findAllConfigs().then((value) => setState(() {
          _configs = value;
        }));
    _refreshCurrentConfig();
  }

  Future<void> _refreshCurrentConfig() async {
    final currentConfig = await _configRepository.findCurrentConfig();
    setState(() {
      _currentConfig = currentConfig;
    });
  }

  Future<void> _selectConfig(String value) async {
    await _configRepository.selectConfig(value);
    await _refreshCurrentConfig();
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
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                        child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                          const Text("Menu",
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 24,
                              )),
                          const SizedBox(
                            height: 6,
                          ),
                          ConfigDropdown(
                              configs: _configs,
                              currentConfigId: _currentConfig?.id,
                              onChange: (value) => _selectConfig(value))
                        ])),
                    SizedBox(
                        height: _appVersionTextSize,
                        child: Text(
                          _appVersion,
                          style: TextStyle(
                            color: Colors.white54,
                            fontSize: _appVersionTextSize,
                          ),
                        ))
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
