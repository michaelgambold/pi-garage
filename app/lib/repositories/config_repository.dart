import 'dart:convert';
import 'package:pi_garage/models/config.dart';
import 'package:pi_garage/services/local_storage_service.dart';
import 'package:uuid/uuid.dart';

class ConfigRepository {
  Future<void> addConfig(Config config) async {
    var configs = await findAllConfigs();
    configs.add(config);
    await _saveAll(configs);
  }

  Future<List<Config>> findAllConfigs() async {
    final localStorageService = LocalStorageService.instance;

    // perform migration of single to multiple configs if required
    await _migrateSingleToMultipleConfig();

    final configStrings =
        await localStorageService.getStringListValue('configs');

    return configStrings.map((e) => Config.fromJson(json.decode(e))).toList();
  }

  Future<Config> findConfig(String id) async {
    final configs = await findAllConfigs();
    return configs.firstWhere((element) => element.id == id);
  }

  Future<Config> findCurrentConfig() async {
    final localStorageService = LocalStorageService.instance;
    final currentConfigId =
        await localStorageService.getStringValue('currentConfigId');

    final configs = await findAllConfigs();
    return configs.firstWhere((element) => element.id == currentConfigId);
  }

  Future<void> removeConfig(String id) async {
    final configs = await findAllConfigs();
    configs.removeWhere((element) => element.id == id);
    await _saveAll(configs);
  }

  Future<void> selectConfig(String id) async {
    final localStorageService = LocalStorageService.instance;
    await localStorageService.setStringValue('currentConfigId', id);
  }

  Future<void> updateConfig(Config config) async {
    final configs = await findAllConfigs();
    final index = configs.indexWhere((element) => element.id == config.id);
    configs[index] = config;
    await _saveAll(configs);
  }

  Future<void> _saveAll(List<Config> configs) async {
    final jsonStrings = configs.map((e) => json.encode(e.toJson())).toList();

    final localStorageService = LocalStorageService.instance;
    await localStorageService.setStringListValue('configs', jsonStrings);
  }

  // multiple configs introduced 1.8.0 (25 Mar), keep until TO_BE_DECIDED
  Future<void> _migrateSingleToMultipleConfig() async {
    final localStorage = LocalStorageService.instance;

    // if we already have new configs defined just skip migration
    if (await localStorage.containsKey('configs')) {
      return;
    }

    // extract all old config items
    final fqdn = await localStorage.getStringValue('global_fqdn');
    final apiKey = await localStorage.getStringValue('global_api_key');

    // create new config item
    const uuid = Uuid();
    final config = Config(uuid.v4(), "default", fqdn, apiKey);

    await _saveAll([config]);
    await selectConfig(config.id);

    // remove old config items
    await localStorage.removeValue('global_fqdn');
    await localStorage.removeValue('global_api_key');
  }
}
