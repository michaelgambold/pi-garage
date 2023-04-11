import 'package:http/http.dart';
import 'package:pi_garage/models/config.dart';
import 'package:pi_garage/repositories/config_repository.dart';

import 'app_version_service.dart';
import 'http_service.dart';

class ApiService {
  final _httpService = HttpService();
  final _configRepo = ConfigRepository();
  final _appVersionService = AppVersionService();

  Future<Response> get(String path) async {
    final config = await _configRepo.findCurrentConfig();
    final uri = Uri.parse('${config.fqdn}$path');
    final headers = await _getHeaders(config);
    return _httpService.get(uri, headers);
  }

  Future<Response> post(String path, Object? body) async {
    final config = await _configRepo.findCurrentConfig();
    final uri = Uri.parse('${config.fqdn}$path');
    final headers = await _getHeaders(config);
    return _httpService.post(uri, body, headers);
  }

  Future<Response> put(String path, Object? body) async {
    final config = await _configRepo.findCurrentConfig();
    final uri = Uri.parse('${config.fqdn}$path');
    final headers = await _getHeaders(config);
    return _httpService.post(uri, body, headers);
  }

  _getHeaders(Config config) async {
    final clientVersion = await _appVersionService.getAppVersion();

    final headers = <String, String>{};
    headers.addAll(
        {'x-api-key': config.apiKey ?? "", 'x-client-version': clientVersion});
    return headers;
  }
}
