import 'package:flutter/material.dart';
import 'package:pi_garage/models/config.dart';
import 'package:pi_garage/repositories/config_repository.dart';
import 'package:pi_garage/widgets/config_list.dart';
import 'package:pi_garage/widgets/floating_add_button.dart';
import 'package:uuid/uuid.dart';

class ConfigsScreen extends StatefulWidget {
  const ConfigsScreen({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<ConfigsScreen> createState() => _ConfigsScreenState();
}

class _ConfigsScreenState extends State<ConfigsScreen> {
  final _configRepo = ConfigRepository();
  List<Config> _configs = [];
  ScaffoldMessengerState? _scaffoldMesseger;

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
      await _configRepo
          .addConfig(Config(const Uuid().v4(), 'New Config', '', null));
      await _refresh();
    } catch (e) {
      _scaffoldMesseger?.clearSnackBars();
      _scaffoldMesseger?.showSnackBar(
          SnackBar(backgroundColor: Colors.red, content: Text(e.toString())));
    }
  }

  Future<void> _handleRemoveConfig(Config config) async {
    try {
      await _configRepo.removeConfig(config.id);
      await _refresh();
    } catch (e) {
      _scaffoldMesseger?.clearSnackBars();
      _scaffoldMesseger?.showSnackBar(
          SnackBar(backgroundColor: Colors.red, content: Text(e.toString())));
    }
  }

  Future<void> _handleEditConfig(BuildContext context, Config config) async {
    await Navigator.pushNamed(context, 'configs/${config.id}/edit');
    await _refresh();
  }

  @override
  Widget build(BuildContext context) {
    _scaffoldMesseger = ScaffoldMessenger.of(context);

    return Scaffold(
        appBar: AppBar(
          title: Text(widget.title),
        ),
        body: Container(
            padding: const EdgeInsets.fromLTRB(8, 0, 8, 20),
            child: Stack(children: [
              RefreshIndicator(
                onRefresh: _refresh,
                child: ListView(
                  children: [
                    ConfigList(
                      configs: _configs,
                      editConfig: (config) =>
                          _handleEditConfig(context, config),
                      removeConfig: _handleRemoveConfig,
                    ),
                  ],
                ),
              ),
              FloatingAddButton(onPressed: _handleAddPressed)
            ])));
  }
}
