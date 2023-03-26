import 'dart:convert';
import 'package:pi_garage/models/config.dart';
import 'package:pi_garage/services/local_storage_service.dart';

class ConfigRepository {
  Future<void> addConfig(Config config) async {
    var configs = await findAllConfigs();
    configs.add(config);
    await updateAllConfigs(configs);
  }

  Future<List<Config>> findAllConfigs() async {
    final localStorageService = LocalStorageService.instance;
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
    await updateAllConfigs(configs);
  }

  Future<void> selectConfig(String id) async {
    final localStorageService = LocalStorageService.instance;
    await localStorageService.setStringValue('currentConfigId', id);
  }

  Future<void> updateAllConfigs(List<Config> configs) async {
    final jsonStrings = configs.map((e) => json.encode(e.toJson())).toList();

    final localStorageService = LocalStorageService.instance;
    await localStorageService.setStringListValue('configs', jsonStrings);
  }

  Future<void> updateConfig(Config config) async {
    final configs = await findAllConfigs();
    final index = configs.indexWhere((element) => element.id == config.id);
    configs[index] = config;
    await updateAllConfigs(configs);
  }
}
