import 'package:flutter/material.dart';

import '../services/http_service.dart';
import '../services/local_storage_service.dart';

class AuditLogScreen extends StatefulWidget {
  const AuditLogScreen({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<AuditLogScreen> createState() => _AuditLogScreenState();
}

class _AuditLogScreenState extends State<AuditLogScreen> {
  @override
  void initState() {
    super.initState();
    // LocalStorageService.instance
    //     .getStringValue('global_fqdn')
    //     .then((value) => setState(() {
    //           _fqdn = value;
    //         }));

    // LocalStorageService.instance
    //     .getStringValue('global_api_key')
    //     .then((value) => setState(
    //           () {
    //             _apiKey = value;
    //           },
    //         ));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text(widget.title),
        ),
        body: Container(
            padding: const EdgeInsets.all(8.0),
            child: ListView(
              children: const [
                ListTile(
                  title: Text("2022-10-14T00:00:00.000Z"),
                  subtitle: Text("Door 1 Opened"),
                )
              ],
            )));
  }
}
