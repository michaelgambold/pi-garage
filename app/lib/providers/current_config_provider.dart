import 'package:flutter/foundation.dart';

import '../models/config.dart';
import '../repositories/config_repository.dart';

class CurrentConfigProvider extends ChangeNotifier {
  Config? _currentConfig;

  Config? get currentConfig => _currentConfig;

  CurrentConfigProvider() {
    final configRepo = ConfigRepository();
    configRepo.findCurrentConfig().then((value) {
      _currentConfig = value;
      notifyListeners();
    });
  }

  Future<void> setCurrentConfig(String id) async {
    final configRepo = ConfigRepository();
    await configRepo.setCurrentConfig(id);
    _currentConfig = await configRepo.findCurrentConfig();
    notifyListeners();
  }
}
