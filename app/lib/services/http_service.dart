import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:http/http.dart';

class HttpService {
  Future<Response> get(Uri uri) {
    return http.get(uri);
  }

  Future<Response> post(Uri url, Object? body) {
    return http.post(url,
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(body));
  }

  Future<Response> put(Uri url, Object? body) {
    return http.put(url,
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(body));
  }
}
