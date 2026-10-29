import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

import '../models/config.dart';
import '../providers/current_config_provider.dart';
import '../repositories/config_repository.dart';
import '../services/app_version_service.dart';
import 'config/config_dropdown.dart';

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

  @override
  void initState() {
    super.initState();

    _appVersionService.getAppVersion().then((value) => setState(() {
          _appVersion = value;
        }));
    _configRepository.findAllConfigs().then((value) => setState(() {
          _configs = value;
        }));
  }

  @override
  Widget build(BuildContext context) {
    final currentConfigProvider = context.watch<CurrentConfigProvider>();
    final currentConfig = currentConfigProvider.currentConfig;

    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            // decoration: const BoxDecoration(color: Colors.blue),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Menu",
                  style: TextStyle(
                    // color: Colors.white,
                    fontSize: 24,
                  ),
                ),
                const SizedBox(
                  height: 6,
                ),
                ConfigDropdown(
                  configs: _configs,
                  currentConfigId: currentConfig?.id,
                  onChange: (value) =>
                      currentConfigProvider.setCurrentConfig(value),
                ),
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Text(
                        _appVersion,
                        style: TextStyle(
                          fontSize: _appVersionTextSize,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          ListTile(
            title: const Text("Configs"),
            onTap: () {
              Navigator.of(context).pop();
              Navigator.pushNamed(context, '/configs');
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

// This widget book is broken as needs a provider for some reason??
@widgetbook.UseCase(name: 'default', type: MenuDrawer)
Widget defaultUseCase(BuildContext context) {
  return const MenuDrawer();
}
