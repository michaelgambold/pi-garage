import 'package:uuid/uuid.dart';

import '../models/config.dart';
import '../repositories/config_repository.dart';
import 'local_storage_service.dart';

class MigrationService {
  Future<void> runAll() async {
    // run all migrations. it's imperative that these are called in order
    // and new migrations are only added to the bottom of this stack of
    // methods
    await _migrateSingleConfigToMultipleConfig();
  }

  // multiple configs introduced 1.8.0
  Future<void> _migrateSingleConfigToMultipleConfig() async {
    final localStorage = LocalStorageService.instance;
    final configRepo = ConfigRepository();

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

    await configRepo.updateAllConfigs([config]);
    await configRepo.setCurrentConfig(config.id);

    // remove old config items
    await localStorage.removeValue('global_fqdn');
    await localStorage.removeValue('global_api_key');
  }
}
