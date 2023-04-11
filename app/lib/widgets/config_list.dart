import 'package:flutter/material.dart';
import 'package:flutter/src/foundation/key.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter/src/widgets/placeholder.dart';
import 'package:pi_garage/models/config.dart';
import 'package:pi_garage/widgets/config_list_item.dart';

class ConfigList extends StatelessWidget {
  const ConfigList({Key? key, required this.configs}) : super(key: key);

  final List<Config> configs;

  @override
  Widget build(BuildContext context) {
    if (configs.isEmpty) {
      return Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [Text("No Configs")])
      ]);
    }

    return Column(
      children:
          configs.map((config) => ConfigListItem(config: config)).toList(),
    );
  }
}
