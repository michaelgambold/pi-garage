import 'package:flutter/material.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

import '../../models/config.dart';

class ConfigDropdown extends StatelessWidget {
  const ConfigDropdown(
      {Key? key,
      required this.configs,
      required this.currentConfigId,
      required this.onChange})
      : super(key: key);

  final List<Config> configs;
  final String? currentConfigId;
  final ValueSetter<String> onChange;

  @override
  Widget build(BuildContext context) {
    return DropdownButton(
      value: currentConfigId,
      isExpanded: true,
      onChanged: (value) => onChange(value.toString()),
      items: configs
          .map((e) => DropdownMenuItem(value: e.id, child: Text(e.name)))
          .toList(),
    );
  }
}

@widgetbook.UseCase(name: 'default', type: ConfigDropdown)
Widget defaultUseCase(BuildContext context) {
  List<Config> configs = [];

  for (var i = 0; i < 2; i++) {
    configs.add(Config(
        fqdn: 'http://localhost:300$i',
        id: '$i',
        name: 'Config #$i',
        apiKey: '$i'));
  }

  void handleChange(String id) {}

  return Container(
      color: Colors.white,
      child: ConfigDropdown(
          configs: configs,
          currentConfigId: configs[0].id,
          onChange: handleChange));
}
