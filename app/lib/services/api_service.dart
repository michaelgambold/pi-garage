import 'package:http/http.dart';

import 'app_version_service.dart';
import 'http_service.dart';
import 'local_storage_service.dart';

class ApiService {
  final _httpService = HttpService();
  final _localStorageService = LocalStorageService.instance;
  final _appVersionService = AppVersionService();

  Future<Response> get(String path) async {
    final fqdn = await _localStorageService.getStringValue('global_fqdn');
    final uri = Uri.parse('$fqdn$path');
    final headers = await _getHeaders();
    return _httpService.get(uri, headers);
  }

  Future<Response> post(String path, Object? body) async {
    final fqdn = await _localStorageService.getStringValue('global_fqdn');
    final uri = Uri.parse('$fqdn$path');
    final headers = await _getHeaders();
    return _httpService.post(uri, body, headers);
  }

  Future<Response> put(String path, Object? body) async {
    final fqdn = await _localStorageService.getStringValue('global_fqdn');
    final uri = Uri.parse('$fqdn$path');
    final headers = await _getHeaders();
    return _httpService.post(uri, body, headers);
  }

  _getHeaders() async {
    final apiKey = await _localStorageService.getStringValue('global_api_key');
    final clientVersion = await _appVersionService.getAppVersion();

    final headers = <String, String>{};
    headers.addAll({'x-api-key': apiKey, 'x-client-version': clientVersion});
    return headers;
  }
}
