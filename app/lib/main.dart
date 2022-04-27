import 'package:flutter/material.dart';
import 'screens/door_sequence_screen.dart';
import 'screens/door_settings_screen.dart';
import 'screens/home_screen.dart';
import 'screens/global_settings_screen.dart';

void main() {
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
        home: const HomeScreen(title: 'Pi Garage'),
        onGenerateRoute: (settings) {
          if (settings.name == '/settings') {
            return MaterialPageRoute(
                builder: (context) =>
                    const GlobalSettingsScreen(title: 'Global Settings'));
          }

          var uri = Uri.parse(settings.name ?? '');

          print(uri.pathSegments);

          if (uri.pathSegments.first == 'doors' &&
              uri.pathSegments.elementAt(2) == 'settings') {
            return MaterialPageRoute(
                builder: (context) => DoorSettingsScreen(
                    title: 'Door ${uri.pathSegments.elementAt(1)} Settings'));
          }

          if (uri.pathSegments.first == 'doors' &&
              uri.pathSegments.elementAt(2) == 'sequence') {
            return MaterialPageRoute(
                builder: (context) => DoorSequenceScreen(
                    title: 'Door ${uri.pathSegments.elementAt(1)} Sequence'));
          }

          return null;
        });
  }
}
