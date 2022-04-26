import 'package:flutter/material.dart';
import 'pages/home_page.dart';
import 'pages/settings_page.dart';
import 'package:shared_preferences/shared_preferences.dart';

SharedPreferences? sp;

void main() async {
  sp = await SharedPreferences.getInstance();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Flutter Demo',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        // home: const MyHomePage(title: 'Pi Garage'),
        initialRoute: '/',
        routes: {
          '/': (context) => const HomePage(title: 'Pi Garage'),
          '/settings': (context) => const SettingsPage(title: 'Settings')
        });
  }
}
