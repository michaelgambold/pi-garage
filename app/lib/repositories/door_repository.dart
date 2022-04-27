import 'dart:convert';

import '../models/door.dart';
import '../services/local_storage_service.dart';
import '../services/http_service.dart';

class DoorRepository {
  Future<List<Door>> findAll() async {
    String apiKey =
        await LocalStorageService.instance.getStringValue('global_api_key');
    String fqdn =
        await LocalStorageService.instance.getStringValue('global_fqdn');

    final response = await HttpService().get(Uri.parse(fqdn + '/doors'));

    if (response.statusCode == 200) {
      return List<Door>.from(jsonDecode(response.body));
    }

    throw Exception(response.reasonPhrase);
  }
}
