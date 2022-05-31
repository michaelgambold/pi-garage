import 'dart:convert';

import '../models/door.dart';
import '../models/sequence_object.dart';
import '../models/update_door.dart';
import '../services/local_storage_service.dart';
import '../services/http_service.dart';

class DoorRepository {
  final _httpService = HttpService();
  final _localStorageService = LocalStorageService.instance;

  Future<List<Door>> findAllDoors() async {
    var apiKey = await _localStorageService.getStringValue('global_api_key');
    var fqdn = await _localStorageService.getStringValue('global_fqdn');

    var headers = <String, String>{'x-api-key': apiKey};

    var res = await _httpService.get(Uri.parse('$fqdn/api/v1/doors'), headers);

    if (res.statusCode == 200) {
      List<dynamic> body = jsonDecode(res.body);
      return body
          .map(
            (dynamic item) => Door.fromJson(item),
          )
          .toList();
    }

    throw Exception(res.reasonPhrase);
  }

  Future<Door> findDoor(int doorId) async {
    var apiKey = await _localStorageService.getStringValue('global_api_key');
    var fqdn = await _localStorageService.getStringValue('global_fqdn');

    var headers = <String, String>{'x-api-key': apiKey};

    var res = await _httpService.get(
        Uri.parse('$fqdn/api/v1/doors/$doorId'), headers);

    if (res.statusCode == 200) {
      return Door.fromJson(jsonDecode(res.body));
    }

    throw Exception(res.reasonPhrase);
  }

  Future<List<SequenceObject>> findDoorSequence(int doorId) async {
    var apiKey = await _localStorageService.getStringValue('global_api_key');
    var fqdn = await _localStorageService.getStringValue('global_fqdn');

    var headers = <String, String>{'x-api-key': apiKey};

    var res = await _httpService.get(
        Uri.parse('$fqdn/api/v1/doors/$doorId/sequence'), headers);

    if (res.statusCode == 200) {
      List<dynamic> body = jsonDecode(res.body);
      return body
          .map(
            (dynamic item) => SequenceObject.fromJson(item),
          )
          .toList();
    }

    throw Exception(res.reasonPhrase);
  }

  Future<void> updateDoor(int doorId, UpdateDoor updateDoor) async {
    var apiKey = await _localStorageService.getStringValue('global_api_key');
    var fqdn = await _localStorageService.getStringValue('global_fqdn');

    var headers = <String, String>{'x-api-key': apiKey};

    var res = await _httpService.put(
        Uri.parse('$fqdn/api/v1/doors/$doorId'), updateDoor, headers);

    if (res.statusCode == 200) {
      return;
    }

    throw Exception(res.reasonPhrase);
  }

  Future<void> updateDoorSequence(
      int doorId, List<SequenceObject> sequence) async {
    var apiKey = await _localStorageService.getStringValue('global_api_key');
    var fqdn = await _localStorageService.getStringValue('global_fqdn');

    var headers = <String, String>{'x-api-key': apiKey};

    var res = await _httpService.put(
        Uri.parse('$fqdn/api/v1/doors/$doorId/sequence'), sequence, headers);

    if (res.statusCode == 200) {
      return;
    }

    throw Exception(res.reasonPhrase);
  }
}
