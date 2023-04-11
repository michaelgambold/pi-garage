import 'package:flutter/material.dart';
import 'package:pi_garage/models/config.dart';
import 'package:pi_garage/providers/current_config_provider.dart';
import 'package:pi_garage/repositories/config_repository.dart';
import 'package:pi_garage/services/app_version_service.dart';
import 'package:pi_garage/widgets/config_dropdown.dart';
import 'package:provider/provider.dart';

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
                              currentConfigId: currentConfig?.id,
                              onChange: (value) =>
                                  currentConfigProvider.setCurrentConfig(value))
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
