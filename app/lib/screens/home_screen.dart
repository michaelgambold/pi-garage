import 'package:flutter/material.dart';
import 'package:pi_garage/models/config.dart';
import 'package:pi_garage/models/door.dart';
import 'package:pi_garage/providers/current_config_provider.dart';
import 'package:pi_garage/services/app_version_service.dart';
import 'package:pi_garage/widgets/door_list.dart';
import 'package:pi_garage/widgets/menu_drawer.dart';
import 'package:provider/provider.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _appVersionService = AppVersionService();
  final GlobalKey<ScaffoldMessengerState> _scaffoldMessengerKey =
      GlobalKey<ScaffoldMessengerState>();

  List<Door> _doors = [];

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

    return ScaffoldMessenger(
        key: _scaffoldMessengerKey,
        child: Scaffold(
            appBar: AppBar(
              title: Text(widget.title),
            ),
            drawer: const MenuDrawer(),
            body: Container(
                padding: const EdgeInsets.all(8.0),
                child: Stack(children: [
                  RefreshIndicator(
                    child: ListView(children: [DoorList(doors: _doors)]),
                    onRefresh: () => _refresh(),
                  )
                ]))));
  }
}
