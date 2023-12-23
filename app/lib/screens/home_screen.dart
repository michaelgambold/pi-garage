import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

import '../models/config.dart';
import '../models/door.dart';
import '../providers/current_config_provider.dart';
import '../services/app_version_service.dart';
import '../services/local_storage_service.dart';
import '../widgets/door_list.dart';
import '../widgets/layout.dart';
import '../widgets/menu_drawer.dart';
import '../widgets/release_notes.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _appVersionService = AppVersionService();
  final _localStorageService = LocalStorageService.instance;
  final GlobalKey<ScaffoldMessengerState> _scaffoldMessengerKey =
      GlobalKey<ScaffoldMessengerState>();

  List<Door> _doors = [];
  bool _showReleaseNotes = false;
  Config? _config;
  io.Socket? _socket;

  Future<void> _initSocket(String fqdn, String apiKey) async {
    var appVersion = await _appVersionService.getAppVersion();

    final socket = io.io(
        '$fqdn/doors',
        io.OptionBuilder().setTransports(['websocket']).setExtraHeaders(
            {'x-api-key': apiKey, 'x-client-version': appVersion}).build());

    socket.onConnect((_) => socket.emit('doors:list'));

    socket.onConnectError((data) {
      _scaffoldMessengerKey.currentState?.clearMaterialBanners();
      _scaffoldMessengerKey.currentState?.showSnackBar(SnackBar(
        content: Text(data.toString()),
        backgroundColor: Colors.red,
      ));

      setState(() {
        _doors = [];
      });
    });

    socket.on('error', ((data) {
      _scaffoldMessengerKey.currentState?.clearMaterialBanners();
      _scaffoldMessengerKey.currentState?.showSnackBar(SnackBar(
        content: Text(data.toString()),
        backgroundColor: Colors.red,
      ));
    }));

    socket.on('doors:list', (data) {
      final doors =
          (data as List<dynamic>).map((e) => Door.fromJson(e)).toList();
      setState(() {
        _doors = doors;
      });
    });

    _socket = socket;
  }

  Future<void> _checkToShowReleaseNotes() async {
    var appVersion = await _appVersionService.getAppVersion();
    var key = "viewed-release-notes-v$appVersion";
    var viewedReleaseNotes = await _localStorageService.getBooleanValue(key);

    if (viewedReleaseNotes != true && _showReleaseNotes == false) {
      setState(() {
        _showReleaseNotes = true;
      });
    } else if (viewedReleaseNotes == true && _showReleaseNotes == true) {
      setState(() {
        _showReleaseNotes = false;
      });
    }
  }

  Future<void> dismissReleaseNotes() async {
    var appVersion = await _appVersionService.getAppVersion();
    var key = "viewed-release-notes-v$appVersion";

    await _localStorageService.setBooleanValue(key, true);
    await _checkToShowReleaseNotes();
  }

  Future<void> _refresh() async {
    setState(() {
      _doors = [];
    });

    if (_socket != null) _socket!.destroy();

    if (_config == null) return;
    await _initSocket(_config!.fqdn, _config!.apiKey ?? '');
  }

  bool configChanged(Config? prevConfig, Config? toTest) {
    if (toTest == null) {
      return false;
    }
    if (prevConfig == null) {
      return true;
    }
    if (toTest.id != prevConfig.id) {
      return true;
    }
    if (toTest.name != prevConfig.name) {
      return true;
    }
    if (toTest.fqdn != prevConfig.fqdn) {
      return true;
    }
    if (toTest.apiKey != prevConfig.apiKey) {
      return true;
    }
    return false;
  }

  @override
  Widget build(BuildContext context) {
    // get current config from provider
    final currentConfigProvider = context.watch<CurrentConfigProvider>();
    final currentConfig = currentConfigProvider.currentConfig;

    if (configChanged(_config, currentConfig)) {
      _config = currentConfig;
      _refresh();
    }

    _checkToShowReleaseNotes();

    return Layout(
        scaffoldMessangerKey: _scaffoldMessengerKey,
        title: widget.title,
        drawer: const MenuDrawer(),
        child: Stack(children: [
          RefreshIndicator(
            child: ListView(children: [DoorList(doors: _doors)]),
            onRefresh: () => _refresh(),
          ),
          if (_showReleaseNotes)
            (AlertDialog(
              title: const Text("Release Notes"),
              content: const ReleaseNotes(),
              actions: [
                TextButton(
                    onPressed: () => dismissReleaseNotes(),
                    child: const Text("Dismiss"))
              ],
            ))
        ]));
  }
}
