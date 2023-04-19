import 'package:flutter/material.dart';
import 'package:pi_garage/models/config.dart';
import 'package:pi_garage/repositories/config_repository.dart';
import 'package:pi_garage/services/http_service.dart';

class EditConfigScreen extends StatefulWidget {
  const EditConfigScreen(
      {Key? key, required this.title, required this.configId})
      : super(key: key);

  final String configId;
  final String title;

  @override
  State<EditConfigScreen> createState() => _EditConfigScreenState();
}

class _EditConfigScreenState extends State<EditConfigScreen> {
  ScaffoldMessengerState? _scaffoldMesseger;
  final GlobalKey<FormState> formKey = GlobalKey<FormState>();
  final _configRepo = ConfigRepository();

  late Config _config;
  final _nameController = TextEditingController(text: '');
  final _fqdnController = TextEditingController(text: '');
  final _apiKeyController = TextEditingController(text: '');

  @override
  void initState() {
    super.initState();
    _configRepo.findConfig(widget.configId).then((value) => setState(() {
          _config = value;
          _nameController.text = value.name;
          _fqdnController.text = value.fqdn;
          _apiKeyController.text = value.apiKey ?? '';
        }));
  }

  @override
  void dispose() {
    super.dispose();
    _nameController.dispose();
    _fqdnController.dispose();
    _apiKeyController.dispose();
  }

  Future<void> _testConnection() async {
    _scaffoldMesseger?.clearSnackBars();

    if (_fqdnController.text.isEmpty) {
      _scaffoldMesseger?.showSnackBar(
        const SnackBar(
          content: Text('FQDN required'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    final headers = <String, String>{'x-api-key': _apiKeyController.text};

    try {
      final res = await HttpService()
          .get(Uri.parse('${_fqdnController.text}/test'), headers);

      if (res.statusCode == 200) {
        _scaffoldMesseger?.showSnackBar(
          const SnackBar(
            content: Text('Test Successful'),
          ),
        );
        return;
      }

      if (res.statusCode == 401) {
        _scaffoldMesseger?.showSnackBar(
          const SnackBar(
            content: Text('API key required'),
            backgroundColor: Colors.red,
          ),
        );
        return;
      }

      _scaffoldMesseger?.showSnackBar(
        const SnackBar(
          content: Text('Test Failed'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    } catch (e) {
      _scaffoldMesseger?.showSnackBar(
        SnackBar(
          content: Text(e.toString()),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _handleSave() async {
    _scaffoldMesseger?.clearSnackBars();

    try {
      _config.apiKey =
          _apiKeyController.text.isEmpty ? null : _apiKeyController.text;
      _config.fqdn = _fqdnController.text;
      _config.name = _nameController.text;

      await _configRepo.updateConfig(_config!);

      _scaffoldMesseger?.showSnackBar(
        const SnackBar(
          content: Text('Settings Saved'),
        ),
      );
    } catch (e) {
      _scaffoldMesseger?.showSnackBar(
        const SnackBar(
          content: Text('Settings Saved'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    _scaffoldMesseger = ScaffoldMessenger.of(context);

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
                      hintText: 'Name',
                    ),
                    validator: (String? value) {
                      if (value == null || value.isEmpty) {
                        return 'A name is required';
                      }
                      return null;
                    },
                    controller: _nameController,
                  ),
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
                    controller: _fqdnController,
                  ),
                  TextFormField(
                    decoration: const InputDecoration(hintText: 'API Key'),
                    controller: _apiKeyController,
                  ),
                  const Spacer(),
                  ElevatedButton(
                      style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.grey,
                          minimumSize: const Size.fromHeight(40)),
                      onPressed: () => _testConnection(),
                      child: const Text('Test')),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                        minimumSize: const Size.fromHeight(40)),
                    onPressed: () async {
                      // Validate will return true if the form is valid, or false if
                      // the form is invalid.
                      if (!formKey.currentState!.validate()) {
                        return;
                      }
                      await _handleSave();
                    },
                    child: const Text('Save'),
                  ),
                ],
              ),
            )));
  }
}
