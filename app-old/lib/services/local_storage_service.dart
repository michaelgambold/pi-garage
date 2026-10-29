import 'package:shared_preferences/shared_preferences.dart';

class LocalStorageService {
  LocalStorageService._privateConstructor();

  static final LocalStorageService instance =
      LocalStorageService._privateConstructor();

  Future<bool> containsKey(String key) async {
    SharedPreferences myPrefs = await SharedPreferences.getInstance();
    return myPrefs.containsKey(key);
  }

  Future<bool> getBooleanValue(String key) async {
    SharedPreferences myPrefs = await SharedPreferences.getInstance();
    return myPrefs.getBool(key) ?? false;
  }

  Future<int> getIntegerValue(String key) async {
    SharedPreferences myPrefs = await SharedPreferences.getInstance();
    return myPrefs.getInt(key) ?? 0;
  }

  Future<List<String>> getStringListValue(String key) async {
    SharedPreferences myPrefs = await SharedPreferences.getInstance();
    return myPrefs.getStringList(key) ?? [];
  }

  Future<String> getStringValue(String key) async {
    SharedPreferences myPrefs = await SharedPreferences.getInstance();
    return myPrefs.getString(key) ?? "";
  }

  Future<void> removeAll() async {
    SharedPreferences myPrefs = await SharedPreferences.getInstance();
    await myPrefs.clear();
  }

  Future<void> removeValue(String key) async {
    SharedPreferences myPrefs = await SharedPreferences.getInstance();
    await myPrefs.remove(key);
  }

  Future<void> setBooleanValue(String key, bool value) async {
    SharedPreferences myPrefs = await SharedPreferences.getInstance();
    await myPrefs.setBool(key, value);
  }

  Future<void> setIntegerValue(String key, int value) async {
    SharedPreferences myPrefs = await SharedPreferences.getInstance();
    await myPrefs.setInt(key, value);
  }

  Future<void> setStringListValue(String key, List<String> value) async {
    SharedPreferences myPrefs = await SharedPreferences.getInstance();
    await myPrefs.setStringList(key, value);
  }

  Future<void> setStringValue(String key, String value) async {
    SharedPreferences myPrefs = await SharedPreferences.getInstance();
    await myPrefs.setString(key, value);
  }
}
