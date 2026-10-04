import 'dart:convert';

import '../models/door.dart';
import '../models/sequence_object.dart';
import '../models/update_door.dart';
import '../services/api_service.dart';

class DoorRepository {
  final _apiService = ApiService();

  Future<void> changeDoorState(int doorId, String state) async {
    var res =
        await _apiService.post('/api/v1/doors/$doorId/state', {'state': state});

    if (res.statusCode == 201) {
      return;
    }

    throw Exception(res.reasonPhrase);
  }

  Future<List<Door>> findAllDoors() async {
    var res = await _apiService.get('/api/v1/doors');

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
    var res = await _apiService.get('/api/v1/doors/$doorId');

    if (res.statusCode == 200) {
      return Door.fromJson(jsonDecode(res.body));
    }

    throw Exception(res.reasonPhrase);
  }

  Future<List<SequenceObject>> findDoorSequence(int doorId) async {
    var res = await _apiService.get('/api/v1/doors/$doorId/sequence');

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

  Future<void> overrideDoorState(int doorId, String state) async {
    var res = await _apiService.put(
        '/api/v1/doors/$doorId/state/override', {'state': state});

    if (res.statusCode == 200) {
      return;
    }

    throw Exception(res.reasonPhrase);  
  }

  Future<void> updateDoor(int doorId, UpdateDoor updateDoor) async {
    var res = await _apiService.put('/api/v1/doors/$doorId', updateDoor);

    if (res.statusCode == 200) {
      return;
    }

    throw Exception(res.reasonPhrase);
  }

  Future<void> updateDoorSequence(
      int doorId, List<SequenceObject> sequence) async {
    var res = await _apiService.put('/api/v1/doors/$doorId/sequence', sequence);

    if (res.statusCode == 200) {
      return;
    }

    throw Exception(res.reasonPhrase);
  }
}
