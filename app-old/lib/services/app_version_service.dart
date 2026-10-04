import 'package:package_info_plus/package_info_plus.dart';

class AppVersionService {
  Future<String> getAppVersion() async {
    var packageInfo = await PackageInfo.fromPlatform();
    return packageInfo.version;
  }
}
