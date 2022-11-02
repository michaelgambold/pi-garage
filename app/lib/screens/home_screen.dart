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

  late io.Socket socket;

  _initSocket(String apiKey) async {
    socket = io.io(
        'http://localhost:3000/doors',
        io.OptionBuilder().setTransports(['websocket']).setExtraHeaders(
            {'x-api-key': apiKey}).build());

    socket.onConnectError((data) {
      _scaffoldMessengerKey.currentState?.clearMaterialBanners();
      _scaffoldMessengerKey.currentState?.showSnackBar(SnackBar(
        content: Text(data.toString()),
        backgroundColor: Colors.red,
      ));
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

  @override
  void initState() {
    super.initState();
    LocalStorageService.instance
        .getStringValue('global_api_key')
        .then(((apiKey) {
      setState(() {
        apiKey = apiKey;
      });
      _initSocket(apiKey);
      socket.emit("doors:list");
    }));
    ;
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
                  ListView(children: [DoorList(doors: _doors)])
                ]))));
  }
}
