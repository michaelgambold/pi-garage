import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

class ReleaseNotes extends StatelessWidget {
  const ReleaseNotes({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("Version 3", style: TextStyle(fontWeight: FontWeight.bold)),
          SizedBox(height: 10),
          Text("This major release deprecates Android 4.4 (Kit Kat)."),
          SizedBox(height: 10),
          Text("Backend services should be updated to major version 3."),
          SizedBox(height: 10),
          // GestureDetector(
          //   onTap: () => launchUrl(Uri.parse(
          //       "https://michaelgambold.github.io/pi-garage/#/?id=backend-service-installation")),
          //   child: const Text(
          //       "https://michaelgambold.github.io/pi-garage/#/?id=backend-service-installation",
          //       style: TextStyle(color: Colors.blue)),
          // )
        ]);
  }
}

@widgetbook.UseCase(name: 'default', type: ReleaseNotes)
Widget defaultUseCase(BuildContext context) {
  return Container(color: Colors.white, child: const ReleaseNotes());
}
