import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

class ReleaseNotes extends StatelessWidget {
  const ReleaseNotes({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      const Text("Version 2", style: TextStyle(fontWeight: FontWeight.bold)),
      const SizedBox(height: 10),
      const Text(
          "In this release a breaking change has been introduced in the backend service."),
      const SizedBox(height: 10),
      const Text(
          "Redis is now a requirement for the backed service to function. Without adding this your "
          "Pi Garage instance will fail to function. For more information and how to wire up Redis "
          "see the documentation at the link below."),
      const SizedBox(height: 10),
      GestureDetector(
        onTap: () => launchUrl(Uri.parse(
            "https://michaelgambold.github.io/pi-garage/#/?id=backend-service-installation")),
        child: const Text(
            "https://michaelgambold.github.io/pi-garage/#/?id=backend-service-installation",
            style: TextStyle(color: Colors.blue)),
      )
    ]);
  }
}

@widgetbook.UseCase(name: 'default', type: ReleaseNotes)
Widget defaultUseCase(BuildContext context) {
  return Container(color: Colors.white, child: const ReleaseNotes());
}
