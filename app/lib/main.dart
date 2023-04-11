import 'package:flutter/material.dart';
import 'package:pi_garage/providers/current_config_provider.dart';
import 'package:pi_garage/screens/audit_log_screen.dart';
import 'package:pi_garage/screens/configs_screen.dart';
import 'package:pi_garage/screens/door_sequence_screen.dart';
import 'package:pi_garage/screens/door_settings_screen.dart';
import 'package:pi_garage/screens/edit_config_screen.dart';
import 'package:pi_garage/screens/home_screen.dart';
import 'package:pi_garage/services/migration_service.dart';
import 'package:provider/provider.dart';

Future<void> main() async {
  try {
    WidgetsFlutterBinding.ensureInitialized();

    final migrationService = MigrationService();
    await migrationService.runAll();

    runApp(ChangeNotifierProvider(
      create: (context) => CurrentConfigProvider(),
      child: const MyApp(),
    ));
  } catch (error) {
    // If an error occurs, show the error message on the screen
    runApp(MaterialApp(
      home: Scaffold(
        body: Center(
          child: Text(
            error.toString(),
            style: const TextStyle(fontSize: 24.0),
          ),
        ),
      ),
    ));
  }
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
              case 'configs':
                final configId = uri.pathSegments.length >= 2
                    ? uri.pathSegments.elementAt(1)
                    : null;
                final childPath = uri.pathSegments.length >= 3
                    ? uri.pathSegments.elementAt(2)
                    : null;

                if (configId != null && childPath == 'edit') {
                  return MaterialPageRoute(
                      builder: (context) => EditConfigScreen(
                            title: 'Edit Config',
                            configId: configId,
                          ));
                }

                return MaterialPageRoute(
                    builder: (context) =>
                        const ConfigsScreen(title: 'Configs'));

              case 'doors':
                final doorId = int.parse(uri.pathSegments.elementAt(1));
                final childPath = uri.pathSegments.elementAt(2);

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

              case 'audit-log':
                return MaterialPageRoute(
                    builder: ((context) =>
                        const AuditLogScreen(title: "Audit Log")));

              default:
                return null;
            }
          } on StateError catch (_) {
            return null;
          }
        });
  }
}
