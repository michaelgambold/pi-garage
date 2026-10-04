import '../models/config.dart';
import '../repositories/config_repository.dart';

class CurrentConfigService {
  static final CurrentConfigService _instance =
      CurrentConfigService._internal();

  late Config currentConfig;

  factory CurrentConfigService() {
    return _instance;
  }

  CurrentConfigService._internal() {
    final configRepo = ConfigRepository();
    configRepo.findCurrentConfig().then((value) => currentConfig = value);
  }
}
