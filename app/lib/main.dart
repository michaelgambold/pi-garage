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
        debugShowCheckedModeBanner: false,
        title: 'Pi Garage',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        home: const HomeScreen(title: 'Pi Garage'),
        onUnknownRoute: (settings) {
          // do somthing better here. this shows the back arrow on the home
          // screen
          return MaterialPageRoute<void>(
              settings: settings,
              builder: (BuildContext context) =>
                  const HomeScreen(title: 'Pi Garage'));
        },
        onGenerateRoute: (settings) {
          var uri = Uri.parse(settings.name ?? '');

          try {
            switch (uri.pathSegments.first) {
              case 'settings':
                return MaterialPageRoute(
                    builder: (context) =>
                        const GlobalSettingsScreen(title: 'Global Settings'));

              case 'doors':
                var doorId = int.parse(uri.pathSegments.elementAt(1));
                var childPath = uri.pathSegments.elementAt(2);

                if (childPath == 'settings') {
                  return MaterialPageRoute(
                      builder: (context) => DoorSettingsScreen(
                            title: 'Door $doorId Settings',
                            doorId: doorId,
                          ));
                }

                if (childPath == 'sequence') {
                  return MaterialPageRoute(
                      builder: (context) => DoorSequenceScreen(
                            title: 'Door $doorId Sequence',
                            doorId: doorId,
                          ));
                }

                return null;

              default:
                return null;
            }
          } on StateError catch (_) {
            return null;
          }
        });
  }
}
