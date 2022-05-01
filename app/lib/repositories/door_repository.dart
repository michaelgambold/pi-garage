import 'dart:convert';

import '../models/door.dart';
import '../models/sequence_object.dart';
import '../models/update_door.dart';
import '../services/local_storage_service.dart';
import '../services/http_service.dart';

class DoorRepository {
  Future<List<Door>> findAllDoors() async {
    String apiKey =
        await LocalStorageService.instance.getStringValue('global_api_key');

    String fqdn =
        await LocalStorageService.instance.getStringValue('global_fqdn');

    final res = await HttpService().get(Uri.parse('$fqdn/api/v1/doors'));

    if (res.statusCode == 200) {
      List<dynamic> body = jsonDecode(res.body);

      print(body);

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
    print('repo id: $doorId');

    String apiKey =
        await LocalStorageService.instance.getStringValue('global_api_key');

    String fqdn =
        await LocalStorageService.instance.getStringValue('global_fqdn');

    final res =
        await HttpService().get(Uri.parse('$fqdn/api/v1/doors/$doorId'));

    if (res.statusCode == 200) {
      return Door.fromJson(jsonDecode(res.body));
    }

    throw Exception(res.reasonPhrase);
  }

  Future<List<SequenceObject>> findDoorSequence(int doorId) async {
    String apiKey =
        await LocalStorageService.instance.getStringValue('global_api_key');

    String fqdn =
        await LocalStorageService.instance.getStringValue('global_fqdn');

    final res =
        await HttpService().get(Uri.parse('$fqdn/api/v1/doors/$doorId'));

    if (res.statusCode == 200) {
      return List<SequenceObject>.from(jsonDecode(res.body));
    }

    throw Exception(res.reasonPhrase);
  }

  Future<void> updateDoor(int doorId, UpdateDoor door) async {
    String apiKey =
        await LocalStorageService.instance.getStringValue('global_api_key');

    String fqdn =
        await LocalStorageService.instance.getStringValue('global_fqdn');

    final res =
        await HttpService().put(Uri.parse('$fqdn/api/v1/doors/$doorId'), {});

    if (res.statusCode == 200) {
      return;
    }

    throw Exception(res.reasonPhrase);
  }

  Future<void> updateDoorSequence(
      int doorId, List<SequenceObject> sequence) async {
    String apiKey =
        await LocalStorageService.instance.getStringValue('global_api_key');

    String fqdn =
        await LocalStorageService.instance.getStringValue('global_fqdn');

    final res = await HttpService()
        .put(Uri.parse('$fqdn/api/v1/doors/$doorId/sequence'), sequence);

    if (res.statusCode == 200) {
      return;
    }

    throw Exception(res.reasonPhrase);
  }
}
