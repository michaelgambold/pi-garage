import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

import '../models/door.dart';
import '../services/local_storage_service.dart';
import '../widgets/door_list.dart';
import '../widgets/menu_drawer.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final GlobalKey<ScaffoldMessengerState> _scaffoldMessengerKey =
      GlobalKey<ScaffoldMessengerState>();
  List<Door> _doors = [];

  late String fqdn;
  late String apiKey;
  late io.Socket socket;

  Future<void> _getConnectionSettings() async {
    fqdn = await LocalStorageService.instance.getStringValue('global_fqdn');
    apiKey =
        await LocalStorageService.instance.getStringValue('global_api_key');
  }

  Future<void> _initSocket(String fqdn, String apiKey) async {
    socket = io.io(
        '$fqdn/doors',
        io.OptionBuilder().setTransports(['websocket']).setExtraHeaders(
            {'x-api-key': apiKey}).build());

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
  }

  Future<void> _refresh() async {
    socket.destroy();
    await _getConnectionSettings();
    await _initSocket(fqdn, apiKey);
  }

  @override
  void initState() {
    super.initState();
    _getConnectionSettings().then((_) {
      _initSocket(fqdn, apiKey);
    });
  }

  @override
  Widget build(BuildContext context) {
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
