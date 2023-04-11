import 'package:flutter/material.dart';
import 'package:pi_garage/services/http_service.dart';
import 'package:pi_garage/services/local_storage_service.dart';

class ConfigsScreen extends StatefulWidget {
  const ConfigsScreen({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<ConfigsScreen> createState() => _ConfigsScreenState();
}

class _ConfigsScreenState extends State<ConfigsScreen> {
  var _fqdn = '';
  var _apiKey = '';

  @override
  void initState() {
    super.initState();
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

  Future<bool> _testConnection() async {
    final headers = <String, String>{'x-api-key': _apiKey};

    try {
      final res = await HttpService().get(Uri.parse('$_fqdn/test'), headers);
      return res.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  @override
  Widget build(BuildContext context) {
    final GlobalKey<FormState> formKey = GlobalKey<FormState>();
    var scaffoldMesseger = ScaffoldMessenger.of(context);

    return Scaffold(
        appBar: AppBar(
          title: Text(widget.title),
        ),
        body: Container(
            padding: const EdgeInsets.all(8.0),
            child: Form(
              key: formKey,
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
                  const Spacer(),
                  ElevatedButton(
                      style: ElevatedButton.styleFrom(
                          primary: Colors.grey,
                          minimumSize: const Size.fromHeight(40)),
                      onPressed: () async {
                        scaffoldMesseger.clearSnackBars();

                        if (await _testConnection()) {
                          scaffoldMesseger.showSnackBar(
                            const SnackBar(
                              content: Text('Test Successful'),
                            ),
                          );
                        } else {
                          scaffoldMesseger.showSnackBar(
                            const SnackBar(
                              content: Text('Test Failed'),
                              backgroundColor: Colors.red,
                            ),
                          );
                        }
                      },
                      child: const Text('Test')),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                        minimumSize: const Size.fromHeight(40)),
                    onPressed: () async {
                      // Validate will return true if the form is valid, or false if
                      // the form is invalid.
                      if (formKey.currentState!.validate()) {
                        formKey.currentState!.save();
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
                ],
              ),
            )));
  }
}
