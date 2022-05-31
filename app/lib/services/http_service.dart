import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:http/http.dart';

class HttpService {
  Future<Response> get(Uri uri, Map<String, String>? headers) {
    headers ??= <String, String>{};
    headers.addAll({'Accept': 'application/json'});

    return http.get(uri, headers: headers);
  }

  Future<Response> post(Uri url, Object? body, Map<String, String>? headers) {
    headers ??= <String, String>{};
    headers.addAll(
        {'Accept': 'application/json', 'Content-Type': 'application/json'});

    return http.post(url, headers: headers, body: jsonEncode(body));
  }

  Future<Response> put(Uri url, Object? body, Map<String, String>? headers) {
    headers ??= <String, String>{};
    headers.addAll(
        {'Accept': 'application/json', 'Content-Type': 'application/json'});

    return http.put(url, headers: headers, body: jsonEncode(body));
  }
}
