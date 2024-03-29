import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';

import '../models/config.dart';
import '../repositories/config_repository.dart';
import '../widgets/config/config_list.dart';
import '../widgets/floating_add_button.dart';
import '../widgets/layout.dart';

class ConfigsScreen extends StatefulWidget {
  const ConfigsScreen({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<ConfigsScreen> createState() => _ConfigsScreenState();
}

class _ConfigsScreenState extends State<ConfigsScreen> {
  final _configRepo = ConfigRepository();
  List<Config> _configs = [];

  final _scaffoldMessengerKey = GlobalKey<ScaffoldMessengerState>();

  @override
  void initState() {
    super.initState();
    _refresh();
  }

  Future<void> _refresh() async {
    final configs = await _configRepo.findAllConfigs();
    setState(() {
      _configs = configs;
    });
  }

  Future<void> _handleAddPressed() async {
    try {
      await _configRepo.addConfig(Config(
          id: const Uuid().v4(), name: 'New Config', fqdn: '', apiKey: null));
      await _refresh();
    } catch (e) {
      _scaffoldMessengerKey.currentState?.clearSnackBars();
      _scaffoldMessengerKey.currentState?.showSnackBar(
          SnackBar(backgroundColor: Colors.red, content: Text(e.toString())));
    }
  }

  Future<void> _handleRemoveConfig(Config config) async {
    try {
      await _configRepo.removeConfig(config.id);
      await _refresh();
    } catch (e) {
      _scaffoldMessengerKey.currentState?.clearSnackBars();
      _scaffoldMessengerKey.currentState?.showSnackBar(
          SnackBar(backgroundColor: Colors.red, content: Text(e.toString())));
    }
  }

  Future<void> _handleEditConfig(BuildContext context, Config config) async {
    await Navigator.pushNamed(context, 'configs/${config.id}/edit');
    await _refresh();
  }

  @override
  Widget build(BuildContext context) {
    return Layout(
        scaffoldMessangerKey: _scaffoldMessengerKey,
        title: widget.title,
        child: Stack(children: [
          RefreshIndicator(
            onRefresh: _refresh,
            child: ConfigList(
              configs: _configs,
              editConfig: (config) => _handleEditConfig(context, config),
              removeConfig: _handleRemoveConfig,
            ),
          ),
          FloatingAddButton(onPressed: _handleAddPressed)
        ]));
  }
}
