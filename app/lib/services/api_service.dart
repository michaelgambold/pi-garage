import 'package:http/http.dart';

import '../models/config.dart';
import '../repositories/config_repository.dart';
import 'app_version_service.dart';
import 'http_service.dart';

const defaultTimeout = Duration(seconds: 5);

class ApiService {
  final _httpService = HttpService();
  final _configRepo = ConfigRepository();
  final _appVersionService = AppVersionService();

  Future<Response> get(String path) async {
    final config = await _configRepo.findCurrentConfig();
    final uri = Uri.parse('${config.fqdn}$path');
    final headers = await _getHeaders(config);

    return _httpService.get(uri, headers).timeout(defaultTimeout);
  }

  Future<Response> post(String path, Object? body) async {
    final config = await _configRepo.findCurrentConfig();
    final uri = Uri.parse('${config.fqdn}$path');
    final headers = await _getHeaders(config);

    return _httpService.post(uri, body, headers).timeout(defaultTimeout);
  }

  Future<Response> put(String path, Object? body) async {
    final config = await _configRepo.findCurrentConfig();
    final uri = Uri.parse('${config.fqdn}$path');
    final headers = await _getHeaders(config);

    return _httpService.put(uri, body, headers).timeout(defaultTimeout);
  }

  _getHeaders(Config config) async {
    final clientVersion = await _appVersionService.getAppVersion();

    final headers = <String, String>{};
    headers.addAll({
      'x-api-key': config.apiKey ?? "",
      'x-client-version': clientVersion,
    });
    return headers;
  }
}
