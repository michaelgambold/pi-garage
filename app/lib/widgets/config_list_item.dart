import 'package:flutter/material.dart';
import 'package:flutter/src/foundation/key.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter/src/widgets/placeholder.dart';
import 'package:pi_garage/models/config.dart';

class ConfigListItem extends StatelessWidget {
  const ConfigListItem(
      {Key? key,
      required this.config,
      required this.remove,
      required this.edit})
      : super(key: key);

  final Config config;
  final VoidCallback remove;
  final VoidCallback edit;

  @override
  Widget build(BuildContext context) {
    void handleMenuClick(String action) {
      if (action == 'edit') {
        return edit();
      }
      if (action == 'remove') {
        return remove();
      }
    }

    return Card(
        child: ListTile(
      title: Text(config.name),
      subtitle: Text(config.fqdn),
      trailing: PopupMenuButton<String>(
        icon: const Icon(Icons.more_vert),
        onSelected: handleMenuClick,
        itemBuilder: (BuildContext context) => [
          const PopupMenuItem<String>(
            value: "edit",
            child: Text("Edit"),
          ),
          const PopupMenuItem<String>(
            value: "remove",
            child: Text("Remove", style: TextStyle(color: Colors.red)),
          )
        ],
      ),
    ));
  }
}
