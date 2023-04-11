import 'package:flutter/material.dart';
import 'package:pi_garage/models/config.dart';
import 'package:pi_garage/repositories/config_repository.dart';
import 'package:pi_garage/services/http_service.dart';
import 'package:pi_garage/services/local_storage_service.dart';
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
    await _configRepo
        .addConfig(Config(const Uuid().v4(), 'New Config', '', null));
    await _refresh();
  }

  @override
  Widget build(BuildContext context) {
    final GlobalKey<FormState> formKey = GlobalKey<FormState>();
    var scaffoldMesseger = ScaffoldMessenger.of(context);

    return Scaffold(
        appBar: AppBar(
          title: Text(widget.title),
        ),
        body: Container(
            padding: const EdgeInsets.all(8.0),
            child: Stack(children: [
              RefreshIndicator(
                onRefresh: _refresh,
                child: ListView(
                  children: [
                    ConfigList(
                      configs: _configs,
                    ),
                  ],
                ),
              ),
              FloatingAddButton(onPressed: _handleAddPressed)
            ])));
  }
}
