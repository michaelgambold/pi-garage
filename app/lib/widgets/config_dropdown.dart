import 'package:flutter/material.dart';
import 'package:pi_garage/models/config.dart';

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
      onChanged: (value) => onChange(value.toString()),
      items: configs
          .map((e) => DropdownMenuItem(value: e.id, child: Text(e.name)))
          .toList(),
    );
  }
}
