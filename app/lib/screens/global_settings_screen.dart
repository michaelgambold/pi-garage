import 'package:flutter/material.dart';
import '../services/http_service.dart';
import '../services/local_storage_service.dart';

class GlobalSettingsScreen extends StatefulWidget {
  const GlobalSettingsScreen({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<GlobalSettingsScreen> createState() => _GlobalSettingsScreenState();
}

class _GlobalSettingsScreenState extends State<GlobalSettingsScreen> {
  String _fqdn = '';
  String _apiKey = '';

  _GlobalSettingsScreenState() {
    print('global state constructor');
    LocalStorageService.instance
        .getStringValue('global_fqdn')
        .then((value) => setState(() {
              _fqdn = value;
            }));

    LocalStorageService.instance
        .getStringValue('global_api_key')
        .then((value) => setState(
              () {
                _apiKey = value;
              },
            ));
  }

  @override
  void initState() {
    super.initState();
    print('global settings init state');
  }

  Future<bool> _testConnection() async {
    return HttpService()
        .get(Uri.parse(_fqdn + '/health'))
        .then((value) => value.statusCode == 200)
        .catchError((error) {
      return false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

    return Scaffold(
        appBar: AppBar(
          // Here we take the value from the MyHomePage object that was created by
          // the App.build method, and use it to set our appbar title.
          title: Text(widget.title),
          // actions: <Widget>[
          //   IconButton(
          //     icon: const Icon(Icons.settings),
          //     tooltip: 'Global Settings',
          //     onPressed: () {
          //       // handle the press
          //     },
          //   ),
          // ],
        ),
        body: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              TextFormField(
                decoration: const InputDecoration(
                  hintText: 'FQDN',
                ),
                validator: (String? value) {
                  if (value == null || value.isEmpty) {
                    return 'A FQDN is required';
                  }
                  return null;
                },
                onSaved: (value) {
                  LocalStorageService.instance
                      .setStringValue('global_fqdn', value ?? '');
                },
                onChanged: (value) {
                  _fqdn = value;
                },
                initialValue: _fqdn,
              ),
              TextFormField(
                decoration: const InputDecoration(hintText: 'API Key'),
                initialValue: _apiKey,
                onSaved: (value) {
                  LocalStorageService.instance
                      .setStringValue('global_api_key', value ?? '');
                },
                onChanged: (value) {
                  _apiKey = value;
                },
              ),
              Padding(
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                  child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        ElevatedButton(
                            onPressed: () async {
                              ScaffoldMessenger.of(context).clearSnackBars();

                              if (await _testConnection()) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Test Successful'),
                                  ),
                                );
                              } else {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Test Failed'),
                                    backgroundColor: Colors.red,
                                  ),
                                );
                              }
                            },
                            child: const Text('Test')),
                        ElevatedButton(
                          onPressed: () async {
                            // Validate will return true if the form is valid, or false if
                            // the form is invalid.
                            if (_formKey.currentState!.validate()) {
                              _formKey.currentState!.save();
                              ScaffoldMessenger.of(context).clearSnackBars();
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Settings Saved'),
                                ),
                              );
                            }
                          },
                          child: const Text('Save'),
                        ),
                      ])),
              // Padding(
              //   padding: const EdgeInsets.symmetric(vertical: 16.0),
              //   child: ElevatedButton(
              //     onPressed: () async {
              //       // Validate will return true if the form is valid, or false if
              //       // the form is invalid.
              //       if (_formKey.currentState!.validate()) {
              //         _formKey.currentState!.save();
              //         ScaffoldMessenger.of(context).showSnackBar(
              //           const SnackBar(
              //             content: Text('Settings Saved'),
              //           ),
              //         );
              //       }
              //     },
              //     child: const Text('Save'),
              //   ),
              // ),
            ],
          ),
        ));
  }
}
