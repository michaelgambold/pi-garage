import 'package:flutter/material.dart';
import 'package:pi_garage/models/audit_log.dart';
import 'package:pi_garage/models/config.dart';
import 'package:pi_garage/models/door.dart';
import 'package:pi_garage/models/sequence_object.dart';
import 'package:pi_garage/widgets/audit_log_card.dart';
import 'package:pi_garage/widgets/config_dropdown.dart';
import 'package:pi_garage/widgets/config_list.dart';
import 'package:pi_garage/widgets/config_list_item.dart';
import 'package:pi_garage/widgets/door_list.dart';
import 'package:pi_garage/widgets/door_list_item.dart';
import 'package:pi_garage/widgets/floating_add_button.dart';
import 'package:pi_garage/widgets/menu_drawer.dart';
import 'package:pi_garage/widgets/release_notes.dart';
import 'package:pi_garage/widgets/sequence_list.dart';
import 'package:pi_garage/widgets/sequence_list_item.dart';
import 'package:widgetbook/widgetbook.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

// Import the generated directories variable
import 'widgetbook.directories.g.dart';

void main() {
  runApp(const WidgetbookApp());
}

@widgetbook.App()
class WidgetbookApp extends StatelessWidget {
  const WidgetbookApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Widgetbook.material(
      // Use the generated directories variable
      directories: directories,
      addons: [],
      integrations: [
        // To make addons & knobs work with Widgetbook Cloud
        WidgetbookCloudIntegration(),
      ],
    );
  }
}

@widgetbook.UseCase(name: 'default', type: AuditLogCard)
Widget auditLogCard(BuildContext context) {
  var auditLog = AuditLog(timestamp: DateTime.now(), detail: "Some detail");
  return AuditLogCard(auditLog: auditLog);
}

@widgetbook.UseCase(name: 'default', type: ConfigDropdown)
Widget configDropdown(BuildContext context) {
  var configs = [
    Config(
        id: "abc123",
        name: "Default Config",
        fqdn: "http://localhost",
        apiKey: null)
  ];
  return ConfigDropdown(
    configs: configs,
    currentConfigId: configs[0].id,
    onChange: (value) => {},
  );
}

@widgetbook.UseCase(name: 'default', type: ConfigListItem)
Widget configListItem(BuildContext context) {
  var config = Config(
      id: "abc123",
      name: "Configuration",
      fqdn: "http://localhost",
      apiKey: null);
  return ConfigListItem(
    config: config,
    remove: () => {},
    edit: () => {},
  );
}

@widgetbook.UseCase(name: 'default', type: ConfigList)
Widget configList(BuildContext context) {
  var configs = [
    Config(
        id: "abc123",
        name: "Configuration #1",
        fqdn: "http://localhost",
        apiKey: null),
    Config(
        id: "abc123",
        name: "Configuration #2",
        fqdn: "http://localhost",
        apiKey: null),
    Config(
        id: "abc123",
        name: "Configuration #3",
        fqdn: "http://localhost",
        apiKey: null)
  ];
  return ConfigList(
    configs: configs,
    editConfig: (config) => {},
    removeConfig: (config) => {},
  );
}

@widgetbook.UseCase(name: 'default', type: DoorListItem)
Widget doorListItem(BuildContext context) {
  const door = Door(
      id: 1,
      label: "Door",
      isEnabled: true,
      state: "open",
      openDuration: 20000,
      closeDuration: 20000);
  return const DoorListItem(door: door);
}

@widgetbook.UseCase(name: 'default', type: DoorList)
Widget doorList(BuildContext context) {
  var doors = const [
    Door(
        id: 1,
        label: "Door #1",
        isEnabled: true,
        state: "open",
        openDuration: 20000,
        closeDuration: 20000),
    Door(
        id: 2,
        label: "Door #2",
        isEnabled: true,
        state: "closed",
        openDuration: 20000,
        closeDuration: 20000),
    Door(
        id: 3,
        label: "Door #3",
        isEnabled: true,
        state: "opening",
        openDuration: 20000,
        closeDuration: 20000)
  ];
  return DoorList(doors: doors);
}

@widgetbook.UseCase(name: 'default', type: FloatingAddButton)
Widget floatingAddButton(BuildContext context) {
  return FloatingAddButton(onPressed: () => {});
}

// This widget book is broken as needs a provider for some reason??
@widgetbook.UseCase(name: 'default', type: MenuDrawer)
Widget menuDrawer(BuildContext context) {
  return const MenuDrawer();
}

@widgetbook.UseCase(name: 'default', type: ReleaseNotes)
Widget releaseNotesModal(BuildContext context) {
  return Container(color: Colors.white, child: const ReleaseNotes());
}

@widgetbook.UseCase(name: 'default', type: SequenceListItem)
Widget sequenceListItem(BuildContext context) {
  var sequenceObject =
      const SequenceObject(action: "on", duration: 1000, target: "relay1");
  return SequenceListItem(
      sequenceObject: sequenceObject,
      index: 0,
      onRemoveHandler: (p0) => {},
      onUpdateHandler: (p0, p1) => {});
}

@widgetbook.UseCase(name: 'default', type: SequenceList)
Widget sequenceList(BuildContext context) {
  var sequenceObjects = const [
    SequenceObject(action: "on", duration: 1000, target: "relay1"),
    SequenceObject(action: "off", duration: 1000, target: "relay1")
  ];
  return SequenceList(
      sequenceObjects: sequenceObjects,
      handleRemoveItem: (p0) => {},
      handleUpdateItem: (p0, p1) => {});
}
