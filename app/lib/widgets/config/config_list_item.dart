import 'package:flutter/material.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

import '../../models/config.dart';

enum Action { edit, remove }

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
      if (action == Action.edit.name) {
        return edit();
      }
      if (action == Action.remove.name) {
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
          PopupMenuItem<String>(
            value: Action.edit.name,
            child: const Text("Edit"),
          ),
          PopupMenuItem<String>(
            value: Action.remove.name,
            child: const Text("Remove", style: TextStyle(color: Colors.red)),
          )
        ],
      ),
    ));
  }
}

@widgetbook.UseCase(name: 'default', type: ConfigListItem)
Widget defaultUseCase(BuildContext context) {
  var config = Config(
      fqdn: "http://localhost:3000",
      id: "abc123",
      name: "Some config",
      apiKey: null);

  void handleEdit() {
    print("handle edit");
  }

  void handleRemove() {
    print("handle remove");
  }

  return ConfigListItem(
    config: config,
    edit: handleEdit,
    remove: handleRemove,
  );
}
