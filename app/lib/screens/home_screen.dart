import 'package:flutter/material.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        actions: <Widget>[
          IconButton(
            icon: const Icon(Icons.settings),
            tooltip: 'Open shopping cart',
            onPressed: () {
              Navigator.pushNamed(context, '/settings');
            },
          ),
        ],
      ),
      body: Center(
          child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Column>[
            Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const <Widget>[
                  Text("Door 1"),
                  IconButton(
                    icon: Icon(Icons.volume_up),
                    tooltip: 'Increase volume by 10',
                    onPressed: null,
                  ),
                ]),
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const <Widget>[
                Text("Door 2"),
                IconButton(
                  icon: Icon(Icons.volume_up),
                  tooltip: 'Door 2',
                  onPressed: null,
                )
              ],
            ),
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Card(
                    color: Colors.grey[400],
                    child: Container(
                        padding: const EdgeInsets.all(80),
                        child: Column(children: <Widget>[
                          const Text("Door 3"),
                          IconButton(
                            icon: const Icon(Icons.volume_up),
                            tooltip: 'Door 3',
                            onPressed: () {
                              print("hi");
                            },
                          ),
                        ])))
              ],
            )
          ])),
    );
  }
}
