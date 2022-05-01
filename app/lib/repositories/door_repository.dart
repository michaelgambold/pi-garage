import 'dart:convert';

import '../models/door.dart';
import '../models/sequence_object.dart';
import '../models/update_door.dart';
import '../services/local_storage_service.dart';
import '../services/http_service.dart';

class DoorRepository {
  late HttpService _httpService;
  late LocalStorageService _localStorageService;
  DoorRepository() {
    _httpService = HttpService();
    _localStorageService = LocalStorageService.instance;
  }

  Future<List<Door>> findAllDoors() async {
    String apiKey = await _localStorageService.getStringValue('global_api_key');

    String fqdn = await _localStorageService.getStringValue('global_fqdn');

    final res = await _httpService.get(Uri.parse('$fqdn/api/v1/doors'));

    if (res.statusCode == 200) {
      List<dynamic> body = jsonDecode(res.body);

      List<Door> doors = body
          .map(
            (dynamic item) => Door.fromJson(item),
          )
          .toList();

      return doors;
    }

    throw Exception(res.reasonPhrase);
  }

  Future<Door> findDoor(int doorId) async {
    String apiKey = await _localStorageService.getStringValue('global_api_key');

    String fqdn = await _localStorageService.getStringValue('global_fqdn');

    final res = await _httpService.get(Uri.parse('$fqdn/api/v1/doors/$doorId'));

    if (res.statusCode == 200) {
      return Door.fromJson(jsonDecode(res.body));
    }

    throw Exception(res.reasonPhrase);
  }

  Future<List<SequenceObject>> findDoorSequence(int doorId) async {
    String apiKey = await _localStorageService.getStringValue('global_api_key');

    String fqdn = await _localStorageService.getStringValue('global_fqdn');

    final res = await _httpService.get(Uri.parse('$fqdn/api/v1/doors/$doorId'));

    if (res.statusCode == 200) {
      List<dynamic> body = jsonDecode(res.body);

      List<SequenceObject> doors = body
          .map(
            (dynamic item) => SequenceObject.fromJson(item),
          )
          .toList();

      return doors;
    }

    throw Exception(res.reasonPhrase);
  }

  Future<void> updateDoor(int doorId, UpdateDoor door) async {
    String apiKey = await _localStorageService.getStringValue('global_api_key');

    String fqdn = await _localStorageService.getStringValue('global_fqdn');

    final res =
        await _httpService.put(Uri.parse('$fqdn/api/v1/doors/$doorId'), {});

    if (res.statusCode == 200) {
      return;
    }

    throw Exception(res.reasonPhrase);
  }

  Future<void> updateDoorSequence(
      int doorId, List<SequenceObject> sequence) async {
    String apiKey = await _localStorageService.getStringValue('global_api_key');

    String fqdn = await _localStorageService.getStringValue('global_fqdn');

    final res = await _httpService.put(
        Uri.parse('$fqdn/api/v1/doors/$doorId/sequence'), sequence);

    if (res.statusCode == 200) {
      return;
    }

    throw Exception(res.reasonPhrase);
  }
}
