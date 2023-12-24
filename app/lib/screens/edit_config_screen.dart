import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/config.dart';
import '../providers/current_config_provider.dart';
import '../repositories/config_repository.dart';
import '../services/http_service.dart';
import '../widgets/layout.dart';

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
  final formKey = GlobalKey<FormState>();
  final _scaffoldMessengerKey = GlobalKey<ScaffoldMessengerState>();

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
    _scaffoldMessengerKey.currentState?.clearSnackBars();

    if (_fqdnController.text.isEmpty) {
      _scaffoldMessengerKey.currentState?.showSnackBar(
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
        _scaffoldMessengerKey.currentState?.showSnackBar(
          const SnackBar(
            content: Text('Test Successful'),
          ),
        );
        return;
      }

      if (res.statusCode == 401) {
        _scaffoldMessengerKey.currentState?.showSnackBar(
          const SnackBar(
            content: Text('API key required'),
            backgroundColor: Colors.red,
          ),
        );
        return;
      }

      _scaffoldMessengerKey.currentState?.showSnackBar(
        const SnackBar(
          content: Text('Test Failed'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    } catch (e) {
      _scaffoldMessengerKey.currentState?.showSnackBar(
        SnackBar(
          content: Text(e.toString()),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _handleSave() async {
    _scaffoldMessengerKey.currentState?.clearSnackBars();

    try {
      _config.apiKey =
          _apiKeyController.text.isEmpty ? null : _apiKeyController.text;
      _config.fqdn = _fqdnController.text;
      _config.name = _nameController.text;

      await _configRepo.updateConfig(_config);

      _scaffoldMessengerKey.currentState?.showSnackBar(
        const SnackBar(
          content: Text('Settings Saved'),
        ),
      );
    } catch (e) {
      _scaffoldMessengerKey.currentState?.showSnackBar(
        const SnackBar(
          content: Text('Settings Saved'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final currentConfigProvider = context.watch<CurrentConfigProvider>();
    final currentConfig = currentConfigProvider.currentConfig;

    return Layout(
        scaffoldMessangerKey: _scaffoldMessengerKey,
        title: widget.title,
        child: Form(
          key: formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Name',
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
                  labelText: "FQDN",
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
                decoration: const InputDecoration(labelText: 'API Key'),
                controller: _apiKeyController,
              ),
              const Spacer(),
              FilledButton(
                  style: FilledButton.styleFrom(
                    backgroundColor: Colors.grey,
                    minimumSize: const Size.fromHeight(40),
                  ),
                  onPressed: () => _testConnection(),
                  child: const Text('Test')),
              FilledButton(
                style: FilledButton.styleFrom(
                  minimumSize: const Size.fromHeight(40),
                ),
                onPressed: () async {
                  // Validate will return true if the form is valid, or false if
                  // the form is invalid.
                  if (!formKey.currentState!.validate()) {
                    return;
                  }
                  await _handleSave();
                  if (currentConfig?.id == _config.id) {
                    await currentConfigProvider.reloadCurrentConfig();
                  }
                },
                child: const Text('Save'),
              ),
            ],
          ),
        ));
  }
}
