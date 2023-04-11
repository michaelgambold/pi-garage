import 'package:flutter/src/foundation/key.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter/src/widgets/placeholder.dart';
import 'package:pi_garage/models/config.dart';

class ConfigListItem extends StatelessWidget {
  const ConfigListItem({Key? key, required this.config}) : super(key: key);

  final Config config;

  @override
  Widget build(BuildContext context) {
    return const Placeholder();
  }
}
