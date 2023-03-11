import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pi_garage/services/local_storage_service.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  late LocalStorageService service;

  setUp(() {
    WidgetsFlutterBinding.ensureInitialized();
    service = LocalStorageService.instance;
  });

  // NOTE: IT MIGHT NOT BE POSSIBLE TO TEST NATIVE API'S LIKE THIS

  // test("Contains Key",
  //     () async => {expect(await service.containsKey('key'), equals(false))});

  // test(
  //     "Get boolean value",
  //     () async =>
  //         {expect(await service.getBooleanValue('boolean-value'), false)});
}
