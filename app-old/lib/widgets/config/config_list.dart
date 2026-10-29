import 'package:flutter/material.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

import '../../models/config.dart';
import 'config_list_item.dart';

class ConfigList extends StatelessWidget {
  const ConfigList(
      {Key? key,
      required this.configs,
      required this.removeConfig,
      required this.editConfig})
      : super(key: key);

  final List<Config> configs;
  final void Function(Config) removeConfig;
  final void Function(Config) editConfig;

  @override
  Widget build(BuildContext context) {
    if (configs.isEmpty) {
      return const Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [Text("No Configs")])
          ]);
    }

    return ListView(
      children: configs
          .map((config) => ConfigListItem(
                config: config,
                remove: () => removeConfig(config),
                edit: () => editConfig(config),
              ))
          .toList(),
    );
  }
}

@widgetbook.UseCase(name: 'default', type: ConfigList)
Widget defaultUseCase(BuildContext context) {
  List<Config> configs = [];

  for (var i = 0; i < 5; i++) {
    configs.add(Config(
        fqdn: "http://localhost:300$i", id: "abc123$i", name: "Config #$i"));
  }

  void handleEditConfig(Config config) {
    // ignore: avoid_print
    print("handle edit config");
  }

  void handleRemoveConfig(Config config) {
    // ignore: avoid_print
    print("handle remove config");
  }

  return ConfigList(
    configs: configs,
    editConfig: handleEditConfig,
    removeConfig: handleRemoveConfig,
  );
}
